import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-scroll';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="hero">
      <div className="hero__bg-grid" />

      <motion.div
        className="hero__content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.p
          className="hero__greeting"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          안녕하세요, 저는
        </motion.p>

        <motion.h1
          className="hero__name"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          강은종
          <span className="hero__name-accent">입니다.</span>
        </motion.h1>

        <motion.h2
          className="hero__title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          Full-Stack Developer
        </motion.h2>

        <motion.p
          className="hero__description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.7 }}
        >
          사용자 경험을 최우선으로 생각하는 풀스택 개발자입니다.
          <br />
          프론트엔드부터 백엔드까지, 완성도 높은 서비스를 만들어냅니다.
        </motion.p>

        <motion.div
          className="hero__actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <Link to="projects" smooth duration={600} offset={-70}>
            <button className="btn btn--primary">프로젝트 보기</button>
          </Link>
          <Link to="contact" smooth duration={600} offset={-70}>
            <button className="btn btn--outline">연락하기</button>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="hero__scroll-indicator"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.6 }}
      >
        <div className="hero__scroll-line" />
        <span>Scroll</span>
      </motion.div>
    </section>
  );
};

export default Hero;
