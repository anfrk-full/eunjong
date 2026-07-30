import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { usePage } from '../context/PageContext';
import ChangeRecordAppend from './worklog/ChangeRecordAppend';
import QauDetailError from './worklog/QauDetailError';
import ScheduleManage from './worklog/ScheduleManage';
import AniControlQueryOptimization from './worklog/AniControlQueryOptimization';
import ProfileImagePipeline from './worklog/ProfileImagePipeline';

interface WorkCaseStat {
  value: string;
  label: string;
}

interface WorkCase {
  id: string;
  date: string;
  title: string;
  summary: string;
  tags: string[];
  stats: WorkCaseStat[];
  accent: string;
  Content: React.FC;
}

const workCases: WorkCase[] = [
  {
    id: 'profile-image-pipeline',
    date: '2024',
    title: '회원 프로필 이미지 업로드·조회 파이프라인',
    summary:
      'Spring Multipart 업로드와 React 조회를 분리해, DB에는 파일명만 저장하고 API·프론트에서 URL을 조합하는 프로필 이미지 파이프라인을 구축한 사례.',
    tags: ['Case Study', 'Spring Boot', 'MultipartFile', 'React'],
    stats: [
      { value: '4 layers', label: 'Disk · DB · API · FE' },
      { value: 'Filename', label: 'DB 저장 전략' },
      { value: 'Timestamp', label: 'unique prefix' },
      { value: 'BASE_URL', label: 'FE origin 결합' },
    ],
    accent: '#4f8cff',
    Content: ProfileImagePipeline,
  },
  {
    id: 'ani-control-query-opt',
    date: '2025',
    title: '동물실 배정 화면 쿼리 최적화',
    summary:
      '루프 내 반복 조회(N+1)를 IN 배치 + 메모리 캐시로 개선. UI/도메인 로직은 유지하고 데이터 접근 패턴만 재설계했습니다.',
    tags: ['Case Study', 'Performance', 'N+1 → Batch', 'PHP / MySQL'],
    stats: [
      { value: 'N+1', label: 'Before' },
      { value: 'O(1)', label: 'After cache' },
      { value: '2 paths', label: '목록 + 케이지맵' },
      { value: 'Same UX', label: '회귀 없이 개선' },
    ],
    accent: '#f59e0b',
    Content: AniControlQueryOptimization,
  },
  {
    id: 'schedule-manage',
    date: '2025',
    title: '시험 일정 통합 대시보드',
    summary:
      '다차원 드릴다운으로 시험을 찾고, 메타·문서·일정 진행률을 한 화면에서 조망하는 대시보드.',
    tags: ['Case Study', 'Dashboard', 'jQuery AJAX', 'Study Ops'],
    stats: [
      { value: '3-step', label: '드릴다운' },
      { value: '8 dims', label: '검색 축' },
      { value: 'Progress', label: '상태 시각화' },
      { value: 'Shell', label: '관심사 분리' },
    ],
    accent: '#3ecf8e',
    Content: ScheduleManage,
  },
  {
    id: 'qau-detail-error',
    date: '2025',
    title: 'QAU 세부오류 등록·조회 시스템',
    summary:
      'GLP QAU 점검 결과를 시험 단위로 등록하고, 조회·필터·엑셀까지 연결한 업무 시스템.',
    tags: ['Case Study', 'PHP / MySQL', 'jQuery AJAX', 'GLP / QAU'],
    stats: [
      { value: 'CRUD', label: '오류 등록' },
      { value: 'API', label: '조회 분리' },
      { value: 'Cascade', label: '종속 선택' },
      { value: 'Excel', label: '리포트' },
    ],
    accent: '#14b8a6',
    Content: QauDetailError,
  },
  {
    id: 'change-record-append',
    date: '2025',
    title: '변경기록지 다중 첨부',
    summary:
      '덮어쓰기에서 누적 추가로 전환. 레거시 스키마 제약 안에서 무결성·파일명·권한 삭제를 설계했습니다.',
    tags: ['Case Study', 'PHP / MySQL', 'Legacy's, 'File Upload'],
    stats: [
      { value: '1→20', label: '첨부 용량' },
      { value: 'Append', label: '저장 전략' },
      { value: 'Whitelist', label: '삭제 검증' },
      { value: 'Zero DT', label: '스키마 보정' },
    ],
    accent: '#fb7185',
    Content: ChangeRecordAppend,
  },
];

const DELTA_PER_STEP = 160;
const STEP_COOLDOWN_MS = 420;
const LAST = workCases.length - 1;

