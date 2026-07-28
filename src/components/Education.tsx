import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';

interface EducationItem {
  period: string;
  degree: string;
  school: string;
  major: string;
  description: string;
  gpa?: string;
  highlights?: string[];
}

const educationData: EducationItem[] = [
  {
    period: '2019.03 – 2025.02',
    degree: '학사',
    school: '전주대학교',
    major: '소프트웨어융합과',
    description: '소프트웨어 공학, 알고리즘, DB, OS 등 컴퓨터공학 전반을 학습했습니다.',
    gpa: '3.38 / 4.5',
  },
  {
    period: '2024.06 – 2024.12',
    degree: '수료',
    school: '멀티캠퍼스 25기',
    major: 'Fullstack',
    description: 'React, Vue, Spring Boot, MySQL을 집중적으로 학습했습니다.',
    highlights: ['팀 프로젝트 우수상', '최우수 학생 수료'],
  },
];

const Education: React.FC = () => {
  const { ref, inView } = useInView();

  return (
    <section id="education" className="section education">
      <div className="container" ref={ref}>
        <motion.div
          className="section__header"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="section__label">Education</span>
          <h2 className="section__title">Education</h2>
        </motion.div>

        <div className="edu__list">
          {educationData.map((item, idx) => (
            <motion.div
              key={idx}
              className="edu__item"
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <span className="edu__period">{item.period}</span>
              <div>
                <h3 className="edu__school">
                  {item.school}
                  <span className="edu__badge">{item.degree}</span>
                </h3>
                <p className="edu__major">{item.major}</p>
                <p className="edu__desc">{item.description}</p>
                {item.highlights && item.highlights.length > 0 && (
                  <ul className="edu__highlights">
                    {item.highlights.map((h) => (
                      <li key={h} className="edu__highlight">
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
                {item.gpa && <p className="edu__gpa">GPA {item.gpa}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
