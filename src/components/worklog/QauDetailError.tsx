import React from 'react';

/** QAU 세부오류 등록·조회 시스템 */
const QauDetailError: React.FC = () => {
  return (
    <>
      <div className="cs__block">
        <h3 className="cs__h2">Problem</h3>
        <p className="cs__text">
          QAU 점검은 시험계획서·기초자료·최종보고서 등 단계별로 수십 개
          점검항목을 가집니다. 기존에는 폼/문서에 산발적으로 기록되어, 시험별
          이력·담당자별 현황·기간 집계·공식 양식 반영이 어려웠습니다.
        </p>
        <div className="cs__table-wrap">
          <table className="cs__table">
            <thead>
              <tr>
                <th>Pain point</th>
                <th>System response</th>
                <th>Business value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>점검 결과가 문서에만 존재</td>
                <td>detail_error 테이블로 구조화 저장</td>
                <td>이력·추적성 확보</td>
              </tr>
              <tr>
                <td>단계마다 점검항목이 다름</td>
                <td>step → error 종속 셀렉트</td>
                <td>입력 실수·누락 감소</td>
              </tr>
              <tr>
                <td>전체 현황 파악 불가</td>
                <td>날짜/기간/QAU/시험번호 필터</td>
                <td>모니터링·보고 속도 향상</td>
              </tr>
              <tr>
                <td>공식 양식에 수동 재입력</td>
                <td>step 조건으로 폼에 자동 반영</td>
                <td>보고서 작성 공수 절감</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="cs__block">
        <h3 className="cs__h2">Approach</h3>
        <p className="cs__caption">Write / Read 역할을 분리하고, 공통 DB를 중심으로 연결했습니다.</p>
        <div className="cs__card">
          <div className="cs__flow">
            <span className="cs__pill cs__pill--info">Study Search</span>
            <span className="cs__flow-arrow">→</span>
            <span className="cs__pill cs__pill--info">detail_error CRUD</span>
            <span className="cs__flow-arrow">→</span>
            <span className="cs__pill cs__pill--info">DB</span>
            <span className="cs__flow-arrow">→</span>
            <span className="cs__pill cs__pill--info">error_api JOIN</span>
            <span className="cs__flow-arrow">→</span>
            <span className="cs__pill cs__pill--info">Dashboard / Excel</span>
          </div>
          <hr className="cs__divider cs__divider--soft" />
          <div className="cs__grid-2">
            <div>
              <h4 className="cs__h3">Write · detail_error_test.php</h4>
              <ul className="cs__list">
                <li>시험번호 검색 → study_1 컨텍스트</li>
                <li>오류 Create / Update / Delete</li>
                <li>단계별 checklist 동적 옵션</li>
              </ul>
            </div>
            <div>
              <h4 className="cs__h3">Read · error_show.php</h4>
              <ul className="cs__list">
                <li>AJAX → error_api.php (JSON)</li>
                <li>단일일 / 기간 · QAU 필터</li>
                <li>Excel 다운로드 연동</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="cs__block">
        <h3 className="cs__h2">Implementation</h3>
        <div className="cs__grid-2">
          <div className="cs__card">
            <div className="cs__card-head">
              Cascading checklist
              <span className="cs__pill cs__pill--ok">UX</span>
            </div>
            <p className="cs__small">
              점검단계(step) 변경 시 해당 단계의 점검항목만 노출해 입력 품질을 올렸습니다.
            </p>
            <pre className="cs__code">{`switch (step) {
  case '시험계획서': options = [...];
  case '시험기초자료': options = [...];
  case '최종보고서(초안)': ...
}`}</pre>
          </div>
          <div className="cs__card">
            <div className="cs__card-head">
              Edit via data-*
              <span className="cs__pill cs__pill--ok">Frontend</span>
            </div>
            <p className="cs__small">
              목록 행의 data-*로 수정 폼을 채우고, step 변경 후 select 동기화
              이슈를 setTimeout(0)으로 해결했습니다.
            </p>
            <pre className="cs__code">{`updateErrorOptions('edit');
setTimeout(() => {
  select.value = error;
}, 0);`}</pre>
          </div>
          <div className="cs__card">
            <div className="cs__card-head">
              Scoped delete
              <span className="cs__pill cs__pill--ok">Safety</span>
            </div>
            <p className="cs__small">
              삭제는 NO + study_uniq_no 동시 조건. 출력은 htmlspecialchars로
              XSS를 방지합니다.
            </p>
            <pre className="cs__code">{`DELETE FROM detail_error
WHERE NO = ? AND study_uniq_no = ?`}</pre>
          </div>
          <div className="cs__card">
            <div className="cs__card-head">
              Prepared JOIN API
              <span className="cs__pill cs__pill--ok">API</span>
            </div>
            <p className="cs__small">
              detail_error ⨝ study_1로 SD/QAU/시험번호를 합성하고, 날짜·QAU
              조건을 prepared statement로 바인딩합니다.
            </p>
            <pre className="cs__code">{`WHERE DATE(inspection_date)
  BETWEEN ? AND ?
AND qau_name = ?`}</pre>
          </div>
        </div>
      </div>

      <div className="cs__block">
        <h3 className="cs__h2">Outcome</h3>
        <div className="cs__stats">
          <div className="cs__stat">
            <span className="cs__stat-value">CRUD</span>
            <span className="cs__stat-label">오류 등록·수정·삭제</span>
          </div>
          <div className="cs__stat">
            <span className="cs__stat-value">Cascade</span>
            <span className="cs__stat-label">단계→항목 종속 선택</span>
          </div>
          <div className="cs__stat">
            <span className="cs__stat-value">API</span>
            <span className="cs__stat-label">조회·필터 분리</span>
          </div>
          <div className="cs__stat">
            <span className="cs__stat-value">Excel</span>
            <span className="cs__stat-label">리포트 연동</span>
          </div>
        </div>
        <p className="cs__text">
          점검 결과가 시험 단위로 남아 공식 양식·대시보드·엑셀까지 한 흐름으로
          연결되었습니다.
        </p>
      </div>
    </>
  );
};

export default QauDetailError;
