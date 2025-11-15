import ImageScale from './ImageScale';
import ChoiceList from './ChoiceList';
import TextAnswer from './TextAnswer';
import { Question } from '@/lib/types';
import { useState } from 'react';

interface AnswerProps {
  question: Question;
  answer?: string;
  onAnswer: (v: string) => void;
}

export default function Answer({ question, answer, onAnswer }: AnswerProps) {
  const [selected, setSelected] = useState<string[]>([]);

  // 이미지 척도
  if (question.questionId === 1 || question.questionId === 2) {
    return (
      <ImageScale
        question={question}
        selected={selected}
        onSelect={setSelected}
      />
    );
  }

  // 텍스트 응답
  if (!question.choices) {
    return <TextAnswer value={answer || ''} onChange={onAnswer} />;
  }

  // 선택형
  return (
    <ChoiceList
      choices={question.choices}
      selected={answer}
      onSelect={onAnswer}
    />
  );
}
