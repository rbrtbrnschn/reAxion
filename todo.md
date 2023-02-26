# WIP:

- fix first reaction to be random
- create calc method to calculate if guess is close enough instead of exact
  - use difficulties as modifiers for how close you can be
- game model
  - score
  - highscore
    -> how do we determine highscore? by not failing consecutively or will this be determined by difficulties model
- refactor to proper files & naming
  -> delete v2
- refactor game flow to create random reactions, with next button.
  -> settings would have an option for automatic next
- think about whole game flow from splash screen to routing

# Completed:

- create random times, debug show times in console V
- on guesstatus.isRight => setTimeout => new Reaction V
- essentially allow multiple reactions after one another V
- message / disclaimer component at top saying: "waiting to start" | " You won " | "Guess" V
- change button text on success to `next` instead of `ready` V

# Icebox:

-> create component to allow for "PlayThisReaction(reaction: Reaction)"
-> create history object, which shows all played reactions
-> create difficulty obj, allowing to calculate diff between reaction.duration and reaction.guess to be in a limit of 30, 50, 100
-> create nicer ui
-> splash screen
-> game screen with dock
-> game
-> help
-> settings
-> history
