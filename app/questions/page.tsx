'use client';

import { useEffect, useState } from 'react';
import { getQuestions } from '@/lib/api';
import { Question } from '@/lib/types';
import ProgressRate from '@/components/ProgressRate';
import QuestionNav from '@/components/QuestionNav';
import Answer from '@/components/Answer';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const data = await getQuestions();
        setQuestions(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : '오류가 발생했습니다.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg">로딩 중...</div>
    );

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.questionId]: value,
    }));
  };

  return (
    <div className="flex flex-col w-full items-center bg-white">
      <div className="w-full max-w-[375px] flex flex-col justify-between" style={{ height: 'calc(100vh - var(--header-height))' }}>

        {/* 진행률 바 */}
        <ProgressRate current={currentIndex + 1} total={questions.length} />

        {/* laptop 이미지와 질문 텍스트 */}
        <div className="relative flex justify-center">
	      <img
		    src="/images/laptop.png"
		    alt="Laptop"
		    className="w-[320px]"
		  />
		  <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 text-center">
		    <h2 className="text-xl font-[MeetMe] text-black">
		  	  {currentQuestion.content}
		    </h2>
		  </div>
		</div>

		{/* 답변 UI */}
		<div className="px-5 py-2">
		  <Answer
		  question={currentQuestion}
		    answer={answers[currentQuestion.questionId]}
		    onAnswer={handleAnswer}
		  />
		</div>

        {/* 네비게이션 */}
        <QuestionNav
          currentIndex={currentIndex}
          total={questions.length}
          onPrevious={() => setCurrentIndex((i) => i - 1)}
          onNext={() => setCurrentIndex((i) => i + 1)}
          onSubmit={() => console.log('제출', answers)}
        />
      </div>
    </div>
  );
}
