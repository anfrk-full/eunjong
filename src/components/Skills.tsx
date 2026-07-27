import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';

interface SkillCategory {
  category: string;
  skills: string[];
}

const skillData: SkillCategory[] = [
  { category: 'Frontend', skills: ['React', 'TypeScript', 'HTML / CSS'] },
  { category: 'Backend', skills: ['Node.js', 'Spring Boot', 'Java', 'PHP'] },
  { category: 'Database', skills: ['MySQL', 'MongoDB'] },
  { category: 'Collaboration', skills: ['Figma', 'Notion', 'Slack'] },
];

const Skills: React.FC = () => {
  const { ref, inView } = useInView();

  return (
    <section id="skills" className="section skills">
      <div className="container" ref={ref}>
        <motion.div
          className="section__header"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="section__label">Skills</span>
          <h2 className="section__title">Tech stack</h2>
          <p className="section__subtitle">실무와 프로젝트에서 사용한 기술입니다.</p>
        </motion.div>

        <div className="skills__grid">
          {skillData.map((cat, i) => (
            <motion.div
              key={cat.category}
              className="skills__group"
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <h3 className="skills__category">{cat.category}</h3>
              <div className="skills__tags">
                {cat.skills.map((skill) => (
                  <span key={skill} className="skills__tag">
                    {skill}
                  </span>
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
