type Props = React.HTMLAttributes<HTMLDivElement>;

export const AnimationContent = ({ className, ...props }: Props) => (
  <div className={`flex-grow-[1] ${className}`} {...props}></div>
);
