import { Profile } from '@/types';

export const profile: Profile = {
  name: 'Tejpreet Singh',
  title: 'Data Engineer',
  taglines: [
    'Data Engineer',
    'Pipeline Architect',
    'Streaming Specialist',
    'ETL Wizard',
    'Kafka Whisperer',
  ],
  bio: [
    "I don't just move data from point A to point B — I build the highways it travels on. As a data engineer, I obsess over making messy, chaotic streams of information flow cleanly, reliably, and at scale. From real-time video analytics to self-healing ETL pipelines, I believe great data infrastructure should be invisible: it just works.",
    "Currently finishing my CS degree while shipping production pipelines at Dixon IoT Lab (Plaksha University), where I've scaled Kafka-powered video analytics to 8+ concurrent streams with sub-200ms latency. I've also won hackathons, published a patent, and written research papers — because why not do it all?",
    "Outside of engineering, I'm a poet who reads religious history novels and volunteers for causes I care about. I bring the same creativity and curiosity to my data work. Every pipeline I build tells a story.",
  ],
  avatarUrl: '/images/avatar.png',
  resumeUrl: '/resume.pdf',
  socialLinks: [
    {
      platform: 'GitHub',
      url: 'https://github.com/tejpreetsingh',
      icon: 'github',
      handle: '@tejpreetsingh',
    },
    {
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/tejpreet-singh-6593a6217',
      icon: 'linkedin',
      handle: '/in/tejpreet-singh',
    },
    {
      platform: 'Email',
      url: 'mailto:singhtejpreet2004@gmail.com',
      icon: 'mail',
      handle: 'singhtejpreet2004@gmail.com',
    },
    {
      platform: 'Website',
      url: 'https://singhtejpreet.com',
      icon: 'globe',
      handle: 'singhtejpreet.com',
    },
  ],
  funFacts: [
    { icon: '⚡', label: 'Live Streams Scaled', value: 8, isCounter: true },
    { icon: '📡', label: 'Pipelines Shipped', value: 15, isCounter: true },
    { icon: '🏆', label: 'Hackathons Won', value: 3, isCounter: true },
    { icon: '☕', label: 'Coffee Status', value: 'Critical', isCounter: false },
  ],
};
