export interface Student {
  id: string;
  name: string;
  regId: string;
  roomNo: string;
  phone: string;
  parentPhone: string;
  status: 'In Hostel' | 'Out' | 'Library';
  time: string;
  reason: string;
}

export interface Complaint {
  id: string;
  name: string;
  roomNo: string;
  regId: string;
  preferredTime: string;
  category: string;
  reason: string;
  status: 'Pending' | 'Resolved';
}

const firstNames = ['Aarav', 'Vihaan', 'Aditya', 'Sai', 'Arjun', 'Rohan', 'Krishna', 'Ishaan', 'Shaurya', 'Atharv', 'Diya', 'Ananya', 'Kiara', 'Saanvi', 'Myra', 'Aadhya', 'Pari', 'Riya', 'Kriti', 'Neha', 'Rahul', 'Karan', 'Priya', 'Sneha', 'Amit'];
const lastNames = ['Sharma', 'Reddy', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Verma', 'Rao', 'Das', 'Nair', 'Menon', 'Iyer', 'Pillai', 'Joshi', 'Choudhury'];

export const generateMockStudents = (): Student[] => {
  const students: Student[] = [];
  let roomCounter = 101;
  let studentsInRoom = 0;

  for (let i = 1; i <= 52; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const statuses: ('In Hostel' | 'Out' | 'Library')[] = ['In Hostel', 'Out', 'Library'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Ensure Reddem Manyatha Reddy is in the list for the face scan demo
    const isManyatha = i === 1;
    const name = isManyatha ? 'Reddem Manyatha Reddy' : `${firstName} ${lastName}`;
    const regId = isManyatha ? '21BCE0001' : `21BCE${i.toString().padStart(4, '0')}`;
    
    students.push({
      id: i.toString(),
      name,
      regId,
      roomNo: roomCounter.toString(),
      phone: `+91 98765${Math.floor(10000 + Math.random() * 90000)}`,
      parentPhone: `+91 99887${Math.floor(10000 + Math.random() * 90000)}`,
      status,
      time: new Date(Date.now() - Math.random() * 10000000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reason: status === 'Out' ? 'Going to market' : status === 'Library' ? 'Studying' : '-',
    });

    studentsInRoom++;
    if (studentsInRoom >= 4) {
      studentsInRoom = 0;
      roomCounter++;
    }
  }
  return students;
};

export const getInitialData = () => {
  if (typeof window === 'undefined') return { students: [], complaints: [] };
  
  const storedStudents = localStorage.getItem('vdorm_students');
  const storedComplaints = localStorage.getItem('vdorm_complaints');
  
  let students = storedStudents ? JSON.parse(storedStudents) : generateMockStudents();
  let complaints = storedComplaints ? JSON.parse(storedComplaints) : [
    { id: '1', name: 'Rohan Sharma', roomNo: '102', regId: '21BCE0005', preferredTime: '10:00 AM', category: 'Electrical', reason: 'Fan not working', status: 'Pending' },
    { id: '2', name: 'Priya Patel', roomNo: '105', regId: '21BCE0012', preferredTime: '02:00 PM', category: 'Plumbing', reason: 'Tap leaking', status: 'Resolved' },
  ];

  if (!storedStudents) localStorage.setItem('vdorm_students', JSON.stringify(students));
  if (!storedComplaints) localStorage.setItem('vdorm_complaints', JSON.stringify(complaints));

  return { students, complaints };
};
