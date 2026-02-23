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
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section__title">About Me</h2>
          <div className="section__line" />
        </motion.div>

        <div className="about__grid">
          <motion.div
            className="about__avatar-wrap"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="about__avatar">
              <span className="about__avatar-initials">EJ</span>
            </div>
            <div className="about__avatar-ring" />
          </motion.div>

          <motion.div
            className="about__text"
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <h3 className="about__subtitle">풀스택 개발자, 강은종</h3>
            <p className="about__bio">
              사용자 중심의 서비스를 설계하고 구현하는 것에 열정을 가진 풀스택 개발자입니다.
              React, TypeScript, Spring Boot를 주력으로 사용하며, 클린 코드와 효율적인 아키텍처를
              지향합니다.
            </p>
            <p className="about__bio">
              새로운 기술을 빠르게 습득하고, 팀원과의 협업을 통해 더 나은 제품을 만들어내는
              것을 즐깁니다. 문제를 분석하고 최적의 솔루션을 찾아내는 과정에서 큰 보람을
              느낍니다.
            </p>

            <div className="about__info-grid">
              <div className="about__info-item">
                <span className="about__info-label">이름</span>
                <span className="about__info-value">강은종</span>
              </div>
              <div className="about__info-item">
                <span className="about__info-label">직무</span>
                <span className="about__info-value">Full-Stack Developer</span>
              </div>
              <div className="about__info-item">
                <span className="about__info-label">위치</span>
                <span className="about__info-value">대한민국, 광주</span>
              </div>
              <div className="about__info-item">
                <span className="about__info-label">이메일</span>
                <span className="about__info-value">rkddmswhd@naver.com</span>
              </div>
            </div>

            {/*<a href="/resume.pdf" className="btn btn--primary" download>
              이력서 다운로드
            </a>*/}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
