import { useEffect, useState } from "react";
import styled from "styled-components";
import "./App.css";
import { useStoreState } from "./store";

function App() {
  const game = useStoreState((state) => state.game);
  const reaction = useStoreState((state) => state.reaction);

  const [animationLength, setAnimationLength] = useState(3000);
  const [animationClassName, setAnimationClassName] = useState("");
  const [input, setInput] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setAnimationClassName("ANIMATION__FINISHED");
    }, animationLength);
  }, [animationLength]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let message = "";
    const guessIsRight = input === animationLength;
    const guessTooSmall = input < animationLength;
    const guessTooHigh = input > animationLength;
    if (guessIsRight) message = "You won";
    else if (guessTooSmall) message = "Too Small";
    else if (guessTooHigh) message = "Too High";
    setMessage(message);

    if (guessIsRight) {
      setAnimationClassName("");

      setAnimationLength(() => 2000);
    }
  }
  return (
    <div className="App">
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
          value={input}
          onChange={(e) => setInput(parseInt(e.currentTarget.value))}
        />
      </form>

      <div>{message}</div>
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

export default App;
