(() => {
  "use strict";

  // Configuration
  const CONFIG = {
    passages: [
      "The quick brown fox jumps over the lazy dog while the keyboard quietly waits for something to go wrong.",
      "Every great developer has deleted a file they needed, blamed the cache, and then quietly restored it from the trash.",
      "Somewhere in a hostel, a router restarts itself at the exact moment someone is about to win an online game.",
      "Please do not look at the screen while typing this sentence because the screen is looking at you and it is not impressed.",
      "You are doing very well, which is suspicious, so we have decided to make this part a little longer than we promised."
    ],
    narrator: {
      start: ["This will be fine.", "A calm beginning. Enjoy it.", "Nothing strange is happening yet.", "Your keyboard has agreed to cooperate."],
      errors: ["That letter was fine a second ago.", "The keyboard noticed that.", "A bold interpretation of the alphabet.", "You and the keys need to talk."],
      popup: ["Nobody asked for that popup. Not even the popup.", "Please accept the consequences.", "The interruption is legally a feature.", "Your attention has been successfully misplaced."],
      effect: ["That was a visual trick. Probably.", "The text is experimenting with your trust.", "Everything you see is technically allowed.", "The passage has developed a personality."],
      fast: ["You are typing faster. This is a red flag.", "Look at that confidence. Concerning.", "Speed detected. We will correct this.", "You are making progress look suspicious."],
      complete: ["Round complete. Do not get comfortable.", "You survived that one somehow.", "The passage has been defeated.", "One less thing standing between you and regret."],
      finish: ["The finish line has moved. It does that.", "Almost there was an optimistic estimate.", "We found more words in the basement.", "Good news. The promise was not binding."]
    },
    rounds: [
      { effects: [] },
      { effects: ["shake", "shrink"] },
      { effects: ["lie", "swap"] },
      { effects: ["lag", "jump", "popup"] },
      { effects: ["shake", "shrink", "lie", "swap", "lag", "jump", "popup", "rewrite", "mirror", "finish"] }
    ],
    popupMessages: ["We use cookies to make you type slower. Accept", "Your free trial of typing has expired. Continue", "Are you a robot? Click to prove it"],
    appendWords: ["and also", "honestly", "just a bit more", "almost there", "we lied"],
    rewrites: { "doing": "making", "well": "great", "suspicious": "questionable", "decided": "planned", "little": "rather" }
  };

  // Game state
  const state = {
    round: 0, index: 0, passage: "", chars: [], errors: 0, keystrokes: 0, correct: 0,
    popups: 0, roundPopups: 0, survived: 0, startedAt: 0, finishedAt: 0, timer: null,
    effectTimer: null, effectTimers: [], mercy: false, paused: false, lastNarrator: "",
    roundErrors: 0, finishMoves: 0, fastStreak: 0
  };

  const $ = (id) => document.getElementById(id);
  const els = {
    start: $("start-screen"), game: $("game-screen"), results: $("results-screen"),
    startButton: $("start-button"), retryButton: $("retry-button"), copyButton: $("copy-button"),
    mercy: $("mercy-toggle"), passage: $("passage"), narrator: $("narrator"),
    countdown: $("countdown"), popupLayer: $("popup-layer"), round: $("round-label"),
    evil: $("evil-fill"), best: $("best-score"), copyStatus: $("copy-status")
  };
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function shuffle(items) { return items.slice().sort(() => Math.random() - 0.5); }
  function pick(items) { return items[Math.floor(Math.random() * items.length)]; }
  function setScreen(screen) {
    [els.start, els.game, els.results].forEach((item) => item.classList.add("is-hidden"));
    screen.classList.remove("is-hidden");
  }
  function setNarrator(trigger) {
    const options = CONFIG.narrator[trigger];
    let line = pick(options);
    while (options.length > 1 && line === state.lastNarrator) line = pick(options);
    state.lastNarrator = line;
    els.narrator.classList.add("fade");
    window.setTimeout(() => { els.narrator.textContent = line; els.narrator.classList.remove("fade"); }, 120);
  }
  function renderPassage() {
    els.passage.textContent = "";
    state.chars = Array.from(state.passage, (character, index) => {
      const span = document.createElement("span");
      span.className = "character";
      span.textContent = character;
      span.dataset.index = index;
      els.passage.appendChild(span);
      return span;
    });
    updateCaret();
  }
  function updateCaret() {
    state.chars.forEach((char, index) => {
      char.classList.toggle("typed", index < state.index);
      char.classList.toggle("current", index === state.index);
    });
  }
  function clearRoundTimers() {
    window.clearInterval(state.effectTimer);
    state.effectTimers.forEach(window.clearTimeout);
    state.effectTimers = [];
  }
  function buildRound(roundNumber) {
    clearRoundTimers();
    state.round = roundNumber;
    state.index = 0;
    state.roundErrors = 0;
    state.roundPopups = 0;
    state.finishMoves = 0;
    state.passage = CONFIG.passages[roundNumber];
    renderPassage();
    els.round.textContent = `Round ${roundNumber + 1} of 5`;
    els.evil.style.width = `${((roundNumber + 1) / 5) * 100}%`;
    setNarrator("start");
    scheduleEffects();
  }
  function scheduleEffects() {
    const active = CONFIG.rounds[state.round].effects;
    if (!active.length) return;
    const tick = () => {
      if (!state.paused) fireEffect(pick(active));
      const delay = state.round === 4 ? 1600 + Math.random() * 1300 : 2200 + Math.random() * 1800;
      state.effectTimer = window.setTimeout(tick, delay);
    };
    state.effectTimer = window.setTimeout(tick, 1300);
  }
  function upcomingChars(count = 8) { return state.chars.slice(state.index + 1, state.index + count + 1); }
  function flashClass(char, className, duration = 850) {
    if (!char) return;
    char.classList.add(className);
    state.effectTimers.push(window.setTimeout(() => char.classList.remove(className), duration));
  }
  function fireEffect(effect) {
    if (state.paused || state.index >= state.chars.length) return;
    const chars = upcomingChars();
    if (effect === "shake" && !state.mercy) {
      const wordStart = state.passage.lastIndexOf(" ", state.index - 1) + 1;
      const wordEnd = state.passage.indexOf(" ", state.index);
      const word = state.chars.slice(wordStart, wordEnd < 0 ? state.chars.length : wordEnd);
      word.forEach((char) => char.classList.add("shake"));
      state.effectTimers.push(window.setTimeout(() => word.forEach((char) => char.classList.remove("shake")), 500));
    }
    if (effect === "shrink") flashClass(pick(chars), "shrink", state.mercy ? 1200 : 650);
    if (effect === "lie" && !state.mercy) {
      const char = pick(chars);
      if (char) { const actual = char.textContent; char.textContent = String.fromCharCode(97 + Math.floor(Math.random() * 26)); flashClass(char, "lie", 900); state.effectTimers.push(window.setTimeout(() => { char.textContent = actual; }, 900)); }
    }
    if (effect === "swap" && !state.mercy && chars.length > 2) {
      const first = chars[0], second = chars[1], text = first.textContent;
      first.textContent = second.textContent; second.textContent = text; flashClass(first, "swap", 1000); flashClass(second, "swap", 1000);
    }
    if (effect === "lag") {
      const typed = state.chars[state.index - 1];
      if (typed) flashClass(typed, "lagged", state.mercy ? 1000 : 500);
    }
    if (effect === "jump" && !state.mercy && state.index < state.chars.length - 3) {
      const current = state.chars[state.index]; current.classList.remove("current");
      state.chars[state.index + 3].classList.add("current");
      state.effectTimers.push(window.setTimeout(updateCaret, 500));
    }
    if (effect === "popup" && state.round >= 3 && state.roundPopups < 2) showPopup();
    if (effect === "rewrite" && state.round === 4) rewriteWord();
    if (effect === "mirror" && state.round === 4 && !state.mercy) {
      const word = chars.slice(0, 5);
      word.forEach((char) => char.classList.add("mirror"));
      state.effectTimers.push(window.setTimeout(() => word.forEach((char) => char.classList.remove("mirror")), 950));
    }
    if (effect === "finish" && state.round === 4 && state.finishMoves < 2 && state.index / state.passage.length > .88) moveFinishLine();
    if (effect === "lie" || effect === "swap" || effect === "mirror" || effect === "rewrite" || effect === "jump") setNarrator("effect");
  }
  function rewriteWord() {
    const remaining = state.passage.slice(state.index);
    const match = remaining.match(/^[^\s]+/);
    if (!match) return;
    const original = match[0], replacement = CONFIG.rewrites[original.toLowerCase()];
    if (!replacement || Math.abs(replacement.length - original.length) > 2) return;
    const start = state.index;
    state.passage = state.passage.slice(0, start) + replacement + state.passage.slice(start + original.length);
    renderPassage();
    setNarrator("effect");
  }
  function moveFinishLine() {
    state.finishMoves += 1;
    const extra = ` ${pick(CONFIG.appendWords)}`;
    state.passage += extra;
    renderPassage();
    setNarrator("finish");
  }
  function showPopup() {
    state.paused = true;
    const popup = document.createElement("div");
    popup.className = "popup";
    popup.style.left = `${20 + Math.random() * 58}%`;
    popup.style.top = `${18 + Math.random() * 55}%`;
    popup.innerHTML = `<p>${pick(CONFIG.popupMessages)}</p><button type="button">Dismiss</button>`;
    popup.querySelector("button").addEventListener("click", () => {
      popup.remove();
      state.popups += 1;
      state.roundPopups += 1;
      state.paused = false;
      if (!els.popupLayer.children.length) els.popupLayer.classList.add("is-hidden");
    });
    els.popupLayer.classList.remove("is-hidden");
    els.popupLayer.appendChild(popup);
    setNarrator("popup");
  }
  function handleKeydown(event) {
    if (els.game.classList.contains("is-hidden") || state.paused) return;
    if (event.key === "Escape") { event.preventDefault(); endRun(); return; }
    if (event.ctrlKey || event.metaKey || event.altKey || event.key.length !== 1) return;
    event.preventDefault();
    state.keystrokes += 1;
    if (event.key === state.passage[state.index]) {
      if (!state.startedAt) state.startedAt = Date.now();
      state.correct += 1; state.fastStreak += 1; state.index += 1;
      const typedChar = state.chars[state.index - 1];
      flashClass(typedChar, "correct-flash", 250);
      if (state.round >= 3) {
        state.effectTimers.push(window.setTimeout(() => {
          if (typedChar) typedChar.classList.add("lagged");
          state.effectTimers.push(window.setTimeout(() => typedChar && typedChar.classList.remove("lagged"), 420));
        }, 300 + Math.random() * 400));
      }
      updateCaret();
      if (state.fastStreak === 8) setNarrator("fast");
      if (state.index >= state.passage.length) completeRound();
    } else {
      state.errors += 1; state.roundErrors += 1; state.fastStreak = 0;
      flashClass(state.chars[state.index], "wrong-flash", 300);
      if (state.roundErrors === 3 || state.errors % 7 === 0) setNarrator("errors");
    }
  }
  function completeRound() {
    state.survived = state.round + 1;
    clearRoundTimers();
    setNarrator("complete");
    if (state.round === 4) { endRun(); return; }
    state.paused = true;
    state.effectTimers.push(window.setTimeout(() => { state.paused = false; buildRound(state.round + 1); }, 850));
  }
  function startRun() {
    state.round = 0; state.index = 0; state.passage = ""; state.errors = 0; state.keystrokes = 0;
    state.correct = 0; state.popups = 0; state.roundPopups = 0; state.survived = 0; state.startedAt = 0; state.finishedAt = 0;
    state.paused = true; state.mercy = els.mercy.checked || prefersReducedMotion;
    document.body.classList.toggle("mercy-mode", state.mercy);
    setScreen(els.game); els.countdown.classList.remove("is-hidden");
    let count = 3; els.countdown.textContent = count;
    const countdownTimer = window.setInterval(() => {
      count -= 1;
      if (!count) { window.clearInterval(countdownTimer); els.countdown.classList.add("is-hidden"); state.paused = false; buildRound(0); return; }
      els.countdown.textContent = count;
    }, 700);
  }
  function miseryIndex(totalSeconds) { return state.errors * 2 + state.popups * 10 + Math.round(totalSeconds / 5); }
  function rankTitle(wpm, accuracy) {
    if (wpm < 20 || accuracy < 80) return "Casualty";
    if (wpm >= 55 && accuracy >= 95) return "Unbothered";
    if (wpm >= 35 && accuracy >= 90) return "Keyboard Warrior";
    return "Survived, Barely";
  }
  function endRun() {
    if (state.finishedAt) return;
    clearRoundTimers();
    state.finishedAt = Date.now();
    els.popupLayer.replaceChildren(); els.popupLayer.classList.add("is-hidden");
    const seconds = state.startedAt ? (state.finishedAt - state.startedAt) / 1000 : 0;
    const wpm = seconds ? Math.round((state.correct / 5) / (seconds / 60)) : 0;
    const accuracy = state.keystrokes ? Math.round((state.correct / state.keystrokes) * 100) : 0;
    const misery = miseryIndex(seconds);
    const rank = rankTitle(wpm, accuracy);
    $("result-wpm").textContent = wpm; $("result-accuracy").textContent = `${accuracy}%`;
    $("result-errors").textContent = state.errors; $("result-time").textContent = `${Math.round(seconds)}s`;
    $("result-popups").textContent = state.popups; $("result-rounds").textContent = `${state.survived} of 5`;
    $("misery-index").textContent = misery; $("rank-title").textContent = rank;
    $("misery-caption").textContent = misery < 20 ? "You barely felt it." : misery < 60 ? "A character building experience." : "Please go outside.";
    state.resultText = `I survived Words Per Misery. ${wpm} WPM, ${accuracy}% accuracy, Misery Index ${misery}. Rank: ${rank}.`;
    const best = Number(localStorage.getItem("wpm_best") || 0);
    if (wpm > best) localStorage.setItem("wpm_best", String(wpm));
    updateBest(); setScreen(els.results);
  }
  function updateBest() {
    const best = localStorage.getItem("wpm_best");
    els.best.textContent = best ? `Best score: ${best} WPM` : "";
  }
  els.startButton.addEventListener("click", startRun);
  els.retryButton.addEventListener("click", startRun);
  els.copyButton.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(state.resultText); els.copyStatus.textContent = "Result copied."; }
    catch (error) { els.copyStatus.textContent = "Copy failed. Select the result from your imagination."; }
  });
  window.addEventListener("keydown", handleKeydown);
  updateBest();
  els.mercy.checked = prefersReducedMotion;
})();
