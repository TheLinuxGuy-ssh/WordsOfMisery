# Contributing to Words Per Misery

Thanks for helping make the typing test more unreasonable.

## Before you start

Please search existing issues and pull requests before opening a new one. Small, focused changes are easiest to review. Keep the project dependency free and preserve the vanilla HTML, CSS, and JavaScript approach.

## Local setup

```bash
git clone https://github.com/TheLinuxGuy-ssh/WordOfMisery.git
cd WordOfMisery
open index.html
```

No package installation or build step is required.

## Making a change

1. Create a branch from `main`.
2. Make one focused change.
3. Test the experience in a desktop browser at 1280px and 1024px widths.
4. Check the browser console for errors.
5. Verify keyboard input, Escape to exit, reduced motion, and the results screen when relevant.
6. Update the README when user-facing behavior changes.
7. Open a pull request with a clear summary and testing notes.

## Style guidelines

- Prefer clear, small functions and existing patterns.
- Keep effects data driven where possible.
- Clean up timers and listeners between rounds.
- Do not add frameworks or dependencies without discussion.
- Avoid punctuation dashes in on-screen copy.
- Do not commit secrets, generated build output, or personal data.

## Pull requests

Pull requests should explain what changed, why it changed, and how it was tested. Screenshots or short recordings are welcome for visual changes.
