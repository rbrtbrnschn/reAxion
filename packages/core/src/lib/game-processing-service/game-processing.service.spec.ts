import { IGame } from '@reaxion/common';
import { GameProcessingService } from './game-processing.service';
describe('game processing service', () => {
  it('should getGameTime', () => {
    const game = MOCK_GAMES[0] as unknown as IGame;
    const service = new GameProcessingService(game);
    const calculatedGameTime = service.getGameTime();
    const preciseGameTime =
      1679299365184 -
      1679299364199 +
      1679299373821 -
      1679299369855 +
      1679299381632 -
      1679299379227;
    expect(calculatedGameTime).toEqual(preciseGameTime);
  });
  it('should getAverageDeviation', () => {
    const game = MOCK_GAMES[4];
    const service = new GameProcessingService(game);
    const calculatedAverageDeviation = service.getAverageDeviation();
    const preciseAverageDeviation = (1000 - 950 + 100 - 100) / 2;
    expect(calculatedAverageDeviation).toEqual(preciseAverageDeviation);
  });
  it('should getAverageDeviation for OTHER_MOCK_GAME', () => {
    const game = OTHER_MOCK_GAME;
    const service = new GameProcessingService(game);
    const calculatedAverageDeviation = service.getAverageDeviation();
    const preciseAverageDeviation = (1000 - 1000 + 441 - 430 + 80 - 50) / 3;
    console.log(
      preciseAverageDeviation,
      (preciseAverageDeviation / 1000).toFixed(2) + 's',
      preciseAverageDeviation.toFixed(2) + 'ms'
    );
    expect(calculatedAverageDeviation).toEqual(preciseAverageDeviation);
  });
  it('should getAverageTimeForCorrectGuess', () => {
    const game = MOCK_GAMES[0] as unknown as IGame;
    const service = new GameProcessingService(game);
    const calculatedAverageTimeForCorrectGuess =
      service.getAverageTimeForCorrectGuess();
    const preciseAverageTimeForCorrectGuess =
      (1679299365184 -
        1679299364199 +
        1679299373821 -
        1679299369855 +
        1679299381632 -
        1679299379227) /
      3;
    expect(calculatedAverageTimeForCorrectGuess).toEqual(
      preciseAverageTimeForCorrectGuess
    );
  });
});
const MOCK_GAMES = [
  {
    _id: '641813401addd062ede0170a',
    score: 3,
    userId: 'e5690617-e75d-4c09-a41f-646a56cebcaa',
    difficulty: {
      id: 'EXTREME_DIFFICULTY',
      deviation: 50,
      maxFailedAttempts: 1,
      maxDuration: 500,
      name: 'Insane',
    },
    name: 'bob',
    failedAttempts: 1,
    reactions: [
      {
        id: '764a46d7-9400-4cfa-8fa0-f4e598dc269c',
        duration: 1000,
        guesses: [1000],
        isGuessed: true,
        guessStatus: 3,
        reactionStatus: 0,
        startedAt: 1679299364199,
        completedAt: 1679299365184,
        key: 'REACTION_CLASS',
      },
      {
        id: '78668338-6692-4a4c-8c05-b027db5b3fef',
        duration: 636,
        guesses: [450],
        isGuessed: true,
        guessStatus: 3,
        reactionStatus: 0,
        startedAt: 1679299369855,
        completedAt: 1679299373821,
        key: 'REACTION_CLASS',
      },
      {
        id: 'd4f7de6c-0faf-440a-bd9d-ea37497d72d4',
        duration: 1386,
        guesses: [890],
        isGuessed: true,
        guessStatus: 3,
        reactionStatus: 0,
        startedAt: 1679299379227,
        completedAt: 1679299381632,
        key: 'REACTION_CLASS',
      },
      {
        id: '20685746-8567-47a3-a3ce-11c97c3d7164',
        duration: 2008,
        guesses: [1370],
        isGuessed: false,
        guessStatus: 3,
        reactionStatus: 0,
        startedAt: 1679299387664,
        completedAt: 1679299389780,
        key: 'REACTION_CLASS',
      },
    ],
    createdAt: '2023-03-20T08:03:12.322Z',
    __v: 0,
  },
  {
    _id: '64181e9a1addd062ede0171d',
    score: 1,
    userId: 'f9d8414d-150e-4dc0-b787-fa76f3574247',
    difficulty: {
      id: 'EASY_DIFFICULTY',
      deviation: 500,
      maxFailedAttempts: 5,
      maxDuration: 3000,
      name: 'Easy',
    },
    name: 'aaa',
    failedAttempts: 5,
    reactions: [
      {
        id: 'fb317a77-8f51-4d30-be3e-6ef5ef509cca',
        duration: 1000,
        guesses: [500],
        isGuessed: true,
        guessStatus: 3,
        reactionStatus: 0,
        startedAt: 1679301999135,
        completedAt: 1679302003576,
        key: 'REACTION_CLASS',
      },
      {
        id: '20f2dccf-e8dc-42fa-962c-77ffee74e44c',
        duration: 1386,
        guesses: [5200, 500, 6000, 8000, 9000],
        isGuessed: false,
        guessStatus: 3,
        reactionStatus: 0,
        startedAt: 1679302008965,
        completedAt: 1679302212624,
        key: 'REACTION_CLASS',
      },
    ],
    createdAt: '2023-03-20T08:51:38.285Z',
    __v: 0,
  },
  {
    _id: '641826201addd062ede0172a',
    score: 2,
    userId: 'f9d8414d-150e-4dc0-b787-fa76f3574247',
    difficulty: {
      id: 'EASY_DIFFICULTY',
      deviation: 500,
      maxFailedAttempts: 5,
      maxDuration: 3000,
      name: 'Easy',
    },
    name: 'aaa',
    failedAttempts: 5,
    reactions: [
      {
        id: '8e22b2ed-28f3-4d18-8a6e-848311c0a80c',
        duration: 1000,
        guesses: [50, 50, 60, 500],
        isGuessed: true,
        guessStatus: 3,
        reactionStatus: 0,
        startedAt: 1679302973966,
        completedAt: 1679302995871,
        key: 'REACTION_CLASS',
      },
      {
        id: 'b7740d95-f25a-4fa2-ae72-52be843699d2',
        duration: 777,
        guesses: [8090, 800],
        isGuessed: true,
        guessStatus: 3,
        reactionStatus: 0,
        startedAt: 1679303000660,
        completedAt: 1679303004789,
        key: 'REACTION_CLASS',
      },
      {
        id: '612c62ed-f570-4655-8ce1-ebd7862df059',
        duration: 1329,
        guesses: [50],
        isGuessed: false,
        guessStatus: 3,
        reactionStatus: 0,
        startedAt: 1679303010139,
        completedAt: 1679303035702,
        key: 'REACTION_CLASS',
      },
    ],
    createdAt: '2023-03-20T09:23:44.727Z',
    __v: 0,
  },
  {
    _id: '64185f22065562fcdf6fe534',
    score: 4,
    userId: '5d3950a7-c418-4b26-afc5-8f6d2805d884',
    difficulty: {
      id: 'EXTREME_DIFFICULTY',
      deviation: 50,
      maxFailedAttempts: 1,
      maxDuration: 500,
      name: 'Insane',
    },
    name: 'Bob',
    failedAttempts: 1,
    reactions: [
      {
        id: '8dac102f-433e-4fbe-87ae-796d322a9c57',
        duration: 1000,
        guesses: [1000],
        isGuessed: true,
        guessStatus: 3,
        reactionStatus: 0,
        startedAt: 1679318785745,
        completedAt: 1679318788637,
        key: 'REACTION_CLASS',
      },
      {
        id: 'ddcc5f53-0488-4b5e-b1e0-52fedbb3ca21',
        duration: 110,
        guesses: [100],
        isGuessed: true,
        guessStatus: 3,
        reactionStatus: 0,
        startedAt: 1679318792778,
        completedAt: 1679318796303,
        key: 'REACTION_CLASS',
      },
      {
        id: 'caf33f5e-40ab-49d8-9448-b1da5c35b913',
        duration: 77,
        guesses: [50],
        isGuessed: true,
        guessStatus: 3,
        reactionStatus: 0,
        startedAt: 1679318800408,
        completedAt: 1679318802677,
        key: 'REACTION_CLASS',
      },
      {
        id: '9fcebca1-84a9-46e2-85bd-98c449b29075',
        duration: 287,
        guesses: [250],
        isGuessed: true,
        guessStatus: 3,
        reactionStatus: 0,
        startedAt: 1679318806992,
        completedAt: 1679318809029,
        key: 'REACTION_CLASS',
      },
      {
        id: '14f3bec0-5fb4-4930-b3f1-797dca2ce0cf',
        duration: 288,
        guesses: [360],
        isGuessed: false,
        guessStatus: 3,
        reactionStatus: 0,
        startedAt: 1679318813353,
        completedAt: 1679318816226,
        key: 'REACTION_CLASS',
      },
    ],
    createdAt: '2023-03-20T13:26:58.349Z',
    __v: 0,
  },
  {
    _id: '64185f22065562fcdf6fe534',
    score: 4,
    userId: '5d3950a7-c418-4b26-afc5-8f6d2805d884',
    difficulty: {
      id: 'EXTREME_DIFFICULTY',
      deviation: 50,
      maxFailedAttempts: 1,
      maxDuration: 500,
      name: 'Insane',
    },
    name: 'Bob',
    failedAttempts: 1,
    reactions: [
      {
        id: '8dac102f-433e-4fbe-87ae-796d322a9c57',
        duration: 950,
        guesses: [400, 1000],
        isGuessed: true,
        guessStatus: 3,
        reactionStatus: 0,
        startedAt: 1679318785745,
        completedAt: 1679318788637,
        key: 'REACTION_CLASS',
      },
      {
        id: 'ddcc5f53-0488-4b5e-b1e0-52fedbb3ca21',
        duration: 100,
        guesses: [100],
        isGuessed: true,
        guessStatus: 3,
        reactionStatus: 0,
        startedAt: 1679318792778,
        completedAt: 1679318796303,
        key: 'REACTION_CLASS',
      },
      {
        id: 'caf33f5e-40ab-49d8-9448-b1da5c35b913',
        duration: 0,
        guesses: [50],
        isGuessed: false,
        guessStatus: 3,
        reactionStatus: 0,
        startedAt: 1679318800408,
        completedAt: 1679318802677,
        key: 'REACTION_CLASS',
      },
    ],
    createdAt: '2023-03-20T13:26:58.349Z',
    __v: 0,
  },
];

