import React from 'react';

/** 회원 프로필 이미지 업로드·조회 파이프라인 */
const ProfileImagePipeline: React.FC = () => {
  return (
    <>
      <div className="cs__block">
        <h3 className="cs__h2">Problem</h3>
        <p className="cs__text">
          이미지가 저장되지 않거나, 저장됐는데도 화면에 보이지 않는 문제가
          발생했습니다. 업로드·DB·조회·표시 책임이 섞여 실패 지점을 찾기
          어려웠습니다.
        </p>
        <div className="cs__table-wrap">
          <table className="cs__table">
            <thead>
              <tr>
                <th>Failure mode</th>
                <th>Root cause</th>
                <th>Fix</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>DTO 바인딩 혼란</td>
                <td>MultipartFile을 RequestDTO에 포함</td>
                <td>컨트롤러에서 파일 파라미터 분리</td>
              </tr>
              <tr>
                <td>파일명 충돌</td>
                <td>원본 파일명 그대로 저장</td>
                <td>timestamp prefix로 unique 이름</td>
              </tr>
              <tr>
                <td>DB / 디스크 불일치</td>
                <td>경로·바이너리를 DB에 혼재</td>
                <td>DB에는 파일명(string)만</td>
              </tr>
              <tr>
                <td>프론트에서 안 보임</td>
                <td>상대경로만 사용 / origin 누락</td>
                <td>BASE_URL + /static/{'{filename}'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="cs__block">
        <h3 className="cs__h2">Approach</h3>
        <p className="cs__caption">레이어별 책임을 나눠 업로드·저장·조회·표시를 분리했습니다.</p>
        <div className="cs__card">
          <div className="cs__flow">
            <span className="cs__pill cs__pill--info">Disk: 바이너리</span>
            <span className="cs__flow-arrow">→</span>
            <span className="cs__pill cs__pill--info">DB: 파일명</span>
            <span className="cs__flow-arrow">→</span>
            <span className="cs__pill cs__pill--info">API: path</span>
            <span className="cs__flow-arrow">→</span>
            <span className="cs__pill cs__pill--info">FE: origin + path</span>
          </div>
          <hr className="cs__divider cs__divider--soft" />
          <ul className="cs__list">
            <li>
              <strong>Controller</strong> — DTO(메타) + MultipartFile(파일) 분리 수신
            </li>
            <li>
              <strong>Service</strong> — 고유 파일명 생성 → static 저장 → DB에는 파일명만
            </li>
            <li>
              <strong>API Read</strong> — DB 파일명 + <code>/static/</code> prefix
            </li>
            <li>
              <strong>Frontend</strong> — BASE_URL + path로 이미지 표시
            </li>
          </ul>
        </div>
      </div>

      <div className="cs__block">
        <h3 className="cs__h2">Implementation</h3>
        <div className="cs__grid-2">
          <div className="cs__card">
            <div className="cs__card-head">
              Upload — Controller
              <span className="cs__pill cs__pill--ok">Spring</span>
            </div>
            <p className="cs__small">
              DTO에 MultipartFile을 두지 않고 컨트롤러에서 따로 받아 서비스로 전달합니다.
            </p>
            <pre className="cs__code">{`@PostMapping("/register")
public ResponseEntity<String> registerUser(
    @ModelAttribute UserRequestDTO dto,
    @RequestParam(value = "memberImgFile", required = false)
        MultipartFile memberImgFile) {
  return loginService.registerUser(dto, memberImgFile);
}`}</pre>
          </div>
          <div className="cs__card">
            <div className="cs__card-head">
              Upload — Service
              <span className="cs__pill cs__pill--ok">Store</span>
            </div>
            <p className="cs__small">
              timestamp + 원본명으로 중복을 막고, static에 저장한 뒤 DB에는 파일명만 set합니다.
            </p>
            <pre className="cs__code">{`String fileName = System.currentTimeMillis()
    + "_" + file.getOriginalFilename();
Files.copy(file.getInputStream(),
    Paths.get("static/" + fileName),
    StandardCopyOption.REPLACE_EXISTING);
dto.setMember_img(fileName);`}</pre>
          </div>
          <div className="cs__card">
            <div className="cs__card-head">
              Read — API
              <span className="cs__pill cs__pill--ok">Path</span>
            </div>
            <p className="cs__small">
              JWT userId로 조회 후 DB 파일명에 <code>/static/</code>을 붙여 응답합니다.
            </p>
            <pre className="cs__code">{`user.setMemberImg(getImageUrl(user.getMemberImg()));

private String getImageUrl(String memberImg) {
  return "/static/" + memberImg;
}`}</pre>
          </div>
          <div className="cs__card">
            <div className="cs__card-head">
              Frontend — Origin
              <span className="cs__pill cs__pill--ok">React</span>
            </div>
            <p className="cs__small">
              FE와 BE origin이 다르므로 응답 path에 서버 BASE_URL을 결합합니다.
            </p>
            <pre className="cs__code">{`const BASE_URL = "http://localhost:8001";
<img src={\`\${BASE_URL}\${userInfo.memberImg}\`}
     alt="Profile" />`}</pre>
          </div>
        </div>
      </div>

      <div className="cs__block">
        <h3 className="cs__h2">Outcome</h3>
        <div className="cs__stats">
          <div className="cs__stat">
            <span className="cs__stat-value">4 layers</span>
            <span className="cs__stat-label">Disk · DB · API · FE</span>
          </div>
          <div className="cs__stat">
            <span className="cs__stat-value">Filename</span>
            <span className="cs__stat-label">DB 저장 전략</span>
          </div>
          <div className="cs__stat">
            <span className="cs__stat-value">Unique</span>
            <span className="cs__stat-label">timestamp prefix</span>
          </div>
          <div className="cs__stat">
            <span className="cs__stat-value">Stable</span>
            <span className="cs__stat-label">환경 변경에 강한 조회</span>
          </div>
        </div>
        <p className="cs__text">
          환경(로컬/서버)이 바뀌어도 DB는 건드리지 않고 prefix만 바꾸면 됩니다.
          실패 지점도 레이어별로 분리되어 디버깅 비용이 줄었습니다.
        </p>
      </div>
    </>
  );
};

export default ProfileImagePipeline;
