# RIGHT NOW
- fix gamemodel VV
- patch gameService to use mongoose V
- patch gameController to use mongoose V
- frontent add axios.post to easypeasy listener V
- fix stats VV
- deploy 
  - env vars in frontend to allow backend communication


- give games a uuid to see local games highlighted on the global leaderboard
- add version to game in case we change interfaces / shemas or game difficulties
  to help with filtering

- go over to nx mono repo structure
  - research how to deploy seperate effectively
  - refactor to interfaces/enums to common lib (check with mongoose)
  - extensive testing
  - nest restful api
    - mongoose

# V1.0.0
- fix release workflow
  - add env variable / secret to prod.env
- global scoreboard with ws
- add feedback section
- renew notifs
- user metric tracking
- reset if gameover with score of 0 

# Alpha v0.1.2 - Stats Supreme
- proper stats page 
- statsProcessingService V
  - time played V
  - average deviation V
  - avarage time it took to guess right V

# Alpha v0.1.1
- settings page V
  - choose game mode V
  - show which gamemode is selected V
- fix scoreboard mean deviation .123231123ms issue V
- make it instructions more clear on when it starts V
  - patch landing page hero text V
- show lives somehow V

# Alpha v0.1.0
- refactor naming `game-over` screen to `CurrentGameStats` Screen V
- game model revamped im abbild von ReactionModel V
- reset on navigate to `/stats` instead of `/game-over` V
- personal scoreboard V
- user input takes 3 characters max -> like arcade V
- promp for user name (3 chars) on gameover? V
- ui revamp V
- fix alert messages, not specific enough (higher lower) V
- timer in between reactions -> rendering next button redundant V
-> remove next button V
- refactor game reset logic V
- WIP Stats Page V

# Alpha v0.0.2
- fix keyboard ressize issue V
- center box on home screen V
- homescreen: fix mobile width of vp V


# Alpha v.0.0.1:

- highscore show session highscore & gameover screen V
- game model & store V
  - difficulty V
    -> 3 failed attempts and your'e out V
  - score V
  - failedAttempts V
    -> per game V
- create calc method to calculate if guess is close enough instead of exact V
  -> use difficulties as modifiers for how close you can be V
- refactor to proper files & naming V
  -> delete v2 V
- fix addguess on reaction.reactionStatus !== IS_OVER V
- fix controlled input value V
- refactor game flow to create random reactions, with next button. V
- fix first reaction to be random V
- create random times, debug show times in console V
- on guesstatus.isRight => setTimeout => new Reaction V
- essentially allow multiple reactions after one another V
- message / disclaimer component at top saying: "waiting to start" | " You won " | "Guess" V
- change button text on success to `next` instead of `ready` V
- fix next button not to skip on not guessed V

# Icebox:

- animations loading, buffering, particles
- other visual cues
- audible cues
- timer before start
  -> automating next button
  -> pause function
- difficulty exponentioal growth ( take game.score as multiplier )
- sound effects & music
- bonus points on how quickly a time is guess correctly
- user metric tracking

- multiplayer game 1v1, via websockets, ws can provide live leaderboard
- if input gets code.ENTER and guessStatus.IS_RIGHT => handleNext()
- think about whole game flow from splash screen to routing
- settings would have an option for automatic next
- replay animation button
- difficulty could be how many tries you get before you lose
- create component to allow for "PlayThisReaction(reaction: Reaction)"
- create history object, which shows all played reactions
- create difficulty obj, allowing to calculate diff between reaction.duration and reaction.guess to be in a limit of 30, 50, 100
- create nicer ui
- splash screen
- game screen with dock
- game
- help
- settings
- history

### Resources:
https://github.com/bramus/viewport-resize-behavior/blob/main/explainer.md
