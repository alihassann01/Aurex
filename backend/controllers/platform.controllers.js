const now = () => new Date().toISOString();

const userSummary = (user) => ({
  id: String(user?._id || user?.id || 'demo-user'),
  name: user?.name || 'Demo User',
  email: user?.email || 'demo@civicconnect.test',
  role: user?.role || 'resident',
});

const staffUser = {
  id: 'staff-demo',
  name: 'Amina Khan',
  email: 'staff@civicconnect.test',
  role: 'staff',
};

const adminUser = {
  id: 'admin-demo',
  name: 'Public Works Office',
  email: 'admin@civicconnect.test',
  role: 'department_admin',
};

const seedResident = {
  id: 'resident-demo',
  name: 'Sample Resident',
  email: 'resident@civicconnect.test',
  role: 'resident',
};

let requestCounter = 1030;
let permitCounter = 12350;

const requests = [
  {
    id: 'req-1',
    ticketId: 'CR-1024',
    title: 'Pothole on Main Street',
    description:
      'Large pothole near the Main Street and 5th Avenue intersection is causing traffic hazards and vehicle damage.',
    category: 'Infrastructure',
    priority: 'High',
    status: 'In Progress',
    location: '123 Main Street',
    attachments: [],
    assignedTo: staffUser,
    department: 'Public Works',
    sla: { deadline: '2026-05-17T12:00:00.000Z', daysLeft: 3, status: 'amber', breached: false },
    comments: [
      {
        id: 'comment-1',
        content: 'A repair crew has been scheduled and will inspect the site this afternoon.',
        author: staffUser,
        isInternal: false,
        createdAt: '2026-05-13T10:00:00.000Z',
      },
    ],
    createdBy: seedResident,
    createdAt: '2026-05-12T08:00:00.000Z',
    updatedAt: '2026-05-13T10:00:00.000Z',
  },
  {
    id: 'req-2',
    ticketId: 'CR-1025',
    title: 'Streetlight outage on Oak Avenue',
    description:
      'Three consecutive streetlights are not working, creating a safety hazard for pedestrians at night.',
    category: 'Safety',
    priority: 'Medium',
    status: 'Under Review',
    location: '456 Oak Avenue',
    attachments: [],
    department: 'Public Safety',
    sla: { deadline: '2026-05-21T12:00:00.000Z', daysLeft: 7, status: 'green', breached: false },
    comments: [],
    createdBy: seedResident,
    createdAt: '2026-05-11T14:00:00.000Z',
    updatedAt: '2026-05-11T14:00:00.000Z',
  },
  {
    id: 'req-3',
    ticketId: 'CR-1026',
    title: 'Water main break emergency',
    description: 'Water main break is flooding a residential street and needs immediate attention.',
    category: 'Infrastructure',
    priority: 'Emergency',
    status: 'Submitted',
    location: '321 Pine Road',
    attachments: [],
    department: 'Water Services',
    sla: { deadline: '2026-05-14T14:00:00.000Z', daysLeft: 0, status: 'red', breached: true },
    comments: [],
    createdBy: seedResident,
    createdAt: '2026-05-14T06:00:00.000Z',
    updatedAt: '2026-05-14T06:00:00.000Z',
  },
];

