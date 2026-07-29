import React from 'react';

/** 쿼리 수 비교용 막대 */
const QueryBar: React.FC<{
  label: string;
  before: number;
  after: number;
  beforeLabel: string;
  afterLabel: string;
}> = ({ label, before, after, beforeLabel, afterLabel }) => {
  const max = Math.max(before, after);
  const beforePct = Math.max((before / max) * 100, 2);
  const afterPct = Math.max((after / max) * 100, 2);

  return (
    <div className="cs__chart">
      <div className="cs__chart-title">{label}</div>
      <div className="cs__chart-row">
        <span className="cs__chart-legend cs__chart-legend--before">Before</span>
        <div className="cs__chart-track">
          <div
            className="cs__chart-fill cs__chart-fill--before"
            style={{ width: `${beforePct}%` }}
          />
        </div>
        <span className="cs__chart-value">{beforeLabel}</span>
      </div>
      <div className="cs__chart-row">
        <span className="cs__chart-legend cs__chart-legend--after">After</span>
        <div className="cs__chart-track">
          <div
            className="cs__chart-fill cs__chart-fill--after"
            style={{ width: `${afterPct}%` }}
          />
        </div>
        <span className="cs__chart-value">{afterLabel}</span>
      </div>
    </div>
  );
};

/** 동물실 배정 화면 쿼리 최적화 */
const AniControlQueryOptimization: React.FC = () => {
  return (
    <>
      <div className="cs__block">
        <h3 className="cs__h2">Problem</h3>
        <p className="cs__text">
          동물실 배정 화면의 과도한 로딩은 루프 내부 반복 SELECT(N+1)가
          원인이었습니다. 데이터 증가에 비례해 DB round-trip이 폭증했고,
          업무 지연으로 이어졌습니다.
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
                <td>row마다 study_1 + substance + etc</td>
                <td>~ 3N queries</td>
              </tr>
              <tr>
                <td>케이지 배정맵</td>
                <td>시험·케이지마다 개별 SELECT</td>
                <td>~ N + N×Cages</td>
              </tr>
              <tr>
                <td>substance 재조회</td>
                <td>같은 sample_name을 케이지마다 반복</td>
                <td>중복 round-trip</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="cs__callout cs__callout--warn">
          <strong>Root cause — N+1 + duplicate lookup</strong>
          <p>
            케이지맵에서 substance 조회가 루프 안에 있어 동일 키를 수십 번
            재조회했습니다. LIKE(와일드카드 없음)와 escape 미적용도 함께
            존재했습니다.
          </p>
        </div>
      </div>

      <div className="cs__block">
        <h3 className="cs__h2">Approach</h3>
        <p className="cs__caption">
          UI·도메인 규칙은 유지하고, 데이터 접근만 배치 + 메모리 캐시로 재설계했습니다.
        </p>
        <div className="cs__card">
          <div className="cs__flow">
            <span className="cs__pill cs__pill--info">1. Collect keys</span>
            <span className="cs__flow-arrow">→</span>
            <span className="cs__pill cs__pill--info">2. Batch IN</span>
            <span className="cs__flow-arrow">→</span>
            <span className="cs__pill cs__pill--info">3. Build maps</span>
            <span className="cs__flow-arrow">→</span>
            <span className="cs__pill cs__pill--info">4. O(1) lookup</span>
          </div>
          <hr className="cs__divider cs__divider--soft" />
          <div className="cs__grid-3">
            <div>
              <h4 className="cs__h3">study_1_cache</h4>
              <p className="cs__small">NO → 시험 메타</p>
            </div>
            <div>
              <h4 className="cs__h3">substance_cache</h4>
              <p className="cs__small">sample_name → st_view</p>
            </div>
            <div>
              <h4 className="cs__h3">etc_cache</h4>
              <p className="cs__small">NO → 순화(etc=1) rows</p>
            </div>
          </div>
        </div>
        <div className="cs__grid-2" style={{ marginTop: 12 }}>
          <div className="cs__card">
            <div className="cs__card-head">
              Before
              <span className="cs__pill">Loop</span>
            </div>
            <pre className="cs__code">{`while ($data) {
  SELECT * FROM study_1 WHERE NO=...
  // cage loop
  SELECT st_view ... LIKE '$name'
}`}</pre>
          </div>
          <div className="cs__card">
            <div className="cs__card-head">
              After
              <span className="cs__pill cs__pill--ok">Batch</span>
            </div>
            <pre className="cs__code">{`// collect NO / sample_name
SELECT * FROM study_1 WHERE NO IN (...)
SELECT ... WHERE substance_name IN (...)
// render: $cache[$key]`}</pre>
          </div>
        </div>
      </div>

      <div className="cs__block">
        <h3 className="cs__h2">Implementation</h3>
        <div className="cs__grid-2">
          <div className="cs__card">
            <div className="cs__card-head">
              Batch + Cache
              <span className="cs__pill cs__pill--ok">Pattern</span>
            </div>
            <p className="cs__small">
              NO/sample_name을 모아 unique 후 IN 절로 적재. 렌더는 캐시 lookup만 수행합니다.
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
              기간 overlap, 케이지 occupancy, 순화(etc=1) 링크 등 도메인 분기는
              유지하고 접근 패턴만 바꿨습니다.
            </p>
          </div>
          <div className="cs__card">
            <div className="cs__card-head">
              Escape + exact match
              <span className="cs__pill cs__pill--ok">Hygiene</span>
            </div>
            <p className="cs__small">
              LIKE → = 전환, mysqli_real_escape_string 적용으로 인덱스 활용과
              주입 여지를 함께 개선했습니다.
            </p>
          </div>
          <div className="cs__card">
            <div className="cs__card-head">
              Dual hot path
              <span className="cs__pill cs__pill--ok">Scope</span>
            </div>
            <p className="cs__small">
              목록 루프와 케이지맵 루프 모두 동일 배치 패턴으로 통일해 화면
              전체 체감을 개선했습니다.
            </p>
          </div>
        </div>
      </div>

      <div className="cs__block">
        <h3 className="cs__h2">Outcome</h3>
        <div className="cs__stats">
          <div className="cs__stat">
            <span className="cs__stat-value">99.94%</span>
            <span className="cs__stat-label">케이지맵 쿼리 감소</span>
          </div>
          <div className="cs__stat">
            <span className="cs__stat-value">98.67%</span>
            <span className="cs__stat-label">목록 화면 쿼리 감소</span>
          </div>
          <div className="cs__stat">
            <span className="cs__stat-value">~25–50×</span>
            <span className="cs__stat-label">예상 응답 개선</span>
          </div>
          <div className="cs__stat">
            <span className="cs__stat-value">Same UX</span>
            <span className="cs__stat-label">회귀 없이 성능만</span>
          </div>
        </div>
        <div className="cs__grid-2">
          <QueryBar
            label="케이지맵 쿼리 (N=50)"
            before={5051}
            after={3}
            beforeLabel="5,051"
            afterLabel="3"
          />
          <QueryBar
            label="목록 화면 쿼리 (N=100)"
            before={301}
            after={4}
            beforeLabel="301"
            afterLabel="4"
          />
        </div>
      </div>
    </>
  );
};

export default AniControlQueryOptimization;
