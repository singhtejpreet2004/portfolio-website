import { SkillCategory } from '@/types';

export const skillCategories: SkillCategory[] = [
  {
    name: 'Languages',
    color: '#FFD300',
    skills: [
      { name: 'Python', icon: '🐍', proficiency: 90, yearsOfExperience: 4, category: 'Languages' },
      { name: 'PySpark', icon: '⚡', proficiency: 85, yearsOfExperience: 2, category: 'Languages' },
      { name: 'SQL', icon: '🗄️', proficiency: 88, yearsOfExperience: 4, category: 'Languages' },
      { name: 'Bash', icon: '💻', proficiency: 78, yearsOfExperience: 3, category: 'Languages' },
      { name: 'C/C++', icon: '⚙️', proficiency: 70, yearsOfExperience: 3, category: 'Languages' },
    ],
  },
  {
    name: 'Data Engineering',
    color: '#66C4FF',
    skills: [
      { name: 'Apache Kafka', icon: '📡', proficiency: 88, yearsOfExperience: 2, category: 'Data Engineering' },
      { name: 'Apache Spark', icon: '⚡', proficiency: 85, yearsOfExperience: 2, category: 'Data Engineering' },
      { name: 'Apache Airflow', icon: '🔧', proficiency: 82, yearsOfExperience: 2, category: 'Data Engineering' },
      { name: 'Delta Lake', icon: '🔺', proficiency: 78, yearsOfExperience: 1, category: 'Data Engineering' },
      { name: 'ETL/ELT Pipelines', icon: '🔄', proficiency: 90, yearsOfExperience: 3, category: 'Data Engineering' },
    ],
  },
  {
    name: 'Infrastructure',
    color: '#5BCC7E',
    skills: [
      { name: 'Docker', icon: '🐳', proficiency: 85, yearsOfExperience: 3, category: 'Infrastructure' },
      { name: 'Linux', icon: '🐧', proficiency: 82, yearsOfExperience: 4, category: 'Infrastructure' },
      { name: 'Git/GitHub', icon: '📝', proficiency: 88, yearsOfExperience: 4, category: 'Infrastructure' },
      { name: 'Gitea', icon: '🏠', proficiency: 75, yearsOfExperience: 1, category: 'Infrastructure' },
      { name: 'k3s/Edge Computing', icon: '☸️', proficiency: 65, yearsOfExperience: 1, category: 'Infrastructure' },
    ],
  },
  {
    name: 'Databases',
    color: '#3A10E5',
    skills: [
      { name: 'MySQL', icon: '🐬', proficiency: 85, yearsOfExperience: 4, category: 'Databases' },
      { name: 'MariaDB', icon: '🗃️', proficiency: 80, yearsOfExperience: 2, category: 'Databases' },
      { name: 'PostgreSQL', icon: '🐘', proficiency: 78, yearsOfExperience: 2, category: 'Databases' },
      { name: 'InfluxDB', icon: '📊', proficiency: 75, yearsOfExperience: 1, category: 'Databases' },
      { name: 'MinIO', icon: '📦', proficiency: 80, yearsOfExperience: 2, category: 'Databases' },
    ],
  },
  {
    name: 'Monitoring & Tools',
    color: '#FF6B6B',
    skills: [
      { name: 'Grafana', icon: '📈', proficiency: 82, yearsOfExperience: 2, category: 'Monitoring & Tools' },
      { name: 'Prometheus', icon: '🔥', proficiency: 78, yearsOfExperience: 1, category: 'Monitoring & Tools' },
      { name: 'Flask', icon: '🌐', proficiency: 80, yearsOfExperience: 2, category: 'Monitoring & Tools' },
      { name: 'TensorFlow Lite', icon: '🧠', proficiency: 65, yearsOfExperience: 1, category: 'Monitoring & Tools' },
      { name: 'Redpanda Console', icon: '🐼', proficiency: 70, yearsOfExperience: 1, category: 'Monitoring & Tools' },
    ],
  },
];
