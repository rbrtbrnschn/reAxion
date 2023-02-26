interface Props extends React.HTMLAttributes<HTMLDivElement> {
  color: string;
}
export const Animation = ({ color, className, ...props }: Props) => (
  <div className={`flex-grow-[1] ${color} ${className}`} {...props}></div>
);
