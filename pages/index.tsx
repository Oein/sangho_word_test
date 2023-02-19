import { Dispatch, SetStateAction, useState } from "react";

function shuffle(array: any[]) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

const Step1 = ({
  stred,
  setStred,
  onDone,
}: {
  stred: string;
  setStred: Dispatch<SetStateAction<string>>;
  onDone: () => void;
}) => {
  let [errored, setErrored] = useState("");

  return (
    <>
      <header>
        <h1>암기하자</h1>
        <h5>영어 단어 리스트를 JSON 으로 입력해야 뻬엑</h5>
      </header>
      <main>
        <textarea
          style={{
            width: "100%",
            marginLeft: "auto",
            marginRight: "auto",
            height: "500px",
          }}
          onChange={(e) => {
            setStred(e.target.value.replace(/'/g, '"'));
            try {
              let jsoned = JSON.parse(e.target.value.replace(/'/g, '"'));
              setStred(JSON.stringify(jsoned, null, 2));
              setErrored("");
            } catch (e: any) {
              setErrored(e.message || e.toString() || "");
            }
          }}
          value={stred}
        ></textarea>
        {errored.length > 0 ? (
          <div
            style={{
              color: "tomato",
            }}
          >
            Error! {errored}
          </div>
        ) : null}
        <button
          disabled={errored.length > 0}
          onClick={onDone}
          style={{
            width: "100%",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          다음
        </button>
      </main>
    </>
  );
};

const Prob = ({
  title,
  ans,
  chajum,
  num,
}: {
  title: string;
  ans: string;
  chajum: boolean;
  num: number;
}) => {
  let [v, setV] = useState("");
  return (
    <div>
      <h1>
        {chajum ? (
          <div
            style={{
              display: "inline-block",
              color: v == ans ? "green" : "tomato",
            }}
          >
            [{v == ans ? "O" : "X"}]
          </div>
        ) : null}{" "}
        {num}. {title}
      </h1>
      <input
        placeholder="정답을 입력해 주세요"
        value={v}
        onChange={(e) => {
          setV(e.target.value);
        }}
      ></input>
      {v != ans && chajum ? (
        <div
          style={{
            color: "tomato",
          }}
        >
          정답은 &apos;{ans}&apos; 인데요!
        </div>
      ) : null}
    </div>
  );
};

export default function Home() {
  let [step, setStep] = useState(0);
  let [cha, setCha] = useState(false);
  let [stred, setStred] = useState(
    JSON.stringify(
      [
        {
          prob: "banana",
          ans: "바나나",
        },
        {
          prob: "apple",
          ans: "사과",
        },
        {
          ans: "orange",
          prob: "오렌지",
        },
      ],
      null,
      2
    )
  );
  const onDone = () => {
    setStep(1);
    setStred((g) =>
      JSON.stringify(
        shuffle(JSON.parse(g)).map((g) => {
          return {
            eng: g.prob,
            kor: g.ans,
          };
        })
      )
    );
  };
  return (
    <>
      {step == 0 ? (
        <Step1 stred={stred} setStred={setStred} onDone={onDone} />
      ) : step == 1 ? (
        <div>
          <header>
            <h1>시험보자</h1>
            <h5>잘해라 뻬엑</h5>
          </header>
          {(JSON.parse(stred) as { kor: string; eng: string }[]).map((e, i) => (
            <Prob key={i} ans={e.kor} title={e.eng} chajum={cha} num={i + 1} />
          ))}
          <button
            onClick={() => {
              setCha((e) => !e);
            }}
          >
            {cha ? "체점 숨기기" : "체점"}
          </button>
        </div>
      ) : null}
    </>
  );
}
