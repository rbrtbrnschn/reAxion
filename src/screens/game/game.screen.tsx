import { RecursiveActions } from "easy-peasy";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { Alert, AlertProps } from "../../components/alert";
import { ColorsNames } from "../../interfaces/colors";
import { GuessStatus } from "../../interfaces/v2/guess.interface";
import { ReactionStatus } from "../../interfaces/v2/reaction.interface";
import { ReactionModel } from "../../store/v2/models/reaction.model";
import { useStoreActions, useStoreState } from "../../store/v3";
import { Reaction } from "../../store/v3/models/reaction.model";
import { whenDebugging } from "../../utils/whenDebugging";

export const GameScreen = () => {
  const reactionState = useStoreState((state) => state.reaction);
  const _reactionState = useStoreActions((actions) => actions.reaction);
  const reaction = reactionState.reaction;

  const [guessInput, setGuessInput] = useState<number | undefined>();

  const alertProps = useMemo(
    () => calcAlertProps(reaction),
    [reaction?.guessStatus, reaction?.reactionStatus]
  );
  const animationColor = useMemo(
    () => calcColor(reaction),
    [reaction?.reactionStatus]
  );

  if (!reaction) return <div>Loading...</div>;

  /* Animation */
  function runAnimation(
    reaction: Reaction | null,
    reactionActions: RecursiveActions<ReactionModel>
  ) {
    setTimeout(() => {
      reactionActions.setReactionStatus(ReactionStatus.IS_OVER);
    }, reaction?.duration ?? 0);
  }

  /* Handlers */
  function handleReady(e: React.MouseEvent<HTMLButtonElement>) {
    const reactionNotOver =
      reactionState.reaction?.reactionStatus !== ReactionStatus.IS_OVER;
    if (reactionNotOver) {
      _reactionState.setReactionStatus(ReactionStatus.IS_IN_PROGRESS);
      runAnimation(reaction, _reactionState as any);
      return;
    }

    _reactionState.setReaction({
      duration: 2000,
      guesses: [],
      guessStatus: GuessStatus.IS_WAITING,
      isGuessed: false,
      reactionStatus: ReactionStatus.HAS_NOT_STARTED,
    });
  }

  function handleSubmitGuess(e: React.MouseEvent<HTMLButtonElement>) {
    if (!guessInput) return;
    if (reaction?.isGuessed) return;

    _reactionState.addGuess(guessInput);
    setGuessInput(undefined);
  }
  function handleChangeGuess(e: React.ChangeEvent<HTMLInputElement>) {
    setGuessInput(parseInt(e.currentTarget.value || "0"));
  }

  return (
    <Screen id="game-screen">
      <Alert {...alertProps} />
      <Flex>
        <Animation color={animationColor} id="animation" />
        <Form
          onClick={{
            button1: handleSubmitGuess,
            button2: handleReady,
          }}
          onChange={handleChangeGuess}
          value={guessInput}
          buttonText={reaction.isGuessed ? "Next" : "Ready"}
        />
      </Flex>
    </Screen>
  );
};

const Screen = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

/**
 * Calculates `background-color` from reaction.
 * @param reaction {Reaction | null}
 * @returns tw className in format bg-`{color}`-500 for colors **fuchsia**, **red**, **orange**, **green**
 */
const calcColor = (reaction: Reaction | null): string => {
  let color = "bg-fuchsia-500";
  switch (reaction?.reactionStatus) {
    case ReactionStatus.HAS_NOT_STARTED:
      color = "bg-red-500";
      break;
    case ReactionStatus.IS_IN_PROGRESS:
      color = "bg-orange-500";
      break;
    case ReactionStatus.IS_OVER:
      color = "bg-green-500";
      break;
    default:
      color = whenDebugging("bg-fuchsia-500", "" as ColorsNames);
      break;
  }
  return color;
};

/**
 * Calculates `color`, `title`, `description` for `<Alert />` component based on `reaction`
 * @param reaction {Reaction | null}
 * @returns {AlertProps}  props for `<Alert />` component
 */
const calcAlertProps = (reaction: Reaction | null): AlertProps => {
  let props: AlertProps = {
    color: "red",
    title: "",
    description: "",
  };
  switch (reaction?.reactionStatus) {
    case ReactionStatus.HAS_NOT_STARTED:
      props.color = "red";
      props.title = "Hit ready to start.";
      props.description = "";
      break;
    case ReactionStatus.IS_IN_PROGRESS:
      props.color = "orange";
      props.title = "In progress.";
      props.description = "";
      break;
    case ReactionStatus.IS_OVER:
      switch (reaction?.guessStatus) {
        case GuessStatus.IS_RIGHT:
          props.color = "green";
          props.title = "You won";
          props.description = "";
          break;
        case GuessStatus.IS_TOO_HIGH:
          props.color = "red";
          props.title = "Wrong. Take another guess.";
          props.description = "Hint: too high";
          break;
        case GuessStatus.IS_TOO_LOW:
          props.color = "red";
          props.title = "Wrong. Take another guess.";
          props.description = "Hint: too low";
          break;
        case GuessStatus.IS_WAITING:
          props.color = "orange";
          props.title = "Waiting for guess";
          props.description = "";
          break;
        default:
          props.color = "fuchsia";
          props.title = whenDebugging("Default switch.guessStatus", "");
          props.description = whenDebugging("Default switch.guessStatus", "");
          break;
      }
      break;
    default:
      props.color = "fuchsia";
      props.title = whenDebugging("Default switch.reactionStatus", "");
      props.description = whenDebugging("Default switch.reactionStatus", "");
  }
  return props;
};

interface AnimationProps extends React.HTMLAttributes<HTMLDivElement> {
  color: string;
}
const Animation = ({ color, className, ...props }: AnimationProps) => (
  <div className={`flex-grow-[1] ${color} ${className}`} {...props}></div>
);

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

type ReadyOrNext = "Ready" | "Next";

interface FormProps
  extends Omit<React.HTMLAttributes<HTMLFormElement>, "onClick" | "onChange"> {
  onClick: {
    button1: (e: React.MouseEvent<HTMLButtonElement>) => void;
    button2: (e: React.MouseEvent<HTMLButtonElement>) => void;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: number;
  buttonText: ReadyOrNext;
}
const Form = ({
  onSubmit,
  onClick,
  onChange,
  value,
  buttonText,
}: FormProps) => (
  <form className="w-full bg-white" onSubmit={onSubmit}>
    <div className="flex items-center border-b border-teal-500 py-2">
      <input
        className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
        type="number"
        placeholder="guess in ms"
        aria-label="Full name"
        value={value}
        onChange={onChange}
      />
      <button
        className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
        type="button"
        onClick={onClick.button1}
      >
        Guess
      </button>

      <button
        className="flex-shrink-0 border-transparent border-4 text-teal-500 hover:text-teal-800 text-sm py-1 px-2 rounded"
        type="button"
        onClick={onClick.button2}
      >
        {buttonText}
      </button>
    </div>
  </form>
);