const WorkLog: React.FC = () => {
  const { ref, inView } = useInView();
  const { pageId, setWheelConsumer } = usePage();
  const [activeIdx, setActiveIdx] = useState(0);
  const activeIdxRef = useRef(0);
  const accumRef = useRef(0);
  const coolUntilRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevPageRef = useRef(pageId);

  const active = workCases[activeIdx];
  const shown = pageId === 'worklog' && inView;

  useEffect(() => {
    activeIdxRef.current = activeIdx;
  }, [activeIdx]);

  useEffect(() => {
    if (pageId === 'worklog' && prevPageRef.current !== 'worklog') {
      setActiveIdx(0);
      activeIdxRef.current = 0;
      accumRef.current = 0;
      coolUntilRef.current = 0;
    }
    prevPageRef.current = pageId;
  }, [pageId]);

  useEffect(() => {
    if (pageId !== 'worklog') return;

    setWheelConsumer((delta) => {
      const now = performance.now();
      if (now < coolUntilRef.current) return true;

      const i = activeIdxRef.current;

      if (delta > 0 && i >= LAST) {
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

      const next = Math.max(0, Math.min(LAST, i + dir));
      if (next === i) return false;

      activeIdxRef.current = next;
      setActiveIdx(next);
      return true;
    });

    return () => setWheelConsumer(null);
  }, [pageId, setWheelConsumer]);

  const onRailClick = (i: number) => {
    if (i === activeIdxRef.current) return;
    activeIdxRef.current = i;
    setActiveIdx(i);
    accumRef.current = 0;
    coolUntilRef.current = 0;
  };

  const bindScrollRef = (el: HTMLDivElement | null) => {
    scrollRef.current = el;
    if (el) el.scrollTop = 0;
  };

  return (
    <section id="worklog" className="section worklog">
      <div className="container worklog__container" ref={ref}>
        <motion.div
          className="wl__browse"
          initial={{ opacity: 0, y: 12 }}
          animate={shown ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="section__header">
            <span className="section__label">Work Log</span>
            <h2 className="section__title">Case studies</h2>
            <p className="section__subtitle">스크롤로 케이스를 넘기며 오른쪽에서 내용을 확인하세요.</p>
          </div>

          <div className="wl__stage">
            <nav className="wl__rail" aria-label="케이스 목록">
              {workCases.map((item, i) => {
                const isActive = i === activeIdx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`wl__rail-item${isActive ? ' wl__rail-item--active' : ''}`}
                    style={{ '--wl-accent': item.accent } as React.CSSProperties}
                    onClick={() => onRailClick(i)}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    <span className="wl__rail-index" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="wl__rail-body">
                      <span className="wl__rail-date">{item.date}</span>
                      <span className="wl__rail-title">{item.title}</span>
                    </span>
                    <span className="wl__rail-mark" aria-hidden="true" />
                  </button>
                );
              })}
            </nav>

            <div className="wl__feature-wrap" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.article
                  key={active.id}
                  className="wl__feature"
                  style={{ '--wl-accent': active.accent } as React.CSSProperties}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  data-scroll-y
                  ref={bindScrollRef}
                >
                  <span className="wl__feature-glow" aria-hidden="true" />

                  <div className="wl__feature-top">
                    <div className="wl__feature-pills">
                      {active.tags.map((tag, i) => (
                        <span
                          key={tag}
                          className={`cs__pill ${i === 0 ? 'cs__pill--info' : ''}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="wl__feature-index" aria-hidden="true">
                      {String(activeIdx + 1).padStart(2, '0')}
                      <span className="wl__feature-index-sep">/</span>
                      {String(workCases.length).padStart(2, '0')}
                    </span>
                  </div>

                  <p className="wl__feature-date">{active.date}</p>
                  <h3 className="wl__feature-title">{active.title}</h3>
                  <p className="wl__feature-summary">{active.summary}</p>

                  <div className="wl__feature-stats">
                    {active.stats.map((s) => (
                      <div key={s.label} className="wl__feature-stat">
                        <span className="wl__feature-stat-value">{s.value}</span>
                        <span className="wl__feature-stat-label">{s.label}</span>
                      </div>
                    ))}
                  </div>

                  <hr className="cs__divider" />

                  <div className="wl__feature-body">
                    <active.Content />
                  </div>
                </motion.article>
              </AnimatePresence>

              <div className="wl__progress" aria-hidden="true">
                {workCases.map((c, i) => (
                  <span
                    key={c.id}
                    className={`wl__progress-dot${i === activeIdx ? ' wl__progress-dot--active' : ''}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WorkLog;
