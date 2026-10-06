/**
 * CampusConnect Mock Data & Static Content
 * Used for offline fallbacks, initial states, and decoupled UI demonstration
 */

export const mockUser = {
  id: 1,
  name: 'Asha Patel',
  usn: 'CS2026001',
  role: 'student',
  department: 'CSE',
  currentYear: 2,
  email: 'asha@example.com',
  mobileNumber: '9876543210',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
};

export const campusDepartments = [
  'CSE',
  'AIML',
  'AIDS',
  'CSBS',
  'CSDS',
  'ECE',
  'EEE',
  'MECH',
  'AUTOMOBILE',
  'AERONAUTICAL',
  'MARINE',
];

export const mockServices = [
  {
    id: 1,
    name: 'Wi-Fi & Campus Network',
    department: 'CSE',
    icon: 'wifi',
    description: 'Report connection drops, portal login errors, or AP malfunction',
    slaHours: 4,
  },
  {
    id: 2,
    name: 'Electrical & Lighting',
    department: 'EEE',
    icon: 'flash',
    description: 'Classroom projectors, switchboard faults, and lab power outlets',
    slaHours: 6,
  },
  {
    id: 3,
    name: 'HVAC & Climate Control',
    department: 'MECH',
    icon: 'thermometer',
    description: 'Auditorium cooling, seminar hall ACs, and ventilation repairs',
    slaHours: 8,
  },
  {
    id: 4,
    name: 'Plumbing & Clean Water',
    department: 'MECH',
    icon: 'water',
    description: 'Restroom facilities, RO filter units, and pipeline maintenance',
    slaHours: 4,
  },
  {
    id: 5,
    name: 'Lab Equipment & Systems',
    department: 'ECE',
    icon: 'desktop',
    description: 'Oscilloscopes, GPU servers, and workstation troubleshooting',
    slaHours: 12,
  },
  {
    id: 6,
    name: 'Hostel & Residential Life',
    department: 'CSE',
    icon: 'bed',
    description: 'Hostel room repairs, furniture maintenance, and keycard resets',
    slaHours: 24,
  },
];

export const mockRequests = [
  {
    id: 101,
    code: 'SR-2026-104921',
    serviceId: 1,
    serviceTitle: 'Wi-Fi & Campus Network',
    title: 'High latency and packet loss on AP-304',
    description: 'Wi-Fi signals in Turing Lab Room 302 keep dropping during practical exams. Connection speed fluctuates below 1 Mbps.',
    location: 'Turing Block, 3rd Floor, Room 302',
    status: 'in_progress',
    priority: 'urgent',
    assignedTo: 'Vikram Joshi (Network Admin)',
    department: 'CSE',
    createdAt: '2026-10-06T07:15:00Z',
    dueAt: '2026-10-06T11:15:00Z',
    history: [
      { step: 'Request Submitted', time: '10:45 AM', note: 'Created by Asha Patel' },
      { step: 'Auto-Triage Complete', time: '10:46 AM', note: 'Assigned Priority: Urgent based on SLA rules' },
      { step: 'Engineer Dispatched', time: '11:10 AM', note: 'Vikram Joshi assigned to inspect Turing 302 switch' },
    ],
  },
  {
    id: 102,
    code: 'SR-2026-098231',
    serviceId: 2,
    serviceTitle: 'Electrical & Lighting',
    title: 'Projector display flickers in Seminar Hall 1',
    description: 'HDMI input gives no signal periodically and bulb lamp warning light is blinking red.',
    location: 'Visvesvaraya Hall, Ground Floor',
    status: 'assigned',
    priority: 'high',
    assignedTo: 'Kiran Kumar (Electrical Team)',
    department: 'EEE',
    createdAt: '2026-10-06T05:30:00Z',
    dueAt: '2026-10-06T13:30:00Z',
    history: [
      { step: 'Request Submitted', time: '08:30 AM', note: 'Created by Asha Patel' },
      { step: 'Assigned to Staff', time: '09:00 AM', note: 'Kiran Kumar scheduled for 2:00 PM slot' },
    ],
  },
  {
    id: 103,
    code: 'SR-2026-081944',
    serviceId: 4,
    serviceTitle: 'Plumbing & Clean Water',
    title: 'Water dispenser cooling unit leak',
    description: 'Dispenser unit outside Library corridor is leaking water on the tiled walkway, causing slipping hazard.',
    location: 'Central Library, 2nd Floor Corridor',
    status: 'completed',
    priority: 'medium',
    assignedTo: 'Ramesh Gowda',
    department: 'MECH',
    createdAt: '2026-10-05T09:00:00Z',
    dueAt: '2026-10-05T13:00:00Z',
    history: [
      { step: 'Request Submitted', time: 'Yesterday 09:00 AM', note: 'Created by Asha Patel' },
      { step: 'In Progress', time: 'Yesterday 10:15 AM', note: 'Gasket valve replaced' },
      { step: 'Resolved & Tested', time: 'Yesterday 12:40 PM', note: 'Corridor dried and unit functioning cleanly.' },
    ],
  },
  {
    id: 104,
    code: 'SR-2026-074120',
    serviceId: 6,
    serviceTitle: 'Hostel & Residential Life',
    title: 'Study lamp socket ungrounded in Block B',
    description: 'Power socket in Room B-412 has a loose internal spring and sparking sound when laptop charger is plugged in.',
    location: 'Cauvery Hostel, Block B, Room 412',
    status: 'pending',
    priority: 'low',
    assignedTo: null,
    department: 'CSE',
    createdAt: '2026-10-06T08:00:00Z',
    dueAt: '2026-10-07T08:00:00Z',
    history: [
      { step: 'Request Submitted', time: 'Today 11:30 AM', note: 'Pending department assignment' },
    ],
  },
];

