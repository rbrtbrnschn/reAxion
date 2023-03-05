import { forwardRef } from "react";

interface Props
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onClick"> {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const GameInput = forwardRef<HTMLInputElement, Props>(
  ({ onClick, ...props }, ref) => {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onClick(null as any);
        }}
        className="w-full"
      >
        <input
          type="number"
          placeholder="Input your guess in ms..."
          className="input input-bordered w-full "
          ref={ref}
          {...props}
        />
      </form>
    );
  }
);
