interface AlertButton {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
interface Props extends React.HTMLAttributes<HTMLDivElement> {
  message: string;
  buttons?: [AlertButton] | [AlertButton, AlertButton];
}
export const Alert = ({ message, buttons, ...props }: Props) => {
  const Buttons = buttons && (
    <div className="flex-none">
      {buttons.length >= 1 && (
        <button className="btn btn-sm btn-ghost" onClick={buttons[0].onClick}>
          {buttons[0].label}
        </button>
      )}
      {buttons.length == 2 && (
        <button className="btn btn-sm btn-primary" onClick={buttons[1].onClick}>
          {buttons[1].label}
        </button>
      )}
    </div>
  );
  return (
    <div className="alert shadow-lg" {...props}>
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-info flex-shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>{message} </span>
      </div>
      {Buttons}
    </div>
  );
};
