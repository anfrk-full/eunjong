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
}

const educationData: EducationItem[] = [
  {
    period: '2019.03 – 2025.02',
    degree: '학사',
    school: '전주대학교',
    major: '소프트웨어융합과',
    description:
      '소프트웨어 공학, 알고리즘, 데이터베이스, 운영체제 등 컴퓨터공학 전반을 학습했습니다.',
    gpa: '3.38 / 4.5',
  },
  {
    period: '2024.06 – 2024.12',
    degree: '수료',
    school: '멀티캠퍼스 25기 fullstack 과정',
    major: 'fullstack 과정',
    description:
      'React, Vue.js, Spring Boot, MySQL을 집중적으로 학습하였으며, 팀 프로젝트 우수상 및 최우수 학생으로 수료했습니다.',
  },
];

const Education: React.FC = () => {
  const { ref, inView } = useInView();

  return (
    <section id="education" className="section education">
      <div className="container" ref={ref}>
        <motion.div
          className="section__header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section__title">Education</h2>
          <div className="section__line" />
          <p className="section__subtitle">학력 및 교육 이력입니다.</p>
        </motion.div>

        <div className="timeline">
          {educationData.map((item, idx) => (
            <motion.div
              key={idx}
              className="timeline__item"
              initial={{ opacity: 0, x: -40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
            >
              <div className="timeline__dot" />
              <div className="timeline__card">
                <div className="timeline__card-top">
                  <span className="timeline__period">{item.period}</span>
                  <span className="timeline__badge">{item.degree}</span>
                </div>
                <h3 className="timeline__school">{item.school}</h3>
                <p className="timeline__major">{item.major}</p>
                <p className="timeline__desc">{item.description}</p>
                {item.gpa && (
                  <p className="timeline__gpa">
                    <strong>GPA:</strong> {item.gpa}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