const permits = [
  {
    id: 'permit-1',
    permitNumber: 'PRM-12345',
    type: 'construction',
    status: 'Approved',
    applicantName: 'Sample Resident',
    address: '123 Main Street',
    description: 'Residential renovation and facade improvements',
    documents: [],
    fee: 1500,
    expiryDate: '2027-06-01',
    createdBy: seedResident,
    createdAt: '2026-05-01T10:00:00.000Z',
    updatedAt: '2026-05-10T10:00:00.000Z',
  },
  {
    id: 'permit-2',
    permitNumber: 'PRM-12346',
    type: 'event',
    status: 'Field Inspection',
    applicantName: 'Sample Resident',
    address: 'Civic Center Park',
    description: 'Community cultural fair with food vendors',
    documents: [],
    fee: 500,
    createdBy: seedResident,
    createdAt: '2026-05-03T10:00:00.000Z',
    updatedAt: '2026-05-12T10:00:00.000Z',
  },
  {
    id: 'permit-3',
    permitNumber: 'PRM-12347',
    type: 'business',
    status: 'Rejected',
    applicantName: 'Sample Resident',
    businessName: 'Elm Street Kitchen',
    address: '789 Elm Street',
    description: 'New small restaurant license',
    documents: [],
    fee: 2000,
    rejectionReason: 'Incomplete zoning documentation. Please submit updated zone clearance.',
    createdBy: seedResident,
    createdAt: '2026-04-28T10:00:00.000Z',
    updatedAt: '2026-05-08T10:00:00.000Z',
  },
];

const announcements = [
  {
    id: 'ann-1',
    title: 'Emergency: Water Main Break on Central Avenue',
    content:
      'Residents in the Central Avenue area should boil water before drinking. Repair crews are on-site and service updates will be posted every two hours.',
    priority: 'Emergency',
    category: 'Emergency',
    author: adminUser,
    isRead: false,
    createdAt: '2026-05-14T06:00:00.000Z',
  },
  {
    id: 'ann-2',
    title: 'Free Health Screening at Community Center',
    content:
      'The Department of Health is offering free health screenings this Saturday from 9 AM to 3 PM. Walk-ins are welcome.',
    priority: 'Normal',
    category: 'Health',
    author: adminUser,
    isRead: false,
    createdAt: '2026-05-13T14:00:00.000Z',
  },
  {
    id: 'ann-3',
    title: 'Road Resurfacing Project Phase 2',
    content:
      'Phase 2 of the resurfacing project starts Monday. Expect detours on Oak Street and Maple Avenue for approximately two weeks.',
    priority: 'High',
    category: 'Infrastructure',
    author: adminUser,
    isRead: true,
    createdAt: '2026-05-12T10:00:00.000Z',
  },
];

const events = [
  {
    id: 'event-1',
    title: 'Annual City Cultural Festival',
    description:
      'Three days of live music, food trucks, art exhibitions, and family activities at Civic Center Park.',
    date: '2026-06-15',
    location: 'Civic Center Park',
    capacity: 500,
    registered: 387,
    registeredUsers: new Set(),
    isRegistered: false,
  },
  {
    id: 'event-2',
    title: 'Town Hall Meeting',
    description: 'Discuss the new budget and infrastructure plan with city officials.',
    date: '2026-05-28',
    location: 'City Hall Auditorium',
    capacity: 200,
    registered: 200,
    registeredUsers: new Set(['resident-demo']),
    isRegistered: true,
  },
  {
    id: 'event-3',
    title: 'Community Clean-up Day',
    description: 'Volunteer to clean parks and waterways. Equipment and refreshments are provided.',
    date: '2026-06-08',
    location: 'Riverside Park',
    capacity: 150,
    registered: 92,
    registeredUsers: new Set(),
    isRegistered: false,
  },
];

const cloneRequestForUser = (request, currentUser) => {
  if (request.createdBy.id !== 'resident-demo') return request;
  return { ...request, createdBy: currentUser.role === 'resident' ? currentUser : request.createdBy };
};

const canManage = (user) => ['staff', 'department_admin', 'super_admin'].includes(user.role);
const canAdmin = (user) => ['department_admin', 'super_admin'].includes(user.role);

const slaForPriority = (priority) => {
  const days = priority === 'Emergency' ? 0 : priority === 'High' ? 2 : priority === 'Medium' ? 5 : 10;
  const deadline = new Date(Date.now() + Math.max(days, 1) * 24 * 60 * 60 * 1000).toISOString();
  return {
    deadline,
    daysLeft: days,
    status: priority === 'Emergency' ? 'red' : priority === 'High' ? 'amber' : 'green',
    breached: false,
  };
};

