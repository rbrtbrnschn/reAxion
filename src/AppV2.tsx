import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import "./App.css";
import { Alert } from "./components/alert";
import { GuessStatus } from "./interfaces/v2/guess.interface";
import { ReactionStatus } from "./interfaces/v2/reaction.interface";
import { useStoreActions, useStoreState } from "./store";

export function AppV2() {
  const game = useStoreState((state) => state.game);
  const reaction = useStoreState((state) => state.reaction);
  const _reaction = useStoreActions((state) => state.reaction);

  const newGuessStatus = useMemo(() => {
    const isWaiting = reaction.duration === 0;
    const isRight = reaction.duration === reaction.guess;
    const isTooHigh = reaction.guess > reaction.duration;
    const isTooLow = reaction.guess < reaction.duration;

    if (isWaiting) return GuessStatus.IS_WAITING;
    else if (isRight) return GuessStatus.IS_RIGHT;
    else if (isTooHigh) return GuessStatus.IS_TOO_HIGH;
    else if (isTooLow) return GuessStatus.IS_TOO_LOW;
    else return GuessStatus.IS_WAITING;
  }, [reaction.guess, reaction.duration]);

  const message = useMemo(() => {
    let message = "";
    if (reaction.reactionStatus === ReactionStatus.IS_IN_PROGRESS)
      message = "Started";
    else {
      switch (reaction.guessStatus) {
        case GuessStatus.IS_RIGHT:
          message = "You won";
          break;
        case GuessStatus.IS_TOO_HIGH:
          message = "Too High";
          break;

        case GuessStatus.IS_TOO_LOW:
          message = "Too Low";
          break;
        case GuessStatus.IS_WAITING:
          switch (reaction.reactionStatus) {
            case ReactionStatus.HAS_NOT_STARTED:
              message = "Get ready.";
              break;
            case ReactionStatus.IS_OVER:
              message = "Completed.";
              break;
            default:
              message = "default";
              break;
          }
          break;
        default:
          break;
      }
    }

    return message;
  }, [reaction.guessStatus, reaction.reactionStatus]);

  const [animationClassName, setAnimationClassName] = useState("");
  useEffect(() => {
    if (!reaction.duration) return;
    _reaction.setReactionStatus(ReactionStatus.IS_IN_PROGRESS);

    console.time("animation");
    setTimeout(() => {
      console.timeEnd("animation");
      setAnimationClassName("ANIMATION__FINISHED");
      _reaction.setReactionStatus(ReactionStatus.IS_OVER);
    }, reaction.duration);
  }, [reaction.duration]);

  useEffect(() => {
    setTimeout(() => {
      _reaction.setDuration(3000);
    }, 1000);
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    _reaction.setGuessStatus(newGuessStatus);
  }

  useEffect(() => {
    if (reaction.guessStatus !== GuessStatus.IS_RIGHT) return;

    _reaction.setReactionStatus(ReactionStatus.HAS_NOT_STARTED);

    setTimeout(() => {
      const newDuration = 2000 + Math.ceil(Math.random() * 1000);
      console.debug("New Duration:", newDuration);
      _reaction.setDuration(newDuration);
      _reaction.setGuess(0);
      _reaction.setGuessStatus(GuessStatus.IS_WAITING);
      //   _reaction.setReactionStatus(ReactionStatus.IS_IN_PROGRESS);
      setAnimationClassName("");
    }, 1000);
  }, [reaction.guessStatus]);

  return (
    <div className="App">
      {message && <Alert title="" description={message} color="orange" />}
      <Animation className={animationClassName} />
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="reactGuess"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Reaction Guess in ms
        </label>
        <input
          type="number"
          id="reactGuess"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="239"
          required
          value={reaction.guess}
          onChange={(e) => _reaction.setGuess(parseInt(e.currentTarget.value))}
        />
      </form>

      {/* <div>{message}</div> */}
    </div>
  );
}

const Animation = styled.div`
  width: 100px;
  height: 100px;
  background-color: red;

  &.ANIMATION__FINISHED {
    background-color: green;
  }
`;