const OTHER_MOCK_GAME = {
  _id: '64199341b10ffd91f86bf778',
  score: 3,
  userId: '5d3950a7-c418-4b26-afc5-8f6d2805d884',
  difficulty: {
    id: 'EXTREME_DIFFICULTY',
    deviation: 50,
    maxFailedAttempts: 1,
    maxDuration: 500,
    name: 'Insane',
  },
  name: 'Bob',
  failedAttempts: 1,
  reactions: [
    {
      id: 'fbfd582f-6774-4c51-99f3-7231030fca27',
      duration: 1000,
      guesses: [1000],
      isGuessed: true,
      guessStatus: 3,
      reactionStatus: 0,
      startedAt: 1679397668559,
      completedAt: 1679397671154,
      key: 'REACTION_CLASS',
    },
    {
      id: '85dd73b0-0388-4d2b-bf79-bcfc6198ff77',
      duration: 441,
      guesses: [430],
      isGuessed: true,
      guessStatus: 3,
      reactionStatus: 0,
      startedAt: 1679397675631,
      completedAt: 1679397678299,
      key: 'REACTION_CLASS',
    },
    {
      id: '485b9b22-9e41-4276-9b7c-e60ec8d6dfda',
      duration: 80,
      guesses: [50],
      isGuessed: true,
      guessStatus: 3,
      reactionStatus: 0,
      startedAt: 1679397682396,
      completedAt: 1679397684759,
      key: 'REACTION_CLASS',
    },
    {
      id: 'b95ef647-ec89-4a75-b071-e91a1f133281',
      duration: 276,
      guesses: [110],
      isGuessed: false,
      guessStatus: 3,
      reactionStatus: 0,
      startedAt: 1679397689071,
      completedAt: 1679397691664,
      key: 'REACTION_CLASS',
    },
  ],
  createdAt: '2023-03-21T11:21:37.690Z',
  __v: 0,
};
