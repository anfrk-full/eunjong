import React from 'react';

/** 시험 일정 통합 대시보드 케이스 스터디 본문 */
const ScheduleManage: React.FC = () => {
  return (
    <>
      <div className="cs__block">
        <h3 className="cs__h2">Problem</h3>
        <p className="cs__text">
          시험 정보는 study_1, 일정은 study_3, 문서는 파일 경로에 흩어져
          있었습니다. 관리자가 “특정 SD/부서/시험계의 시험 → 현재 일정 상태”
          를 보려면 여러 화면을 오가야 했고, 취소 시험·진행률을 한눈에 보기
          어려웠습니다.
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
                <td>오늘 기준 완료/진행/예정 + Progress Bar</td>
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
        <h3 className="cs__h2">UI Architecture</h3>
        <p className="cs__caption">
          HTML은 레이아웃 골격만 두고, 데이터·렌더는 JS가 채우는 구조입니다.
        </p>
        <div className="cs__card">
          <div className="cs__grid-3">
            <div>
              <h4 className="cs__h3">Row 1 · Drill-down</h4>
              <p className="cs__small">
                Col1: 검색 축 선택 → Col2: 축 값 목록 → Col3: 시험번호 목록 (+
                sticky search)
              </p>
            </div>
            <div>
              <h4 className="cs__h3">Row 2 · Progress</h4>
              <p className="cs__small">
                일정 상태 비율 stacked progress (완료 / 진행 중 / 예정)
              </p>
            </div>
            <div>
              <h4 className="cs__h3">Row 3 · Detail</h4>
              <p className="cs__small">
                좌: 시험 메타·문서 링크 · 우: 일정 카드 타임라인
              </p>
            </div>
          </div>
          <hr className="cs__divider cs__divider--soft" />
          <div className="cs__flow">
            <span className="cs__pill cs__pill--info">Dimension</span>
            <span className="cs__flow-arrow">→</span>
            <span className="cs__pill cs__pill--info">Values</span>
            <span className="cs__flow-arrow">→</span>
            <span className="cs__pill cs__pill--info">Study list</span>
            <span className="cs__flow-arrow">→</span>
            <span className="cs__pill cs__pill--info">Parallel fetch</span>
            <span className="cs__flow-arrow">→</span>
            <span className="cs__pill cs__pill--info">Detail + Timeline + Progress</span>
          </div>
        </div>
      </div>

      <div className="cs__block">
        <h3 className="cs__h2">Data Flow</h3>
        <div className="cs__table-wrap">
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
                <td>축별 DISTINCT 값 또는 전체 시험번호</td>
              </tr>
              <tr>
                <td>fetchData2(dim, value)</td>
                <td>fetch_data_2.php</td>
                <td>선택 값에 속한 시험번호 목록</td>
              </tr>
              <tr>
                <td>fetchData3(NO)</td>
                <td>fetch_data_4.php + fetch_data_3.php</td>
                <td>시험 상세(study_1)와 일정(study_3) 병렬 로드</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="cs__callout cs__callout--info">
          <strong>병렬 로딩 패턴</strong>
          <p>
            시험 선택 시 상세 API와 일정 API를 동시에 호출합니다. 화면은
            메타정보 패널과 일정 패널을 독립 갱신해, 한쪽 지연이 전체 UI를
            막지 않도록 했습니다.
          </p>
        </div>
      </div>

      <div className="cs__block">
        <h3 className="cs__h2">Implementation Highlights</h3>
        <div className="cs__grid-2">
          <div className="cs__card">
            <div className="cs__card-head">
              Cascading discovery
              <span className="cs__pill cs__pill--ok">UX</span>
            </div>
            <p className="cs__small">
              시험책임자·부서·시험항목·시험계·의뢰자·QAU·시험물질·시험번호
              8축으로 진입. 값 목록/시험목록은 클라이언트 검색 + 결과 수
              배지로 즉시 좁힙니다.
            </p>
            <pre className="cs__code">{`fetchData('sd_name')
→ fetchData2(key, value)
→ fetchData3(studyNO)`}</pre>
          </div>
          <div className="cs__card">
            <div className="cs__card-head">
              Date-based schedule states
              <span className="cs__pill cs__pill--ok">Status</span>
            </div>
            <p className="cs__small">
              오늘 날짜 기준으로 일정 카드를 분류하고, 같은 카운트로 stacked
              progress bar를 구성합니다.
            </p>
            <pre className="cs__code">{`date < today  → 완료 (success)
date == today → 진행 중 (info)
date > today  → 예정 (danger)`}</pre>
          </div>
          <div className="cs__card">
            <div className="cs__card-head">
              Presentation mapping
              <span className="cs__pill cs__pill--ok">Domain</span>
            </div>
            <p className="cs__small">
              DB 코드값(gov_no, category 약칭)을 운영 명칭으로 매핑. GLP/NON-GLP,
              시설, 부처 라벨을 헤더에 묶어 “한 줄 요약 카드”로 만듭니다. 취소일은
              도장형 오버레이로 강조합니다.
            </p>
          </div>
          <div className="cs__card">
            <div className="cs__card-head">
              Shell + behavior split
              <span className="cs__pill cs__pill--ok">Structure</span>
            </div>
            <p className="cs__small">
              HTML은 col/row 컨테이너만, CSS는 viewport 기반 스크롤 패널, JS는
              AJAX·렌더·필터를 담당. 레거시 CMS 페이지에 embed 가능한 형태로
              유지했습니다.
            </p>
          </div>
        </div>
      </div>

      <div className="cs__block">
        <h3 className="cs__h2">Detail Panel Contents</h3>
        <div className="cs__table-wrap">
          <table className="cs__table">
            <thead>
              <tr>
                <th>Block</th>
                <th>Content</th>
                <th>Interaction</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Header</td>
                <td>시험번호 · 부처 · GLP여부 · 시설</td>
                <td>시험번호 클릭 → 상세 페이지 새 탭</td>
              </tr>
              <tr>
                <td>Meta</td>
                <td>제목/물질/의뢰자/부서/항목/시험계/SD/담당/QAU</td>
                <td>긴 텍스트 truncate + tooltip</td>
              </tr>
              <tr>
                <td>Documents</td>
                <td>시험계획서 / 변경기록지</td>
                <td>파일 존재 시 열기, 없으면 disabled</td>
              </tr>
              <tr>
                <td>Timeline</td>
                <td>study_3 work + date 카드 목록</td>
                <td>상태 색상 패널 + empty state 안내</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ScheduleManage;
