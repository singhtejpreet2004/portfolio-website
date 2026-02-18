import { Experience } from '@/types';

export const experiences: Experience[] = [
  {
    id: 'exp-1',
    company: 'Dixon IoT Lab, Plaksha University',
    role: 'Research Intern - Data Pipelines',
    startDate: 'May 2025',
    endDate: 'Present',
    location: 'Plaksha University',
    description: 'Engineering real-time streaming analytics pipelines and deploying infrastructure for distributed data processing at the edge.',
    bullets: [
      'Authored comprehensive technical documentation, stakeholder-specific diagrams, and troubleshooting guides for the production pipeline, improving knowledge transfer efficiency and reducing onboarding time by 40%',
      'Engineered a real-time streaming analytics pipeline (Kafka → ML inference → Flask), scaling to 8+ live streams with ≤2% data loss and sub-200ms latency',
      'Deployed a self-hosted Gitea instance on NAS with PostgreSQL backend and RBAC, enabling secure, offline version control and team collaboration across projects',
      'Prototyped a Raspberry Pi-based k3s edge cluster (master-slave nodes) as a testbed for distributed data pipelines, supporting a pilot study for an upcoming research paper',
    ],
    keyAchievement: 'Scaled streaming pipeline to 8+ concurrent live video streams with sub-200ms latency',
    techStack: ['Kafka', 'Flask', 'Docker', 'k3s', 'PostgreSQL', 'Gitea', 'Raspberry Pi'],
  },
  {
    id: 'exp-2',
    company: 'Roton Consultancies Pvt. Ltd.',
    role: 'Business Analyst Intern',
    startDate: 'Jul 2024',
    endDate: 'Jan 2025',
    location: 'India',
    description: 'Authored research reports and technical documentation, streamlined cross-functional team communication and improved project delivery timelines.',
    bullets: [
      'Authored detailed research reports and technical documentation, improving knowledge transfer efficiency and cutting onboarding time by 20%',
      'Collaborated with cross-functional teams across business and technical units, streamlining project communication and reducing feedback cycles by 15%',
      'Developed time management and workflow practices under client deadlines, supporting a 10% faster delivery of market studies',
    ],
    keyAchievement: 'Reduced feedback cycles by 15% through streamlined cross-team communication',
    techStack: ['Research', 'Documentation', 'Analytics', 'Project Management'],
  },
  {
    id: 'exp-3',
    company: 'KCCRST - Chandigarh University',
    role: 'Student Researcher',
    startDate: 'Aug 2023',
    endDate: 'Feb 2024',
    location: 'Chandigarh University',
    description: 'Developed ML pipelines for medical prognosis research, conducting comparative analysis across multiple EHR datasets.',
    bullets: [
      'Developed a Python-based ML pipeline for thyroid prognosis, achieving 90% predictive accuracy through model optimization',
      'Conducted comparative analysis of multiple EHR datasets, evaluating model prediction metrics across sources and documenting findings',
    ],
    keyAchievement: 'Achieved 90% predictive accuracy for thyroid prognosis ML pipeline',
    techStack: ['Python', 'Machine Learning', 'Pandas', 'Scikit-learn', 'EHR Data'],
  },
];
