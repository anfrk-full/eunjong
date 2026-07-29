import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { usePage } from '../context/PageContext';

interface SkillItem {
  name: string;
  level: number; // 1–5
}

interface SkillCategory {
  id: string;
  name: string;
  blurb: string;
  accent: string;
  heroSkill: string;
  pattern: 'grid' | 'rings' | 'stripes' | 'dots' | 'diagonal' | 'wave';
  skills: SkillItem[];
}

const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    name: 'Languages',
    blurb: '업무와 프로젝트에서 다루는 언어',
    accent: '#f7df1e',
    heroSkill: 'JavaScript',
    pattern: 'grid',
    skills: [
      { name: 'HTML', level: 5 },
      { name: 'CSS', level: 3 },
      { name: 'JavaScript', level: 4 },
      { name: 'TypeScript', level: 4 },
      { name: 'Java', level: 4 },
      { name: 'PHP', level: 4 },
    ],
  },
  {
    id: 'frontend',
    name: 'Frontend',
    blurb: 'UI를 설계하고 구현하는 영역',
    accent: '#61dafb',
    heroSkill: 'React',
    pattern: 'rings',
    skills: [
      { name: 'React', level: 5 },
      { name: 'Vue', level: 3 },
      { name: 'TypeScript', level: 4 },
      { name: 'HTML', level: 5 },
      { name: 'CSS', level: 3 },
    ],
  },
  {
    id: 'backend',
    name: 'Backend',
    blurb: '서버·API·비즈니스 로직',
    accent: '#6db33f',
    heroSkill: 'Spring Boot',
    pattern: 'wave',
    skills: [
      { name: 'Node.js', level: 4 },
      { name: 'Spring Boot', level: 4 },
      { name: 'Java', level: 4 },
      { name: 'PHP', level: 4 },
    ],
  },
  {
    id: 'database',
    name: 'Database',
    blurb: '데이터 모델링과 조회 설계',
    accent: '#00758f',
    heroSkill: 'MySQL',
    pattern: 'dots',
    skills: [
      { name: 'MySQL', level: 4 },
      { name: 'MongoDB', level: 3 },
    ],
  },
  {
    id: 'collaboration',
    name: 'Collaboration',
    blurb: '디자인·문서·커뮤니케이션 툴',
    accent: '#4a154b',
    heroSkill: 'Slack',
    pattern: 'diagonal',
    skills: [
      { name: 'Figma', level: 3 },
      { name: 'Notion', level: 5 },
      { name: 'Slack', level: 5 },
    ],
  },
];

const ANGLE_STEP = 14;
const LAST = skillCategories.length - 1;
const DELTA_PER_CARD = 160;
const STEP_COOLDOWN_MS = 420;

const LEVEL_LABELS = ['', 'Familiar', 'Working', 'Solid', 'Strong', 'Expert'];
const SKILL_ICON_URL: Record<string, string> = {
  React: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  Vue: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
  TypeScript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  HTML: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  CSS: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  JavaScript:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  Java: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  PHP: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
  'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'Spring Boot': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
  MySQL: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  MongoDB: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  Figma: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
  Notion: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/notion/notion-original.svg',
  Slack: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg',
};

