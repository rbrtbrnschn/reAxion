interface Props
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onClick"> {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
export const GameInput = ({ onClick, ...props }: Props) => {
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
            {...props}
          />
        </label>
      </div>
    </form>
  );
};
