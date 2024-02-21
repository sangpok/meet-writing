import { Post } from '@Type/Model';
import { InfiniteResponse } from '@Type/Response';
import { InfiniteData } from '@tanstack/react-query';

const adjectives = [
  '가냘픈',
  '가는',
  '가엾은',
  '가파른',
  '같은',
  '거센',
  '거친',
  '건조한',
  '검은',
  '게으른',
  '게을러빠진',
  '게을러터진',
  '고달픈',
  '고른',
  '고마운',
  '고운',
  '고픈',
  '곧은',
  '괜찮은',
  '구석진',
  '굳은',
  '굵은',
  '귀여운',
  '그런',
  '그른',
  '그리운',
  '기다란',
  '기쁜',
  '긴',
  '깊은',
  '깎아지른',
  '깨끗한',
  '나쁜',
  '나은',
  '난데없는',
  '날랜',
  '날카로운',
  '낮은',
  '너그러운',
  '너른',
  '널따란',
  '넓은',
  '네모난',
  '노란',
  '높은',
  '누런',
  '눅은',
  '느닷없는',
  '느린',
  '늦은',
  '다른',
  '더러운',
  '더운',
  '덜된',
  '돈',
  '동그란',
  '돼먹잖은',
  '된',
  '둥그런',
  '둥근',
  '뒤늦은',
  '드문',
  '딱한',
  '때늦은',
  '뛰어난',
  '뜨거운',
  '막다른',
  '막중한',
  '많은',
  '매운',
  '먼',
  '멋진',
  '메마른',
  '메스꺼운',
  '모난',
  '못난',
  '못된',
  '못생긴',
  '무거운',
  '무딘',
  '무른',
  '무서운',
  '미끈미끈한',
  '미운',
  '미친',
  '바람직스러운',
  '반가운',
  '밝은',
  '밤늦은',
  '보드라운',
  '보람찬',
  '보잘것없는',
  '부드러운',
  '부른',
  '붉은',
  '비싼',
  '빠른',
  '빨간',
  '뻘건',
  '뼈저린',
  '뽀얀',
  '뿌연',
  '새로운',
  '서툰',
  '섣부른',
  '설운',
  '성가신',
  '센',
  '수다스러운',
  '수줍은',
  '쉬운',
  '스스러운',
  '슬픈',
  '시원찮은',
  '싫은',
  '싼',
  '쌀쌀맞은',
  '쏜살같은',
  '쓰디쓴',
  '쓰린',
  '쓴',
  '아니꼬운',
  '아닌',
  '아름다운',
  '아쉬운',
  '아픈',
  '안된',
  '안쓰러운',
  '안타까운',
  '않은',
  '알맞은',
  '약빠른',
  '약은',
  '얇은',
  '얕은',
  '어두운',
  '어려운',
  '어린',
  '언짢은',
  '엄청난',
  '없는',
  '여문',
  '열띤',
  '예쁜',
  '올바른',
  '옳은',
  '외로운',
  '우스운',
  '의심쩍은',
  '이른',
  '익은',
  '있는',
  '작은',
  '잘난',
  '잘빠진',
  '재미있는',
  '적은',
  '젊은',
  '점잖은',
  '조그만',
  '좁은',
  '좋은',
  '주제넘은',
  '줄기찬',
  '즐거운',
  '지나친',
  '지혜로운',
  '질긴',
  '짓궂은',
  '짙은',
  '짠',
  '짧은',
  '케케묵은',
  '큰',
  '탐스러운',
  '턱없는',
  '푸른',
  '하나같은',
  '한결같은',
  '흐린',
  '희망찬',
  '흰',
  '힘겨운',
  '힘찬',
];

