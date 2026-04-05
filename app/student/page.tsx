'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ScanFace, MessageSquareWarning, Users, CalendarDays, UtensilsCrossed, LogOut, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { getInitialData, Complaint } from '@/lib/mockData';
import { io, Socket } from 'socket.io-client';

let socket: Socket;

export default function StudentPortal() {
  const [activeTab, setActiveTab] = useState('face-scan');
  const router = useRouter();

  useEffect(() => {
    socket = io({
      transports: ['websocket'],
    });
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const tabs = [
    { id: 'face-scan', label: 'Face Scan', icon: <ScanFace size={20} /> },
    { id: 'complaint', label: 'Raise a Complaint', icon: <MessageSquareWarning size={20} /> },
    { id: 'warden', label: 'Warden & Members', icon: <Users size={20} /> },
    { id: 'events', label: 'Hostel Events', icon: <CalendarDays size={20} /> },
    { id: 'mess', label: 'Mess Details', icon: <UtensilsCrossed size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex font-sans relative overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 flex flex-col shadow-sm z-10">
        <div className="p-6 border-b border-slate-800">
          <Logo />
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                activeTab === tab.id 
                  ? 'bg-cyan-500/20 text-cyan-400 shadow-sm border border-cyan-500/30' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => router.push('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto z-10">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'face-scan' && <FaceScanSection />}
          {activeTab === 'complaint' && <ComplaintSection />}
          {activeTab === 'warden' && <WardenSection />}
          {activeTab === 'events' && <EventsSection />}
          {activeTab === 'mess' && <MessSection />}
        </div>
      </main>
    </div>
  );
}

function FaceScanSection() {
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [message, setMessage] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState('');

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setCameraError("Unable to access camera. Please check permissions.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleScan = (action: string, msg: string) => {
    setScanState('scanning');
    setMessage('');
    setTimeout(() => {
      setScanState('success');
      setMessage(msg);
      
      // Update local storage status for Manyatha
      const data = localStorage.getItem('vdorm_students');
      if (data) {
        const students = JSON.parse(data);
        const manyatha = students.find((s: any) => s.regId === '21BCE0001');
        if (manyatha) {
          manyatha.status = action;
          manyatha.time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          localStorage.setItem('vdorm_students', JSON.stringify(students));
          
          if (socket) {
            socket.emit('status_update', manyatha);
          }
        }
      }
    }, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Face Scan Entry/Exit</h2>
      <p className="text-slate-400">Position your face in the frame to authenticate.</p>

      <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-slate-700/50 flex flex-col items-center">
        {/* Camera Preview Area */}
        <div className="relative w-full max-w-md aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.1)] border-4 border-slate-100 mb-8 flex items-center justify-center">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {cameraError && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 text-red-400 p-4 text-center z-10">
              {cameraError}
            </div>
          )}
          
          {scanState === 'idle' && !cameraError && (
            <span className="text-white/50 z-10 font-medium tracking-widest uppercase text-sm">Align Face</span>
          )}
          
          {scanState === 'scanning' && (
            <motion.div 
              className="absolute w-48 h-48 border-4 border-green-500 rounded-lg z-20"
              animate={{ 
                x: [0, 20, -20, 0],
                y: [0, -20, 20, 0],
                scale: [1, 1.05, 0.95, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}

          {scanState === 'success' && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 bg-green-500/80 backdrop-blur-sm flex flex-col items-center justify-center text-white z-30"
            >
              <CheckCircle2 size={48} className="text-white mb-2" />
              <p className="font-bold text-lg">Reddem Manyatha Reddy ✅</p>
              <p className="text-green-100 font-medium">{message}</p>
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 w-full">
          <button 
            onClick={() => handleScan('In Hostel', 'Face recognition successful. Welcome back!')}
            disabled={scanState === 'scanning'}
            className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all disabled:opacity-50"
          >
            Enter Hostel
          </button>
          <button 
            onClick={() => handleScan('Out', 'Face recognition successful. Have a safe trip!')}
            disabled={scanState === 'scanning'}
            className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-red-500 to-orange-500 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-0.5 transition-all disabled:opacity-50"
          >
            Exit Hostel
          </button>
          <button 
            onClick={() => handleScan('Library', 'Library entry granted ✅')}
            disabled={scanState === 'scanning'}
            className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-yellow-500 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:-translate-y-0.5 transition-all disabled:opacity-50"
          >
            Library Entry
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ComplaintSection() {
  const [complaints, setComplaints] = useState<Complaint[]>(() => getInitialData().complaints);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.on('complaint_notification', (newComplaint: Complaint) => {
        setComplaints(prev => {
          // Check if it already exists to avoid duplicates from the emitter
          if (prev.some(c => c.id === newComplaint.id)) return prev;
          const updated = [newComplaint, ...prev];
          localStorage.setItem('vdorm_complaints', JSON.stringify(updated));
          return updated;
        });
      });
    }

    return () => {
      if (socket) {
        socket.off('complaint_notification');
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newComplaint: Complaint = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      roomNo: formData.get('roomNo') as string,
      regId: formData.get('regId') as string,
      preferredTime: formData.get('preferredTime') as string,
      category: formData.get('category') as string,
      reason: formData.get('reason') as string,
      status: 'Pending'
    };

    const updated = [newComplaint, ...complaints];
    setComplaints(updated);
    localStorage.setItem('vdorm_complaints', JSON.stringify(updated));
    setSuccess(true);
    (e.target as HTMLFormElement).reset();
    
    if (socket) {
      socket.emit('new_complaint', newComplaint);
    }
    
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <h2 className="text-3xl font-bold text-white">Raise a Complaint</h2>
      
      <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-slate-700/50">
        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 font-medium border border-green-200">
            <CheckCircle2 size={20} />
            Complaint raised successfully!
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
            <input name="name" required className="w-full px-4 py-2 rounded-lg border border-slate-700/50 focus:ring-2 focus:ring-cyan-500 outline-none bg-slate-800 text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Registration ID</label>
            <input name="regId" required className="w-full px-4 py-2 rounded-lg border border-slate-700/50 focus:ring-2 focus:ring-cyan-500 outline-none bg-slate-800 text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Room Number</label>
            <input name="roomNo" required className="w-full px-4 py-2 rounded-lg border border-slate-700/50 focus:ring-2 focus:ring-cyan-500 outline-none bg-slate-800 text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Preferred Time</label>
            <input name="preferredTime" type="time" required className="w-full px-4 py-2 rounded-lg border border-slate-700/50 focus:ring-2 focus:ring-cyan-500 outline-none bg-slate-800 text-white" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
            <select name="category" required className="w-full px-4 py-2 rounded-lg border border-slate-700/50 focus:ring-2 focus:ring-cyan-500 outline-none bg-slate-800 text-white">
              <option value="">Select Category</option>
              <option value="Electrical">Electrical</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Carpentry">Carpentry</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Internet">Internet / Wi-Fi</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-1">Reason / Description</label>
            <textarea name="reason" rows={3} required className="w-full px-4 py-2 rounded-lg border border-slate-700/50 focus:ring-2 focus:ring-cyan-500 outline-none resize-none bg-slate-800 text-white" />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all">
              Submit Complaint
            </button>
          </div>
        </form>
      </div>

      <h3 className="text-2xl font-bold text-white mt-12">Complaint History</h3>
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-sm border border-slate-700/50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 border-b border-slate-700/50 text-slate-300 text-sm">
              <th className="p-4 font-semibold">Sl No</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Reason</th>
              <th className="p-4 font-semibold">Preferred Time</th>
              <th className="p-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c, i) => (
              <tr key={c.id} className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                <td className="p-4 text-slate-400">{i + 1}</td>
                <td className="p-4 font-medium text-white">{c.category}</td>
                <td className="p-4 text-slate-400">{c.reason}</td>
                <td className="p-4 text-slate-400">{c.preferredTime}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    c.status === 'Resolved' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
            {complaints.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">No complaints found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function WardenSection() {
  const members = [
    { role: 'Chief Warden', name: 'Dr. S. Ramesh', phone: '+91 98765 43210', email: 'chiefwarden@vit.ac.in' },
    { role: 'Assistant Warden', name: 'Mr. K. Kumar', phone: '+91 98765 43211', email: 'asstwarden@vit.ac.in' },
    { role: 'Hostel Office', name: 'Block A Office', phone: '0416-220-1234', email: 'hosteloffice@vit.ac.in' },
    { role: 'Emergency Contact', name: 'Campus Security', phone: '0416-220-9999', email: 'security@vit.ac.in' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Warden & Hostel Members</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {members.map((m, i) => (
          <div key={i} className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-700/50 hover:shadow-md transition-shadow">
            <div className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2">{m.role}</div>
            <h3 className="text-xl font-bold text-white mb-4">{m.name}</h3>
            <div className="space-y-2 text-slate-300">
              <p>📞 {m.phone}</p>
              <p>✉️ {m.email}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function EventsSection() {
  const events = [
    { title: 'Hostel Orientation', date: 'Aug 15, 2026', desc: 'Welcome session for all new block residents.', type: 'General' },
    { title: 'Sports Night', date: 'Sep 05, 2026', desc: 'Inter-block badminton and table tennis tournament.', type: 'Sports' },
    { title: 'Cultural Evening', date: 'Oct 12, 2026', desc: 'Music, dance, and food festival in the courtyard.', type: 'Cultural' },
    { title: 'Maintenance Day', date: 'Nov 01, 2026', desc: 'Scheduled deep cleaning of all corridors.', type: 'Maintenance' },
    { title: 'Fire Drill', date: 'Dec 10, 2026', desc: 'Mandatory evacuation practice.', type: 'Safety' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Hostel Events</h2>
      <div className="space-y-4">
        {events.map((e, i) => (
          <div key={i} className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-cyan-500/50 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-white">{e.title}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  {e.type}
                </span>
              </div>
              <p className="text-slate-400">{e.desc}</p>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-sm font-bold text-cyan-400 bg-cyan-500/10 px-4 py-2 rounded-lg inline-block">
                {e.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function MessSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Mess Details & Menu</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Mess 1 */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-sm border border-slate-700/50 overflow-hidden">
          <div className="p-6 border-b border-slate-700/50 bg-slate-800/50 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Special Mess (Mess 1)</h3>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Crowd: Medium
            </span>
          </div>
          <div className="p-6 space-y-4">
            <div><strong className="text-white block mb-1">Breakfast (7:30 AM - 9:00 AM)</strong><p className="text-slate-400 text-sm">Masala Dosa, Chutney, Sambar, Bread, Butter, Jam, Tea/Coffee</p></div>
            <div><strong className="text-white block mb-1">Lunch (12:30 PM - 2:00 PM)</strong><p className="text-slate-400 text-sm">Paneer Butter Masala, Roti, Dal Tadka, Jeera Rice, Salad, Gulab Jamun</p></div>
            <div><strong className="text-white block mb-1">Snacks (4:30 PM - 5:30 PM)</strong><p className="text-slate-400 text-sm">Samosa, Mint Chutney, Tea/Coffee</p></div>
            <div><strong className="text-white block mb-1">Dinner (7:30 PM - 9:00 PM)</strong><p className="text-slate-400 text-sm">Veg Fried Rice, Manchurian, Roti, Dal, Milk</p></div>
          </div>
        </div>

        {/* Mess 2 */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-sm border border-slate-700/50 overflow-hidden">
          <div className="p-6 border-b border-slate-700/50 bg-slate-800/50 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Regular Mess (Mess 2)</h3>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Crowd: High
            </span>
          </div>
          <div className="p-6 space-y-4">
            <div><strong className="text-white block mb-1">Breakfast (7:30 AM - 9:00 AM)</strong><p className="text-slate-400 text-sm">Idli, Vada, Sambar, Chutney, Tea/Coffee</p></div>
            <div><strong className="text-white block mb-1">Lunch (12:30 PM - 2:00 PM)</strong><p className="text-slate-400 text-sm">Rice, Sambar, Rasam, Poriyal, Papad, Pickle</p></div>
            <div><strong className="text-white block mb-1">Snacks (4:30 PM - 5:30 PM)</strong><p className="text-slate-400 text-sm">Biscuits, Mixture, Tea/Coffee</p></div>
            <div><strong className="text-white block mb-1">Dinner (7:30 PM - 9:00 PM)</strong><p className="text-slate-400 text-sm">Chapati, Veg Kurma, Rice, Rasam, Milk</p></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
