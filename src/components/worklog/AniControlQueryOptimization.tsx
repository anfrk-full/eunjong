import React from 'react';

/** 동물실 배정 화면 쿼리 최적화 케이스 스터디 본문 */
const AniControlQueryOptimization: React.FC = () => {
  return (
    <>
      <div className="cs__block">
        <h3 className="cs__h2">Problem</h3>
        <p className="cs__text">
          동물실/케이지 배정 화면은 study_2(배정)·study_1(시험)·test_substance_tb
          (물질성질)를 조합해야 합니다. 원본은 행/케이지마다 개별 SELECT를
          실행해, 데이터 증가에 비례해 DB round-trip이 폭증했습니다.
        </p>
        <div className="cs__table-wrap">
          <table className="cs__table">
            <thead>
              <tr>
                <th>Path</th>
                <th>Before (per loop)</th>
                <th>Cost shape</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>목록 화면</td>
                <td>row마다 study_2(etc=1) + study_1 + substance</td>
                <td>~ 3N queries</td>
              </tr>
              <tr>
                <td>케이지 배정맵</td>
                <td>겹치는 시험마다 study_1 + 케이지마다 substance</td>
                <td>~ N + N×Cages queries</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="cs__callout cs__callout--warn">
          <strong>Worst-case smell</strong>
          <p>
            케이지맵에서는 substance 조회가 케이지 루프 안에 있어, 같은
            sample_name을 수십 번 재조회했습니다. 전형적인 N+1 + 중복 조회
            결합 패턴입니다.
          </p>
        </div>
      </div>

      <div className="cs__block">
        <h3 className="cs__h2">Before vs After</h3>
        <div className="cs__grid-2">
          <div className="cs__card">
            <div className="cs__card-head">
              ani_control_1.php
              <span className="cs__pill">Before</span>
            </div>
            <p className="cs__small">
              루프 안에서 즉시 조회. 결과셋이 커질수록 선형 이상으로 느려짐.
            </p>
            <pre className="cs__code">{`while ($data) {
  // per row
  SELECT * FROM study_2 WHERE etc=1 AND NO=...
  SELECT * FROM study_1 WHERE NO=...
  SELECT st_view FROM test_substance_tb ...
}`}</pre>
            <pre className="cs__code">{`// cage loop 내부
$sql_sample = "SELECT st_view ... LIKE '$name'";
mysqli_query(...); // every cage`}</pre>
          </div>
          <div className="cs__card">
            <div className="cs__card-head">
              ani_control_1_test.php
              <span className="cs__pill cs__pill--ok">After</span>
            </div>
            <p className="cs__small">
              ID 수집 → 배치 IN 조회 → 연관배열 캐시 → 루프는 lookup만.
            </p>
            <pre className="cs__code">{`// 1) collect NO list
// 2) batch
SELECT * FROM study_1 WHERE NO IN (...)
SELECT ... FROM test_substance_tb
  WHERE substance_name IN (...)
SELECT * FROM study_2
  WHERE etc=1 AND NO IN (...)

// 3) render with cache[$NO]`}</pre>
          </div>
        </div>
      </div>

      <div className="cs__block">
        <h3 className="cs__h2">Optimization Design</h3>
        <div className="cs__card">
          <div className="cs__flow">
            <span className="cs__pill cs__pill--info">1. Collect keys</span>
            <span className="cs__flow-arrow">→</span>
            <span className="cs__pill cs__pill--info">2. Batch IN queries</span>
            <span className="cs__flow-arrow">→</span>
            <span className="cs__pill cs__pill--info">3. Build maps</span>
            <span className="cs__flow-arrow">→</span>
            <span className="cs__pill cs__pill--info">4. O(1) render lookups</span>
          </div>
          <hr className="cs__divider cs__divider--soft" />
          <div className="cs__grid-3">
            <div>
              <h4 className="cs__h3">study_1_cache</h4>
              <p className="cs__small">
                NO → 시험 메타 (SD, study_case, sample_name…)
              </p>
            </div>
            <div>
              <h4 className="cs__h3">substance_cache</h4>
              <p className="cs__small">
                sample_name → st_view (물질성질)
              </p>
            </div>
            <div>
              <h4 className="cs__h3">etc_cache</h4>
              <p className="cs__small">
                NO → 순화(etc=1) study_2 rows
              </p>
            </div>
          </div>
        </div>
        <div className="cs__table-wrap">
          <table className="cs__table">
            <thead>
              <tr>
                <th>Metric (rows = N)</th>
                <th>Before</th>
                <th>After</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>목록 화면 DB hits</td>
                <td>~3N</td>
                <td>1 + 3 (base + 3 batches)</td>
              </tr>
              <tr>
                <td>케이지맵 DB hits</td>
                <td>~N (study_1) + N×Cages (substance)</td>
                <td>1 + 2 batches</td>
              </tr>
              <tr>
                <td>동일 substance 재조회</td>
                <td>케이지마다 반복</td>
                <td>unique 후 1회</td>
              </tr>
              <tr>
                <td>렌더 단계</td>
                <td>쿼리 대기 포함</td>
                <td>메모리 lookup</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="cs__block">
        <h3 className="cs__h2">Implementation Highlights</h3>
        <div className="cs__grid-2">
          <div className="cs__card">
            <div className="cs__card-head">
              Batch + Cache
              <span className="cs__pill cs__pill--ok">Pattern</span>
            </div>
            <p className="cs__small">
              NO/sample_name을 모아 array_unique 후 IN 절로 한 번에 적재.
              이후 isset($cache[$key])로 접근합니다.
            </p>
            <pre className="cs__code">{`$sql = "SELECT * FROM study_1
 WHERE NO IN ($no_list_str)";
while ($row) {
  $study_1_cache[$row['NO']] = $row;
}`}</pre>
          </div>
          <div className="cs__card">
            <div className="cs__card-head">
              Same business rules
              <span className="cs__pill cs__pill--ok">Correctness</span>
            </div>
            <p className="cs__small">
              기간 overlap 판정, 케이지 occupancy 맵, 순화(etc=1) 링크 조건 등
              도메인 분기는 유지. “느린 올바른 로직”을 “빠른 올바른 로직”으로
              바꿨습니다.
            </p>
          </div>
          <div className="cs__card">
            <div className="cs__card-head">
              Escape + exact match
              <span className="cs__pill cs__pill--ok">Hygiene</span>
            </div>
            <p className="cs__small">
              substance 조회를 LIKE에서 = + mysqli_real_escape_string으로 정리.
              불필요 와일드카드 매칭과 주입 여지를 줄였습니다.
            </p>
          </div>
          <div className="cs__card">
            <div className="cs__card-head">
              Dual hot path
              <span className="cs__pill cs__pill--ok">Scope</span>
            </div>
            <p className="cs__small">
              ① 미배정 목록 루프 ② 기간 겹침 케이지맵 루프 — 둘 다 같은 배치
              패턴으로 통일해 개선 효과를 화면 전체로 확장했습니다.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AniControlQueryOptimization;
