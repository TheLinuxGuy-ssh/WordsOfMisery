# Words Per Misery

> A typing test that wants you to fail.

[![HTML](https://img.shields.io/badge/HTML-22c55e?style=flat-square&logo=html5&logoColor=0a0a0a)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS-22c55e?style=flat-square&logo=css3&logoColor=0a0a0a)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-22c55e?style=flat-square&logo=javascript&logoColor=0a0a0a)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-22c55e?style=flat-square&logo=github&logoColor=0a0a0a)](https://pages.github.com/)
[![MIT](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)

## Play

**[Open Words Per Misery on GitHub Pages](https://thelinuxguy-ssh.github.io/WordOfMisery/)**

Words Per Misery starts like an ordinary typing test, then steadily makes the text less trustworthy. Type the passage exactly as shown, survive five rounds, and see how much suffering your performance earned.

This is a desktop experience. A physical keyboard is required.

## What happens in the five rounds

| Round | Name | What goes wrong |
| --- | --- | --- |
| 1 | Warm Up | A normal typing passage, for now. |
| 2 | Mild Inconvenience | The current word shakes and upcoming letters shrink. |
| 3 | Trust Issues | Upcoming letters briefly lie and neighboring letters swap places. |
| 4 | Technical Difficulties | Typed feedback arrives late, the caret jumps, and fake popups interrupt the run. |
| 5 | Pure Evil | Earlier effects return more often, words rewrite themselves, text mirrors, and the finish line moves. |

The expected character is always based on the underlying passage. Visual effects are only visual tricks, except when Round 5 deliberately rewrites a word and updates the expected text too.

## Features

- Five short rounds designed to finish in under two minutes
- Global keyboard input with no visible text field
- Countdown, round indicator, evil meter, narrator, and results screen
- WPM, accuracy, errors, elapsed time, dismissed popups, and rounds survived
- Misery Index and rank title based on the final run
- Copyable result summary
- Best WPM saved locally under `wpm_best`
- Mercy Mode for players who prefer less motion
- Automatic reduced-motion support through `prefers-reduced-motion`
- No framework, build step, package, or external runtime dependency

## Controls

- Type the displayed passage with a physical keyboard.
- Space is handled by the game and will not scroll the page.
- Modifier keys are ignored.
- Press `Escape` at any point to end the run and view the results.
- In Round 4 and Round 5, click a popup button before typing again.

## Misery Index

The score is intentionally simple and easy to tune:

```text
errors * 2 + popupsDismissed * 10 + Math.round(totalSeconds / 5)
```

Rank evaluation is performed in this order:

1. WPM under 20 or accuracy under 80 percent: `Casualty`
2. WPM 55 or above and accuracy 95 percent or above: `Unbothered`
3. WPM 35 or above and accuracy 90 percent or above: `Keyboard Warrior`
4. Everything else: `Survived, Barely`

## Run locally

There is nothing to install:

```bash
git clone https://github.com/TheLinuxGuy-ssh/WordOfMisery.git
cd WordOfMisery
open index.html
```

You can also double-click `index.html` or serve the folder with any static file server. The project is designed to deploy directly to GitHub Pages.

## Project structure

```text
index.html   Page structure and game screens
style.css    Dark visual system, responsive message, and effect styles
script.js    Game state, typing engine, effects, popups, narrator, and results
README.md    Project documentation
```

## Visual preview

Add a gameplay screenshot or short GIF here before submitting the Hacktoberfest project:

```text
docs/words-per-misery.gif
```

## How I used GitHub Copilot

I used GitHub Copilot during the build to help break the game into clear vanilla JavaScript sections, suggest small helpers for passage rendering and effect scheduling, and review edge cases around global keyboard input, timers, popups, reduced motion, and score calculation.

The final project was kept dependency free and the behavior was manually checked in a browser. Copilot suggestions were edited to match the intended tone, visual design, gameplay rules, and accessibility requirements.

Prompt screenshots can be added here:

```text
docs/copilot-prompt-1.png
docs/copilot-prompt-2.png
```

## License

MIT
