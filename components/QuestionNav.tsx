interface QuestionNavProps {
  currentIndex: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export default function QuestionNav({
  currentIndex,
  total,
  onPrevious,
  onNext,
  onSubmit,
}: QuestionNavProps) {
  const isLast = currentIndex === total - 1;

  return (
    <div className="w-full bg-white px-4 pb-4">
      <div className="w-full max-w-[375px] mx-auto">

        {/* 이전 / 다음/제출 버튼 */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className={`w-22 py-3 rounded-full font-[MeetMe] text-2xl
              ${
                currentIndex === 0
                  ? 'bg-gray-200 text-gray-400 border-gray-200'
                  : 'bg-gray-300 text-black hover:brightness-95'
              }`}
          >
            이전
          </button>

          {isLast ? (
            <button
              onClick={onSubmit}
              className="w-22 py-3 rounded-full bg-blue-500 text-white font-[MeetMe] text-2xl hover:brightness-95"
            >
              제출
            </button>
          ) : (
            <button
              onClick={onNext}
              className="w-22 py-3 rounded-full font-[MeetMe] text-2xl text-white hover:brightness-95"
              style={{ backgroundColor: '#FF6F00' }}
            >
              다음
            </button>
          )}
        </div>
      </div>
    </div>
  );
}