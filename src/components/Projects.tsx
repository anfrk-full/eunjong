import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '../hooks/useInView';

type Category = 'All' | 'Frontend' | 'Backend' | 'Fullstack';

/** 기여 탭 1개 */
interface ContributionTab {
  label: string;       // 탭 이름 (예: '시험물질 관리')
  desc: string;        // 탭 설명 텍스트
  images: string[];    // 이미지 경로 배열 (public 기준)
}

interface Project {
  title: string;
  description: string;
  longDesc: string;
  category: Exclude<Category, 'All'>;
  tech: string[];
  github?: string;
  demo?: string;
  video?: string;
  emoji: string;
  highlights: string[];
  role?: string;
  period?: string;
  members?: string;
  contribution?: string;
  contributionTabs?: ContributionTab[];   // ← 탭형 기여 (이미지 포함)
  troubleshooting?: string[];
  retrospective?: string;
}

const projectData: Project[] = [
  {
    title: 'WorkSpace',
    description: '운동인을 위한 추천 및 매칭 플랫폼',
    longDesc:
      '맞춤형 운동/식단 추천, 운동 크루 매칭, 종목별 커뮤니티 등 운동인을 위한 종합 플랫폼입니다.',
    category: 'Frontend',
    tech: ['React', 'Spring Boot', 'MySQL', 'TypeScript'],
    github: 'https://github.com/maechu-egg/multicampus_maechu_back',
    video: 'https://www.youtube.com/watch?v=roMHHzFvCP4',
    emoji: '💪',
    highlights: ['맞춤형 운동/식단 추천', '자유로운 운동 크루', '종목 별 커뮤니티', '뱃지 시스템'],
    role: '프론트 개발',
    period: '2024.09 – 2024.11',
    members: '7명',
    retrospective:
      '7명의 팀원과 함께한 첫 풀스택 협업 프로젝트로, 기획부터 배포까지 전 과정을 경험했습니다.\n\n' +
      '프론트엔드 개발을 담당하며 React 컴포넌트 설계와 Spring Boot API 연동을 직접 구현하면서, ' +
      '백엔드와의 원활한 소통이 개발 속도에 얼마나 큰 영향을 미치는지 체감했습니다. ' +
      '초기에 API 명세를 충분히 협의하지 않아 중간에 수정이 잦았던 경험을 통해, ' +
      '사전 설계의 중요성을 깊이 깨달았습니다.\n\n' +
      '배틀 현황 페이지의 실시간 갱신 기능을 구현하면서 상태 관리와 API 폴링 처리에 대해 고민하며 ' +
      '실력을 키울 수 있었고, 반응형 디자인을 직접 적용하며 사용자 경험에 대한 시야도 넓어졌습니다.\n\n' +
      '다음 프로젝트에서는 초기 설계 단계에서 팀원들과 더 긴밀히 소통하고, ' +
      'TypeScript를 고도화해 타입 안정성을 높이고 싶습니다.',
    contribution:
      '✦ 크루 찾기 페이지\n' +
      '운동 종목·지역 기반 필터링 기능 구현으로 사용자 맞춤 크루 탐색 지원\n\n' +
      '✦ 크루 소개 페이지\n' +
      '크루 이름·이미지·소개글을 카드 UI로 직관적으로 표시, 반응형 디자인 적용\n\n' +
      '✦ 크루원 정보 페이지\n' +
      '크루원 프로필(배지·배틀 승리 수 등) 표시로 상세 정보 제공\n\n' +
      '✦ 크루 게시판\n' +
      '게시물 작성·댓글·좋아요 기능 구현, 공지 및 자유 소통 채널 제공\n\n' +
      '✦ 배틀 현황 페이지\n' +
      '배틀 시작일·종료일·TOP2 유저·진행 상황을 실시간 표시, 상태 관리 및 API 자동 갱신 구현',
  },
  {
    title: '시험관리프로그램',
    description: '직장 내 사용하는 시험관리 홈페이지',
    longDesc:
      '비임상시험을 함에 있어서 편의성을 위해 개발한 시험관리 홈페이지입니다.',
    category: 'Fullstack',
    tech: ['PHP', 'MySQL'],
    emoji: '⚗️',
    highlights: ['시험물질 관리', '시험 일정 관리', '동물 관리', 'QAU 업무'],
    role: '풀스택 개발',
    period: '2025.01 – 현재',
    members: '1명',
    retrospective:
      'PHP를 사용한 웹사이트 유지 보수 및 개발, 기존 프로젝트를 React + Spring Boot로 변경하는 작업을 진행하였습니다.' +
      '프론트+백+DB까지 모든걸 하는 풀스택을 경험하면서, 어떤 순서로 작업을 하는게 더 효율적인지 알게되었습니다.',
    // 탭형 기여 (이미지 포함)
    contributionTabs: [
      {
        label: '시험물질 관리',
        desc:
          '시험물질 등록·수정·삭제·조회 기능 구현, 시험물질 목록 표시\n' +
          '시험물질의 기본 정보(명칭, 로트번호, 보관조건 등)를 체계적으로 관리할 수 있도록 구현하였습니다.',
        images: [
          '/images/exam/substance_1.png',
          '/images/exam/substance_2.png',
          '/images/exam/substance_3.png',
        ],
      },
      {
        label: '시험 일정 관리',
        desc:
          '시험 일정 추가·수정·삭제 기능 구현, 권한 관리 및 누락된 과정에 대한 확인기능 구현\n' +
          '시험별 일정 지정, 진행 상태 추적, 마감일 알림 등을 포함한 종합 일정 관리 시스템입니다.',
        images: [
          '/images/exam/schedule_1.png',
          '/images/exam/schedule_2.png',
          '/images/exam/schedule_3.png',
        ],
      },
      {
        label: '동물 관리',
        desc:
          '동물 배정 기능 구현, 동물배정 목록 날짜별표시 및 배정조회 쿼리 최적화\n' +
          '실험동물의 개체 정보, 시험군 배정, 관찰 기록 등을 효율적으로 관리할 수 있도록 구현하였습니다.',
        images: [
        ],
      },
      {
        label: 'QAU 업무',
        desc:
          '점검 일정 확인 및 오류사항 입력 및 조회, 점검기록지의 생성, 한눈에 보는 시험정보 구현\n' +
          'QAU(품질보증부서) 점검 업무를 디지털화하여 점검 이력 관리 및 엑셀 자동 생성 및 다운로드 기능을 구현하였습니다.',
        images: [
          '/images/exam/qau_1.png',
          '/images/exam/qau_2.png',
          '/images/exam/qau_3.png',
        ],
      },
    ],
  },
  {
    title: '프로젝트1',
    description: '프로젝트1 소개',
    longDesc:
      '프로젝트1 소개',
    category: 'Backend',
    tech: ['Java', 'Spring Boot', 'MySQL'],
    emoji: '📂',
    highlights: [''],
    role: '백엔드 개발',
    period: '2024.09 – 2024.11',
    members: '1명',
  },
];

