import { Heart } from "heroicons-react";
import { forwardRef } from "react";
import styled from "styled-components";
interface Props
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onClick"> {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  lifes: number;
}

export const GameInput = forwardRef<HTMLInputElement, Props>(
  ({ onClick, lifes, ...props }, ref) => {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onClick(null as any);
        }}
        className="w-full"
      >
        <div className="form-control">
          <div className="input-group">
            <input
              type="number"
              placeholder="Input your guess in ms..."
              className="input input-bordered w-full "
              ref={ref}
              {...props}
            />
            <span>
              {lifes}
              <MyHeartOutline />
            </span>
          </div>
        </div>
      </form>
    );
  }
);

const MyHeartOutline = styled(Heart)`
  & {
    width: 22px;
    height: 22px;
  }
`;
