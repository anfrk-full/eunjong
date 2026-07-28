import React from 'react';

/** 회원 프로필 이미지 업로드·조회 파이프라인 케이스 스터디 본문 */
const ProfileImagePipeline: React.FC = () => {
  return (
    <>
      <div className="cs__block">
        <h3 className="cs__h2">Problem</h3>
        <p className="cs__text">
          이미지가 저장이 안되거나 저장이 되었는데 보이지 않는 문제가 발생했습니다.
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
        <h3 className="cs__h2">Design Principle</h3>
        <p className="cs__caption">
          레이어별 책임을 나누는 것이 이 파이프라인의 핵심입니다.
        </p>
        <div className="cs__card">
          <ul className="cs__list">
            <li>
              <strong>Controller</strong> — DTO(메타) + MultipartFile(파일) 분리
              수신
            </li>
            <li>
              <strong>Service</strong> — 고유 파일명 생성 → static 저장 → DTO에
              파일명 set → DB 저장
            </li>
            <li>
              <strong>API Read</strong> — DB 파일명 + &quot;/static/&quot; prefix → 응답
              path
            </li>
            <li>
              <strong>Frontend</strong> — BASE_URL + path → {'<img src>'}
            </li>
          </ul>
          <hr className="cs__divider cs__divider--soft" />
          <div className="cs__grid-2">
            <div>
              <h4 className="cs__h3">핵심 경계</h4>
              <div className="cs__flow">
                <span className="cs__pill cs__pill--info">Disk: 바이너리</span>
                <span className="cs__flow-arrow">·</span>
                <span className="cs__pill cs__pill--info">DB: 파일명</span>
                <span className="cs__flow-arrow">·</span>
                <span className="cs__pill cs__pill--info">API: path</span>
                <span className="cs__flow-arrow">·</span>
                <span className="cs__pill cs__pill--info">FE: origin + path</span>
              </div>
            </div>
            <div>
              <h4 className="cs__h3">Why split</h4>
              <p className="cs__small">
                환경(로컬/서버/CDN)이 바뀌어도 DB는 건드리지 않고 prefix만
                바꾸면 됩니다. 업로드·조회·표시 실패 지점도 레이어별로
                분리됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="cs__block">
        <h3 className="cs__h2">Implementation</h3>
        <div className="cs__grid-2">
          <div className="cs__card">
            <div className="cs__card-head">
              1) Upload — Controller
              <span className="cs__pill cs__pill--ok">Spring</span>
            </div>
            <p className="cs__small">
              DTO에 MultipartFile을 두지 않고, 컨트롤러에서 따로 받아 서비스로
              전달합니다. DTO에는 이미지 이름(`member_img`)만 둡니다.
            </p>
            <pre className="cs__code">{`@PostMapping("/register")
public ResponseEntity<String> registerUser(
    @ModelAttribute UserRequestDTO userRequestDTO,
    @RequestParam(value = "memberImgFile", required = false)
        MultipartFile memberImgFile) {
  return loginServiceImple.registerUser(
      userRequestDTO, memberImgFile);
}`}</pre>
          </div>

          <div className="cs__card">
            <div className="cs__card-head">
              2) Upload — Service
              <span className="cs__pill cs__pill--ok">Static store</span>
            </div>
            <p className="cs__small">
              `currentTimeMillis + 원본파일명`으로 중복을 막고, static 폴더에
              저장한 뒤 DB 저장 전 DTO에 파일명만 set합니다.
            </p>
            <pre className="cs__code">{`String fileName = System.currentTimeMillis()
    + "_" + memberImgFile.getOriginalFilename();
Path path = Paths.get(
    "src/main/resources/static/" + fileName);
Files.copy(memberImgFile.getInputStream(), path,
    StandardCopyOption.REPLACE_EXISTING);
userRequestDTO.setMember_img(fileName);`}</pre>
          </div>

          <div className="cs__card">
            <div className="cs__card-head">
              3) Read — Controller / Service
              <span className="cs__pill cs__pill--ok">JWT</span>
            </div>
            <p className="cs__small">
              JWT에서 userId를 뽑아 조회하고, DB 파일명에 `/static/`을 붙여
              응답합니다. 예: `1719..._photo.jpg` → `/static/1719..._photo.jpg`
            </p>
            <pre className="cs__code">{`user.setMemberImg(getImageUrl(user.getMemberImg()));

private String getImageUrl(String memberImg) {
  return "/static/" + memberImg;
}`}</pre>
          </div>

          <div className="cs__card">
            <div className="cs__card-head">
              4) Frontend — React
              <span className="cs__pill cs__pill--ok">Origin join</span>
            </div>
            <p className="cs__small">
              FE(3000)와 BE(8001) origin이 다르므로, 응답 path만으로는 부족하고
              서버 BASE_URL 결합이 필요합니다.
            </p>
            <pre className="cs__code">{`const BASE_URL = "http://localhost:8001";
<img src={\`\${BASE_URL}\${userInfo.memberImg}\`}
     alt="Profile" />
// => http://localhost:8001/static/1719..._photo.jpg`}</pre>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileImagePipeline;
