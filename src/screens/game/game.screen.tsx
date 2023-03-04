import { RecursiveActions } from "easy-peasy";
import { useEffect, useMemo, useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Alert, AlertProps } from "../../components/alert";
import { AnimationContent } from "../../components/animation";
import { ColorsNames } from "../../interfaces/colors.interface";
import { GuessStatus } from "../../interfaces/guess.interface";
import { IReaction, ReactionStatus } from "../../interfaces/reaction.interface";
import { RouteNames } from "../../interfaces/route.interface";
import { routes } from "../../routes";
import { useStoreActions, useStoreState } from "../../store";
import { ReactionModel } from "../../store/models/reaction.model";
import { ReactionBuilder } from "../../utils/reaction/Reaction.builder";
import { whenDebugging } from "../../utils/whenDebugging";
import { Form } from "./game.form";
import { Screen } from "../../components/common";
import { Countdown } from "../../components/countdown";
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

/**
 * Navigates user to <GameOverScreen /> if state.game.isGameOver
 * @param isGameOver {Boolean}
 * @param navigate {NavigateFunction}
 */
function useHandleGameOverNavigation(
  isGameOver: boolean,
  navigate: NavigateFunction
) {
  useEffect(() => {
    if (isGameOver) navigate(routes[RouteNames.GAME_OVER_PAGE].path);
  }, [isGameOver, navigate]);
}

export const GameScreen = () => {
  const reactionState = useStoreState((state) => state.reaction);
  const _reactionState = useStoreActions((actions) => actions.reaction);
  const isGameOver = useStoreState((state) => state.game.isGameOver);
  const reaction = reactionState.reaction;

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
  const navigate = useNavigate();
  useInitializeRandomReaction(reaction, _reactionState);
  useHandleGameOverNavigation(isGameOver, navigate);

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
  function handleReady(e: React.MouseEvent<HTMLButtonElement>) {
    const reactionNotOver =
      reactionState.reaction?.reactionStatus !== ReactionStatus.IS_OVER;
    const hasGuessed =
      reactionState.reaction?.guessStatus !== GuessStatus.IS_WAITING;

    if (reactionNotOver) {
      runAnimation(reaction, _reactionState as any);
      return;
    } else if (!hasGuessed) {
      return;
    }
    const newReaction = new ReactionBuilder().buildWithRandomDuration();
    _reactionState.setReaction({
      ...newReaction,
    });
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

  function handleReturnToHome() {
    navigate(routes[RouteNames.HOME_PAGE].path);
  }

  return (
    <Screen
      id="game-screen"
      className={`${animationColor} py-10 flex flex-col`}
    >
      <div className="flex justify-center">
        <Alert {...alertProps} />
      </div>
      <Flex>
        <AnimationContent className="flex flex-col justify-center items-center">
          <Countdown value={3} />
          3
        </AnimationContent>
        <div className="flex justify-center">
          <Form
            onClick={{
              button1: handleSubmitGuess,
              button2: handleReady,
            }}
            onChange={handleChangeGuess}
            value={guessInput as any}
            buttonText={reaction.isGuessed ? "Next" : "Ready"}
          />
        </div>
      </Flex>
    </Screen>
  );
};

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
