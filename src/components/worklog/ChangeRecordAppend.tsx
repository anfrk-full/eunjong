import React from 'react';

/** 변경기록지 다중 첨부 케이스 스터디 본문 */
const ChangeRecordAppend: React.FC = () => {
  return (
    <>
      <div className="cs__block">
        <h3 className="cs__h2">Problem</h3>
        <p className="cs__text">
          시험일정 화면에서 변경기록지를 수정하면 기존 파일이 교체되어, 이전
          개정본이 사라졌습니다. 규제·감사 성격의 문서에서 이력 보존이 필요했고,
          파일명도 원본 업로드명을 그대로 써서 시험번호·날짜 기준 추적이
          어려웠습니다.
        </p>
        <div className="cs__table-wrap">
          <table className="cs__table">
            <thead>
              <tr>
                <th>Before</th>
                <th>After</th>
                <th>Why it matters</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>file_2 단일 컬럼 덮어쓰기</td>
                <td>file_2~file_21 순차 슬롯 추가</td>
                <td>이력 손실 방지</td>
              </tr>
              <tr>
                <td>디스크 unlink 후 저장</td>
                <td>기존 파일 유지 + 신규만 저장</td>
                <td>감사 추적 가능</td>
              </tr>
              <tr>
                <td>원본 파일명 그대로</td>
                <td>시험번호_변경기록지_날짜.ext</td>
                <td>검색·식별 일관성</td>
              </tr>
              <tr>
                <td>목록 1건 표시</td>
                <td>등록된 전체 링크 목록</td>
                <td>사용자 확인 비용 감소</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="cs__block">
        <h3 className="cs__h2">Constraints</h3>
        <div className="cs__grid-2">
          <div className="cs__card">
            <div className="cs__card-head">Given</div>
            <ul className="cs__list">
              <li>기존 study_1 테이블 / PHP 절차형 코드베이스</li>
              <li>별도 attachment 테이블 신설은 범위 밖</li>
              <li>입력 UI는 기존 study_1 폼을 재사용</li>
              <li>권한(per)에 따라 수정·삭제 UX가 다름</li>
            </ul>
          </div>
          <div className="cs__card">
            <div className="cs__card-head">Decision</div>
            <ul className="cs__list">
              <li>가로 확장 컬럼(file_2~21)으로 요구사항 충족</li>
              <li>“다음 빈 슬롯” 탐색으로 append 구현</li>
              <li>런타임 SHOW COLUMNS + ALTER로 컬럼 보강</li>
              <li>삭제 시 컬럼명 whitelist (regex)</li>
            </ul>
          </div>
        </div>
        <div className="cs__callout cs__callout--warn">
          <strong>Trade-off (의도적으로 수용)</strong>
          <p>
            정규화된 attachment 테이블이 장기적으로는 더 낫습니다. 이번 작업은
            레거시 호환·배포 리스크·일정 제약을 우선해 wide-column append를
            선택했습니다. 포트폴리오에서는 “이상적 설계”보다 “제약 하 최적해”를
            설명할 수 있는 사례로 씁니다.
          </p>
        </div>
      </div>

      <div className="cs__block">
        <h3 className="cs__h2">Architecture</h3>
        <p className="cs__caption">
          Upload path · study_1_test.php → Disk + study_1 · View/Delete ·
          study_3_test.php
        </p>
        <div className="cs__card">
          <div className="cs__flow">
            <span className="cs__pill cs__pill--info">1. Form</span>
            <span className="cs__flow-arrow">→</span>
            <span className="cs__pill cs__pill--info">2. Find empty slot</span>
            <span className="cs__flow-arrow">→</span>
            <span className="cs__pill cs__pill--info">3. Rename + move</span>
            <span className="cs__flow-arrow">→</span>
            <span className="cs__pill cs__pill--info">4. Dynamic UPDATE</span>
            <span className="cs__flow-arrow">→</span>
            <span className="cs__pill cs__pill--info">5. Multi-list UI</span>
          </div>
          <hr className="cs__divider cs__divider--soft" />
          <div className="cs__grid-3">
            <div>
              <h4 className="cs__h3">Slot scan</h4>
              <p className="cs__small">
                for i in 2..21: empty(file_i) → 선택 후 break. 가득 차면 거부.
              </p>
            </div>
            <div>
              <h4 className="cs__h3">Naming</h4>
              <p className="cs__small">
                {'{studyNo}_변경기록지_{Y-m-d}.ext'} / 충돌 시 _2, _3…
              </p>
            </div>
            <div>
              <h4 className="cs__h3">Delete</h4>
              <p className="cs__small">
                file_col whitelist → unlink → SET col=NULL
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="cs__block">
        <h3 className="cs__h2">Implementation Highlights</h3>
        <div className="cs__grid-2">
          <div className="cs__card">
            <div className="cs__card-head">
              Append, not overwrite
              <span className="cs__pill cs__pill--ok">Integrity</span>
            </div>
            <p className="cs__small">
              UPDATE에 항상 file_2를 넣지 않고, 찾은 컬럼만 동적 추가.
              기존 슬롯 값이 보호됩니다.
            </p>
            <pre className="cs__code">{`if ($change_file_col && $change_file_name) {
  $sql1 .= ", $change_file_col = '...'";
}`}</pre>
          </div>
          <div className="cs__card">
            <div className="cs__card-head">
              Dynamic column whitelist
              <span className="cs__pill cs__pill--ok">Security</span>
            </div>
            <p className="cs__small">
              URL의 file_col을 SQL 식별자로 쓰기 전, 허용 패턴만 통과.
              임의 컬럼 변조·주입을 차단합니다.
            </p>
            <pre className="cs__code">{`preg_match(
  '/^file_([2-9]|1[0-9]|2[01])$/',
  $file_col
)`}</pre>
          </div>
          <div className="cs__card">
            <div className="cs__card-head">
              Schema self-heal
              <span className="cs__pill cs__pill--ok">Ops</span>
            </div>
            <p className="cs__small">
              SHOW COLUMNS로 file_3~21 존재 여부를 확인하고 없으면 ALTER.
              수동 마이그레이션 누락에도 기능이 동작하도록 했습니다. (운영
              비용은 트레이드오프)
            </p>
          </div>
          <div className="cs__card">
            <div className="cs__card-head">
              Multi-file visibility
              <span className="cs__pill cs__pill--ok">UX</span>
            </div>
            <p className="cs__small">
              study_3에서 file_2~21을 배열로 모아 링크 목록 표시. 관리자
              권한에서는 파일 단위 삭제 링크를 제공합니다.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangeRecordAppend;