const Skills: React.FC = () => {
  const { ref, inView } = useInView();
  const { pageId, setWheelConsumer, setLocked } = usePage();
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const activeRef = useRef(0);
  const expandedRef = useRef(false);
  const accumRef = useRef(0);
  const coolUntilRef = useRef(0);
  const prevPageRef = useRef(pageId);

  const activeCategory = skillCategories[active];

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    expandedRef.current = expanded;
    setLocked(expanded && pageId === 'skills');
    return () => setLocked(false);
  }, [expanded, pageId, setLocked]);

  useEffect(() => {
    if (pageId === 'skills' && prevPageRef.current !== 'skills') {
      if (prevPageRef.current === 'education') {
        setActive(LAST);
        activeRef.current = LAST;
      } else {
        setActive(0);
        activeRef.current = 0;
      }
      accumRef.current = 0;
      coolUntilRef.current = 0;
      setExpanded(false);
      expandedRef.current = false;
    }
    if (pageId !== 'skills') {
      setExpanded(false);
      expandedRef.current = false;
      coolUntilRef.current = 0;
    }
    prevPageRef.current = pageId;
  }, [pageId]);

  useEffect(() => {
    if (pageId !== 'skills') return;

    setWheelConsumer((delta) => {
      if (expandedRef.current) return true;
      const now = performance.now();
      if (now < coolUntilRef.current) return true;

      const i = activeRef.current;

      if (delta > 0 && i >= LAST) {
        accumRef.current = 0;
        return false;
      }
      if (delta < 0 && i <= 0) {
        accumRef.current = 0;
        return false;
      }

      accumRef.current += delta;
      if (Math.abs(accumRef.current) < DELTA_PER_CARD) return true;

      const dir = accumRef.current > 0 ? 1 : -1;
      accumRef.current = 0;
      coolUntilRef.current = now + STEP_COOLDOWN_MS;

      const next = Math.max(0, Math.min(LAST, i + dir));
      if (next === i) {
        accumRef.current = 0;
        return false;
      }

      if (next === 0 || next === LAST) accumRef.current = 0;
      activeRef.current = next;
      setActive(next);
      return true;
    });

    return () => setWheelConsumer(null);
  }, [pageId, setWheelConsumer]);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expanded]);

  const openActive = () => {
    setExpanded(true);
  };

  const onSlotClick = (i: number) => {
    if (i === activeRef.current) {
      openActive();
      return;
    }
    activeRef.current = i;
    setActive(i);
    accumRef.current = 0;
    coolUntilRef.current = 0;
  };

  return (
    <section id="skills" className="section skills">
      <div className="container skills__container" ref={ref}>
        <motion.div
          className="section__header"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: expanded ? 0 : 1, y: expanded ? -8 : 0 } : {}}
          transition={{ duration: 0.35 }}
          style={{ pointerEvents: expanded ? 'none' : 'auto' }}
        >
          <span className="section__label">Skills</span>
          <h2 className="section__title">Tech stack</h2>
          
        </motion.div>

        <div className="skills__stage" aria-live="polite">
          <AnimatePresence mode="wait">
            {!expanded && (
              <motion.div
                key={activeCategory.id}
                className="skills__preview"
                style={{ '--card-accent': activeCategory.accent } as React.CSSProperties}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="skills__preview-eyebrow">{activeCategory.name}</p>
                <p className="skills__preview-blurb">{activeCategory.blurb}</p>
                <ul className="skills__preview-chips">
                  {activeCategory.skills.slice(0, 5).map((skill, idx) => {
                    const iconSrc = SKILL_ICON_URL[skill.name];
                    return (
                      <motion.li
                        key={skill.name}
                        className="skills__preview-chip"
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.04 + idx * 0.04, duration: 0.28 }}
                      >
                        <span className="skills__preview-chip-icon" aria-hidden="true">
                          {iconSrc ? (
                            <img
                              src={iconSrc}
                              alt=""
                              className="skills__preview-chip-img"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            skill.name.slice(0, 1)
                          )}
                        </span>
                        <span className="skills__preview-chip-name">{skill.name}</span>
                      </motion.li>
                    );
                  })}
                </ul>
                <p className="skills__preview-hint">카드를 눌러 숙련도 보기</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className={`skills__fan${expanded ? ' skills__fan--dim' : ''}`}
            role="list"
            aria-hidden={expanded}
          >
            {skillCategories.map((cat, i) => {
              const offset = i - active;
              const angle = offset * ANGLE_STEP;
              const abs = Math.abs(offset);
              const hidden = abs > 4;
              const isActive = offset === 0;
              const heroIconSrc = SKILL_ICON_URL[cat.heroSkill];

              return (
                <button
                  key={cat.id}
                  type="button"
                  role="listitem"
                  className={`skills__slot${isActive ? ' skills__slot--active' : ''}`}
                  style={
                    {
                      '--angle': `${angle}deg`,
                      '--z': String(100 - abs),
                      opacity: expanded || hidden ? 0 : Math.max(0.35, 1 - abs * 0.14),
                      pointerEvents: expanded || hidden ? 'none' : 'auto',
                    } as React.CSSProperties
                  }
                  onClick={() => onSlotClick(i)}
                  aria-current={isActive ? 'true' : undefined}
                  aria-label={`${cat.name} 상세 보기`}
                  tabIndex={expanded ? -1 : isActive ? 0 : -1}
                >
                  <span className="skills__label">
                    <span className="skills__label-name">{cat.name}</span>
                  </span>
                  <span
                    className={`skills__card skills__card--${cat.pattern}`}
                    style={{ '--card-accent': cat.accent } as React.CSSProperties}
                  >
                    <span className="skills__card-glow" aria-hidden="true" />
                    {heroIconSrc ? (
                      <span className="skills__card-heroicon" aria-hidden="true">
                        <img
                          src={heroIconSrc}
                          alt=""
                          className="skills__card-heroicon-img"
                          loading="lazy"
                          decoding="async"
                        />
                      </span>
                    ) : null}
                    <span className="skills__card-title">{cat.name}</span>
                    <span className="skills__card-meta">
                      {cat.skills.length} skills · Click to open
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {!expanded && (
            <div className="skills__progress" aria-hidden="true">
              {skillCategories.map((cat, i) => (
                <span
                  key={cat.id}
                  className={`skills__progress-dot${i === active ? ' skills__progress-dot--active' : ''}`}
                />
              ))}
            </div>
          )}

          <AnimatePresence>
            {expanded && (
              <motion.div
                className="skills__expand"
                style={{ '--card-accent': activeCategory.accent } as React.CSSProperties}
                initial={{ opacity: 0, y: 72, scale: 0.88 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 48, scale: 0.92 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                role="dialog"
                aria-modal="true"
                aria-label={`${activeCategory.name} 숙련도`}
              >
                <div className="skills__expand-top">
                  <div>
                    <span className="skills__expand-eyebrow">Category</span>
                    <h3 className="skills__expand-title">{activeCategory.name}</h3>
                    <p className="skills__expand-blurb">{activeCategory.blurb}</p>
                  </div>
                  <button
                    type="button"
                    className="skills__expand-close"
                    onClick={() => setExpanded(false)}
                  >
                    Close
                  </button>
                </div>

                <ul className="skills__level-list">
                  {activeCategory.skills.map((skill, idx) => (
                    <motion.li
                      key={skill.name}
                      className="skills__level-item"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + idx * 0.05, duration: 0.35 }}
                    >
                      {(() => {
                        const iconSrc = SKILL_ICON_URL[skill.name];
                        return (
                      <div className="skills__level-tag">
                        <span className="skills__level-icon" aria-hidden="true">
                          {iconSrc ? (
                            <img
                              src={iconSrc}
                              alt=""
                              className="skills__level-icon-img"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            skill.name.slice(0, 1)
                          )}
                        </span>
                        <span className="skills__level-name">{skill.name}</span>
                      </div>
                        );
                      })()}
                      <div className="skills__level-meter">
                        <div className="skills__level-track" aria-hidden="true">
                          {Array.from({ length: 5 }).map((_, n) => (
                            <span
                              key={n}
                              className={`skills__level-pip${n < skill.level ? ' skills__level-pip--on' : ''}`}
                            />
                          ))}
                        </div>
                        <span className="skills__level-label">{LEVEL_LABELS[skill.level]}</span>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Skills;