export const mockShuttles = [
  {
    id: 'shuttle-1',
    route: 'Route A: North Campus Shuttle',
    nextArrival: '3 mins',
    status: 'On Time',
    capacity: '82%',
    stops: ['Main Gate', 'Library Square', 'Tech Park', 'Sports Complex'],
    currentStop: 'Library Square',
  },
  {
    id: 'shuttle-2',
    route: 'Route B: Hostel Express Circuit',
    nextArrival: '8 mins',
    status: 'Approaching',
    capacity: '45%',
    stops: ['Hostel Quad', 'Dining Commons', 'Auditorium', 'Science Block'],
    currentStop: 'Hostel Quad',
  },
  {
    id: 'shuttle-3',
    route: 'Route C: Innovation & Research Loop',
    nextArrival: '14 mins',
    status: 'On Schedule',
    capacity: '60%',
    stops: ['Incubation Hub', 'Nanotech Center', 'Aeronautical Hangar'],
    currentStop: 'Incubation Hub',
  },
];

export const mockFacilities = [
  {
    id: 'fac-1',
    name: 'Smart Study Pods (Floor 3)',
    building: 'Central Library',
    status: 'Available',
    availableCount: 4,
    totalCount: 12,
    badgeColor: '#10B981',
  },
  {
    id: 'fac-2',
    name: 'AI High Performance Lab',
    building: 'Alan Turing Block',
    status: 'Reserved',
    availableCount: 0,
    totalCount: 36,
    badgeColor: '#EF4444',
  },
  {
    id: 'fac-3',
    name: 'Indoor Badminton Courts',
    building: 'Sports Complex',
    status: 'Available',
    availableCount: 2,
    totalCount: 4,
    badgeColor: '#10B981',
  },
];

export const mockNotifications = [
  {
    id: 1,
    title: 'Ticket #SR-2026-104921 In Progress',
    message: 'Vikram Joshi has begun work on the Wi-Fi AP issue in Turing 302.',
    time: '15m ago',
    read: false,
    type: 'status_update',
  },
  {
    id: 2,
    title: 'Scheduled Maintenance Advisory',
    message: 'Cauvery Hostel power switchboard check scheduled for 4:00 PM today.',
    time: '2h ago',
    read: false,
    type: 'system_alert',
  },
  {
    id: 3,
    title: 'Ticket #SR-2026-081944 Completed',
    message: 'The water dispenser leak has been fixed and verified by engineering staff.',
    time: '1d ago',
    read: true,
    type: 'resolved',
  },
];

export const mockStats = {
  total: 18,
  pending: 3,
  assigned: 5,
  in_progress: 4,
  completed: 6,
};
