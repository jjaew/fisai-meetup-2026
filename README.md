# FISAI MeetUP 과제Ⅰ — GitHub Pages 배포용 프로젝트

이 폴더는 과제Ⅰ의 정적 웹페이지와 Python 자동화 도구를 함께 포함합니다.

## 웹페이지 배포
1. GitHub 계정에 로그인한 후 새로운 **Public** repository를 만듭니다. 예: `fisai-meetup-2026`.
2. 저장소에서 **Add file → Upload files**를 클릭합니다.
3. 이 ZIP을 압축 해제한 뒤, **압축 해제 폴더 안의 내용물 전체**(특히 `docs` 폴더)를 드래그해 업로드합니다. ZIP 자체는 업로드하지 마세요.
4. **Commit changes**로 저장합니다. 저장소 최상위에 `docs` 폴더가 보여야 합니다.
5. **Settings → Pages → Build and deployment → Source: Deploy from a branch**를 선택합니다.
6. **Branch: `main` / Folder: `/docs` → Save**로 설정합니다.
7. Pages 페이지에 나타나는 **Visit site** 버튼으로 배포된 실제 웹사이트에 접속해 동작을 검증합니다.
8. 배포 성공을 확인한 뒤에만 `배포_url.txt`에 **실제 URL 한 줄**을 작성합니다.

웹 주소 형식 예시 (실제 URL이 아닙니다):
`https://GITHUB_USERNAME.github.io/fisai-meetup-2026/`

## 최종 제출 시 유지할 필수 파일명
- `배포_url.txt` : 배포 완료한 실제 사이트 URL 한 줄
- `solution.py` : Python 자동화 도구
- `결과_카테고리집계.csv` : Python 집계 결과
- `제출물.md` : 사용 도구/구현 메모 3~5줄
최종 ZIP 파일명: `사번_이름.zip`.

## Python 실행
- 루트 폴더에서 `python solution.py` (또는 Windows에서 `py solution.py`)
- `안내서비스.csv`에서 카테고리별 CSV 7개와 집계 CSV를 생성합니다.
- 동시에 `docs/assets/data.js`를 갱신합니다.

## 확인해야 할 사항
- 웹페이지에 7개의 카테고리 카드와 `결과 7건` 표시
- `복지` 검색 → 결과 1건 (복지 카테고리 카드 1개 표시, 카드 내부 안내서비스 4건)
- `교육부` 검색 → 결과 1건 (`민원` 카테고리), 카드 클릭 → 5개 서비스
- 카드뉴스 1~4 이미지 4장 정상 표시
- PC 및 모바일 화면 확인

**주의:** GitHub Pages는 외부에서 접근 가능한 공개 웹사이트입니다. 실제 업무자료·비밀정보·개인정보를 업로드하지 마세요. 이 프로젝트는 과제 제공 예시 데이터만 포함합니다.
