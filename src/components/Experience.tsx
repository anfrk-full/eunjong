import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { usePage } from '../context/PageContext';

interface ExperienceItem {
  title: string;
  period: string;
  company: string;
  role: string;
  type: string;
  tasks: string[];
  tech: string[];
}

const experienceData: ExperienceItem[] = [
  {
    title: '리드커리어',
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
  const { pageId } = usePage();
  const [activeIdx, setActiveIdx] = useState(0);
  const active = experienceData[activeIdx];
  const shown = pageId === 'experience' && inView;

  return (
    <section id="experience" className="section experience">
      <div className="container exp__container" ref={ref}>
        <motion.div
          className="section__header"
          initial={{ opacity: 0, y: 16 }}
          animate={shown ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="section__label">Experience</span>
          <h2 className="section__title">Career path</h2>
          <p className="section__subtitle">쌓아온 경험을 타임라인으로 살펴보세요.</p>
        </motion.div>

        <div className="exp__stage">
          <motion.div
            className="exp__timeline"
            initial={{ opacity: 0, y: 18 }}
            animate={shown ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.08 }}
            role="list"
            aria-label="경력 타임라인"
          >
            <div className="exp__track" aria-hidden="true">
              <span className="exp__track-line" />
            </div>

            <div
              className="exp__points"
              style={{ '--exp-count': experienceData.length } as React.CSSProperties}
            >
              {experienceData.map((item, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <button
                    key={`${item.title}-${item.period}`}
                    type="button"
                    role="listitem"
                    className={`exp__point${isActive ? ' exp__point--active' : ''}`}
                    onClick={() => setActiveIdx(idx)}
                    aria-current={isActive ? 'true' : undefined}
                    aria-label={`${item.title}, ${item.period}`}
                  >
                    <span className="exp__point-title">{item.title}</span>
                    <span className="exp__point-dot" aria-hidden="true" />
                    <span className="exp__point-period">{item.period}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          <div className="exp__detail-wrap" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                className="exp__detail"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
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
                  {active.tasks.map((task) => (
                    <li key={task} className="exp__task-item">
                      <span className="exp__task-arrow" aria-hidden="true">
                        –
                      </span>
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
      </div>
    </section>
  );
};

export default Experience;
