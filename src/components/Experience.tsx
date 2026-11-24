import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { usePage } from '../context/PageContext';

interface ExperienceItem {
  title: string;
  period: string;
  company: string;
  role: string;
  summary?: string;
  tasks: string[];
  tech: string[];
}

const experienceData: ExperienceItem[] = [
  {
    title: '리드커리어',
    period: '2024.12 – 현재',
    company: '리드커리어',
    role: '전산관리책임자',
    summary:
      '헬스케어본부 시험관리프로그램의 전산관리책임자로서 프로그램의 전반적인 설계, 개발 및 유지보수를 수행함',
    tasks: [
      '헬스케어본부 시험관리프로그램의 전체 개발 라이프사이클을 담당하며, 요구사항 분석부터 설계, 개발, 배포까지 신규 기능 제작 및 운영 중 발생하는 이슈에 대한 유지보수를 수행함',
      'NAS 서버 환경에서의 서버 아키텍처를 설계하고 구현하여 시스템 운영 기반을 구축함',
      '조회 시 과도한 리소스를 소모하는 레거시 코드를 분석하고 쿼리 및 로직을 최적화하여 조회 성능을 개선함',
      '화면 캡처 시 보안 화면을 노출하고 원격 프로그램 실행 중 시험관리프로그램 접근을 차단하는 보안 기능을 구현하여 데이터 유출을 방지함',
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
                </div>

                {active.summary && <p className="exp__summary">{active.summary}</p>}

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
