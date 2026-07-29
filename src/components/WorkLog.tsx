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
    Content: QauDetailError,
  },
  {
    id: 'change-record-append',
    date: '2025',
    title: '변경기록지 다중 첨부 — Append',
    summary:
      '덮어쓰기에서 누적 추가로 전환. 레거시 스키마 제약 안에서 무결성·파일명·권한 삭제를 설계했습니다.',
    tags: ['Case Study', 'PHP / MySQL', 'Legacy', 'File Upload'],
    stats: [
      { value: '1→20', label: '첨부 용량' },
      { value: 'Append', label: '저장 전략' },
      { value: 'Whitelist', label: '삭제 검증' },
      { value: 'Zero DT', label: '스키마 보정' },
    ],
    Content: ChangeRecordAppend,
  },
];

const CARD_GAP = 10;
const CARD_FALLBACK_H = 160;
/** 카드 내용이 이 비율 미만으로만 보이면(≒ 40% 이상 비가시) 해당 행은 페이지에 넣지 않음 */
const MIN_VISIBLE_RATIO = 0.6;

function fitRows(gridH: number, cardH: number, gap: number): number {
  if (gridH < 40 || cardH <= 0) return 1;
  // 마지막 행은 cardH * MIN_VISIBLE_RATIO 만 확보되면 허용
  const rows =
    Math.floor((gridH + gap - cardH * MIN_VISIBLE_RATIO) / (cardH + gap)) + 1;
  return Math.max(1, rows);
}

const WorkLog: React.FC = () => {
  const { ref, inView } = useInView();
  const { setLocked, pageId } = usePage();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [listPage, setListPage] = useState(0);
  const [pageSize, setPageSize] = useState(workCases.length);
  const scrollRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const selected = workCases.find((c) => c.id === selectedId) ?? null;
  const listPageCount = Math.max(1, Math.ceil(workCases.length / pageSize));
  const safePage = Math.min(listPage, listPageCount - 1);
  const listSlice = workCases.slice(
    safePage * pageSize,
    safePage * pageSize + pageSize
  );

  useEffect(() => {
    if (pageId !== 'worklog') {
      setSelectedId(null);
      setLocked(false);
      return;
    }
    setLocked(!!selectedId);
    return () => setLocked(false);
  }, [selectedId, setLocked, pageId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [selectedId]);

  useEffect(() => {
    if (selectedId) return;
    const el = gridRef.current;
    if (!el) return;

    const measure = () => {
      const cols = window.matchMedia('(max-width: 900px)').matches ? 1 : 2;
      const h = el.clientHeight;
      if (h < 40) return;

      const cardEls = el.querySelectorAll<HTMLElement>('.wl__card');
      let cardH = CARD_FALLBACK_H;
      if (cardEls.length > 0) {
        cardH = Math.max(
          ...Array.from(cardEls).map((c) => Math.max(c.offsetHeight, c.scrollHeight))
        );
      }

      const rows = fitRows(h, cardH, CARD_GAP);
      const nextSize = Math.min(workCases.length, Math.max(cols, rows * cols));
      setPageSize((prev) => (prev === nextSize ? prev : nextSize));
      setListPage((p) => {
        const maxPage = Math.max(0, Math.ceil(workCases.length / nextSize) - 1);
        return Math.min(p, maxPage);
      });
    };

    measure();
    const rafMeasure = () => requestAnimationFrame(measure);
    const ro = new ResizeObserver(rafMeasure);
    ro.observe(el);
    window.addEventListener('resize', rafMeasure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', rafMeasure);
    };
  }, [selectedId, pageId]);

  const closeDetail = () => setSelectedId(null);

  return (
    <section id="worklog" className="section worklog">
      <div className="container" ref={ref}>
        <AnimatePresence mode="wait">
          {!selected ? (
            <motion.div
              key="list"
              className="wl__page"
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <div className="section__header">
                <span className="section__label">Work Log</span>
                <h2 className="section__title">Case studies</h2>
                <p className="section__subtitle">
                  카드를 눌러 자세히 볼 수 있습니다.
                </p>
              </div>

              <div className="wl__grid" ref={gridRef}>
                {listSlice.map((item, idx) => (
                  <motion.button
                    key={item.id}
                    type="button"
                    className="wl__card wl__card--compact"
                    initial={{ opacity: 0, y: 12 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                    onClick={() => setSelectedId(item.id)}
                  >
                    <div className="wl__card-top">
                      <span className="wl__date">{item.date}</span>
                      <span className="wl__card-cta">Read →</span>
                    </div>
                    <div className="wl__card-pills">
                      {item.tags.slice(0, 2).map((tag, i) => (
                        <span
                          key={tag}
                          className={`cs__pill ${i === 0 ? 'cs__pill--info' : ''}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="wl__card-title">{item.title}</h3>
                    <p className="wl__card-summary">{item.summary}</p>
                  </motion.button>
                ))}
              </div>

              {listPageCount > 1 && (
                <div className="wl__pager" role="navigation" aria-label="케이스 목록 페이지">
                  <button
                    type="button"
                    className="wl__pager-btn"
                    disabled={safePage === 0}
                    onClick={() => setListPage((p) => Math.max(0, p - 1))}
                  >
                    ← Prev
                  </button>
                  <div className="wl__pager-status">
                    <span className="wl__pager-status-label">Page</span>
                    <strong>
                      {safePage + 1}
                      <span className="wl__pager-status-sep">/</span>
                      {listPageCount}
                    </strong>
                  </div>
                  <button
                    type="button"
                    className="wl__pager-btn wl__pager-btn--next"
                    disabled={safePage >= listPageCount - 1}
                    onClick={() => setListPage((p) => Math.min(listPageCount - 1, p + 1))}
                  >
                    Next →
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key={selected.id}
              className="cs wl__detail"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.35 }}
            >
              <div className="wl__detail-top">
                <button type="button" className="wl__back" onClick={closeDetail}>
                  ← All case studies
                </button>
              </div>

              <div
                className="wl__detail-scroll"
                ref={scrollRef}
                onWheel={(e) => e.stopPropagation()}
              >
                <div className="cs__header">
                  <div className="cs__pills">
                    {selected.tags.map((tag, i) => (
                      <span
                        key={tag}
                        className={`cs__pill ${i === 0 ? 'cs__pill--info' : ''}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="cs__title">{selected.title}</h2>
                  <p className="cs__lead">{selected.summary}</p>
                </div>

                <div className="cs__stats">
                  {selected.stats.map((s) => (
                    <div key={s.label} className="cs__stat">
                      <span className="cs__stat-value">{s.value}</span>
                      <span className="cs__stat-label">{s.label}</span>
                    </div>
                  ))}
                </div>

                <hr className="cs__divider" />

                <selected.Content />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default WorkLog;
