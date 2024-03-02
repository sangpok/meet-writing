
# 문장 수집 서비스: 마음을 준 글, 마중글
*내 마음을 준 문장을 수집하고 공유해보세요!*
![og-image](https://github.com/sangpok/meet-writing/assets/48979587/2603eae0-32ac-45c8-ab45-4e14c265f344)

## 서비스 소개
- 마주친 문장에 마음을 준 적이 있지 않으신가요? 책을 읽다가, 기사를 읽다가, 누군가가 달아놓은 댓글을 보다가 마음에 드는 문장을 분명 마주친 적이 있으실 거예요. 마중글은 그런 문장을 간직할 수 있도록 도와드리고 있어요.

## 서비스 정보 개요

#### 개발 인원
- 1명, 김 주현(@sangpok, sang.pok.e@gmail.com)

#### 개발 기간
- 총 한 달, 2024년 02월 02일 ~ 02월 23일
- 기획 및 디자인 2주, 1차 개발 2주

#### 배포 주소
- https://meet-writing.vercel.app/, by Vercel

#### 화면설계 URL
- [마중글 Prototyping UI / Figma URL](https://www.figma.com/file/OkRMzY85ORjBxoHZ83Agv4/%EB%A7%88%EC%A4%91%EA%B8%80(Meet-writing)?type=design&node-id=140%3A122&mode=design&t=xIIrvRBjUgKFPnAJ-1)

#### 기술 스택 /Frontend
`React`, `Typescript`
- 서비스의 특성상 서버 사이드 렌더링이 필요한 작업이 없고 SPA로 동작하는 것이 매끄러울 것 같아 선정하였습니다.

`Module SCSS`
- CSS in JS는 스타일을 직렬화하는 과정에서 런타임 오버헤드가 걸리고 번들 크기를 늘리는 단점이 있습니다.
- 초기 로딩을 최대한 앞당기기 위함과, 스코프 지정 스타일을 사용하기 위해 Module SCSS를 선택했습니다.

`React Query`, `Recoil`
- 서버 사이드 상태를 효율적으로 캐싱하기 위해 React Query를 사용하였습니다.
- Header Config 등 클라이언트 상태를 효율적으로 관리하기 위해 Recoil을 사용하였습니다.

#### 기술 스택 /Backend
`Firebase`
- 1인 개발로 진행하면서 서버보단 클라이언트 쪽에 신경을 쓰고 싶었기에 서버리스로 진행하였습니다.

## 서비스 특징

### 서버리스
- BaaS인 Firebase에서 제공하는 기능을 통해 사용자 인증 및 데이터베이스를 구현하였습니다.
- Firebase에서 제공하는 메소드를 통해 로직을 구현하였고, 캐싱 기능을 사용하기 위해 React Query를 사용하였습니다.

### 반응형 및 PWA
- 반응형 웹으로 브라우저 뿐만 아니라 다양한 디바이스 해상도에 대응하였습니다.
- 디바이스에서 제공하는 PWA 기능을 통해 어플리케이션으로 편하게 이용할 수 있게 하였습니다.


| Responsive Web  | PWA |
| ------------- | ------------- |
| ![반응형 웹](https://github.com/sangpok/meet-writing/assets/48979587/b6e9fe8c-8779-4ef3-8df7-c5fd20f75ad2)  | ![GIF 2024-02-28 오후 4-44-44](https://github.com/sangpok/meet-writing/assets/48979587/ef5512da-06a9-4ffc-94b9-41e124a6d9ea)  |


### 랜덤 무한 스크롤
- 사용자의 체류 시간을 늘리기 위해 매번 랜덤한 글을 보여줍니다.
- Firebase에는 랜덤 관련 기능이 없기에 직접 구현하였습니다.
  - 각 포스트마다 1~10000 사이의 랜덤 숫자를 총 5개 설정합니다.
  - 해당 5개 중에 하나를 선택하고, 오름차순 또는 내림차순 둘 중 하나를 선택합니다.
  - 커서를 기준으로 페이지 사이즈에 맞게 잘라내고, Fisher-Yates shuffle 알고리즘을 통해 섞은 목록을 반환합니다.
  - 결과적으로 0.00000276%의 확률로 순서가 같은 포스트를 볼 수 있어 무작위성을 보장합니다.

| 랜덤 무한 스크롤 |
| ------------- |
| ![GIF 2024-02-28 오후 4-50-41](https://github.com/sangpok/meet-writing/assets/48979587/84e34c6b-81b7-4a54-90e0-9efc12ad0dd1) |

### Optimistic UI
- 서버리스의 특성상 네트워크를 통해 DB를 조회하므로 서버 상태와 네트워크 상태에 따라 딜레이가 다소 길어질 수 있습니다.
- 이로 인해 사용자의 액션 후 UI Feedback까지 간극이 생기게 되고, UX 경험에 부정적인 영향을 끼치게 됩니다.
- 하나의 어플리케이션처럼 동작하게 만든 마중글 서비스에서는 부드러운 UX 경험이 중요하다고 생각했습니다.
- 따라서, 서버에 보낸 요청이 성공할 것임을 전제하고 UI를 먼저 업데이트하는 Optimistic UI를 React Query를 사용하여 적용하였습니다.

| 저장하기 Optimistic Update |
| ------------- |
| ![GIF 2024-02-28 오후 4-59-30](https://github.com/sangpok/meet-writing/assets/48979587/8cd95860-8c50-42c8-ab69-6f3467dbd879) |
| *Network Throttle이 적용된 상태입니다* |


### 웹폰트 경량화
- 마중글 서비스에선 폰트가 중요한 요소이기에 모든 환경에 동일한 폰트를 적용하고 있습니다.
- 하지만 Noto Serif KR 폰트는 1개의 Font-weight가 약 7MB이고, 마중글에선 약 4개의 굵기를 활용하고 있습니다.
- 약 28MB의 폰트 파일들을 서버 자체에서 서빙하기엔 트래픽 부담이 컸기에 최적화를 진행하였습니다.
- 직접 OTF 파일을 Subset 목록을 통해 필요한 심볼만 가져와 최적화를 진행했습니다.
- OTF파일을 WOFF, WOFF2 포맷으로 변환하여 압축을 진행해 용량을 줄였습니다.
- 그 결과 하나 당 7MB의 폰트 파일들이 약 300KB으로 용량을 95% 가량 줄였습니다.
- 관련 포스팅: [벨로그 웹폰트 경량화(w. Subset character)](https://velog.io/@sangpok/%EC%9B%B9%ED%8F%B0%ED%8A%B8-%EA%B2%BD%EB%9F%89%ED%99%94w.-Subset-character)
