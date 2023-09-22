export interface slideInfos {
  key: string;
  subText: string;
  title: string;
  description: string;
  background: string;
  bgColor: string;
}

export interface teamInfos {
  id: string;
  name: string;
  profile: string;
  part: string;
  mbti: string;
  desc: string;
  isLeader: boolean;
}

export const MAIN_SLIDES: slideInfos[] = [
  {
    key: "1",
    subText: "작은 텍스트1",
    title: "제목1 입니다!",
    description:
      "별에도 많은 위에 아이들의 어머니, 하나의 별을 나는 오면 버리었습니다.",
    background:
      "https://firebasestorage.googleapis.com/v0/b/fe3-wiki.appspot.com/o/main%2Fslide-bg01.jpg?alt=media&token=ae5158fd-83b5-407b-b818-8378e9b8561e",
    bgColor: "#6C63FF",
  },
  {
    key: "2",
    subText: "작은 텍스트2",
    title: "제목2 입니다!",
    description: "가난한 우는 가슴속에 새겨지는 까닭이요, 비둘기,",
    background:
      "https://firebasestorage.googleapis.com/v0/b/fe3-wiki.appspot.com/o/main%2Fslide-bg02.jpg?alt=media&token=764dc294-b608-4f94-a1a5-241bdb5524ca",
    bgColor: "#00b96b",
  },
  {
    key: "3",
    subText: "작은 텍스트3",
    title: "제목3 입니다!",
    description:
      "무덤 릴케 했던 있습니다. 이제 슬퍼하는 속의 시와 된 이름자 이름을 까닭입니다.",
    background:
      "https://firebasestorage.googleapis.com/v0/b/fe3-wiki.appspot.com/o/main%2Fslide-bg03.jpg?alt=media&token=bfa144f8-5126-4461-853c-3797580c063b",
    bgColor: "#0E21A0",
  },
];

export const TEAM3: teamInfos[] = [
  {
    id: "1",
    name: "박나영",
    profile:
      "https://firebasestorage.googleapis.com/v0/b/fe3-wiki.appspot.com/o/main%2F%EB%B0%95%EB%82%98%EC%98%81.jpeg?alt=media&token=3aafc118-153a-4323-977c-a90b92dbf168",
    part: "임직원 페이지 담당",
    mbti: "ISFP",
    desc: "잘 부탁드립니다 😎~!",
    isLeader: true,
  },
  {
    id: "2",
    name: "김미정",
    profile:
      "https://firebasestorage.googleapis.com/v0/b/fe3-wiki.appspot.com/o/main%2F%EA%B9%80%EB%AF%B8%EC%A0%95.jpg?alt=media&token=f534456b-600d-44de-b834-992e94e00076",
    part: "출퇴근 기록 페이지 담당",
    mbti: "INFJ",
    desc: "열심히 하겠습니다!!",
    isLeader: false,
  },
  {
    id: "3",
    name: "김성겸",
    profile:
      "https://firebasestorage.googleapis.com/v0/b/fe3-wiki.appspot.com/o/main%2F%EA%B9%80%EC%84%B1%EA%B2%B8.jpg?alt=media&token=f371b0f4-2e50-4069-9db3-da30320ed145",
    part: "프로젝트 페이지 담당",
    mbti: "ISFJ",
    desc: "어려움이 있으면 서로 공유해서 같이 해결해보아요!",
    isLeader: false,
  },
  {
    id: "4",
    name: "노욱진",
    profile:
      "https://firebasestorage.googleapis.com/v0/b/fe3-wiki.appspot.com/o/main%2F%E1%84%82%E1%85%A9%E1%84%8B%E1%85%AE%E1%86%A8%E1%84%8C%E1%85%B5%E1%86%AB.jpg?alt=media&token=f01bbe93-0263-457a-aeac-b3d657a5bfa4",
    part: "위키 페이지 담당",
    mbti: "ISFJ",
    desc: "열심히 해보겠습니다!",
    isLeader: false,
  },
  {
    id: "5",
    name: "진종수",
    profile:
      "https://firebasestorage.googleapis.com/v0/b/fe3-wiki.appspot.com/o/main%2F%EC%A7%84%EC%A2%85%EC%88%98.png?alt=media&token=06f11583-f2a7-450f-a275-92332677c94a",
    part: "로그인/회원가입 페이지 담당",
    mbti: "ESTJ",
    desc: "최선을 다하겠습니다! 잘 부탁드립니다!",
    isLeader: false,
  },
];
