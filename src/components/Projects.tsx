import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { usePage } from '../context/PageContext';

type Category = 'All' | 'Frontend' | 'Backend' | 'Fullstack';

/** Problem → Solution → Result 한 세트 */
interface CaseStudy {
  title: string;
  problem: string;
  solution: string;
  result: string;
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
  cases: CaseStudy[];
}

const projectData: Project[] = [
  {
    title: 'WorkSpace',
    description: '운동인을 위한 추천 및 매칭 플랫폼',
    overview:
      '맞춤형 운동/식단 추천, 운동 크루 매칭, 종목별 커뮤니티를 제공하는 운동인 종합 플랫폼입니다. ' +
      '프론트엔드 개발을 담당하며 크루 매칭·이미지 업로드·배틀 현황 등 핵심 화면을 구현했습니다.',
    category: 'Fullstack',
    tech: ['React', 'Spring Boot', 'MySQL', 'TypeScript'],
    github: 'https://github.com/maechu-egg/multicampus_maechu_back',
    video: 'https://www.youtube.com/watch?v=roMHHzFvCP4',
    emoji: '💪',
    role: '프론트 개발',
    period: '2024.09 – 2024.11',
    members: '7명',
    cases: [
      {
        title: '이미지 저장·관리 구조',
        problem:
          '초기에는 프론트엔드에서 이미지를 직접 다루는 방식으로 접근하려 했습니다. ' +
          '그러나 이미지가 클라이언트에 머무르면 용량·보안·동기화 측면에서 한계가 있었고, ' +
          '여러 화면에서 동일 이미지를 일관되게 보여주기 어렵다는 문제가 드러났습니다. ' +
          '혼자 해결하려다 막히는 구간이 길어지면서, 일정에도 영향을 줄 수 있는 상황이었습니다.',
        solution:
          '혼자 붙잡고 있기보다 팀원들과 문제를 공유하고, 백엔드에서 이미지를 저장·관리하는 방향으로 설계를 전환했습니다. ' +
          '업로드는 API를 통해 서버에 위임하고, 프론트는 URL만 받아 렌더링하도록 역할을 분리했습니다. ' +
          '이 과정에서 API 명세와 저장 경로·권한 처리까지 함께 맞춰 나갔습니다.',
        result:
          '이미지 저장·조회가 백엔드 중심으로 정리되어 프론트 부담이 줄었고, ' +
          '크루 소개·프로필 등 여러 화면에서 동일한 리소스를 안정적으로 재사용할 수 있게 되었습니다. ' +
          '무엇보다 혼자 막히던 문제를 팀과 공유하는 협업 습관이 이후 이슈 해결 속도를 높이는 계기가 되었습니다.',
      },
      {
        title: '크루 찾기 UX 개선',
        problem:
          '크루 찾기 페이지는 검색어 입력만으로 크루를 찾는 구조였습니다. ' +
          '사용자가 원하는 운동 종목이나 지역을 알고 있어도, 키워드를 정확히 맞추지 않으면 원하는 결과를 얻기 어려웠고, ' +
          '목록을 일일이 훑어야 하는 불편함이 있었습니다.',
        solution:
          '단순 검색에 의존하던 흐름을 운동 종목·지역 기반 필터링으로 재설계했습니다. ' +
          '사용자가 조건을 선택하면 바로 맞는 크루만 좁혀 볼 수 있도록 UI와 API 연동을 함께 구현했습니다.',
        result:
          '원하는 조건으로 빠르게 크루를 찾을 수 있게 되어 탐색 비용이 줄었고, ' +
          '검색어에만 의존하던 경험에서 벗어나 목적 지향적인 매칭 흐름으로 사용자 경험을 개선했습니다.',
      },
    ],
  },
  {
    title: '시험관리프로그램',
    description: '직장 내 사용하는 시험관리 홈페이지',
    overview:
      '비임상시험 업무의 편의성을 위해 개발한 시험관리 웹입니다. ' +
      '시험물질·일정·동물·QAU 업무까지 한 곳에서 관리할 수 있도록 풀스택으로 구현·유지보수하고 있습니다.',
    category: 'Fullstack',
    tech: ['PHP', 'MySQL'],
    emoji: '⚗️',
    role: '풀스택 개발',
    period: '2025.01 – 현재',
    members: '1명',
    cases: [
      {
        title: '시험 일정 입력 페이지',
        problem:
          '시험 일정은 담당자가 직접 방문해 시간을 알려주거나, 전화로 전달하는 방식이었습니다. ' +
          'PC 업무 중에도 자리를 비우거나 통화를 반복해야 해서 전달 누락·재확인이 잦았고, ' +
          '일정 정보가 한곳에 남지 않아 공유·기록이 불편했습니다.',
        solution:
          '시험 일정을 입력·확인할 수 있는 별도 페이지를 만들었습니다. ' +
          'PC로 업무를 보면서 바로 일정을 등록할 수 있도록 화면을 구성해, ' +
          '대면·전화 전달에 의존하던 흐름을 웹 입력으로 대체했습니다.',
        result:
          '자리를 비우지 않고도 일정을 즉시 입력·공유할 수 있게 되어 전달 비용이 줄었고, ' +
          '일정이 시스템에 남아 이후 조회·수정이 쉬워졌습니다.',
        images: ['/images/exam/schedule_3.png'],
      },
      {
        title: '시험·점검 일정 상태 관리',
        problem:
          '이미 종료된 일정, 현재 진행 중인 일정, 앞으로 예정된 일정이 한 화면에 섞여 있어 ' +
          '담당자가 지금 무엇을 봐야 하는지 바로 파악하기 어려웠습니다. ' +
          '상태별로 나누어 확인하는 기준이 없다 보니, 누락·중복 확인이 발생하기 쉬운 구조였습니다.',
        solution:
          '일정·점검 정보를 상태(종료 / 진행 / 예정)와 업무 영역별로 구분해 볼 수 있도록 화면을 개선했습니다. ' +
          '원하는 구간만 선택해 확인할 수 있게 필터·섹션 구조를 두고, ' +
          '한눈에 시험·점검 현황을 파악할 수 있는 뷰로 재구성했습니다.',
        result:
          '담당자가 필요한 상태·영역만 골라 확인할 수 있게 되어 일정 누락 위험을 줄였고, ' +
          '업무 우선순위를 빠르게 잡는 데 도움이 되었습니다. ' +
          '점검·시험 정보를 영역별로 모아 보는 UI로 현장 업무 흐름에 맞는 가시성을 확보했습니다.',
        images: [
          '/images/exam/qau_1.png',
          '/images/exam/qau_2.png',
          '/images/exam/qau_3.png',
        ],
      },
      {
        title: '시험물질·동물·일정 CRUD',
        problem:
          '시험물질 정보, 동물 배정, 시험 일정이 문서·엑셀 중심으로 흩어져 있어 ' +
          '등록·수정·조회가 번거롭고 최신 상태를 공유하기 어려웠습니다.',
        solution:
          '시험물질·동물 배정·시험 일정에 대한 등록·수정·삭제·조회 기능을 웹으로 구현하고, ' +
          '권한과 누락 과정 확인까지 포함해 업무 흐름에 맞게 정리했습니다.',
        result:
          '현장 담당자가 브라우저에서 바로 자료를 관리할 수 있게 되어 정보 동기화 비용을 줄였고, ' +
          '시험 진행에 필요한 기초 데이터를 체계적으로 유지할 수 있게 되었습니다.',
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

/* ─── 모달 ─── */
const ProjectModal: React.FC<{ project: Project; onClose: () => void }> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return ReactDOM.createPortal(
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div
        className="modal"
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 30 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        <button className="modal__close" onClick={onClose} aria-label="닫기">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="modal__header">
          <span className="modal__category">{project.category}</span>
          <h2 className="modal__title">{project.title}</h2>
          <p className="modal__subtitle">{project.description}</p>
        </div>

        {(project.period || project.role || project.members) && (
          <div className="modal__meta">
            {project.period && (
              <div className="modal__meta-item">
                <span className="modal__meta-label">Period</span>
                <span className="modal__meta-value">{project.period}</span>
              </div>
            )}
            {project.role && (
              <div className="modal__meta-item">
                <span className="modal__meta-label">Role</span>
                <span className="modal__meta-value">{project.role}</span>
              </div>
            )}
            {project.members && (
              <div className="modal__meta-item">
                <span className="modal__meta-label">Team</span>
                <span className="modal__meta-value">{project.members}</span>
              </div>
            )}
          </div>
        )}

        <div className="modal__section">
          <h3 className="modal__section-title">Overview</h3>
          <p className="modal__desc">{project.overview}</p>
        </div>

        {project.cases.map((c) => (
          <div key={c.title} className="modal__case">
            {project.cases.length > 1 && <h3 className="modal__case-title">{c.title}</h3>}

            <div className="modal__section">
              <h4 className="modal__section-title">Problem</h4>
              <p className="modal__desc">{c.problem}</p>
            </div>

            <div className="modal__section">
              <h4 className="modal__section-title">Solution</h4>
              <p className="modal__desc">{c.solution}</p>
            </div>

            <div className="modal__section">
              <h4 className="modal__section-title">Result</h4>
              <p className="modal__desc">{c.result}</p>
              {c.images && c.images.length > 0 && (
                <div className="modal__case-gallery">
                  <CaseGallery images={c.images} label={c.title} />
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="modal__section">
          <h3 className="modal__section-title">Stack</h3>
          <div className="modal__tech">
            {project.tech.map((t) => (
              <span key={t} className="modal__tech-tag">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="modal__links">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="modal__link-btn modal__link-btn--github"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="modal__link-btn modal__link-btn--demo"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
              Live Demo
            </a>
          )}
          {project.video && (
            <a
              href={project.video}
              target="_blank"
              rel="noopener noreferrer"
              className="modal__link-btn modal__link-btn--video"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              시연 영상
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

/* ─── 메인 ─── */
const Projects: React.FC = () => {
  const { ref, inView } = useInView();
  const { setLocked, pageId } = usePage();
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (pageId !== 'projects') {
      setSelectedProject(null);
      setLocked(false);
      return;
    }
    setLocked(!!selectedProject);
    return () => setLocked(false);
  }, [selectedProject, setLocked, pageId]);

  const filtered =
    activeCategory === 'All'
      ? projectData
      : projectData.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="section projects">
      <div className="container" ref={ref}>
        <motion.div
          className="section__header"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="section__label">Projects</span>
          <h2 className="section__title">Selected work</h2>
          <p className="section__subtitle">클릭하면 상세 내용을 볼 수 있습니다.</p>
        </motion.div>

        <motion.div
          className="projects__filter"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`projects__filter-btn ${activeCategory === cat ? 'projects__filter-btn--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <div className="projects__grid">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, idx) => (
              <motion.button
                key={project.title}
                type="button"
                className="project-card"
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                onClick={() => setSelectedProject(project)}
              >
                <div className="project-card__top">
                  <span className="project-card__cat">{project.category}</span>
                  <span className="project-card__arrow">→</span>
                </div>
                <h3 className="project-card__title">{project.title}</h3>
                <p className="project-card__desc">{project.description}</p>
                <div className="project-card__tech">
                  {project.tech.slice(0, 4).map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
