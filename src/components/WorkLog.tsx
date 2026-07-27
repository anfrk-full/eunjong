import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import ChangeRecordAppend from './worklog/ChangeRecordAppend';
import QauDetailError from './worklog/QauDetailError';
import ScheduleManage from './worklog/ScheduleManage';

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

/**
 * 새 케이스 추가 방법:
 * 1) worklog/ 폴더에 본문 컴포넌트 생성
 * 2) 아래 workCases 배열에 메타데이터 + Content 등록
 */
const workCases: WorkCase[] = [
  {
    id: 'schedule-manage',
    date: '2025',
    title: '시험 일정 통합 대시보드',
    summary:
      'schedule_manage_test.html을 셸로, JS/CSS/API 계층이 실제 로직을 담당하는 시험 탐색·현황 대시보드. 다차원 드릴다운으로 시험을 찾고, 메타정보·문서·일정 진행률을 한 화면에서 조망하도록 설계했습니다.',
    tags: ['Case Study', 'SPA-like Dashboard', 'jQuery AJAX', 'Study Ops'],
    stats: [
      { value: '3-step', label: '드릴다운 탐색' },
      { value: '8 dims', label: '검색 축 (SD/부서/…)' },
      { value: 'Progress', label: '완료·진행·예정 시각화' },
      { value: 'HTML shell', label: '관심사 분리 (html/js/css/api)' },
    ],
    Content: ScheduleManage,
  },
  {
    id: 'qau-detail-error',
    date: '2025',
    title: 'QAU 세부오류 등록·조회 시스템',
    summary:
      'GLP 신뢰성보증(QAU) 점검 결과를 시험 단위로 등록하고, 전사 관점에서 조회·필터·엑셀 내보내기까지 연결한 업무 시스템. Write 화면과 Read 화면을 분리해 입력 품질과 모니터링을 동시에 만족하도록 설계했습니다.',
    tags: ['Case Study', 'PHP / MySQL', 'jQuery AJAX', 'GLP / QAU'],
    stats: [
      { value: 'CRUD', label: '시험별 오류 등록' },
      { value: 'API', label: '조회 계층 분리' },
      { value: 'Cascade', label: '단계→항목 종속 선택' },
      { value: 'Excel', label: '감사 리포트 출력' },
    ],
    Content: QauDetailError,
  },
  {
    id: 'change-record-append',
    date: '2025',
    title: '변경기록지 다중 첨부 — Replace to Append',
    summary:
      'GLP 시험관리 시스템에서 변경기록지 업로드를 “덮어쓰기”에서 “누적 추가”로 전환한 기능 개선 사례. 레거시 스키마 제약 안에서 데이터 무결성·파일명 규칙·권한별 삭제·운영 배포를 함께 설계했습니다.',
    tags: ['Case Study', 'PHP / MySQL', 'Legacy System', 'File Upload'],
    stats: [
      { value: '1 → 20', label: '첨부 용량 (file_2~21)' },
      { value: 'Append', label: '저장 전략' },
      { value: 'Whitelist', label: '동적 컬럼 삭제 검증' },
      { value: 'Zero downtime', label: '스키마 보정 방식' },
    ],
    Content: ChangeRecordAppend,
  },
];

const WorkLog: React.FC = () => {
  const { ref, inView } = useInView();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = workCases.find((c) => c.id === selectedId) ?? null;

  useEffect(() => {
    if (!selectedId) return;
    const el = document.getElementById('worklog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedId]);

  return (
    <section id="worklog" className="section worklog">
      <div className="container" ref={ref}>
        <AnimatePresence mode="wait">
          {!selected ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <div className="section__header">
                <span className="section__label">Work Log</span>
                <h2 className="section__title">Case studies</h2>
                <p className="section__subtitle">
                  작업 중 마주친 문제와 설계 결정을 정리한 기록입니다. 카드를 눌러 자세히 볼 수 있습니다.
                </p>
              </div>

              <div className="wl__list">
                {workCases.map((item, idx) => (
                  <motion.button
                    key={item.id}
                    type="button"
                    className="wl__card"
                    initial={{ opacity: 0, y: 12 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                    onClick={() => setSelectedId(item.id)}
                  >
                    <div className="wl__card-top">
                      <span className="wl__date">{item.date}</span>
                      <span className="wl__card-cta">Read →</span>
                    </div>
                    <div className="wl__card-pills">
                      {item.tags.map((tag, i) => (
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
                    <div className="wl__card-stats">
                      {item.stats.map((s) => (
                        <div key={s.label} className="wl__card-stat">
                          <span className="wl__card-stat-value">{s.value}</span>
                          <span className="wl__card-stat-label">{s.label}</span>
                        </div>
                      ))}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={selected.id}
              className="cs"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.35 }}
            >
              <button
                type="button"
                className="wl__back"
                onClick={() => setSelectedId(null)}
              >
                ← All case studies
              </button>

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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default WorkLog;
