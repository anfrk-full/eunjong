import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { usePage } from '../context/PageContext';

type Category = 'All' | 'Frontend' | 'Backend' | 'Fullstack';

/** Problem → Solution → Result 한 세트 */
interface CaseStudy {
  title: string;
  problem: React.ReactNode;
  solution: React.ReactNode;
  result: React.ReactNode;
  images?: string[];
}

interface Project {
  title: string;
  description: string;
  overview: string;
  category: Exclude<Category, 'All'>;
  tech: string[];
  github?: string;
  demo?: string;
  video?: string;
  emoji?: string;
  role?: string;
  period?: string;
  members?: string;
  accent: string;
  cases: CaseStudy[];
}

const projectData: Project[] = [
  {
    title: 'WorkSpace',
    description: '운동인을 위한 추천 및 매칭 플랫폼',
    overview:
      '맞춤형 운동/식단 추천, 운동 크루 매칭, 종목별 커뮤니티를 제공하는 운동인 종합 플랫폼입니다. ' +
      '프론트엔드 개발을 담당하며 크루 매칭·이미지 업로드·배틀 현황 등 핵심 화면을 구현했습니다.',
    category: 'Frontend',
    tech: ['React', 'Spring Boot', 'MySQL', 'TypeScript'],
    github: 'https://github.com/maechu-egg/multicampus_maechu_back',
    video: 'https://www.youtube.com/watch?v=roMHHzFvCP4',
    emoji: '💪',
    role: '프론트 개발',
    period: '2024.09 – 2024.11',
    members: '7명',
    accent: '#4f8cff',
    cases: [
      {
        title: '이미지 저장·관리 구조',
        problem: (
          <>
            초기에는 프론트엔드에서 이미지를 직접 다루는 방식으로 접근하려 했습니다. 그러나 이미지가
            클라이언트에 머무르면 <strong>용량·보안·동기화 측면에서 한계</strong>가 있었고, 여러
            화면에서 동일 이미지를 일관되게 보여주기 어렵다는 문제가 드러났습니다.{' '}
            <strong>혼자 해결하려다 막히는 구간</strong>이 길어지면서,{' '}
            <strong>일정에도 영향</strong>을 줄 수 있는 상황이었습니다.
          </>
        ),
        solution: (
          <>
            혼자 붙잡고 있기보다 <strong>팀원들과 문제를 공유</strong>하고,{' '}
            <strong>백엔드에서 이미지를 저장·관리하는 방향</strong>으로 설계를 전환했습니다. 업로드는
            API를 통해 서버에 위임하고, 프론트는 URL만 받아 렌더링하도록 역할을 분리했습니다. 이
            과정에서 API 명세와 저장 경로·권한 처리까지 함께 맞춰 나갔습니다.
          </>
        ),
        result: (
          <>
            이미지 저장·조회가 백엔드 중심으로 정리되어 <strong>프론트 부담이 줄었고</strong>, 크루
            소개·프로필 등 여러 화면에서 동일한 리소스를 <strong>안정적으로 재사용</strong>할 수 있게
            되었습니다. 무엇보다 혼자 막히던 문제를 <strong>팀과 공유하는 협업 습관</strong>이 이후
            이슈 해결 속도를 높이는 계기가 되었습니다.
          </>
        ),
      },
      {
        title: '크루 찾기 UX 개선',
        problem: (
          <>
            크루 찾기 페이지는 <strong>검색어 입력만으로 크루를 찾는 구조</strong>였습니다. 사용자가
            원하는 운동 종목이나 지역을 알고 있어도, 키워드를{' '}
            <strong>정확히 맞추지 않으면 원하는 결과를 얻기 어려웠고</strong>, 목록을 일일이 훑어야
            하는 불편함이 있었습니다.
          </>
        ),
        solution: (
          <>
            단순 검색에 의존하던 흐름을 운동 종목·지역 기반 <strong>필터링으로 재설계</strong>
            했습니다. 사용자가 조건을 선택하면 바로 맞는 크루만 좁혀 볼 수 있도록 UI와 API 연동을 함께
            구현했습니다.
          </>
        ),
        result: (
          <>
            원하는 조건으로 빠르게 크루를 찾을 수 있게 되어 <strong>탐색 비용이 줄었고</strong>,
            검색어에만 의존하던 경험에서 벗어나{' '}
            <strong>목적 지향적인 매칭 흐름으로 사용자 경험을 개선</strong>했습니다.
          </>
        ),
      },
    ],
  },
  {
    title: '시험관리프로그램',
    description: '직장 내 사용하는 시험관리 홈페이지',
    overview:
      '비임상시험 업무의 편의성을 위해 개발한 시험관리 웹입니다. ' +
      '시험물질·일정·동물·QAU 업무까지 한 곳에서 관리할 수 있도록 풀스택으로 구현·유지보수하고 있습니다.',
    category: 'Frontend',
    tech: ['PHP', 'MySQL'],
    emoji: '⚗️',
    role: '풀스택 개발',
    period: '2025.01 – 현재',
    members: '1명',
    accent: '#3ecf8e',
    cases: [
      {
        title: '시험 일정 입력 페이지',
        problem: (
          <>
            시험 일정은 담당자가 <strong>직접 방문해 시간을 알려주거나, 전화로 전달하는 방식</strong>
            이었습니다. PC 업무 중에도 자리를 비우거나 통화를 반복해야 해서{' '}
            <strong>전달 누락·재확인이 잦았고</strong>,{' '}
            <strong>일정 정보가 한곳에 남지 않아 공유·기록이 불편</strong>했습니다.
          </>
        ),
        solution: (
          <>
            시험 일정을 입력·확인할 수 있는 별도 페이지를 만들었습니다. PC로 업무를 보면서 바로
            일정을 등록할 수 있도록 화면을 구성해,{' '}
            <strong>대면·전화 전달에 의존하던 흐름을 웹 입력으로 대체</strong>했습니다.
          </>
        ),
        result: (
          <>
            자리를 비우지 않고도 일정을{' '}
            <strong>즉시 입력·공유할 수 있게 되어 전달 비용이 줄었고</strong>, 일정이 시스템에 남아
            이후 조회·수정이 쉬워졌습니다.
          </>
        ),
        images: ['/images/exam/schedule_3.png'],
      },
      {
        title: '시험·점검 일정 상태 관리',
        problem: (
          <>
            이미 종료된 일정, 현재 진행 중인 일정, 앞으로 예정된 일정이{' '}
            <strong>
              한 화면에 섞여 있어 담당자가 지금 무엇을 봐야 하는지 바로 파악하기 어려웠습니다
            </strong>
            . 상태별로 나누어 확인하는 기준이 없다 보니,{' '}
            <strong>누락·중복 확인이 발생하기 쉬운 구조</strong>였습니다.
          </>
        ),
        solution: (
          <>
            <strong>일정·점검 정보를 상태(종료 / 진행 / 예정)와 업무 영역별로 구분</strong>해 볼 수
            있도록 화면을 개선했습니다. 원하는 구간만 선택해 확인할 수 있게{' '}
            <strong>필터·섹션 구조</strong>를 두고,{' '}
            <strong>한눈에 시험·점검 현황을 파악할 수 있는 뷰로 재구성</strong>했습니다.
          </>
        ),
        result: (
          <>
            담당자가 필요한 상태·영역만 골라 확인할 수 있게 되어{' '}
            <strong>일정 누락 위험을 줄였고</strong>,{' '}
            <strong>업무 우선순위를 빠르게 잡는 데 도움</strong>이 되었습니다. 점검·시험 정보를
            영역별로 모아 보는 UI로 현장 업무 흐름에 맞는 가시성을 확보했습니다.
          </>
        ),
        images: [
          '/images/exam/qau_1.png',
          '/images/exam/qau_2.png',
          '/images/exam/qau_3.png',
        ],
      },
      {
        title: '시험물질·동물·일정 CRUD',
        problem: (
          <>
            시험물질 정보, 동물 배정, 시험 일정이 문서·엑셀 중심으로 흩어져 있어{' '}
            <strong>등록·수정·조회가 번거롭고 최신 상태를 공유하기 어려웠습니다</strong>.
          </>
        ),
        solution: (
          <>
            시험물질·동물 배정·시험 일정에 대한{' '}
            <strong>등록·수정·삭제·조회 기능을 웹으로 구현</strong>하고,{' '}
            <strong>권한과 누락 과정 확인</strong>까지 포함해 업무 흐름에 맞게 정리했습니다.
          </>
        ),
        result: (
          <>
            현장 담당자가 브라우저에서 바로 자료를 관리할 수 있게 되어{' '}
            <strong>정보 동기화 비용을 줄였고</strong>, 시험 진행에 필요한{' '}
            <strong>기초 데이터를 체계적으로 유지</strong>할 수 있게 되었습니다.
          </>
        ),
        images: [
          '/images/exam/substance_1.png',
          '/images/exam/schedule_1.png',
          '/images/exam/ani1.JPG',
        ],
      },
    ],
  },
];

