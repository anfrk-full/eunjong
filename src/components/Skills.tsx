import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';

interface Skill {
  name: string;
  level: number;
  color: string;
}

interface SkillCategory {
  category: string;
  icon: string;
  skills: Skill[];
}

const skillData: SkillCategory[] = [
  {
    category: 'Frontend',
    icon: '🖥️',
    skills: [
      { name: 'React', level: 70, color: '#61DAFB' },
      { name: 'TypeScript', level: 70, color: '#3178C6' },
      { name: 'HTML / CSS', level: 75, color: '#E34F26' },
    ],
  },
  {
    category: 'Backend',
    icon: '⚙️',
    skills: [
      { name: 'Node.js', level: 65, color: '#339933' },
      { name: 'Spring Boot', level: 65, color: '#6DB33F' },
      { name: 'Java', level: 60, color: '#3776AB' },
      { name: 'PHP', level: 70, color: '#E10098' },
    ],
  },
  {
    category: 'Database',
    icon: '🗄️',
    skills: [
      { name: 'MySQL', level: 75, color: '#4169E1' },
      { name: 'MongoDB', level: 65, color: '#47A248' },
    ],
  },
  {
    category: 'DevOps & Team Collaboration Tools',
    icon: '📝',
    skills: [
      { name: 'Figma', level: 55, color: '#4169E1' },
      { name: 'Notion', level: 85, color: '#47A248' },
      { name: 'Slack', level: 90, color: '#47A248' },
    ],
  },
];

const SkillBar: React.FC<{ skill: Skill; delay: number; inView: boolean }> = ({
  skill,
  delay,
  inView,
}) => (
  <div className="skill-bar">
    <div className="skill-bar__header">
      <span className="skill-bar__name">{skill.name}</span>
      <span className="skill-bar__level">{skill.level}%</span>
    </div>
    <div className="skill-bar__track">
      <motion.div
        className="skill-bar__fill"
        style={{ backgroundColor: skill.color }}
        initial={{ width: 0 }}
        animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
        transition={{ duration: 1, delay, ease: 'easeOut' }}
      />
    </div>
  </div>
);

const Skills: React.FC = () => {
  const { ref, inView } = useInView();

  return (
    <section id="skills" className="section skills">
      <div className="container" ref={ref}>
        <motion.div
          className="section__header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section__title">Skills</h2>
          <div className="section__line" />
          <p className="section__subtitle">주요 기술 스택과 숙련도입니다.</p>
        </motion.div>

        <div className="skills__grid">
          {skillData.map((cat, catIdx) => (
            <motion.div
              key={cat.category}
              className="skills__card"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: catIdx * 0.15 }}
            >
              <div className="skills__card-header">
                <span className="skills__icon">{cat.icon}</span>
                <h3 className="skills__category">{cat.category}</h3>
              </div>
              <div className="skills__list">
                {cat.skills.map((skill, skillIdx) => (
                  <SkillBar
                    key={skill.name}
                    skill={skill}
                    delay={catIdx * 0.15 + skillIdx * 0.1 + 0.3}
                    inView={inView}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
