interface Props
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onClick"> {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
export const GameInput = ({ onClick, ...props }: Props) => {
  return (
    <div className="form-control">
      <label className="input-group">
        <input
          type="number"
          placeholder="0.01"
          className="input input-bordered w-full"
          {...props}
        />
        <button className="btn" onClick={onClick}>
          Guess
        </button>
      </label>
    </div>
  );
};
