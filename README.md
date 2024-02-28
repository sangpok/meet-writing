# 문장 수집 서비스: 마음을 준 글, 마중글
*내 마음을 준 문장을 수집하고 공유해보세요!*

## 서비스 소개
- 마주친 문장에 마음을 준 적이 있지 않으신가요? 책을 읽다가, 기사를 읽다가, 누군가가 달아놓은 댓글을 보다가 마음에 드는 문장을 분명 마주친 적이 있으실 거예요. 마중글은 그런 문장을 간직할 수 있도록 도와드리고 있어요.

## 서비스 정보 개요

#### 개발 인원
- 1명, 김 주현(@sangpok, sang.pok.e@gmail.com)

#### 개발 기간
- 총 한 달, 2024년 02월 02일 ~ 02월 23일

#### 배포 주소
- https://meet-writing.vercel.app/

#### 화면설계 URL
- [마중글 Prototyping UI / Figma URL]([https://www.figma.com/file/My6S2nDJSUg0MB8AffCyem/Wherewatch-v2?type=design&node-id=0%3A1&mode=design&t=DjYF73dVE9Q9ZTbR-1](https://www.figma.com/file/OkRMzY85ORjBxoHZ83Agv4/%EB%A7%88%EC%A4%91%EA%B8%80(Meet-writing)?type=design&node-id=140%3A122&mode=design&t=xIIrvRBjUgKFPnAJ-1)https://www.figma.com/file/OkRMzY85ORjBxoHZ83Agv4/%EB%A7%88%EC%A4%91%EA%B8%80(Meet-writing)?type=design&node-id=140%3A122&mode=design&t=xIIrvRBjUgKFPnAJ-1)

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

### 랜덤 무한 스크롤
- 사용자의 체류 시간을 늘리기 위해 매번 랜덤한 글을 보여줍니다.
- Firebase에는 랜덤 관련 기능이 없기에 직접 구현하였습니다.
  - 각 포스트마다 1~10000 사이의 랜덤 숫자를 총 5개 설정합니다.
  - 해당 5개 중에 하나를 선택하고, 오름차순 또는 내림차순 둘 중 하나를 선택합니다.
  - 커서를 기준으로 페이지 사이즈에 맞게 잘라내고, Fisher-Yates shuffle 알고리즘을 통해 섞은 목록을 반환합니다.
  - 결과적으로 0.00000276%의 확률로 순서가 같은 포스트를 볼 수 있어 무작위성을 보장합니다.

### Optimistic UI
- 서버리스의 특성상 네트워크를 통해 DB를 조회하므로 서버 상태와 네트워크 상태에 따라 딜레이가 다소 길어질 수 있습니다.
- 이로 인해 사용자의 액션 후 UI Feedback까지 간극이 생기게 되고, UX 경험에 부정적인 영향을 끼치게 됩니다.
- 하나의 어플리케이션처럼 동작하게 만든 마중글 서비스에서는 부드러운 UX 경험이 중요하다고 생각했습니다.
- 따라서, 서버에 보낸 요청이 성공할 것임을 전제하고 UI를 먼저 업데이트하는 Optimistic UI를 React Query를 사용하여 적용하였습니다.
