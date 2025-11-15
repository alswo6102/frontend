'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ScaleQuestionProps {
  questionId: number;
  questionText: string;
  questionFolder: string;
  onAnswer: (value: number) => void;
  initialValue?: number;
}

export default function ScaleQuestion({ 
  questionId, 
  questionText, 
  questionFolder,
  onAnswer, 
  initialValue = 0 
}: ScaleQuestionProps) {
  const [selectedValue, setSelectedValue] = useState(initialValue);

  const handleSelect = (value: number) => {
    setSelectedValue(value);
    onAnswer(value);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="relative w-full h-[300px]">
        <Image
          src="/images/laptop.png"
          alt="laptop background"
          fill
          className="object-contain object-center"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center px-8">
          <p className="font-[MeetMe] text-[22px] text-center text-black leading-relaxed">
            {questionText}
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap justify-center max-w-2xl">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <button
            key={num}
            onClick={() => handleSelect(num)}
            className="relative w-12 h-12 transition-transform duration-200 active:scale-90 hover:scale-110"
          >
            <Image
              src={selectedValue === num 
                ? `/images/${questionFolder}/filled.png` 
                : `/images/${questionFolder}/default.png`
              }
              alt={`${num}`}
              fill
              className="object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
