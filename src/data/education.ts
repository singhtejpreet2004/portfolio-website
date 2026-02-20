import { Education } from '@/types';

export const education: Education[] = [
  {
    institution: 'Chandigarh University',
    degree: 'Bachelor of Engineering',
    field: 'Computer Science and Engineering',
    startDate: '2022',
    endDate: '2026',
    gpa: '7.19/10.00',
    coursework: [
      'Data Structures & Algorithms',
      'Database Management Systems',
      'Machine Learning',
      'Computer Networks',
      'Operating Systems',
      'Software Engineering',
      'Object-Oriented Programming',
      'Data Analytics',
    ],
    activities: [
      'PR Coordinator, IEEE CUSB',
      'Editorial Coordinator, CIS CUSB',
      'Hackathon Team Lead',
      'Student Researcher - KCCRST',
    ],
  },
  {
    institution: 'Your School Name', // TODO: update
    degree: 'Higher Secondary (Class XII)',
    field: 'Science — Physics, Chemistry, Mathematics, Computer Science',
    startDate: '2020',
    endDate: '2022',
    // gpa: 'XX%',  // TODO: add actual percentage
    coursework: [
      'Physics',
      'Chemistry',
      'Mathematics',
      'Computer Science',
      'English',
    ],
    activities: [],
  },
  {
    institution: 'Your School Name', // TODO: update
    degree: 'Matriculation (Class X)',
    field: 'Secondary Education — CBSE',
    startDate: '2018',
    endDate: '2020',
    // gpa: 'XX%',  // TODO: add actual percentage
    coursework: [
      'Mathematics',
      'Science',
      'Social Science',
      'English',
      'Computer',
    ],
    activities: [],
  },
];
