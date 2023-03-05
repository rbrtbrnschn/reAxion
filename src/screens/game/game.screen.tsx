import classNames from "classnames";
import { RecursiveActions } from "easy-peasy";
import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { Alert } from "../../components/alert";
import { Countdown } from "../../components/countdown";
import { withNavigation } from "../../components/navigation";
import { GuessStatus } from "../../enums/guess.enum";
import { ReactionStatus } from "../../enums/reaction.enum";
import { useCountdown } from "../../hooks/useCountdown";
import { ColorsNames } from "../../interfaces/colors.interface";
import { IReaction } from "../../interfaces/reaction.interface";
import { useStoreActions, useStoreState } from "../../store";
import { ReactionModel } from "../../store/models/reaction.model";
import { ReactionBuilder } from "../../utils/reaction/Reaction.builder";
import { whenDebugging } from "../../utils/whenDebugging";
import { GameInput } from "./game.input";
import { GameoverModal } from "./gameover.modal";
/**
 * Calculates `background-color` from reaction.
 * @param reaction {IReaction | null}
 * @returns tw className in format bg-`{color}`-500 for colors **fuchsia**, **red**, **orange**, **green**
 */
const calcColor = (reaction: IReaction | null): string => {
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

type AlertProps = { color: string; title: string; description: string };
/**
 * Calculates `color`, `title`, `description` for `<Alert />` component based on `reaction`
 * @param reaction {IReaction | null}
 * @returns {AlertProps}  props for `<Alert />` component
 */
const calcAlertProps = (reaction: IReaction | null): AlertProps => {
  let props: AlertProps = {
    color: "red",
    title: "",
    description: "",
  };
  switch (reaction?.reactionStatus) {
    case ReactionStatus.HAS_NOT_STARTED:
      props.color = "red";
      props.title = "Get ready.";
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
          props.title = "Too high. Take another guess.";
          props.description = "Hint: too high";
          break;
        case GuessStatus.IS_TOO_LOW:
          props.color = "red";
          props.title = "Too low. Take another guess.";
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

/**
 * Initializes Reaction with random duration.
 */
function useInitializeRandomReaction(
  reaction: IReaction | null,
  actions: RecursiveActions<ReactionModel>
) {
  useEffect(() => {
    if (reaction) return;

    actions.setReaction(new ReactionBuilder().buildWithRandomDuration());
  }, [actions, reaction]);
}

const MyGameScreen = () => {
  function useToggleTimer() {
    useEffect(() => {
      if (timer === 0) {
        setShowTimer(false);
        setTimeout(() => {
          runAnimation(reaction, _reactionState);
        }, 1000);
      }
    }, [timer]);
  }

  function useAutomaticlyGenerateNewReactionOnSuccessfullGuess() {
    useEffect(() => {
      if (reaction?.isGuessed) handleGenerateNewReaction();
    }, [reaction?.isGuessed]);
  }

  function useFocusInput() {
    useEffect(() => {
      if (
        reaction?.reactionStatus === ReactionStatus.IS_OVER &&
        reaction.guessStatus === GuessStatus.IS_WAITING
      )
        inputRef.current?.focus();
    }, [reaction]);
  }

  const reactionState = useStoreState((state) => state.reaction);
  const _reactionState = useStoreActions((actions) => actions.reaction);
  const gameState = useStoreState((state) => state.game);
  const _gameState = useStoreActions((actions) => actions.game);

  const isGameOver = gameState.currentGameIsOver;
  const reaction = reactionState.reaction;
  const inputRef = useRef<HTMLInputElement>(null);

  const [showTimer, setShowTimer] = useState(true);
  const [guessInput, setGuessInput] = useState<string>("");
  const guessNumber = useMemo(() => {
    if (!guessInput) return 0;
    return parseInt(guessInput, 10);
  }, [guessInput]);

  const alertProps = useMemo(
    () => calcAlertProps(reaction),
    [reaction?.guessStatus, reaction?.reactionStatus]
  );
  const animationColor = useMemo(
    () => calcColor(reaction),
    [reaction?.reactionStatus]
  );

  /* Initialize */
  useInitializeRandomReaction(reaction, _reactionState);
  const { timer, reset } = useCountdown(3);
  useToggleTimer();
  useAutomaticlyGenerateNewReactionOnSuccessfullGuess();
  useFocusInput();

  useEffect(() => {
    if (isGameOver) return _gameState.reset();
  }, []);

  if (!reaction) return <div>Loading...</div>;

  /* Animation */
  function runAnimation(
    reaction: IReaction | null,
    reactionActions: RecursiveActions<ReactionModel>
  ) {
    _reactionState.setReactionStatus(ReactionStatus.IS_IN_PROGRESS);
    setTimeout(() => {
      reactionActions.setReactionStatus(ReactionStatus.IS_OVER);
    }, reaction?.duration ?? 0);
  }

  /* Handlers */
  function handleGenerateNewReaction() {
    const newReaction = new ReactionBuilder().buildWithRandomDuration();
    _reactionState.setReaction({
      ...newReaction,
    });
    reset();
    setShowTimer(true);
  }

  function handleSubmitGuess(e?: React.MouseEvent<HTMLButtonElement>) {
    if (!guessInput) return;
    if (reaction?.isGuessed) return;
    if (reaction?.reactionStatus !== ReactionStatus.IS_OVER) return;

    _reactionState.addGuess(guessNumber);
    setGuessInput("");
  }

  function handleChangeGuess(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.currentTarget;
    const isEmptyString = !value.length;

    const parsed = parseInt(e.currentTarget.value);
    if (isNaN(parsed) && !isEmptyString) return;

    setGuessInput(e.currentTarget.value);
  }

  return (
    <div className={"flex flex-col p-4 h-full"}>
      <Alert message={alertProps.title} />
      <Flex>
        <AnimationContent className="flex flex-col justify-center items-center">
          <Animation
            className={classNames({
              "mask mask-hexagon": true,
              [animationColor]: animationColor,
              "animate-hueRotate":
                reaction.reactionStatus === ReactionStatus.HAS_NOT_STARTED,
            })}
          >
            <Countdown
              value={timer}
              style={{ visibility: showTimer ? "visible" : "hidden" }}
            />
          </Animation>
        </AnimationContent>
        <GameInput
          onChange={handleChangeGuess}
          value={guessInput}
          onClick={handleSubmitGuess}
          ref={inputRef}
        />
      </Flex>
      <GameoverModal isOpen={isGameOver} />
    </div>
  );
};

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Animation = styled.div`
  height: 11rem;
  width: 11rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AnimationContent = styled.div`
  flex-grow: 1;
`;

export const GameScreen = withNavigation(MyGameScreen);