const CATEGORIES: Category[] = ['All', 'Frontend', 'Backend', 'Fullstack'];
const DELTA_PER_STEP = 160;
const STEP_COOLDOWN_MS = 420;

/* ─── 라이트박스 ─── */
interface LightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ images, currentIndex, onClose, onPrev, onNext }) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      className="lightbox-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <button
        className="lightbox__nav lightbox__nav--prev"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="이전 이미지"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <motion.div
        className="lightbox__content"
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <img src={images[currentIndex]} alt={`스크린샷 ${currentIndex + 1}`} className="lightbox__img" />
        <div className="lightbox__counter">
          {currentIndex + 1} / {images.length}
        </div>
      </motion.div>

      <button
        className="lightbox__nav lightbox__nav--next"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="다음 이미지"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <button className="lightbox__close" onClick={onClose} aria-label="닫기">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );
};

/* ─── 케이스 이미지 갤러리 ─── */
const CaseGallery: React.FC<{ images: string[]; label: string }> = ({ images, label }) => {
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });

  const openLightbox = useCallback((idx: number) => {
    setLightbox({ open: true, index: idx });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox({ open: false, index: 0 });
  }, []);

  const prevImage = useCallback(() => {
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index - 1 + images.length) % images.length,
    }));
  }, [images.length]);

  const nextImage = useCallback(() => {
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index + 1) % images.length,
    }));
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="contrib-gallery">
        {images.map((src, imgIdx) => (
          <button
            key={imgIdx}
            className="contrib-gallery__item"
            onClick={() => openLightbox(imgIdx)}
            aria-label={`${label} 스크린샷 ${imgIdx + 1} 확대보기`}
          >
            <img
              src={src}
              alt={`${label} 스크린샷 ${imgIdx + 1}`}
              className="contrib-gallery__img"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '';
                (e.currentTarget.parentElement as HTMLElement).classList.add(
                  'contrib-gallery__item--placeholder'
                );
              }}
            />
            <div className="contrib-gallery__overlay">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {lightbox.open && (
          <Lightbox
            images={images}
            currentIndex={lightbox.index}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </>
  );
};

/* ─── 메인 ─── */
const Projects: React.FC = () => {
  const { ref, inView } = useInView();
  const { pageId, setWheelConsumer } = usePage();
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [activeIdx, setActiveIdx] = useState(0);
  const activeIdxRef = useRef(0);
  const filteredLenRef = useRef(0);
  const accumRef = useRef(0);
  const coolUntilRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered =
    activeCategory === 'All'
      ? projectData
      : projectData.filter((p) => p.category === activeCategory);

  const safeIdx = filtered.length === 0 ? 0 : Math.min(activeIdx, filtered.length - 1);
  const active = filtered[safeIdx] ?? null;
  const shown = pageId === 'projects' && inView;

  useEffect(() => {
    activeIdxRef.current = safeIdx;
  }, [safeIdx]);

  useEffect(() => {
    filteredLenRef.current = filtered.length;
  }, [filtered.length]);

  useEffect(() => {
    setActiveIdx(0);
    activeIdxRef.current = 0;
    accumRef.current = 0;
    coolUntilRef.current = 0;
  }, [activeCategory]);

  useEffect(() => {
    if (pageId !== 'projects') return;

    setWheelConsumer((delta) => {
      const now = performance.now();
      if (now < coolUntilRef.current) return true;

      const last = filteredLenRef.current - 1;
      if (last < 0) return false;

      const i = activeIdxRef.current;

      if (delta > 0 && i >= last) {
        accumRef.current = 0;
        return false;
      }
      if (delta < 0 && i <= 0) {
        accumRef.current = 0;
        return false;
      }

      accumRef.current += delta;
      if (Math.abs(accumRef.current) < DELTA_PER_STEP) return true;

      const dir = accumRef.current > 0 ? 1 : -1;
      accumRef.current = 0;
      coolUntilRef.current = now + STEP_COOLDOWN_MS;

      const next = Math.max(0, Math.min(last, i + dir));
      if (next === i) return false;

      activeIdxRef.current = next;
      setActiveIdx(next);
      return true;
    });

    return () => setWheelConsumer(null);
  }, [pageId, setWheelConsumer]);

  const bindScrollRef = useCallback((el: HTMLDivElement | null) => {
    scrollRef.current = el;
    if (el) el.scrollTop = 0;
  }, []);

  const onRailClick = (i: number) => {
    if (i === activeIdxRef.current) return;
    activeIdxRef.current = i;
    setActiveIdx(i);
    accumRef.current = 0;
    coolUntilRef.current = 0;
  };

  return (
    <section id="projects" className="section projects">
      <div className="container projects__container" ref={ref}>
        <motion.div
          className="section__header"
          initial={{ opacity: 0, y: 16 }}
          animate={shown ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.35 }}
        >
          <span className="section__label">Projects</span>
          <h2 className="section__title">Selected work</h2>
          <p className="section__subtitle">스크롤로 프로젝트를 넘기며 오른쪽에서 내용을 확인하세요.</p>
        </motion.div>

        <motion.div
          className="projects__filter"
          initial={{ opacity: 0, y: 10 }}
          animate={shown ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`projects__filter-btn ${activeCategory === cat ? 'projects__filter-btn--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <div className="projects__stage">
          {filtered.length === 0 ? (
            <p className="projects__empty">해당 카테고리의 프로젝트가 없습니다.</p>
          ) : (
            <>
              <nav className="projects__rail" aria-label="프로젝트 목록">
                {filtered.map((project, i) => {
                  const isActive = i === safeIdx;
                  return (
                    <button
                      key={project.title}
                      type="button"
                      className={`projects__rail-item${isActive ? ' projects__rail-item--active' : ''}`}
                      style={{ '--proj-accent': project.accent } as React.CSSProperties}
                      onClick={() => onRailClick(i)}
                      aria-current={isActive ? 'true' : undefined}
                    >
                      <span className="projects__rail-index" aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="projects__rail-body">
                        <span className="projects__rail-title">{project.title}</span>
                        <span className="projects__rail-cat">{project.category}</span>
                      </span>
                      <span className="projects__rail-mark" aria-hidden="true" />
                    </button>
                  );
                })}
              </nav>

              <div className="projects__feature-wrap" aria-live="polite">
                <AnimatePresence mode="wait">
                  {active && (
                    <motion.article
                      key={active.title}
                      className="projects__feature"
                      style={{ '--proj-accent': active.accent } as React.CSSProperties}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      data-scroll-y
                      ref={bindScrollRef}
                    >
                      <span className="projects__feature-glow" aria-hidden="true" />

                      <div className="projects__feature-top">
                        <span className="projects__feature-cat">{active.category}</span>
                        <span className="projects__feature-index" aria-hidden="true">
                          {String(safeIdx + 1).padStart(2, '0')}
                          <span className="projects__feature-index-sep">/</span>
                          {String(filtered.length).padStart(2, '0')}
                        </span>
                      </div>

                      <h3 className="projects__feature-title">{active.title}</h3>
                      <p className="projects__feature-desc">{active.description}</p>

                      <div className="projects__feature-meta">
                        {active.period && (
                          <div className="projects__feature-meta-item">
                            <span className="projects__feature-meta-label">Period</span>
                            <span className="projects__feature-meta-value">{active.period}</span>
                          </div>
                        )}
                        {active.role && (
                          <div className="projects__feature-meta-item">
                            <span className="projects__feature-meta-label">Role</span>
                            <span className="projects__feature-meta-value">{active.role}</span>
                          </div>
                        )}
                        {active.members && (
                          <div className="projects__feature-meta-item">
                            <span className="projects__feature-meta-label">Team</span>
                            <span className="projects__feature-meta-value">{active.members}</span>
                          </div>
                        )}
                        <div className="projects__feature-meta-item">
                          <span className="projects__feature-meta-label">Cases</span>
                          <span className="projects__feature-meta-value">{active.cases.length}</span>
                        </div>
                      </div>

                      <div className="projects__body">
                        <section className="projects__section">
                          <h4 className="projects__section-title">Overview</h4>
                          <p className="projects__section-text">{active.overview}</p>
                        </section>

                        {active.cases.map((c) => (
                          <section key={c.title} className="projects__case">
                            {active.cases.length > 1 && (
                              <h4 className="projects__case-title">{c.title}</h4>
                            )}
                            <div className="projects__section">
                              <h5 className="projects__section-title">Problem</h5>
                              <p className="projects__section-text">{c.problem}</p>
                            </div>
                            <div className="projects__section">
                              <h5 className="projects__section-title">Solution</h5>
                              <p className="projects__section-text">{c.solution}</p>
                            </div>
                            <div className="projects__section">
                              <h5 className="projects__section-title">Result</h5>
                              <p className="projects__section-text">{c.result}</p>
                              {c.images && c.images.length > 0 && (
                                <div className="projects__case-gallery">
                                  <CaseGallery images={c.images} label={c.title} />
                                </div>
                              )}
                            </div>
                          </section>
                        ))}

                        <section className="projects__section">
                          <h4 className="projects__section-title">Stack</h4>
                          <div className="projects__feature-tech">
                            {active.tech.map((t) => (
                              <span key={t}>{t}</span>
                            ))}
                          </div>
                        </section>

                        {(active.github || active.demo || active.video) && (
                          <div className="projects__links">
                            {active.github && (
                              <a
                                href={active.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="projects__link"
                              >
                                GitHub
                              </a>
                            )}
                            {active.demo && (
                              <a
                                href={active.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="projects__link"
                              >
                                Live Demo
                              </a>
                            )}
                            {active.video && (
                              <a
                                href={active.video}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="projects__link"
                              >
                                시연 영상
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.article>
                  )}
                </AnimatePresence>

                {filtered.length > 1 && (
                  <div className="projects__progress" aria-hidden="true">
                    {filtered.map((p, i) => (
                      <span
                        key={p.title}
                        className={`projects__progress-dot${i === safeIdx ? ' projects__progress-dot--active' : ''}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;
