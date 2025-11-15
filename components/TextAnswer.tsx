/**
 * 주관식 답변 : Q4, Q6
 */

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function TextAnswer({ value, onChange }: Props) {
  return (
    <div className="flex justify-center">
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="아기사자가 궁금해..."
          className="w-70 p-3 rounded-xl border border-gray-300 font-[Pretendard]"
        />
    </div>
  );
}