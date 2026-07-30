import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { usePage } from '../context/PageContext';
import { useTheme } from '../context/ThemeContext';
import SheepHillsBackground from './about/SheepHillsBackground';

const EMAIL = 'rkddmswhd@naver.com';
const COMPACT_QUERY = '(max-height: 760px), (max-width: 900px)';

const About: React.FC = () => {
  const { ref, inView } = useInView();
  const { pageId } = usePage();
  const { theme } = useTheme();
  const [fxEnabled, setFxEnabled] = useState(true);
  const [compactCopy, setCompactCopy] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sheepActive = pageId === 'about' && fxEnabled;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setFxEnabled(!mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(COMPACT_QUERY);
    const sync = () => setCompactCopy(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      const el = document.createElement('textarea');
      el.value = EMAIL;
      el.setAttribute('readonly', '');
      el.style.position = 'fixed';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }

    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2200);
  };

  return (
    <section
      id="about"
      className={`section about${sheepActive ? ` about--sheep about--sheep-${theme}` : ''}`}
    >
      <SheepHillsBackground active={sheepActive} theme={theme} />

      <div className="container about__stage" ref={ref}>
        <motion.div
          className="about__intro"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            className="about__eyebrow"
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            About me
          </motion.span>

          <motion.h2
            className="about__headline"
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.12 }}
          >
            강은종
          </motion.h2>

          <motion.p
            className="about__role"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.2 }}
          >
            Full-Stack · Frontend Obsessed
          </motion.p>

          <motion.div
            className="about__copy"
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.28 }}
          >
            <div className="about__copy-full" hidden={compactCopy}>
              <p>
                백엔드도 중요하지만, 손이 먼저 가는 곳은 화면입니다.
                클릭 한 번이 느껴지게, 스크롤 한 줄이 기억되게 인터랙션을 추가하는걸 좋아합니다.
              </p>
              <p>
                React와 TypeScript로 움직임을 설계하고, Spring Boot·PHP로 그 뒤를 받칩니다.
                동작하는 코드보다, 머물게 만드는 경험을 남기고 싶습니다.
              </p>
            </div>
            <div className="about__copy-short" hidden={!compactCopy}>
              <p>
                화면 인터랙션을 설계하는 걸 좋아합니다.
                React·TypeScript로 움직임을, Spring Boot·PHP로 뒤를 받칩니다.
              </p>
            </div>
          </motion.div>

          <motion.ul
            className="about__facts"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.38 }}
          >
            <li>
              <span className="about__fact-label">Based in</span>
              <span className="about__fact-value">광주</span>
            </li>
            <li>
              <span className="about__fact-label">Email</span>
              <button
                type="button"
                className="about__fact-value about__fact-copy"
                onClick={copyEmail}
                aria-label="이메일 복사"
              >
                <span className="about__fact-copy-text">{EMAIL}</span>
                <span className="about__fact-copy-icon" aria-hidden="true">
                  {toastVisible ? (
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </span>
              </button>
            </li>
          </motion.ul>
        </motion.div>
      </div>

      <AnimatePresence>
        {toastVisible && (
          <motion.div
            className={`about__toast about__toast--${theme}`}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 16, scale: 0.96, x: '-50%' }}
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: 10, scale: 0.96, x: '-50%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="about__toast-dot" aria-hidden="true" />
            <span className="about__toast-text">이메일이 복사되었어요</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default About;