const nouns = [
  '강아지',
  '개',
  '검은담비',
  '고라니',
  '고래',
  '고리무늬물범',
  '고릴라',
  '고슴도치',
  '고양이',
  '곰',
  '괴',
  '기니피그',
  '기린',
  '나귀',
  '나무늘보',
  '낙타',
  '너구리',
  '노루',
  '노새',
  '뉴트리아',
  '늑대',
  '능소니',
  '다람쥐',
  '단봉낙타',
  '담비',
  '당나귀',
  '돌고래',
  '돼지',
  '두더지',
  '들고양이',
  '라마',
  '락타',
  '마르모트',
  '말',
  '망아지',
  '매머드',
  '맥',
  '멧돼지',
  '몰티즈',
  '물개',
  '미국너구리',
  '미어캣',
  '바다코끼리',
  '바다표범',
  '바위담비',
  '박쥐',
  '반달곰',
  '백두산호랑이',
  '버새',
  '범고래',
  '북극곰',
  '북극여우',
  '불도그',
  '불여우',
  '비버',
  '빈양',
  '사냥개',
  '사슴',
  '사이가',
  '사이가산양',
  '사자',
  '산토끼',
  '살쾡이',
  '삵',
  '삽살개',
  '생쥐',
  '서벌',
  '성우',
  '셰퍼드',
  '소',
  '송아지',
  '수고양이',
  '수달',
  '수사슴',
  '순록',
  '스라소니',
  '스컹크',
  '스피츠',
  '승냥이',
  '시궁쥐',
  '시베리아호랑이',
  '쌍봉낙타',
  '아르마딜로',
  '아메리카들소',
  '아무르표범',
  '아시아코끼리',
  '안경곰',
  '안주애기박쥐',
  '알파카',
  '암곰',
  '암사슴',
  '앙고라',
  '야마',
  '양',
  '얼룩말',
  '얼룩소',
  '여우',
  '염소',
  '영양',
  '오리너구리',
  '오소리',
  '요크셔테리어',
  '워터벅',
  '원숭이',
  '웜뱃',
  '유럽소나무담비',
  '이리',
  '인도상',
  '일각고래',
  '자칼',
  '재규어',
  '쥐',
  '진돗개',
  '집쥐',
  '차우차우',
  '천산갑',
  '청서',
  '청설모',
  '초서',
  '치와와',
  '치타',
  '친칠라',
  '침팬지',
  '캥거루',
  '코끼리',
  '코뿔소',
  '코알라',
  '토끼',
  '토황마',
  '판다',
  '표범',
  '푸들',
  '풍산개',
  '하늘다람쥐',
  '하마',
  '하이에나',
  '하프물범',
  '한국호랑이',
  '해달',
  '햄스터',
  '호랑이',
  '황소',
];

export const getRandomNickname = () => {
  const indicatorA = Math.floor(Math.random() * adjectives.length);
  const indicatorB = Math.floor(Math.random() * nouns.length);

  return `${adjectives[indicatorA]} ${nouns[indicatorB]}`;
};

export const getFormattedDate = (timestamp: Date) => {
  return new Intl.DateTimeFormat('ko-KR', { dateStyle: 'long' }).format(new Date(timestamp));
};

export const getHourLabel = (hour: number) => {
  const isDawn = 0 <= hour && hour <= 6;
  const isMorning = 7 <= hour && hour <= 10;
  const isLunch = 11 <= hour && hour <= 13;
  const isAfternoon = 14 <= hour && hour <= 17;
  const isEvening = 18 <= hour && hour <= 20;
  const isNight = 21 <= hour && hour <= 23;

  return (
    (isDawn && '새벽') ||
    (isMorning && '아침') ||
    (isLunch && '점심') ||
    (isAfternoon && '낮') ||
    (isEvening && '저녁') ||
    (isNight && '밤')
  );
};

export const validateEmail = (email: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const getTextWidth = (text: string, baseElement: Element) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  context.font = getComputedStyle(baseElement).font;

  return context.measureText(text).width;
};

export const shuffle = <T>(array: T[]) => {
  const tmpArray = [...array];

  for (let i = tmpArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tmpArray[i], tmpArray[j]] = [tmpArray[j], tmpArray[i]];
  }

  return tmpArray;
};

export const changeRootFontSize = (fontSize: string) => {
  const htmlElement = document.querySelector('html')!;
  htmlElement.style.fontSize = fontSize;
};

export const getCurrentPostId = () => {
  const targetPost = document
    .elementFromPoint(window.innerWidth / 2, innerHeight / 2)!
    .closest('[data-pid]')! as HTMLDivElement;

  return targetPost.dataset.pid!;
};

export const getPostById = (
  pages: InfiniteData<InfiniteResponse<Post[]>>['pages'],
  postId: string
) => {
  for (let i = 0; i < pages.length; i++) {
    for (let j = 0; j < pages[i].list.length; j++) {
      const targetPostId = pages[i].list[j].id;

      if (targetPostId === postId) {
        return pages[i].list[j];
      }
    }
  }

  return null;
};
