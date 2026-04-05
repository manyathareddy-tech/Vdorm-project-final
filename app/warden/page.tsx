'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Activity, MessageSquareWarning, Wrench, LogOut, Search, Bell, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { getInitialData, Student, Complaint } from '@/lib/mockData';
import { io, Socket } from 'socket.io-client';

let socket: Socket;

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState('status');
  const [notifications, setNotifications] = useState<{id: string, message: string, type: string, time: string}[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toast, setToast] = useState<{id: string, message: string, type: string} | null>(null);
  const router = useRouter();

  useEffect(() => {
    socket = io({
      transports: ['websocket'],
    });

    socket.on('complaint_notification', (data) => {
      const newNotif = {
        id: Math.random().toString(36).substr(2, 9),
        message: `New Complaint: ${data.category} in Room ${data.roomNo}`,
        type: 'complaint',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setNotifications(prev => [newNotif, ...prev]);
      setToast(newNotif);
      setTimeout(() => setToast(null), 5000);
    });

    socket.on('maintenance_notification', (data) => {
      const newNotif = {
        id: Math.random().toString(36).substr(2, 9),
        message: `Urgent Maintenance: ${data.issue} in ${data.location}`,
        type: 'maintenance',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setNotifications(prev => [newNotif, ...prev]);
      setToast(newNotif);
      setTimeout(() => setToast(null), 5000);
    });

    socket.on('status_notification', (data) => {
      if (data.status === 'Out' && data.time > '22:00:00') {
        const newNotif = {
          id: Math.random().toString(36).substr(2, 9),
          message: `Late Entry Alert: ${data.name} (${data.regId})`,
          type: 'alert',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setNotifications(prev => [newNotif, ...prev]);
        setToast(newNotif);
        setTimeout(() => setToast(null), 5000);
      }
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const tabs = [
    { id: 'status', label: 'In/Out Status', icon: <Activity size={20} /> },
    { id: 'students', label: 'Student Info', icon: <Users size={20} /> },
    { id: 'complaints', label: 'Complaints', icon: <MessageSquareWarning size={20} /> },
    { id: 'maintenance', label: 'Maintenance', icon: <Wrench size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex font-sans relative overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 text-slate-300 flex flex-col z-10">
        <div className="p-6 border-b border-slate-800 bg-slate-950/50">
          <div className="text-3xl font-extrabold tracking-tighter text-white drop-shadow-sm">
            V<span className="text-cyan-500">Dorm</span> <span className="text-sm font-medium text-slate-500 ml-2">Admin</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                activeTab === tab.id 
                  ? 'bg-cyan-500/20 text-cyan-400 shadow-sm border border-cyan-500/30' 
                  : 'hover:bg-slate-800 hover:text-white'
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
      <main className="flex-1 overflow-y-auto z-10 flex flex-col">
        {/* Topbar */}
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 h-16 flex items-center justify-between px-8 shadow-sm relative z-50">
          <h1 className="text-xl font-bold text-white">
            {tabs.find(t => t.id === activeTab)?.label} Dashboard
          </h1>
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors relative"
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div 
                className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50"
                onClick={() => setShowNotifications(false)}
              >
                <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
                  <h3 className="font-bold text-white">Notifications</h3>
                  <button 
                    onClick={() => setNotifications([])}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Clear All
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">
                      No new notifications
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-700/50">
                      {notifications.map(n => (
                        <div key={n.id} className="p-4 hover:bg-slate-700/30 transition-colors">
                          <div className="flex justify-between items-start mb-1">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              n.type === 'complaint' ? 'bg-amber-500/20 text-amber-400' :
                              n.type === 'alert' ? 'bg-red-500/20 text-red-400' :
                              'bg-blue-500/20 text-blue-400'
                            }`}>
                              {n.type.toUpperCase()}
                            </span>
                            <span className="text-xs text-slate-500">{n.time}</span>
                          </div>
                          <p className="text-sm text-slate-300">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>
        
        <div className="p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'status' && <StatusSection />}
          {activeTab === 'students' && <StudentInfoSection />}
          {activeTab === 'complaints' && <AdminComplaintsSection />}
          {activeTab === 'maintenance' && <MaintenanceSection />}
        </div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <motion.div 
          initial={{ opacity: 0, y: 50, x: 50 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 50, x: 50 }}
          className="fixed bottom-6 right-6 bg-slate-800 border border-slate-700 shadow-2xl rounded-xl p-4 flex items-start gap-4 z-50 max-w-sm"
        >
          <div className={`p-2 rounded-lg ${
            toast.type === 'complaint' ? 'bg-amber-500/20 text-amber-400' :
            toast.type === 'alert' ? 'bg-red-500/20 text-red-400' :
            'bg-blue-500/20 text-blue-400'
          }`}>
            <Bell size={20} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-white mb-1">New Notification</h4>
            <p className="text-sm text-slate-300">{toast.message}</p>
          </div>
          <button onClick={() => setToast(null)} className="text-slate-500 hover:text-white">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </div>
  );
}

function StatusSection() {
  const [students, setStudents] = useState<Student[]>(() => getInitialData().students);

  useEffect(() => {
    if (socket) {
      socket.on('status_notification', (updatedStudent: Student) => {
        setStudents(prev => {
          const next = prev.map(s => s.id === updatedStudent.id ? updatedStudent : s);
          localStorage.setItem('vdorm_students', JSON.stringify(next));
          return next;
        });
      });
    }

    // Live update simulation every 3 seconds
    const interval = setInterval(() => {
      setStudents(prev => {
        const next = [...prev];
        // Pick 1-3 random students to update
        const numToUpdate = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numToUpdate; i++) {
          const idx = Math.floor(Math.random() * next.length);
          // Don't randomly update Manyatha's status to avoid overriding manual tests
          if (next[idx].regId === '21BCE0001') continue;
          
          const statuses: ('In Hostel' | 'Out' | 'Library')[] = ['In Hostel', 'Out', 'Library'];
          const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
          next[idx] = {
            ...next[idx],
            status: newStatus,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            reason: newStatus === 'Out' ? 'Market' : newStatus === 'Library' ? 'Study' : '-'
          };
        }
        localStorage.setItem('vdorm_students', JSON.stringify(next));
        return next;
      });
    }, 3000);

    return () => {
      clearInterval(interval);
      if (socket) {
        socket.off('status_notification');
      }
    };
  }, []);

  const getRowClass = (status: string) => {
    if (status === 'In Hostel') return 'bg-green-500/10 hover:bg-green-500/20';
    if (status === 'Library') return 'bg-yellow-500/10 hover:bg-yellow-500/20';
    return 'bg-red-500/10 hover:bg-red-500/20';
  };

  const getBadgeClass = (status: string) => {
    if (status === 'In Hostel') return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (status === 'Library') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const renderTable = (data: Student[], title: string) => (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-sm border border-slate-700/50 overflow-hidden mb-8">
      <div className="p-4 border-b border-slate-700/50 bg-slate-800/50 flex justify-between items-center">
        <h3 className="font-bold text-white">{title}</h3>
        <span className="text-sm font-medium text-slate-400">Count: {data.length}</span>
      </div>
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="sticky top-0 bg-slate-800 shadow-sm z-10">
            <tr className="text-slate-300">
              <th className="p-3 font-semibold border-b border-slate-700/50">Sl No</th>
              <th className="p-3 font-semibold border-b border-slate-700/50">Name</th>
              <th className="p-3 font-semibold border-b border-slate-700/50">Reg ID</th>
              <th className="p-3 font-semibold border-b border-slate-700/50">Room</th>
              <th className="p-3 font-semibold border-b border-slate-700/50">Time</th>
              <th className="p-3 font-semibold border-b border-slate-700/50">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((s, i) => (
              <tr key={s.id} className={`border-b border-slate-700/50 transition-colors ${getRowClass(s.status)}`}>
                <td className="p-3 text-slate-400">{i + 1}</td>
                <td className="p-3 font-medium text-white">{s.name}</td>
                <td className="p-3 text-slate-400">{s.regId}</td>
                <td className="p-3 text-slate-400">{s.roomNo}</td>
                <td className="p-3 text-slate-400 font-mono text-xs">{s.time}</td>
                <td className="p-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getBadgeClass(s.status)}`}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Live Status Monitor</h2>
        <div className="flex items-center gap-2 text-sm font-medium text-green-400 bg-green-500/20 px-3 py-1.5 rounded-full border border-green-500/30">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live Updates Active
        </div>
      </div>

      {renderTable(students, 'All Students (Live)')}
      
      <div className="grid lg:grid-cols-2 gap-8">
        {renderTable(students.filter(s => s.status === 'In Hostel'), 'Currently In Hostel')}
        {renderTable(students.filter(s => s.status === 'Out'), 'Currently Out')}
        {renderTable(students.filter(s => s.status === 'Library'), 'Currently in Library')}
      </div>
    </motion.div>
  );
}

function StudentInfoSection() {
  const [students, setStudents] = useState<Student[]>(() => getInitialData().students);
  const [search, setSearch] = useState('');

  const filtered = students.filter(s => {
    const term = search.toLowerCase();
    // If searching by room, show all roommates
    if (term && !isNaN(Number(term)) && term.length === 3) {
      return s.roomNo === term;
    }
    return s.name.toLowerCase().includes(term) || s.regId.toLowerCase().includes(term) || s.roomNo.includes(term);
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-white">Student Directory</h2>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Name, Reg ID, or Room..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-700/50 focus:ring-2 focus:ring-cyan-500 outline-none bg-slate-800 text-white placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-sm border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-slate-800/50">
              <tr className="text-slate-300">
                <th className="p-4 font-semibold border-b border-slate-700/50">Sl No</th>
                <th className="p-4 font-semibold border-b border-slate-700/50">Name</th>
                <th className="p-4 font-semibold border-b border-slate-700/50">Reg ID</th>
                <th className="p-4 font-semibold border-b border-slate-700/50">Room</th>
                <th className="p-4 font-semibold border-b border-slate-700/50">Phone</th>
                <th className="p-4 font-semibold border-b border-slate-700/50">Parent Phone</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-slate-400">{i + 1}</td>
                  <td className="p-4 font-medium text-white">{s.name}</td>
                  <td className="p-4 text-slate-400">{s.regId}</td>
                  <td className="p-4 text-slate-400 font-medium">{s.roomNo}</td>
                  <td className="p-4 text-slate-400">{s.phone}</td>
                  <td className="p-4 text-slate-400">{s.parentPhone}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">No students found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

function AdminComplaintsSection() {
  const [complaints, setComplaints] = useState<Complaint[]>(() => getInitialData().complaints);

  useEffect(() => {
    if (socket) {
      socket.on('complaint_notification', (newComplaint: Complaint) => {
        setComplaints(prev => {
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

  const markResolved = (id: string) => {
    const updated = complaints.map(c => c.id === id ? { ...c, status: 'Resolved' as const } : c);
    setComplaints(updated);
    localStorage.setItem('vdorm_complaints', JSON.stringify(updated));
  };

  const pending = complaints.filter(c => c.status === 'Pending');
  const resolved = complaints.filter(c => c.status === 'Resolved');

  const renderTable = (data: Complaint[], isPending: boolean) => (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-sm border border-slate-700/50 overflow-hidden mb-8">
      <div className="p-4 border-b border-slate-700/50 bg-slate-800/50 flex justify-between items-center">
        <h3 className="font-bold text-white">{isPending ? 'Pending Complaints' : 'Resolved Complaints'}</h3>
        <span className="text-sm font-medium text-slate-400">Count: {data.length}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-slate-800/50">
            <tr className="text-slate-300">
              <th className="p-4 font-semibold border-b border-slate-700/50">Room</th>
              <th className="p-4 font-semibold border-b border-slate-700/50">Name</th>
              <th className="p-4 font-semibold border-b border-slate-700/50">Category</th>
              <th className="p-4 font-semibold border-b border-slate-700/50">Reason</th>
              <th className="p-4 font-semibold border-b border-slate-700/50">Time</th>
              {isPending && <th className="p-4 font-semibold border-b border-slate-700/50 text-right">Action</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((c) => (
              <tr key={c.id} className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                <td className="p-4 font-medium text-white">{c.roomNo}</td>
                <td className="p-4 text-slate-400">{c.name}</td>
                <td className="p-4 text-slate-400">
                  <span className="px-2 py-1 bg-slate-800 rounded-md text-xs font-medium border border-slate-700">{c.category}</span>
                </td>
                <td className="p-4 text-slate-400 max-w-xs truncate" title={c.reason}>{c.reason}</td>
                <td className="p-4 text-slate-400">{c.preferredTime}</td>
                {isPending && (
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => markResolved(c.id)}
                      className="px-3 py-1.5 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-white rounded-lg text-xs font-bold transition-colors border border-cyan-500/30 hover:border-cyan-500"
                    >
                      Mark Resolved
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={isPending ? 6 : 5} className="p-8 text-center text-slate-400">No complaints in this category.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Complaints Management</h2>
      {renderTable(pending, true)}
      {renderTable(resolved, false)}
    </motion.div>
  );
}

function MaintenanceSection() {
  const rooms = [
    { room: '101', status: 'Cleaned', time: '09:00 AM', staff: 'Raju' },
    { room: '102', status: 'Not Cleaned', time: '-', staff: 'Raju' },
    { room: '103', status: 'Cleaned', time: '09:30 AM', staff: 'Raju' },
  ];

  const bathrooms = [
    { floor: 'Ground Floor', status: 'Cleaned', time: '08:00 AM', staff: 'Team A' },
    { floor: 'First Floor', status: 'Cleaned', time: '10:00 AM', staff: 'Team B' },
    { floor: 'Second Floor', status: 'Not Cleaned', time: '-', staff: 'Team C' },
  ];

  const garden = [
    { area: 'Front Lawn', status: 'Watered', remark: 'Done', staff: 'Mali Kaka' },
    { area: 'Courtyard', status: 'Not Watered', remark: 'Rainy day - No watering needed', staff: 'Mali Kaka' },
  ];

  const sports = [
    { name: 'Aarav Sharma', reg: '21BCE0010', item: 'Basketball', status: 'Returned' },
    { name: 'Vihaan Reddy', reg: '21BCE0045', item: 'Badminton Rackets', status: 'Not Returned' },
  ];

  const renderSimpleTable = (title: string, headers: string[], rows: (string | React.ReactNode)[][]) => (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-sm border border-slate-700/50 overflow-hidden">
      <div className="p-4 border-b border-slate-700/50 bg-slate-800/50">
        <h3 className="font-bold text-white">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-slate-800/50">
            <tr className="text-slate-300">
              {headers.map((h, i) => <th key={i} className="p-3 font-semibold border-b border-slate-700/50">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-800/50">
                {row.map((cell, j) => <td key={j} className="p-3 text-slate-400">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const getStatusBadge = (status: string) => {
    const isGood = status.includes('Cleaned') && !status.includes('Not') || status === 'Watered' || status === 'Returned';
    const isBad = status.includes('Not');
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
        isGood ? 'bg-green-500/20 text-green-400' : isBad ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-300'
      }`}>
        {status}
      </span>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <h2 className="text-2xl font-bold text-white mb-6">Facility Maintenance</h2>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {renderSimpleTable('Room Cleaning', ['Room', 'Status', 'Time', 'Staff'], rooms.map(r => [r.room, getStatusBadge(r.status), r.time, r.staff]))}
        {renderSimpleTable('Bathroom Cleaning', ['Floor', 'Status', 'Time', 'Staff'], bathrooms.map(b => [b.floor, getStatusBadge(b.status), b.time, b.staff]))}
        {renderSimpleTable('Garden Maintenance', ['Area', 'Status', 'Remark', 'Staff'], garden.map(g => [g.area, getStatusBadge(g.status), g.remark, g.staff]))}
        {renderSimpleTable('Sports / Borrowed Items', ['Student', 'Reg ID', 'Item', 'Status'], sports.map(s => [s.name, s.reg, s.item, getStatusBadge(s.status)]))}
      </div>
    </motion.div>
  );
}
