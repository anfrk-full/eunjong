import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { usePage } from '../context/PageContext';

interface EducationItem {
  period: string;
  degree: string;
  school: string;
  major: string;
  description: string;
  chapter: string;
  gpa?: string;
  gpaRatio?: number;
  highlights?: string[];
}

const educationData: EducationItem[] = [
  {
    period: '2019.03 – 2025.02',
    degree: '학사',
    school: '전주대학교',
    major: '소프트웨어융합과',
    chapter: 'Foundation',
    description: '소프트웨어 공학, 알고리즘, DB, OS 등 컴퓨터공학 전반을 학습했습니다.',
    gpa: '3.38 / 4.5',
    gpaRatio: 3.38 / 4.5,
  },
  {
    period: '2024.06 – 2024.12',
    degree: '수료',
    school: '멀티캠퍼스 25기',
    major: 'Fullstack',
    chapter: 'Practice',
    description: 'React, Vue, Spring Boot, MySQL을 집중적으로 학습했습니다.',
    highlights: ['팀 프로젝트 우수상', '최우수 학생 수료'],
  },
];

const Education: React.FC = () => {
  const { ref, inView } = useInView();
  const { pageId } = usePage();
  const [focus, setFocus] = useState<number | null>(null);
  const active = pageId === 'education' && inView;

  return (
    <section id="education" className="section education">
      <div className="container edu__container" ref={ref}>
        <motion.div
          className="section__header"
          initial={{ opacity: 0, y: 16 }}
          animate={active ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="section__label">Education</span>
          <h2 className="section__title">Learning path</h2>
          <p className="section__subtitle">기초에서 실전까지 이어진 배움입니다.</p>
        </motion.div>

        <div className="edu__journey" onMouseLeave={() => setFocus(null)}>
          {educationData.map((item, i) => {
            const dimmed = focus !== null && focus !== i;
            const emphasized = focus === i;

            return (
              <motion.article
                key={item.school}
                className={`edu__chapter${emphasized ? ' edu__chapter--focus' : ''}${
                  dimmed ? ' edu__chapter--dim' : ''
                }`}
                initial={{ opacity: 0, y: 24 }}
                animate={active ? { opacity: dimmed ? 0.42 : 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.08 + i * 0.12 }}
                onMouseEnter={() => setFocus(i)}
                onFocus={() => setFocus(i)}
                tabIndex={0}
              >
                <div className="edu__chapter-index" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </div>

                <div className="edu__chapter-top">
                  <span className="edu__chapter-label">{item.chapter}</span>
                  <span className="edu__badge">{item.degree}</span>
                </div>

                <p className="edu__period">{item.period}</p>
                <h3 className="edu__school">{item.school}</h3>
                <p className="edu__major">{item.major}</p>
                <p className="edu__desc">{item.description}</p>

                {item.gpa && typeof item.gpaRatio === 'number' && (
                  <div className="edu__gpa-block">
                    <div className="edu__gpa-row">
                      <span className="edu__gpa-label">GPA</span>
                      <span className="edu__gpa-value">{item.gpa}</span>
                    </div>
                    <div className="edu__gpa-track" aria-hidden="true">
                      <motion.span
                        className="edu__gpa-fill"
                        initial={{ scaleX: 0 }}
                        animate={active ? { scaleX: item.gpaRatio } : {}}
                        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.28 }}
                      />
                    </div>
                  </div>
                )}

                {item.highlights && item.highlights.length > 0 && (
                  <ul className="edu__highlights">
                    {item.highlights.map((h, idx) => (
                      <motion.li
                        key={h}
                        className="edu__highlight"
                        initial={{ opacity: 0, y: 8 }}
                        animate={active ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.35 + idx * 0.08, duration: 0.35 }}
                      >
                        {h}
                      </motion.li>
                    ))}
                  </ul>
                )}
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Education;
