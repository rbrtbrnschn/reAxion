# Alpha v.0.0.1:

- create calc method to calculate if guess is close enough instead of exact
  -> use difficulties as modifiers for how close you can be
- game model & store
  - difficulty
    -> 3 failed attempts and your'e out
  - score
  - highscore
    -> how do we determine highscore? by not failing consecutively or will this be determined by difficulties model
  - failedAttempts
    -> per reaction or per game?

# Completed:

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
