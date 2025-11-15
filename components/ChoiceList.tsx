/**
 * 선택형 답변 : Q3, Q5, Q7, Q8, Q9
 */

interface Props {
  choices: string[];
  selected?: string;
  onSelect: (v: string) => void;
}

export default function ChoiceList({ choices, selected, onSelect }: Props) {
  return (
    <div className="space-y-3">
      {choices.map(choice => (
        <button
          key={choice}
          onClick={() => onSelect(choice)}
          className={`w-full p-3 rounded-lg border-2 font-[MeetMe] text-xl ${
            selected === choice
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          {choice}
        </button>
      ))}
    </div>
  );
}