export const listRequests = (req, res) => {
  const currentUser = userSummary(req.user);
  const visible = canManage(currentUser)
    ? requests
    : requests.filter((item) => ['resident-demo', currentUser.id].includes(item.createdBy.id));

  res.json({ data: visible.map((item) => cloneRequestForUser(item, currentUser)) });
};

export const createRequest = (req, res) => {
  const currentUser = userSummary(req.user);
  const { title, description, category, priority = 'Low', location, latitude, longitude } = req.body;

  if (!title || !description || !category || !location) {
    return res.status(400).json({ message: 'title, description, category, and location are required' });
  }

  const request = {
    id: `req-${Date.now()}`,
    ticketId: `CR-${requestCounter++}`,
    title,
    description,
    category,
    priority,
    status: 'Submitted',
    location,
    latitude,
    longitude,
    attachments: [],
    department: category === 'Safety' ? 'Public Safety' : category === 'Permits' ? 'Permits Office' : 'Public Works',
    sla: slaForPriority(priority),
    comments: [],
    createdBy: currentUser,
    createdAt: now(),
    updatedAt: now(),
  };

  requests.unshift(request);
  res.status(201).json({ data: request });
};

export const updateRequest = (req, res) => {
  const currentUser = userSummary(req.user);
  const request = requests.find((item) => item.id === req.params.id || item.ticketId === req.params.id);

  if (!request) return res.status(404).json({ message: 'Request not found' });

  const { status, assignedTo, priority, comment, isInternal } = req.body;

  if ((status || assignedTo || priority) && !canManage(currentUser)) {
    return res.status(403).json({ message: 'Only staff can update request workflow fields' });
  }

  if (status) request.status = status;
  if (assignedTo) request.assignedTo = assignedTo;
  if (priority) {
    request.priority = priority;
    request.sla = slaForPriority(priority);
  }
  if (comment) {
    request.comments.push({
      id: `comment-${Date.now()}`,
      content: comment,
      author: currentUser,
      isInternal: Boolean(isInternal && canManage(currentUser)),
      createdAt: now(),
    });
  }

  request.updatedAt = now();
  res.json({ data: cloneRequestForUser(request, currentUser) });
};

export const listPermits = (req, res) => {
  const currentUser = userSummary(req.user);
  const visible = canAdmin(currentUser)
    ? permits
    : permits.filter((item) => ['resident-demo', currentUser.id].includes(item.createdBy.id));

  res.json({
    data: visible.map((item) =>
      item.createdBy.id === 'resident-demo' && currentUser.role === 'resident'
        ? { ...item, createdBy: currentUser, applicantName: currentUser.name }
        : item
    ),
  });
};

export const createPermit = (req, res) => {
  const currentUser = userSummary(req.user);
  const { type, applicantName, address, description, businessName } = req.body;

  if (!type || !applicantName || !address || !description) {
    return res.status(400).json({ message: 'type, applicantName, address, and description are required' });
  }

  const baseFees = { construction: 1500, event: 500, business: 2000 };
  const permit = {
    id: `permit-${Date.now()}`,
    permitNumber: `PRM-${permitCounter++}`,
    type,
    status: 'Submitted',
    applicantName,
    businessName,
    address,
    description,
    documents: [],
    fee: baseFees[type] || 750,
    createdBy: currentUser,
    createdAt: now(),
    updatedAt: now(),
  };

  permits.unshift(permit);
  res.status(201).json({ data: permit });
};

export const updatePermit = (req, res) => {
  const currentUser = userSummary(req.user);
  if (!canAdmin(currentUser)) {
    return res.status(403).json({ message: 'Only department administrators can update permits' });
  }

  const permit = permits.find((item) => item.id === req.params.id || item.permitNumber === req.params.id);
  if (!permit) return res.status(404).json({ message: 'Permit not found' });

  const { status, rejectionReason, expiryDate } = req.body;
  if (status) permit.status = status;
  if (rejectionReason !== undefined) permit.rejectionReason = rejectionReason;
  if (expiryDate) permit.expiryDate = expiryDate;
  permit.updatedAt = now();

  res.json({ data: permit });
};