const CATEGORIES: Category[] = ['All', 'Frontend', 'Backend', 'Fullstack'];

/* ─── 라이트박스 컴포넌트 ─── */
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
      {/* 이전 버튼 */}
      <button
        className="lightbox__nav lightbox__nav--prev"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label="이전 이미지"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* 이미지 */}
      <motion.div
        className="lightbox__content"
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[currentIndex]}
          alt={`스크린샷 ${currentIndex + 1}`}
          className="lightbox__img"
        />
        <div className="lightbox__counter">
          {currentIndex + 1} / {images.length}
        </div>
      </motion.div>

      {/* 다음 버튼 */}
      <button
        className="lightbox__nav lightbox__nav--next"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label="다음 이미지"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* 닫기 버튼 */}
      <button className="lightbox__close" onClick={onClose} aria-label="닫기">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );
};

/* ─── 기여 탭 섹션 컴포넌트 ─── */
const ContributionTabSection: React.FC<{ tabs: ContributionTab[] }> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });

  const currentTab = tabs[activeTab];

  const openLightbox = useCallback((idx: number) => {
    setLightbox({ open: true, index: idx });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox({ open: false, index: 0 });
  }, []);

  const prevImage = useCallback(() => {
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index - 1 + currentTab.images.length) % currentTab.images.length,
    }));
  }, [currentTab.images.length]);

  const nextImage = useCallback(() => {
    setLightbox((prev) => ({
      ...prev,
      index: (prev.index + 1) % currentTab.images.length,
    }));
  }, [currentTab.images.length]);

  return (
    <div className="contrib-tabs">
      {/* 탭 버튼 목록 */}
      <div className="contrib-tabs__nav">
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            className={`contrib-tabs__btn ${activeTab === idx ? 'contrib-tabs__btn--active' : ''}`}
            onClick={() => setActiveTab(idx)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className="contrib-tabs__panel"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22 }}
        >
          {/* 설명 */}
          <p className="contrib-tabs__desc">{currentTab.desc}</p>

          {/* 이미지 갤러리 */}
          {currentTab.images.length > 0 && (
            <div className="contrib-gallery">
              {currentTab.images.map((src, imgIdx) => (
                <button
                  key={imgIdx}
                  className="contrib-gallery__item"
                  onClick={() => openLightbox(imgIdx)}
                  aria-label={`스크린샷 ${imgIdx + 1} 확대보기`}
                >
                  <img
                    src={src}
                    alt={`${currentTab.label} 스크린샷 ${imgIdx + 1}`}
                    className="contrib-gallery__img"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '';
                      (e.currentTarget.parentElement as HTMLElement).classList.add('contrib-gallery__item--placeholder');
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
          )}
        </motion.div>
      </AnimatePresence>

      {/* 라이트박스 */}
      <AnimatePresence>
        {lightbox.open && (
          <Lightbox
            images={currentTab.images}
            currentIndex={lightbox.index}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── 모달 컴포넌트 ─── */
const ProjectModal: React.FC<{ project: Project; onClose: () => void }> = ({
  project,
  onClose,
}) => {
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

  return (
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
      >
        {/* 닫기 버튼 */}
        <button className="modal__close" onClick={onClose} aria-label="닫기">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* 헤더 */}
        <div className="modal__header">
          <span className="modal__emoji">{project.emoji}</span>
          <div>
            <span className="modal__category">{project.category}</span>
            <h2 className="modal__title">{project.title}</h2>
            <p className="modal__subtitle">{project.description}</p>
          </div>
        </div>

        {/* 메타 정보 */}
        {(project.period || project.role || project.members) && (
          <div className="modal__meta">
            {project.period && (
              <div className="modal__meta-item">
                <span className="modal__meta-label">📅 기간</span>
                <span className="modal__meta-value">{project.period}</span>
              </div>
            )}
            {project.role && (
              <div className="modal__meta-item">
                <span className="modal__meta-label">👤 역할</span>
                <span className="modal__meta-value">{project.role}</span>
              </div>
            )}
            {project.members && (
              <div className="modal__meta-item">
                <span className="modal__meta-label">👥 인원</span>
                <span className="modal__meta-value">{project.members}</span>
              </div>
            )}
          </div>
        )}

        {/* 프로젝트 소개 */}
        <div className="modal__section">
          <h3 className="modal__section-title">📌 프로젝트 소개</h3>
          <p className="modal__desc">{project.longDesc}</p>
        </div>

        {/* 주요 기능 */}
        <div className="modal__section">
          <h3 className="modal__section-title">✨ 주요 기능</h3>
          <ul className="modal__highlights">
            {project.highlights.map((h) => (
              <li key={h} className="modal__highlight-item">
                <span className="modal__highlight-dot">▹</span>
                {h}
              </li>
            ))}
          </ul>
        </div>

        {/* 기술 스택 */}
        <div className="modal__section">
          <h3 className="modal__section-title">🛠 기술 스택</h3>
          <div className="modal__tech">
            {project.tech.map((t) => (
              <span key={t} className="modal__tech-tag">{t}</span>
            ))}
          </div>
        </div>

        {/* 기여 내용 — 탭형 (이미지 포함) */}
        {project.contributionTabs && project.contributionTabs.length > 0 && (
          <div className="modal__section">
            <h3 className="modal__section-title">🙋 나의 기여</h3>
            <ContributionTabSection tabs={project.contributionTabs} />
          </div>
        )}

        {/* 기여 내용 — 텍스트형 (기존 방식) */}
        {!project.contributionTabs && project.contribution && (
          <div className="modal__section">
            <h3 className="modal__section-title">🙋 나의 기여</h3>
            <p className="modal__desc" style={{ whiteSpace: 'pre-line' }}>
              {project.contribution}
            </p>
          </div>
        )}

        {/* 트러블슈팅 */}
        {project.troubleshooting && project.troubleshooting.length > 0 && (
          <div className="modal__section">
            <h3 className="modal__section-title">🔧 트러블슈팅</h3>
            <ul className="modal__trouble-list">
              {project.troubleshooting.map((item, i) => (
                <li key={i} className="modal__trouble-item">
                  <span className="modal__trouble-num">{String(i + 1).padStart(2, '0')}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 회고 */}
        {project.retrospective && (
          <div className="modal__section modal__section--retro">
            <h3 className="modal__section-title">💬 회고</h3>
            <blockquote className="modal__retro">
              {project.retrospective}
            </blockquote>
          </div>
        )}

        {/* 링크 버튼 */}
        <div className="modal__links">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="modal__link-btn modal__link-btn--github">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="modal__link-btn modal__link-btn--demo">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
              Live Demo
            </a>
          )}
          {project.video && (
            <a href={project.video} target="_blank" rel="noopener noreferrer" className="modal__link-btn modal__link-btn--video">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              시연 영상
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─── 메인 컴포넌트 ─── */
const Projects: React.FC = () => {
  const { ref, inView } = useInView();
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered =
    activeCategory === 'All'
      ? projectData
      : projectData.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="section projects">
      <div className="container" ref={ref}>
        <motion.div
          className="section__header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section__title">Projects</h2>
          <div className="section__line" />
          <p className="section__subtitle">직접 개발한 주요 프로젝트들입니다. 카드를 클릭하면 자세히 볼 수 있습니다.</p>
        </motion.div>

        {/* 카테고리 필터 */}
        <motion.div
          className="projects__filter"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
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

        {/* 프로젝트 카드 그리드 */}
        <motion.div className="projects__grid" layout>
          <AnimatePresence mode="popLayout">
            {filtered.map((project, idx) => (
              <motion.div
                key={project.title}
                className="project-card project-card--clickable"
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                onClick={() => setSelectedProject(project)}
              >
                <div className="project-card__emoji">{project.emoji}</div>
                <div className="project-card__category-tag">{project.category}</div>
                <h3 className="project-card__title">{project.title}</h3>
                <p className="project-card__desc">{project.description}</p>
                <p className="project-card__long-desc">{project.longDesc}</p>

                <ul className="project-card__highlights">
                  {project.highlights.map((h) => (
                    <li key={h}>
                      <span className="project-card__highlight-dot">✦</span> {h}
                    </li>
                  ))}
                </ul>

                <div className="project-card__tech">
                  {project.tech.map((t) => (
                    <span key={t} className="project-card__tech-tag">{t}</span>
                  ))}
                </div>

                <div className="project-card__view-more">
                  자세히 보기 →
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* 모달 */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
