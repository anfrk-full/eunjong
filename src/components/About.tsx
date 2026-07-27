import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';

const About: React.FC = () => {
  const { ref, inView } = useInView();

  return (
    <section id="about" className="section about">
      <div className="container" ref={ref}>
        <motion.div
          className="section__header"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="section__label">About</span>
          <h2 className="section__title">Profile</h2>
          <p className="section__subtitle">짧게 보는 소개와 기본 정보입니다.</p>
        </motion.div>

        <div className="about__grid">
          <motion.div
            className="about__card"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <div className="about__avatar">EJ</div>
            <h3 className="about__name">강은종</h3>
            <p className="about__role">Full-Stack Developer</p>
            <div className="about__meta">
              <div className="about__meta-item">
                <span className="about__meta-label">Location</span>
                <span className="about__meta-value">광주</span>
              </div>
              <div className="about__meta-item">
                <span className="about__meta-label">Email</span>
                <span className="about__meta-value">rkddmswhd@naver.com</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="about__main"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="about__subtitle">무엇을 만드나요</h3>
            <p className="about__bio">
              React, TypeScript, Spring Boot, PHP를 사용해 웹 서비스를 설계하고 구현합니다.
              읽기 쉬운 코드와 유지보수 가능한 구조를 우선합니다.
            </p>
            <p className="about__bio">
              문제를 쪼개고, 팀과 맞춰가며, 실제로 쓰이는 결과물을 만드는 일에 집중합니다.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
