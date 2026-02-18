import { Achievement } from '@/types';

export const achievements: Achievement[] = [
  // Certifications
  {
    title: 'Associate SQL Developer',
    type: 'certification',
    issuer: 'DataCamp',
    date: '2024',
    description: 'Validated expertise in SQL querying, data manipulation, and database management.',
    badgeColor: '#03EF62',
  },
  {
    title: 'Oracle Cloud Infrastructure AI',
    type: 'certification',
    issuer: 'Oracle',
    date: '2024',
    description: 'Certified in Oracle Cloud AI services and infrastructure fundamentals.',
    badgeColor: '#F80000',
  },
  {
    title: 'IBM Data Science Professional Certificate',
    type: 'certification',
    issuer: 'IBM',
    date: '2024',
    description: 'Comprehensive certification covering data science methodology, tools, and machine learning.',
    badgeColor: '#0F62FE',
  },
  // Competitions
  {
    title: 'Winner - Hack\'Ndore',
    type: 'award',
    issuer: 'Hack\'Ndore Hackathon',
    date: '2024',
    description: 'Won first place with a cash prize of ₹1,00,000 for building an innovative tech solution.',
    badgeColor: '#FFD300',
  },
  {
    title: '2nd Position - Innospark Ideathon',
    type: 'award',
    issuer: 'Innospark',
    date: '2024',
    description: 'Secured second position for a creative innovation pitch at the Innospark Ideathon.',
    badgeColor: '#C0C0C0',
  },
  {
    title: 'Top 5 Teams - Bharat Tech Experience',
    type: 'award',
    issuer: 'Bharat Tech Experience',
    date: '2024',
    description: 'Ranked among the top 5 teams in a national-level technology competition.',
    badgeColor: '#CD7F32',
  },
  // Research
  {
    title: 'Patent: Integrated Automobile Helmet',
    type: 'accomplishment',
    issuer: 'Published Patent',
    date: 'Sept 2024',
    description: 'An Integrated Automobile Helmet to Promote User Ease And Protection — published patent.',
    badgeColor: '#5BCC7E',
  },
  {
    title: 'Research Papers - Thyroid Prognosis',
    type: 'accomplishment',
    issuer: 'KCCRST - CU',
    date: '2024-2025',
    description: 'Published papers on SML-aided Thyroid Prognosis & Prophylaxis and Comparative Analysis of EHRs.',
    badgeColor: '#66C4FF',
  },
];
