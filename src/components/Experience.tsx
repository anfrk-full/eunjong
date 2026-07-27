import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '../hooks/useInView';

interface ExperienceItem {
  period: string;
  company: string;
  role: string;
  type: string;
  tasks: string[];
  tech: string[];
}

const experienceData: ExperienceItem[] = [
  {
    period: '2024.12 – 현재',
    company: '리드커리어',
    role: '풀스택 개발자',
    type: '파견직',
    tasks: [
      'PHP 웹사이트 유지보수 및 기능 개발',
      'MariaDB 스키마·쿼리 유지보수',
      'PHP → React + Spring Boot 전환 작업',
    ],
    tech: ['PHP', 'React', 'TypeScript', 'Node.js', 'MySQL'],
  },
];

const Experience: React.FC = () => {
  const { ref, inView } = useInView();
  const [activeIdx, setActiveIdx] = useState(0);
  const active = experienceData[activeIdx];

  return (
    <section id="experience" className="section experience">
      <div className="container" ref={ref}>
        <motion.div
          className="section__header"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="section__label">Experience</span>
          <h2 className="section__title">Experience</h2>
        </motion.div>

        <div className="exp__layout">
          <div className="exp__tabs">
            {experienceData.map((item, idx) => (
              <button
                key={idx}
                className={`exp__tab ${activeIdx === idx ? 'exp__tab--active' : ''}`}
                onClick={() => setActiveIdx(idx)}
              >
                <span className="exp__tab-company">{item.company}</span>
                <span className="exp__tab-period">{item.period}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              className="exp__detail"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <div className="exp__detail-header">
                <div>
                  <h3 className="exp__role">
                    {active.role}
                    <span className="exp__company">@ {active.company}</span>
                  </h3>
                  <p className="exp__period">{active.period}</p>
                </div>
                <span className="exp__type-badge">{active.type}</span>
              </div>

              <ul className="exp__tasks">
                {active.tasks.map((task, i) => (
                  <li key={i} className="exp__task-item">
                    <span className="exp__task-arrow">–</span>
                    {task}
                  </li>
                ))}
              </ul>

              <div className="exp__tech-list">
                {active.tech.map((t) => (
                  <span key={t} className="exp__tech-tag">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Experience;
