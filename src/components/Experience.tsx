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
      'PHP를 사용한 웹사이트 유지 보수 및 개발',
      'MariaDB 유지 보수 및 개발',
      'PHP 웹사이트의 React + Spring Boot화',
      
    ],
    tech: ['PHP', 'React', 'TypeScript', 'Node.js', 'MySQL'],
  },
];

const Experience: React.FC = () => {
  const { ref, inView } = useInView();
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section id="experience" className="section experience">
      <div className="container" ref={ref}>
        <motion.div
          className="section__header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section__title">Experience</h2>
          <div className="section__line" />
          <p className="section__subtitle">경력 및 실무 경험입니다.</p>
        </motion.div>

        <div className="exp__layout">
          {/* 탭 목록 */}
          <motion.div
            className="exp__tabs"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
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
          </motion.div>

          {/* 상세 내용 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              className="exp__detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              <div className="exp__detail-header">
                <div>
                  <h3 className="exp__role">
                    {experienceData[activeIdx].role}
                    <span className="exp__company">
                      @ {experienceData[activeIdx].company}
                    </span>
                  </h3>
                  <p className="exp__period">{experienceData[activeIdx].period}</p>
                </div>
                <span className="exp__type-badge">{experienceData[activeIdx].type}</span>
              </div>

              <ul className="exp__tasks">
                {experienceData[activeIdx].tasks.map((task, i) => (
                  <li key={i} className="exp__task-item">
                    <span className="exp__task-arrow">▹</span>
                    {task}
                  </li>
                ))}
              </ul>

              <div className="exp__tech-list">
                {experienceData[activeIdx].tech.map((t) => (
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
