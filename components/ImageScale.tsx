/**
 * 척도형 답변 (이미지 버튼) : Q1, Q2
 */

import { Question } from '@/lib/types';

interface Props {
  question: Question;
  selected?: string[]; // 여러 개 선택 가능
  onSelect: (values: string[]) => void;
}

export default function ImageScale({ question, selected = [], onSelect }: Props) {
  const num = question.questionId;

  const handleClick = (value: string) => {
    if (selected.includes(value)) {
      // 이미 선택된 값이면 취소
      onSelect(selected.filter((v) => v !== value));
    } else {
      // 선택 추가
      onSelect([...selected, value]);
    }
  };

  return (
    <div className="flex flex-col">
        <div className="flex justify-center">
            <p className="font-[MeetMe] text-lg" style={{ color: "#FF6F00" }}>※ 해당하는 만큼 눌러주세요! ※</p>
        </div>
      {[0, 5].map((row) => (
        <div key={row} className="flex justify-center gap-3">
          {Array.from({ length: 5 }, (_, i) => {
            const value = String(row + i + 1);
            const isSelected = selected.includes(value);

            const img = isSelected
              ? `/images/question-${num}/filled.png`
              : `/images/question-${num}/default.png`;

            return (
              <button
                key={value}
                onClick={() => handleClick(value)}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <img src={img} alt={`선택 ${value}`} />
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
