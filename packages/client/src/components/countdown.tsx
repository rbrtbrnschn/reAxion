interface Props extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
}
export const Countdown = ({ value, className, ...props }: Props) => {
  return (
    <span className={"countdown font-mono text-6xl " + className} {...props}>
      {/*@ts-ignore*/}
      <span style={{ "--value": value }}></span>
    </span>
  );
};
