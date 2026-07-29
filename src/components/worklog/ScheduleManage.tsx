import React from 'react';

/** 시험 일정 통합 대시보드 */
const ScheduleManage: React.FC = () => {
  return (
    <>
      <div className="cs__block">
        <h3 className="cs__h2">Problem</h3>
        <p className="cs__text">
          시험 정보는 study_1, 일정은 study_3, 문서는 파일 경로에 흩어져
          있었습니다. 특정 SD/부서/시험계의 시험과 일정 상태를 보려면 여러
          화면을 오가야 했고, 취소 시험·진행률을 한눈에 보기 어려웠습니다.
        </p>
        <div className="cs__table-wrap">
          <table className="cs__table">
            <thead>
              <tr>
                <th>Pain point</th>
                <th>Dashboard response</th>
                <th>Ops value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>시험 탐색 경로가 단일(번호)뿐</td>
                <td>8개 축 드릴다운 + 즉시 필터</td>
                <td>상황별 탐색 속도 향상</td>
              </tr>
              <tr>
                <td>메타/문서/일정이 화면 분리</td>
                <td>선택 시 상세+일정 병렬 로드</td>
                <td>컨텍스트 스위칭 감소</td>
              </tr>
              <tr>
                <td>일정 상태 파악이 수동</td>
                <td>오늘 기준 완료/진행/예정 + Progress</td>
                <td>진행률 즉시 인지</td>
              </tr>
              <tr>
                <td>취소 시험 혼동</td>
                <td>취소 도장 오버레이</td>
                <td>오판 리스크 감소</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="cs__block">
        <h3 className="cs__h2">Approach</h3>
        <p className="cs__caption">
          HTML은 레이아웃 골격만 두고, 데이터·렌더는 JS가 채우는 구조로 설계했습니다.
        </p>
        <div className="cs__card">
          <div className="cs__flow">
            <span className="cs__pill cs__pill--info">Dimension</span>
            <span className="cs__flow-arrow">→</span>
            <span className="cs__pill cs__pill--info">Values</span>
            <span className="cs__flow-arrow">→</span>
            <span className="cs__pill cs__pill--info">Study list</span>
            <span className="cs__flow-arrow">→</span>
            <span className="cs__pill cs__pill--info">Parallel fetch</span>
            <span className="cs__flow-arrow">→</span>
            <span className="cs__pill cs__pill--info">Detail + Timeline</span>
          </div>
          <hr className="cs__divider cs__divider--soft" />
          <div className="cs__grid-3">
            <div>
              <h4 className="cs__h3">Row 1 · Drill-down</h4>
              <p className="cs__small">검색 축 → 축 값 목록 → 시험번호 목록</p>
            </div>
            <div>
              <h4 className="cs__h3">Row 2 · Progress</h4>
              <p className="cs__small">완료 / 진행 중 / 예정 stacked progress</p>
            </div>
            <div>
              <h4 className="cs__h3">Row 3 · Detail</h4>
              <p className="cs__small">메타·문서 링크 + 일정 카드 타임라인</p>
            </div>
          </div>
        </div>
        <div className="cs__table-wrap" style={{ marginTop: 12 }}>
          <table className="cs__table">
            <thead>
              <tr>
                <th>Step</th>
                <th>API</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>fetchData(dim)</td>
                <td>fetch_data.php</td>
                <td>축별 DISTINCT 값 / 전체 시험번호</td>
              </tr>
              <tr>
                <td>fetchData2(dim, value)</td>
                <td>fetch_data_2.php</td>
                <td>선택 값에 속한 시험번호 목록</td>
              </tr>
              <tr>
                <td>fetchData3(NO)</td>
                <td>fetch_data_3/4.php</td>
                <td>상세 + 일정 병렬 로드</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="cs__block">
        <h3 className="cs__h2">Implementation</h3>
        <div className="cs__grid-2">
          <div className="cs__card">
            <div className="cs__card-head">
              Cascading discovery
              <span className="cs__pill cs__pill--ok">UX</span>
            </div>
            <p className="cs__small">
              SD·부서·시험항목·시험계·의뢰자·QAU·시험물질·시험번호 8축으로 진입하고
              클라이언트 검색으로 즉시 좁힙니다.
            </p>
            <pre className="cs__code">{`fetchData('sd_name')
→ fetchData2(key, value)
→ fetchData3(studyNO)`}</pre>
          </div>
          <div className="cs__card">
            <div className="cs__card-head">
              Date-based states
              <span className="cs__pill cs__pill--ok">Status</span>
            </div>
            <p className="cs__small">
              오늘 날짜 기준으로 일정 카드를 분류하고, 같은 카운트로 progress bar를 구성합니다.
            </p>
            <pre className="cs__code">{`date < today  → 완료
date == today → 진행 중
date > today  → 예정`}</pre>
          </div>
          <div className="cs__card">
            <div className="cs__card-head">
              Presentation mapping
              <span className="cs__pill cs__pill--ok">Domain</span>
            </div>
            <p className="cs__small">
              DB 코드값을 운영 명칭으로 매핑하고, 취소일은 도장형 오버레이로 강조합니다.
            </p>
          </div>
          <div className="cs__card">
            <div className="cs__card-head">
              Shell + behavior
              <span className="cs__pill cs__pill--ok">Structure</span>
            </div>
            <p className="cs__small">
              HTML은 컨테이너만, JS는 AJAX·렌더·필터를 담당해 레거시 CMS에
              embed 가능한 형태로 유지했습니다.
            </p>
          </div>
        </div>
      </div>

      <div className="cs__block">
        <h3 className="cs__h2">Outcome</h3>
        <div className="cs__stats">
          <div className="cs__stat">
            <span className="cs__stat-value">3-step</span>
            <span className="cs__stat-label">드릴다운</span>
          </div>
          <div className="cs__stat">
            <span className="cs__stat-value">8 dims</span>
            <span className="cs__stat-label">검색 축</span>
          </div>
          <div className="cs__stat">
            <span className="cs__stat-value">Parallel</span>
            <span className="cs__stat-label">상세·일정 동시 로드</span>
          </div>
          <div className="cs__stat">
            <span className="cs__stat-value">One view</span>
            <span className="cs__stat-label">진행률 즉시 파악</span>
          </div>
        </div>
        <div className="cs__callout cs__callout--info">
          <strong>병렬 로딩 패턴</strong>
          <p>
            시험 선택 시 상세 API와 일정 API를 동시에 호출합니다. 한쪽 지연이
            전체 UI를 막지 않도록 패널을 독립 갱신했습니다.
          </p>
        </div>
      </div>
    </>
  );
};

export default ScheduleManage;
