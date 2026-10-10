// Displays the 4 community stats as compact colored numbers.
// Order: Questions (blue), Answers (orange), Helpful (rose), Friends (green).
export default function UserStats({ stats }) {
  const values = [
    { value: stats?.questions, color: "text-primary" },
    { value: stats?.answers, color: "text-orange-500" },
    { value: stats?.helpful, color: "text-rose-500" },
    { value: stats?.friends, color: "text-emerald-500" },
  ];
  return (
    <div className="flex items-center gap-2.5 text-sm font-bold tabular-nums">
      {values.map((v, i) => (
        <span key={i} className={v.color}>
          {v.value ?? 0}
        </span>
      ))}
    </div>
  );
}