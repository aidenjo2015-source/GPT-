const KAKAO_CHANNEL_URL = "https://pf.kakao.com/";

const quizData = [
  {
    question: "현재 영어 수준은?",
    options: [
      { label: "초급", score: "A" },
      { label: "중급", score: "B" },
      { label: "상급", score: "B" },
    ],
  },
  {
    question: "캠프 목표는?",
    options: [
      { label: "회화 자신감", score: "A" },
      { label: "시험 대비", score: "B" },
      { label: "종합 성장", score: "C" },
    ],
  },
  {
    question: "예산 범위는?",
    options: [
      { label: "저가", score: "C" },
      { label: "중간", score: "A" },
      { label: "프리미엄", score: "B" },
    ],
  },
  {
    question: "캠프 기간은?",
    options: [
      { label: "2주", score: "C" },
      { label: "4주", score: "A" },
      { label: "8주 이상", score: "B" },
    ],
  },
  {
    question: "학습 강도 선호는?",
    options: [
      { label: "강도 높음", score: "B" },
      { label: "보통", score: "C" },
      { label: "체험 중심", score: "A" },
    ],
  },
  {
    question: "숙소 선호는?",
    options: [
      { label: "기숙사", score: "B" },
      { label: "가정형", score: "A" },
      { label: "무관", score: "C" },
    ],
  },
];

const resultProfiles = {
  A: {
    title: "A형: 스피킹 집중형",
    summary:
      "회화 자신감과 말문 트기를 최우선으로 하는 유형입니다. 1:1 수업 비중이 높은 프로그램을 추천드립니다.",
    agencies: [
      {
        name: "스피킹 부스터 캠프",
        detail: "1:1 회화 비중 70%, 일상 표현 교정 중심",
      },
      {
        name: "라이브 토크 집중 과정",
        detail: "발음/억양 교정 + 실전 롤플레이",
      },
      {
        name: "스피킹 스타트 캠프",
        detail: "초급 맞춤 커리큘럼 + 생활 케어 강화",
      },
    ],
  },
  B: {
    title: "B형: 학습 몰입형",
    summary:
      "성적 향상과 시험 대비를 중요하게 생각하는 유형입니다. 구조화된 커리큘럼을 추천드립니다.",
    agencies: [
      {
        name: "아카데믹 집중 캠프",
        detail: "레벨 테스트 기반 분반 + 데일리 과제",
      },
      {
        name: "테스트 점프 과정",
        detail: "모의 테스트/피드백 루프 포함",
      },
      {
        name: "하이퍼 스터디 캠프",
        detail: "하루 학습량 상위, 코칭 중심 관리",
      },
    ],
  },
  C: {
    title: "C형: 밸런스형",
    summary:
      "학습과 체험의 균형을 원하는 유형입니다. 처음 캠프에 추천드리는 형태입니다.",
    agencies: [
      {
        name: "올라운드 체험형",
        detail: "체험 프로그램 포함 + 학습 강도 중간",
      },
      {
        name: "밸런스 코스",
        detail: "회화/독해/체험 균형 구성",
      },
      {
        name: "퍼스트 캠프",
        detail: "초보자 적응 프로그램 + 생활 케어",
      },
    ],
  },
};

const quiz = document.querySelector("[data-quiz]");
const progress = document.querySelector("[data-quiz-progress]");
const questionEl = document.querySelector("[data-quiz-question]");
const optionsEl = document.querySelector("[data-quiz-options]");
const prevBtn = document.querySelector("[data-quiz-prev]");
const nextBtn = document.querySelector("[data-quiz-next]");
const resultBox = document.querySelector("[data-quiz-result]");
const resultTitle = document.querySelector("[data-result-title]");
const resultSummary = document.querySelector("[data-result-summary]");
const resultCards = document.querySelector("[data-result-cards]");
const progressBar = document.querySelector("[data-quiz-bar]");
const restartBtn = document.querySelector("[data-quiz-restart]");
const kakaoLinks = document.querySelectorAll("[data-kakao-link]");

let currentIndex = 0;
const answers = Array(quizData.length).fill(null);

const renderQuestion = () => {
  const current = quizData[currentIndex];
  progress.textContent = `${currentIndex + 1} / ${quizData.length}`;
  if (progressBar) {
    progressBar.style.width = `${((currentIndex + 1) / quizData.length) * 100}%`;
  }
  questionEl.textContent = current.question;
  optionsEl.innerHTML = "";

  current.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = option.label;
    btn.className = answers[currentIndex] === index ? "selected" : "";
    btn.addEventListener("click", () => {
      answers[currentIndex] = index;
      renderQuestion();
    });
    optionsEl.appendChild(btn);
  });

  prevBtn.disabled = currentIndex === 0;
  nextBtn.textContent = currentIndex === quizData.length - 1 ? "결과 보기" : "다음";
};

const resetQuiz = () => {
  currentIndex = 0;
  answers.fill(null);
  quiz.hidden = false;
  resultBox.hidden = true;
  renderQuestion();
};

const calculateResult = () => {
  const tally = { A: 0, B: 0, C: 0 };
  answers.forEach((answer, index) => {
    if (answer === null) return;
    const score = quizData[index].options[answer].score;
    tally[score] += 1;
  });

  return Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0];
};

const renderResult = (type) => {
  const profile = resultProfiles[type];
  resultTitle.textContent = profile.title;
  resultSummary.textContent = profile.summary;
  resultCards.innerHTML = "";

  profile.agencies.forEach((agency) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `<h4>${agency.name}</h4><p>${agency.detail}</p>`;
    resultCards.appendChild(card);
  });

  quiz.hidden = true;
  resultBox.hidden = false;
  resultBox.scrollIntoView({ behavior: "smooth" });
};

prevBtn.addEventListener("click", () => {
  if (currentIndex === 0) return;
  currentIndex -= 1;
  renderQuestion();
});

nextBtn.addEventListener("click", () => {
  if (answers[currentIndex] === null) {
    alert("선택지를 골라주세요.");
    return;
  }

  if (currentIndex < quizData.length - 1) {
    currentIndex += 1;
    renderQuestion();
  } else {
    const type = calculateResult();
    renderResult(type);
  }
});

restartBtn?.addEventListener("click", resetQuiz);

renderQuestion();

kakaoLinks.forEach((link) => {
  link.href = KAKAO_CHANNEL_URL;
  link.target = "_blank";
  link.rel = "noreferrer";
});