export const listAnnouncements = (req, res) => {
  res.json({ data: announcements });
};

export const createAnnouncement = (req, res) => {
  const currentUser = userSummary(req.user);
  if (!canAdmin(currentUser)) {
    return res.status(403).json({ message: 'Only administrators can publish announcements' });
  }

  const { title, content, priority = 'Normal', category = 'General', expiryDate } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: 'title and content are required' });
  }

  const announcement = {
    id: `ann-${Date.now()}`,
    title,
    content,
    priority,
    category,
    expiryDate,
    author: currentUser,
    isRead: false,
    createdAt: now(),
  };

  announcements.unshift(announcement);
  res.status(201).json({ data: announcement });
};

export const markAnnouncementRead = (req, res) => {
  const announcement = announcements.find((item) => item.id === req.params.id);
  if (!announcement) return res.status(404).json({ message: 'Announcement not found' });
  announcement.isRead = true;
  res.json({ data: announcement });
};

export const listEvents = (req, res) => {
  const currentUser = userSummary(req.user);
  res.json({
    data: events.map(({ registeredUsers, ...event }) => ({
      ...event,
      isRegistered: registeredUsers.has(currentUser.id) || event.isRegistered,
    })),
  });
};

export const registerForEvent = (req, res) => {
  const currentUser = userSummary(req.user);
  const event = events.find((item) => item.id === req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  if (event.registered >= event.capacity && !event.registeredUsers.has(currentUser.id)) {
    return res.status(400).json({ message: 'Event is full' });
  }

  if (!event.registeredUsers.has(currentUser.id)) {
    event.registeredUsers.add(currentUser.id);
    event.registered += 1;
  }

  const { registeredUsers, ...eventPayload } = event;
  res.json({ data: { ...eventPayload, isRegistered: true } });
};

export const getAnalyticsOverview = (req, res) => {
  const openStatuses = ['Submitted', 'Under Review', 'Assigned', 'In Progress'];
  const totalRequests = requests.length;
  const openTickets = requests.filter((item) => openStatuses.includes(item.status)).length;
  const breached = requests.filter((item) => item.sla.breached || item.sla.status === 'red').length;

  const ticketsByStatus = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'].map(
    (status) => ({ status, count: requests.filter((item) => item.status === status).length })
  );

  const permitFunnel = ['Submitted', 'Document Verification', 'Field Inspection', 'Approved', 'Rejected'].map(
    (stage) => ({ stage, count: permits.filter((item) => item.status === stage).length })
  );

  res.json({
    data: {
      totalRequests,
      openTickets,
      slaBreachRate: totalRequests ? Math.round((breached / totalRequests) * 1000) / 10 : 0,
      avgResolutionTime: 2.4,
      ticketsByStatus,
      resolutionTimeByDept: [
        { department: 'Public Works', avgDays: 2.1 },
        { department: 'Public Safety', avgDays: 1.3 },
        { department: 'Permits Office', avgDays: 4.8 },
      ],
      slaBreachOverTime: [
        { week: 'Week 1', breachRate: 5.1 },
        { week: 'Week 2', breachRate: 4.8 },
        { week: 'Week 3', breachRate: 4.4 },
        { week: 'Week 4', breachRate: 3.9 },
      ],
      permitFunnel,
      topIssues: [
        { rank: 1, category: 'Infrastructure', location: 'Main Street', count: 24 },
        { rank: 2, category: 'Safety', location: 'Oak Avenue', count: 18 },
        { rank: 3, category: 'Permits', location: 'Elm Street', count: 12 },
      ],
      complaintHeatmap: [
        { latitude: 40.7128, longitude: -74.006, intensity: 0.8, area: 'Central' },
        { latitude: 40.7218, longitude: -74.016, intensity: 0.5, area: 'Riverside' },
      ],
    },
  });
};
