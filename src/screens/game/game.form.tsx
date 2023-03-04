type ReadyOrNext = "Ready" | "Next";

interface Props
  extends Omit<React.HTMLAttributes<HTMLFormElement>, "onClick" | "onChange"> {
  onClick: {
    button1: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    button2: (e: React.MouseEvent<HTMLButtonElement>) => void;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: number;
  buttonText: ReadyOrNext;
}
export const Form = ({ onClick, onChange, value, buttonText }: Props) => (
  <form
    className="absolute w-3/5 bottom-10 left-1/2 bg-white -translate-x-[50%] m-auto px-5 rounded-full shadow-lg"
    onSubmit={(e) => {
      e.preventDefault();
      onClick.button1();
    }}
  >
    <div className="flex items-center pt-4 mb-5 w-full">
      <input
        className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
        type="number"
        placeholder="guess in ms"
        aria-label="Full name"
        value={value}
        onChange={onChange}
      />
      <button
        className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white w-20 py-1 px-2 rounded"
        type="button"
        onClick={onClick.button1}
      >
        Guess
      </button>

      <button
        className="flex-shrink-0 border-teal-500 border-2 text-teal-500 hover:bg-teal-100 text-sm w-20 py-1.5 px-2 ml-2 rounded"
        type="button"
        onClick={onClick.button2}
      >
        {buttonText}
      </button>
    </div>
  </form>
);
