import React from 'react';

/** PDF 열람·인쇄 — COPY 도장 포함 전용 뷰어 */
const PdfCopyViewer: React.FC = () => {
  return (
    <>
      <div className="cs__block">
        <h3 className="cs__h2">Problem</h3>
        <p className="cs__text">
          카피본 출력 시 COPY 표시가 필요했습니다. 크롬에서 PDF URL을 바로
          열면 인쇄·다운로드가 브라우저 내장 뷰어에서 처리되어, 화면 위에 올린
          오버레이가 출력물에 들어가지 않았습니다. 매번 수동으로 도장을 찍는
          작업이 반복됐습니다.
        </p>
        <div className="cs__table-wrap">
          <table className="cs__table">
            <thead>
              <tr>
                <th>Before</th>
                <th>Gap</th>
                <th>Needed</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Chrome PDF viewer 직링크</td>
                <td>DOM 오버레이가 인쇄 파이프라인 밖</td>
                <td>표시가 출력·다운로드에 포함</td>
              </tr>
              <tr>
                <td>화면 위 COPY 표시만 추가</td>
                <td>인쇄물에는 미반영</td>
                <td>PDF 바이트 자체에 스탬프</td>
              </tr>
              <tr>
                <td>수동 도장 날인</td>
                <td>출력마다 반복 공수</td>
                <td>원클릭 인쇄·다운로드</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="cs__block">
        <h3 className="cs__h2">Approach</h3>
        <p className="cs__caption">
          업로드 PDF를 여는 전용 뷰어를 두고, 화면 열람과 인쇄·다운로드 경로를
          분리했습니다.
        </p>
        <div className="cs__card">
          <div className="cs__flow">
            <span className="cs__pill cs__pill--info">file 검증</span>
            <span className="cs__flow-arrow">→</span>
            <span className="cs__pill cs__pill--info">PDF.js 렌더</span>
            <span className="cs__flow-arrow">→</span>
            <span className="cs__pill cs__pill--info">화면 열람</span>
            <span className="cs__flow-arrow">→</span>
            <span className="cs__pill cs__pill--info">pdf-lib 스탬프</span>
            <span className="cs__flow-arrow">→</span>
            <span className="cs__pill cs__pill--info">인쇄 / 다운로드</span>
          </div>
          <hr className="cs__divider cs__divider--soft" />
          <div className="cs__grid-2">
            <div>
              <h4 className="cs__h3">Screen</h4>
              <ul className="cs__list">
                <li>PDF.js 캔버스 + 썸네일·줌·페이지 이동</li>
                <li>텍스트 레이어로 드래그 선택·복사</li>
                <li>COPY 도장은 화면에서는 숨김</li>
              </ul>
            </div>
            <div>
              <h4 className="cs__h3">Print / Download</h4>
              <ul className="cs__list">
                <li>pdf-lib로 1페이지에 COPY·쪽 범위 삽입</li>
                <li>인쇄: 스탬프 PDF blob → iframe print</li>
                <li>실패 시 고해상도 캔버스 + @media print 폴백</li>
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
              Path guard
              <span className="cs__pill cs__pill--ok">PHP</span>
            </div>
            <p className="cs__small">
              `..` 차단 · `.pdf`만 허용 · `realpath`로 healthcare 하위인지
              확인해 임의 경로 접근을 막았습니다.
            </p>
            <pre className="cs__code">{`if (strpos($file, '..') !== false
  || !preg_match('/\\.pdf$/i', $file)) {
  // reject
}
$full = realpath($base . '/' . $file);`}</pre>
          </div>
          <div className="cs__card">
            <div className="cs__card-head">
              Stamp into PDF
              <span className="cs__pill cs__pill--ok">pdf-lib</span>
            </div>
            <p className="cs__small">
              COPY / 페이지 범위 / 대조인을 캔버스로 그린 뒤 PNG로 임베드하고
              Multiply 블렌드로 1페이지 좌상에 배치합니다.
            </p>
            <pre className="cs__code">{`first.drawImage(stampImg, {
  x: margin,
  y: height - margin - stampH,
  blendMode: BlendMode.Multiply,
});`}</pre>
          </div>
          <div className="cs__card">
            <div className="cs__card-head">
              Print fallback
              <span className="cs__pill cs__pill--ok">Resilience</span>
            </div>
            <p className="cs__small">
              blob 인쇄가 막히면 300dpi 캔버스 재렌더 후 CSS `@media print`로
              도장을 올리고, 종료 후 화면 스케일로 복구합니다.
            </p>
          </div>
          <div className="cs__card">
            <div className="cs__card-head">
              Download with stamp
              <span className="cs__pill cs__pill--ok">Export</span>
            </div>
            <p className="cs__small">
              1페이지는 A4 시트에 스탬프를 합성해 새로 만들고, 2페이지 이후는
              원본을 복사해 내려받습니다.
            </p>
          </div>
        </div>
      </div>

      <div className="cs__block">
        <h3 className="cs__h2">Result</h3>
        <div className="cs__grid-3">
          <div className="cs__stat">
            <span className="cs__stat-value">Baked-in</span>
            <span className="cs__stat-label">인쇄·다운로드 모두 COPY 포함</span>
          </div>
          <div className="cs__stat">
            <span className="cs__stat-value">0 stamp</span>
            <span className="cs__stat-label">수동 도장 작업 제거</span>
          </div>
          <div className="cs__stat">
            <span className="cs__stat-value">Fallback</span>
            <span className="cs__stat-label">blob 실패 시 캔버스 인쇄</span>
          </div>
        </div>
        <p className="cs__text" style={{ marginTop: 14 }}>
          카피본 출력마다 도장을 찍지 않아도 되어 작업 효율이 올랐고, 브라우저
          뷰어 제약 없이도 표시가 출력물에 안정적으로 남습니다.
        </p>
      </div>
    </>
  );
};

export default PdfCopyViewer;
