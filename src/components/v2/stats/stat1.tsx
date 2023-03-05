interface Props {
  title: string;
  number: string;
  label: string;
}
export const Stat1 = ({ title, number, label, ...props }: Props) => {
  return (
    <div className="stats shadow w-full">
      <div className="stat">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{number}</div>
        <div className="stat-desc">{label}</div>
      </div>
    </div>
  );
};
