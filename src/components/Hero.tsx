import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-scroll';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="hero">
      <motion.div
        className="hero__content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="hero__badge">
          <span className="hero__badge-dot" />
          Available for work
        </div>

        <h1 className="hero__title">
          Kang Eunjong
          <br />
          <span>Full-Stack Developer</span>
        </h1>

        <p className="hero__lead">
          프론트엔드부터 백엔드까지, 쓰기 편한 서비스를 설계하고 만듭니다.
        </p>

        <div className="hero__actions">
          <Link to="projects" smooth duration={600} offset={-70}>
            <button className="btn btn--primary">View projects</button>
          </Link>
          <Link to="worklog" smooth duration={600} offset={-70}>
            <button className="btn btn--outline">Work log</button>
          </Link>
        </div>

        <motion.div
          className="hero__panel"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero__panel-bar">
            <span className="hero__panel-dot" />
            <span className="hero__panel-dot" />
            <span className="hero__panel-dot" />
          </div>
          <div className="hero__panel-body">
            <div className="hero__stat">
              <p className="hero__stat-label">Focus</p>
              <p className="hero__stat-value">Full-Stack</p>
            </div>
            <div className="hero__stat">
              <p className="hero__stat-label">Stack</p>
              <p className="hero__stat-value">React · PHP</p>
            </div>
            <div className="hero__stat">
              <p className="hero__stat-label">Based in</p>
              <p className="hero__stat-value">Gwangju</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
