import uuid4 from "uuid4";
import { GuessStatus } from "./enums/guess.enum";
import { ReactionStatus } from "./enums/reaction.enum";
import { IGame } from "./interfaces/game.interface";
import { StatsProcessingService } from "./utils/stats/statsProcessingService";

test("renders learn react link", () => {
  // render(<App />);
  // const linkElement = screen.getByText(/learn react/i);
  // expect(linkElement).toBeInTheDocument();
});

test("should do test StatsProcessingService", () => {
  const game: IGame = {
    difficulty: 0,
    failedAttempts: 5,
    name: "pet",
    score: 3,
    reactions: [
      {
        duration: 10,
        _id: uuid4(),
        guesses: [5],
        guessStatus: GuessStatus.IS_RIGHT,
        isGuessed: true,
        reactionStatus: ReactionStatus.IS_OVER,
        completedAt: Date.now() + 5 * 1000,
        startedAt: Date.now(),
      },
    ],
  };
  const processingService = new StatsProcessingService(game);
  const averageDeviation = processingService.getAverageDeviation();
  const averageTimeForCorrectGuess =
    processingService.getAverageTimeForCorrectGuess();
  const gameTime = processingService.getGameTime();

  expect(averageDeviation).toBe(5);
  expect(gameTime).toBe(5 * 1000);
  expect(averageTimeForCorrectGuess).toBe(5 * 1000);
});
