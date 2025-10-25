(() => {
  'use strict';

  // Elements
  const $ = (sel, scope=document) => scope.querySelector(sel);
  const $$ = (sel, scope=document) => Array.from(scope.querySelectorAll(sel));

  const appRoot = document.documentElement;
  const ring = $('#progress-ring');
  const timeDisplay = $('#time-display');
  const sessionInfo = $('#pomo-count');
  const startBtn = $('#btn-start');
  const pauseBtn = $('#btn-pause');
  const resetBtn = $('#btn-reset');
  const skipBtn = $('#btn-skip');
  const tabs = $$('.chip[data-mode]');
  const modeGif = $('#mode-gif');
  const toast = $('#toast');

  // Settings dialog
  const openSettingsBtn = $('#open-settings');
  const toggleThemeBtn = $('#toggle-theme');
  const settingsDialog = $('#settings-dialog');
  const settingsForm = $('#settings-form');
  const setPomodoro = $('#set-pomodoro');
  const setShort = $('#set-short');
  const setLong = $('#set-long');
  const setIntervalInp = $('#set-interval');
  const setAuto = $('#set-auto');
  const setNotify = $('#set-notify');
  const setSound = $('#set-sound');
  const saveSettingsBtn = $('#save-settings');
  const closeSettingsBtn = $('#close-settings');

  // Tasks
  const taskForm = $('#task-form');
  const taskInput = $('#task-input');
  const taskList = $('#task-list');

  // Gifs per mode
  const GIFS = {
    pomodoro: 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif', // cat typing
    short: 'https://media.giphy.com/media/WoWm8YzFQJg5i/giphy.gif',     // cat stretch
    long: 'https://media.giphy.com/media/13borq7Zo2kulO/giphy.gif'      // cat sleeping
  };

  // State
  const DEFAULTS = {
    durations: { pomodoro: 25, short: 5, long: 15 }, // minutes
    interval: 4,
    auto: false,
    notify: false,
    sound: true,
    theme: 'dark'
  };

  const storage = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
    }
  };

  let settings = storage.get('pomodoro:settings', DEFAULTS);
  // Migrate missing keys safely
  settings = { ...DEFAULTS, ...settings, durations: { ...DEFAULTS.durations, ...(settings.durations||{}) } };
  applyTheme(settings.theme);

  const state = {
    mode: 'pomodoro', // 'pomodoro' | 'short' | 'long'
    running: false,
    startTime: 0,
    endTime: 0,
    totalMs: minsToMs(settings.durations.pomodoro),
    remainingMs: minsToMs(settings.durations.pomodoro),
    completedToday: getTodayCount(),
    pomosSinceLong: 0,
    tickId: 0
  };
  updatePomoCountUI();
  updateModeAttributes();
  updateTimeUI(state.remainingMs, state.totalMs);

  // Bind events
  startBtn.addEventListener('click', start);
  pauseBtn.addEventListener('click', pause);
  resetBtn.addEventListener('click', () => reset());
  skipBtn.addEventListener('click', () => finishSession(true));
  tabs.forEach(tab => tab.addEventListener('click', () => setMode(tab.dataset.mode)));

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    if (e.code === 'Space') { e.preventDefault(); state.running ? pause() : start(); }
    if (e.key === 'r' || e.key === 'R') { reset(); }
    if (e.key === 'n' || e.key === 'N') { finishSession(true); }
    if (e.key === '1') setMode('pomodoro');
    if (e.key === '2') setMode('short');
    if (e.key === '3') setMode('long');
  });

  // Settings dialog
  openSettingsBtn.addEventListener('click', () => {
    setPomodoro.value = settings.durations.pomodoro;
    setShort.value = settings.durations.short;
    setLong.value = settings.durations.long;
    setIntervalInp.value = settings.interval;
    setAuto.checked = settings.auto;
    setNotify.checked = settings.notify;
    setSound.checked = settings.sound;
    settingsDialog.showModal();
  });

  closeSettingsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    settingsDialog.close();
  });

  saveSettingsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const next = {
      durations: {
        pomodoro: clampInt(setPomodoro.value, 1, 120),
        short: clampInt(setShort.value, 1, 60),
        long: clampInt(setLong.value, 1, 60)
      },
      interval: clampInt(setIntervalInp.value, 1, 12),
      auto: !!setAuto.checked,
      notify: !!setNotify.checked,
      sound: !!setSound.checked,
      theme: settings.theme
    };
    settings = next;
    storage.set('pomodoro:settings', settings);
    showToast('Settings saved');
    settingsDialog.close();
    // If current mode duration changed, reset timer visuals
    setMode(state.mode, { keepModeActive: true });
    if (settings.notify) maybeRequestNotificationPermission();
  });

  toggleThemeBtn.addEventListener('click', () => {
    const next = settings.theme === 'dark' ? 'light' : 'dark';
    settings.theme = next;
    storage.set('pomodoro:settings', settings);
    applyTheme(next);
    toggleThemeBtn.setAttribute('aria-pressed', String(next === 'light'));
  });

  // Tasks
  const tasks = storage.get('pomodoro:tasks', []);
  renderTasks();
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = (taskInput.value || '').trim();
    if (!title) return;
    tasks.push({ id: cryptoRandomId(), title, done: false });
    storage.set('pomodoro:tasks', tasks);
    taskInput.value = '';
    renderTasks();
  });

  function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(t => {
      const li = document.createElement('li');
      li.className = 'task-item' + (t.done ? ' completed' : '');
      li.setAttribute('data-id', t.id);
      li.innerHTML = `
        <input type="checkbox" ${t.done ? 'checked' : ''} aria-label="Complete task" />
        <div class="task-title">${escapeHtml(t.title)}</div>
        <div class="task-actions">
          <button class="btn ghost" data-act="up" title="Move up">▲</button>
          <button class="btn ghost" data-act="down" title="Move down">▼</button>
          <button class="btn" data-act="del" title="Delete">Delete</button>
        </div>
      `;
      const [checkbox] = li.getElementsByTagName('input');
      checkbox.addEventListener('change', () => {
        t.done = checkbox.checked; storage.set('pomodoro:tasks', tasks); renderTasks();
      });
      li.addEventListener('click', (e) => {
        const btn = e.target.closest('button'); if (!btn) return;
        const act = btn.getAttribute('data-act');
        const idx = tasks.findIndex(x => x.id === t.id);
        if (act === 'del') { tasks.splice(idx,1); }
        if (act === 'up' && idx > 0) { const [m] = tasks.splice(idx,1); tasks.splice(idx-1,0,m); }
        if (act === 'down' && idx < tasks.length-1) { const [m] = tasks.splice(idx,1); tasks.splice(idx+1,0,m); }
        storage.set('pomodoro:tasks', tasks); renderTasks();
      });
      taskList.appendChild(li);
    });
  }

  // Core timer functions
  function start() {
    if (state.running) return;
    const now = Date.now();
    // If just reset or initial, remainingMs is current; else resume from remaining
    state.startTime = now;
    state.endTime = now + state.remainingMs;
    state.running = true;
    startBtn.disabled = true; pauseBtn.disabled = false; resetBtn.disabled = false; skipBtn.disabled = false;
    tick();
    showToast('Timer started');
  }

  function pause() {
    if (!state.running) return;
    state.running = false;
    clearTimeout(state.tickId);
    state.remainingMs = Math.max(0, state.endTime - Date.now());
    startBtn.disabled = false; pauseBtn.disabled = true; // keep reset enabled
    document.title = formatTitle(state.remainingMs, state.mode);
    showToast('Paused');
  }

  function reset() {
    clearTimeout(state.tickId);
    state.running = false;
    const mins = getModeMins(state.mode);
    state.totalMs = minsToMs(mins);
    state.remainingMs = state.totalMs;
    startBtn.disabled = false; pauseBtn.disabled = true; resetBtn.disabled = true; skipBtn.disabled = true;
    updateTimeUI(state.remainingMs, state.totalMs);
    showToast('Reset');
  }

  function setMode(mode, opts={}) {
    if (!['pomodoro','short','long'].includes(mode)) return;
    const wasRunning = state.running;
    clearTimeout(state.tickId);
    state.mode = mode;
    const mins = getModeMins(mode);
    state.totalMs = minsToMs(mins);
    state.remainingMs = state.totalMs;
    state.running = false;
    updateModeAttributes();
    updateTimeUI(state.remainingMs, state.totalMs);
    startBtn.disabled = false; pauseBtn.disabled = true; resetBtn.disabled = true; skipBtn.disabled = true;
    tabs.forEach(t => {
      const active = t.dataset.mode === mode;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', String(active));
    });
    if (!opts.keepModeActive) {
      showToast(`${labelFor(mode)} ready`);
    }
    // restore running if switching mode while running? keep simple: stop.
  }

  function tick() {
    if (!state.running) return;
    const remaining = Math.max(0, state.endTime - Date.now());
    state.remainingMs = remaining;
    updateTimeUI(remaining, state.totalMs);
    document.title = formatTitle(remaining, state.mode);
    if (remaining <= 0) { finishSession(false); return; }
    // Aim updates roughly 100-250ms for smooth ring without heavy cost
    const nextIn = 200;
    state.tickId = setTimeout(tick, nextIn);
  }

  function finishSession(skipped) {
    clearTimeout(state.tickId);
    const wasMode = state.mode;
    state.running = false;
    startBtn.disabled = false; pauseBtn.disabled = true; skipBtn.disabled = true; resetBtn.disabled = true;
    updateTimeUI(0, state.totalMs);
    if (!skipped) {
      if (wasMode === 'pomodoro') {
        state.completedToday += 1;
        state.pomosSinceLong += 1;
        setTodayCount(state.completedToday);
        updatePomoCountUI();
      }
      if (settings.sound) playChime();
      if (settings.notify) notifyUser(nextModeFor(wasMode));
    }
    // Switch mode
    const nextMode = skipped ? nextModeFor(wasMode) : nextModeFor(wasMode);
    if (wasMode !== 'pomodoro') {
      // after any break, reset series if coming back to pomodoro
    }
    setMode(nextMode);
    if (settings.auto && !skipped) start();
  }

  function nextModeFor(mode) {
    if (mode === 'pomodoro') {
      // Long break after interval pomodoros
      if (state.pomosSinceLong >= (settings.interval - 1)) {
        state.pomosSinceLong = 0; return 'long';
      }
      return 'short';
    }
    return 'pomodoro';
  }

  // UI helpers
  function updateModeAttributes() {
    appRoot.setAttribute('data-mode', state.mode);
    modeGif.src = GIFS[state.mode] || GIFS.pomodoro;
  }

  function updateTimeUI(ms, totalMs) {
    timeDisplay.textContent = millisToMinutesAndSeconds(ms);
    const pct = 1 - (ms / Math.max(1, totalMs));
    const deg = Math.min(360, Math.max(0, pct * 360));
    ring.style.setProperty('--deg', `${deg}deg`);
  }

  function labelFor(mode) {
    return mode === 'pomodoro' ? 'Pomodoro' : mode === 'short' ? 'Short Break' : 'Long Break';
  }

  function getModeMins(mode) {
    return settings.durations[mode] || DEFAULTS.durations[mode];
  }

  function formatTitle(ms, mode) {
    return `${millisToMinutesAndSeconds(ms)} • ${labelFor(mode)} • Pomodoro Timer`;
  }

  function updatePomoCountUI() {
    sessionInfo.textContent = String(state.completedToday);
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 1700);
  }

  function playChime() {
    // Small pleasant tri-tone using Web Audio API (no assets needed)
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [880, 1174.66, 1567.98]; // A5, D6, G6
    const now = ctx.currentTime;
    notes.forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = freq;
      o.connect(g); g.connect(ctx.destination);
      const t0 = now + i * 0.12; const t1 = t0 + 0.2;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.4, t0 + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, t1);
      o.start(t0); o.stop(t1 + 0.01);
    });
  }

  function maybeRequestNotificationPermission() {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') Notification.requestPermission().catch(()=>{});
  }

  function notifyUser(nextMode) {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    const title = labelFor(nextMode) === 'Pomodoro' ? 'Time to focus!' : `Time for a ${labelFor(nextMode)} ✨`;
    const body = labelFor(nextMode) === 'Pomodoro' ? 'Start your next session and crush it.' : 'Stretch, hydrate, and chill for a bit.';
    try { new Notification(title, { body }); } catch {}
  }

  // Utils
  function minsToMs(m) { return Math.round(Number(m) * 60 * 1000); }
  function millisToMinutesAndSeconds(ms) {
    const total = Math.round(ms / 1000);
    const m = Math.floor(total / 60).toString().padStart(2, '0');
    const s = Math.max(0, total % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
  function clampInt(v, min, max) { v = parseInt(v,10); if (Number.isNaN(v)) v = min; return Math.min(max, Math.max(min, v)); }
  function escapeHtml(s) { return s.replace(/[&<>"]+/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
  function cryptoRandomId() {
    try {
      if (crypto?.randomUUID) return crypto.randomUUID();
      if (crypto?.getRandomValues) {
        const a = new Uint8Array(16); crypto.getRandomValues(a);
        return Array.from(a, x => x.toString(16).padStart(2, '0')).join('');
      }
    } catch {}
    // Fallback
    return 'id-' + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  }

  function getTodayKey() {
    const d = new Date();
    return `pomodoro:count:${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
  function getTodayCount() { return storage.get(getTodayKey(), 0); }
  function setTodayCount(v) { storage.set(getTodayKey(), v); }

  function applyTheme(theme) { document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark'); }

  // Initialize notification if user had opted in previously
  if (settings.notify) maybeRequestNotificationPermission();
})();
