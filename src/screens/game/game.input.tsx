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
      >
        <div className="form-control">
          <label className="input-group">
            <input
              type="number"
              placeholder="0.01"
              className="input input-bordered w-full"
              ref={ref}
              {...props}
            />
          </label>
        </div>
      </form>
    );
  }
);
