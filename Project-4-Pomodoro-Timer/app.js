// ============================================
// POMODORO TIMER - MAIN APPLICATION
// ============================================

'use strict';

// ============================================
// STATE MANAGEMENT MODULE
// ============================================

const State = {
    phase: 'work',
    isRunning: false,
    isPaused: false,
    remainingTime: 0,
    totalTime: 0,
    startTime: null,
    pausedTime: 0,
    currentSession: 1,
    completedSessions: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalFocusTime: 0,
    settings: {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        sessionsBeforeLongBreak: 4,
        autoStart: true,
        tickingSound: false,
        notifications: true,
        volume: 70,
        muted: false,
        theme: 'light'
    },
    weeklyStats: { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 },
    lastResetDate: null,
    
    init() {
        this.remainingTime = this.settings.workDuration * 60;
        this.totalTime = this.remainingTime;
        this.lastResetDate = this.getTodayKey();
        this.checkDailyReset();
    },
    
    getTodayKey() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    },
    
    getCurrentDayName() {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[new Date().getDay()];
    },
    
    checkDailyReset() {
        const today = this.getTodayKey();
        if (this.lastResetDate !== today) {
            this.completedSessions = 0;
            this.totalFocusTime = 0;
            this.currentStreak = 0;
            this.lastResetDate = today;
        }
    },
    
    startSession() {
        this.isRunning = true;
        this.isPaused = false;
        this.startTime = performance.now();
    },
    
    pauseSession() {
        this.isPaused = true;
        this.isRunning = false;
        this.pausedTime = this.remainingTime;
    },
    
    resumeSession() {
        this.isRunning = true;
        this.isPaused = false;
        this.remainingTime = this.pausedTime;
        this.startTime = performance.now();
    },
    
    resetSession() {
        this.isRunning = false;
        this.isPaused = false;
        this.remainingTime = this.totalTime;
        this.startTime = null;
        this.pausedTime = 0;
    },
    
    completeSession() {
        if (this.phase === 'work') {
            this.completedSessions++;
            this.currentStreak++;
            this.totalFocusTime += this.settings.workDuration;
            
            if (this.currentStreak > this.longestStreak) {
                this.longestStreak = this.currentStreak;
            }
            
            const today = this.getCurrentDayName();
            this.weeklyStats[today]++;
        }
        
        this.isRunning = false;
        this.isPaused = false;
    },
    
    nextPhase() {
        if (this.phase === 'work') {
            if (this.currentSession >= this.settings.sessionsBeforeLongBreak) {
                this.phase = 'longBreak';
                this.remainingTime = this.settings.longBreakDuration * 60;
                this.currentSession = 0;
            } else {
                this.phase = 'shortBreak';
                this.remainingTime = this.settings.shortBreakDuration * 60;
            }
            this.currentSession++;
        } else {
            this.phase = 'work';
            this.remainingTime = this.settings.workDuration * 60;
        }
        
        this.totalTime = this.remainingTime;
        this.isRunning = false;
        this.isPaused = false;
    },
    
    skipBreak() {
        if (this.phase !== 'work') {
            this.phase = 'work';
            this.remainingTime = this.settings.workDuration * 60;
            this.totalTime = this.remainingTime;
            this.isRunning = false;
            this.isPaused = false;
        }
    },
    
    updateSettings(newSettings) {
        Object.assign(this.settings, newSettings);
        
        if (!this.isRunning && !this.isPaused) {
            if (this.phase === 'work') {
                this.remainingTime = this.settings.workDuration * 60;
            } else if (this.phase === 'shortBreak') {
                this.remainingTime = this.settings.shortBreakDuration * 60;
            } else {
                this.remainingTime = this.settings.longBreakDuration * 60;
            }
            this.totalTime = this.remainingTime;
        }
    }
};

const Storage = {
    prefix: 'pomodoro:v1:',
    
    save() {
        try {
            const data = {
                settings: State.settings,
                completedSessions: State.completedSessions,
                totalFocusTime: State.totalFocusTime,
                longestStreak: State.longestStreak,
                currentStreak: State.currentStreak,
                weeklyStats: State.weeklyStats,
                lastResetDate: State.lastResetDate,
                currentSession: State.currentSession,
                phase: State.phase
            };
            
            localStorage.setItem(this.prefix + 'state', JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save state:', error);
        }
    },
    
    load() {
        try {
            const saved = localStorage.getItem(this.prefix + 'state');
            if (saved) {
                const data = JSON.parse(saved);
                
                if (data.settings) {
                    State.settings = { ...State.settings, ...data.settings };
                }
                
                State.completedSessions = data.completedSessions || 0;
                State.totalFocusTime = data.totalFocusTime || 0;
                State.longestStreak = data.longestStreak || 0;
                State.currentStreak = data.currentStreak || 0;
                State.weeklyStats = data.weeklyStats || State.weeklyStats;
                State.lastResetDate = data.lastResetDate || State.getTodayKey();
                State.currentSession = data.currentSession || 1;
                State.phase = data.phase || 'work';
                
                return true;
            }
        } catch (error) {
            console.error('Failed to load state:', error);
        }
        return false;
    }
};

const Timer = {
    intervalId: null,
    
    start() {
        if (this.intervalId) return;
        
        const tick = () => {
            if (!State.isRunning) {
                this.stop();
                return;
            }
            
            const now = performance.now();
            const elapsed = (now - State.startTime) / 1000;
            
            State.remainingTime = Math.max(0, State.totalTime - elapsed);
            
            UI.updateTimer();
            UI.updateProgress();
            
            if (State.remainingTime <= 0) {
                this.onComplete();
                return;
            }
            
            this.intervalId = requestAnimationFrame(tick);
        };
        
        this.intervalId = requestAnimationFrame(tick);
        
        if (State.settings.tickingSound) {
            Audio.startTicking();
        }
    },
    
    stop() {
        if (this.intervalId) {
            cancelAnimationFrame(this.intervalId);
            this.intervalId = null;
        }
        Audio.stopTicking();
    },
    
    onComplete() {
        this.stop();
        State.completeSession();
        Audio.playComplete();
        
        Notify.send(
            State.phase === 'work' ? 'Work Session Complete!' : 'Break Complete!',
            State.phase === 'work' ? 'Great job! Time for a break.' : 'Break is over. Ready to focus?'
        );
        
        State.nextPhase();
        Storage.save();
        UI.updateAll();
        
        if (State.settings.autoStart) {
            setTimeout(() => this.startSession(), 3000);
        }
    },
    
    startSession() {
        State.startSession();
        this.start();
        UI.updateAll();
    },
    
    pauseSession() {
        this.stop();
        State.pauseSession();
        UI.updateAll();
    },
    
    resumeSession() {
        State.resumeSession();
        this.start();
        UI.updateAll();
    },
    
    resetSession() {
        this.stop();
        State.resetSession();
        UI.updateAll();
    },
    
    skipBreak() {
        this.stop();
        State.skipBreak();
        UI.updateAll();
    }
};

const UI = {
    elements: {},
    
    init() {
        this.elements.timeDisplay = document.getElementById('timeDisplay');
        this.elements.timerStatus = document.getElementById('timerStatus');
        this.elements.sessionPhase = document.getElementById('sessionPhase');
        this.elements.sessionCount = document.getElementById('sessionCount');
        this.elements.progressRing = document.getElementById('progressRing');
        this.elements.startPauseBtn = document.getElementById('startPauseBtn');
        this.elements.resetBtn = document.getElementById('resetBtn');
        this.elements.skipBtn = document.getElementById('skipBtn');
        this.elements.completedSessions = document.getElementById('completedSessions');
        this.elements.totalFocusTime = document.getElementById('totalFocusTime');
        this.elements.longestStreak = document.getElementById('longestStreak');
        this.elements.workDuration = document.getElementById('workDuration');
        this.elements.shortBreakDuration = document.getElementById('shortBreakDuration');
        this.elements.longBreakDuration = document.getElementById('longBreakDuration');
        this.elements.sessionsBeforeLongBreak = document.getElementById('sessionsBeforeLongBreak');
        this.elements.autoStartToggle = document.getElementById('autoStartToggle');
        this.elements.tickingSoundToggle = document.getElementById('tickingSoundToggle');
        this.elements.notificationsToggle = document.getElementById('notificationsToggle');
        this.elements.muteBtn = document.getElementById('muteBtn');
        this.elements.volumeSlider = document.getElementById('volumeSlider');
        this.elements.volumeValue = document.getElementById('volumeValue');
        this.elements.themeToggle = document.getElementById('themeToggle');
        
        this.setupEventListeners();
        this.loadSettings();
        this.updateAll();
    },
    
    setupEventListeners() {
        this.elements.startPauseBtn.addEventListener('click', () => this.handleStartPause());
        this.elements.resetBtn.addEventListener('click', () => Timer.resetSession());
        this.elements.skipBtn.addEventListener('click', () => Timer.skipBreak());
        
        this.elements.workDuration.addEventListener('change', (e) => this.handleSettingChange('workDuration', e));
        this.elements.shortBreakDuration.addEventListener('change', (e) => this.handleSettingChange('shortBreakDuration', e));
        this.elements.longBreakDuration.addEventListener('change', (e) => this.handleSettingChange('longBreakDuration', e));
        this.elements.sessionsBeforeLongBreak.addEventListener('change', (e) => this.handleSettingChange('sessionsBeforeLongBreak', e));
        
        this.elements.autoStartToggle.addEventListener('change', (e) => {
            State.settings.autoStart = e.target.checked;
            Storage.save();
        });
        
        this.elements.tickingSoundToggle.addEventListener('change', (e) => {
            State.settings.tickingSound = e.target.checked;
            if (State.isRunning && e.target.checked) {
                Audio.startTicking();
            } else {
                Audio.stopTicking();
            }
            Storage.save();
        });
        
        this.elements.notificationsToggle.addEventListener('change', (e) => {
            State.settings.notifications = e.target.checked;
            if (e.target.checked) {
                Notify.requestPermission();
            }
            Storage.save();
        });
        
        this.elements.muteBtn.addEventListener('click', () => this.toggleMute());
        this.elements.volumeSlider.addEventListener('input', (e) => {
            State.settings.volume = parseInt(e.target.value);
            this.elements.volumeValue.textContent = `${State.settings.volume}%`;
            Audio.setVolume(State.settings.volume / 100);
            Storage.save();
        });
        
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    },
    
    handleStartPause() {
        if (State.isRunning) {
            Timer.pauseSession();
        } else if (State.isPaused) {
            Timer.resumeSession();
        } else {
            Timer.startSession();
        }
    },
    
    handleSettingChange(setting, event) {
        const input = event.target;
        const value = parseInt(input.value);
        const errorElement = document.getElementById(`${input.id}Error`);
        
        if (isNaN(value) || value < 1 || value > 120) {
            errorElement.textContent = 'Please enter a value between 1 and 120';
            input.classList.add('invalid');
            return;
        }
        
        errorElement.textContent = '';
        input.classList.remove('invalid');
        
        State.updateSettings({ [setting]: value });
        Storage.save();
        this.updateTimer();
    },
    
    toggleMute() {
        State.settings.muted = !State.settings.muted;
        this.elements.muteBtn.classList.toggle('muted', State.settings.muted);
        Audio.setMuted(State.settings.muted);
        Storage.save();
    },
    
    toggleTheme() {
        const newTheme = State.settings.theme === 'light' ? 'dark' : 'light';
        State.settings.theme = newTheme;
        document.documentElement.setAttribute('data-theme', newTheme);
        Storage.save();
    },
    
    handleKeyboard(event) {
        if (event.target.tagName === 'INPUT') return;
        
        switch(event.key.toLowerCase()) {
            case ' ':
                event.preventDefault();
                this.handleStartPause();
                break;
            case 'r':
                event.preventDefault();
                Timer.resetSession();
                break;
            case 's':
                event.preventDefault();
                Timer.skipBreak();
                break;
            case 'm':
                event.preventDefault();
                this.toggleMute();
                break;
        }
    },
    
    handleVisibilityChange() {
        if (document.hidden) {
            if (State.isRunning) {
                State.pausedTime = State.remainingTime;
            }
        } else {
            if (State.isRunning && State.startTime) {
                const elapsed = (performance.now() - State.startTime) / 1000;
                State.remainingTime = Math.max(0, State.totalTime - elapsed);
                this.updateTimer();
                this.updateProgress();
            }
        }
    },
    
    loadSettings() {
        this.elements.workDuration.value = State.settings.workDuration;
        this.elements.shortBreakDuration.value = State.settings.shortBreakDuration;
        this.elements.longBreakDuration.value = State.settings.longBreakDuration;
        this.elements.sessionsBeforeLongBreak.value = State.settings.sessionsBeforeLongBreak;
        this.elements.autoStartToggle.checked = State.settings.autoStart;
        this.elements.tickingSoundToggle.checked = State.settings.tickingSound;
        this.elements.notificationsToggle.checked = State.settings.notifications;
        this.elements.volumeSlider.value = State.settings.volume;
        this.elements.volumeValue.textContent = `${State.settings.volume}%`;
        this.elements.muteBtn.classList.toggle('muted', State.settings.muted);
        document.documentElement.setAttribute('data-theme', State.settings.theme);
    },
    
    updateTimer() {
        const minutes = Math.floor(State.remainingTime / 60);
        const seconds = Math.floor(State.remainingTime % 60);
        this.elements.timeDisplay.textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        document.title = `${this.elements.timeDisplay.textContent} - Pomodoro Timer`;
    },
    
    updateProgress() {
        const progress = State.remainingTime / State.totalTime;
        const circumference = 2 * Math.PI * 140;
        const offset = circumference * (1 - progress);
        
        this.elements.progressRing.style.strokeDashoffset = offset;
        
        this.elements.progressRing.className = 'progress-ring-circle';
        if (State.phase === 'shortBreak') {
            this.elements.progressRing.classList.add('break');
        } else if (State.phase === 'longBreak') {
            this.elements.progressRing.classList.add('long-break');
        }
    },
    
    updateSessionInfo() {
        let phaseText = 'Work Session';
        this.elements.sessionPhase.className = 'session-phase';
        
        if (State.phase === 'shortBreak') {
            phaseText = 'Short Break';
            this.elements.sessionPhase.classList.add('break');
        } else if (State.phase === 'longBreak') {
            phaseText = 'Long Break';
            this.elements.sessionPhase.classList.add('long-break');
        }
        
        this.elements.sessionPhase.textContent = phaseText;
        
        const totalSessions = State.settings.sessionsBeforeLongBreak;
        const currentInCycle = State.phase === 'work' ? State.currentSession : State.currentSession - 1;
        this.elements.sessionCount.textContent = `Session ${currentInCycle} of ${totalSessions}`;
    },
    
    updateTimerStatus() {
        let status = 'Ready to focus';
        
        if (State.isRunning) {
            status = State.phase === 'work' ? 'Stay focused!' : 'Take a break';
        } else if (State.isPaused) {
            status = 'Paused';
        }
        
        this.elements.timerStatus.textContent = status;
    },
    
    updateControls() {
        const startPauseBtn = this.elements.startPauseBtn;
        const icon = startPauseBtn.querySelector('svg');
        const text = startPauseBtn.querySelector('span');
        
        if (State.isRunning) {
            icon.innerHTML = '<rect x="6" y="4" width="4" height="16" fill="currentColor"></rect><rect x="14" y="4" width="4" height="16" fill="currentColor"></rect>';
            text.textContent = 'Pause';
            startPauseBtn.classList.add('paused');
            startPauseBtn.setAttribute('aria-label', 'Pause timer');
        } else {
            icon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3" fill="currentColor"></polygon>';
            text.textContent = State.isPaused ? 'Resume' : 'Start';
            startPauseBtn.classList.remove('paused');
            startPauseBtn.setAttribute('aria-label', State.isPaused ? 'Resume timer' : 'Start timer');
        }
        
        this.elements.skipBtn.disabled = State.phase === 'work';
    },
    
    updateStats() {
        this.elements.completedSessions.textContent = State.completedSessions;
        this.elements.totalFocusTime.textContent = `${State.totalFocusTime}m`;
        this.elements.longestStreak.textContent = State.longestStreak;
        this.updateWeeklyChart();
    },
    
    updateWeeklyChart() {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const maxSessions = Math.max(...Object.values(State.weeklyStats), 1);
        
        days.forEach(day => {
            const bar = document.querySelector(`.chart-bar[data-day="${day}"] .bar-fill`);
            const sessions = State.weeklyStats[day] || 0;
            const height = (sessions / maxSessions) * 100;
            
            bar.style.height = `${height}%`;
            bar.setAttribute('data-value', sessions);
        });
    },
    
    updateAll() {
        this.updateTimer();
        this.updateProgress();
        this.updateSessionInfo();
        this.updateTimerStatus();
        this.updateControls();
        this.updateStats();
    }
};

const Audio = {
    context: null,
    tickingInterval: null,
    gainNode: null,
    
    init() {
        document.addEventListener('click', () => this.createContext(), { once: true });
    },
    
    createContext() {
        if (!this.context) {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.context.createGain();
            this.gainNode.connect(this.context.destination);
            this.setVolume(State.settings.volume / 100);
        }
    },
    
    setVolume(volume) {
        if (this.gainNode) {
            this.gainNode.gain.value = State.settings.muted ? 0 : volume;
        }
    },
    
    setMuted(muted) {
        if (this.gainNode) {
            this.gainNode.gain.value = muted ? 0 : State.settings.volume / 100;
        }
    },
    
    playComplete() {
        if (!this.context || State.settings.muted) return;
        
        this.createContext();
        
        const now = this.context.currentTime;
        const frequencies = [523.25, 659.25, 783.99];
        
        frequencies.forEach((freq, index) => {
            const oscillator = this.context.createOscillator();
            const envelope = this.context.createGain();
            
            oscillator.connect(envelope);
            envelope.connect(this.gainNode);
            
            oscillator.frequency.value = freq;
            oscillator.type = 'sine';
            
            const startTime = now + (index * 0.15);
            envelope.gain.setValueAtTime(0, startTime);
            envelope.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
            envelope.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + 0.4);
        });
    },
    
    startTicking() {
        if (this.tickingInterval || State.settings.muted) return;
        
        this.createContext();
        
        this.tickingInterval = setInterval(() => {
            if (!this.context || State.settings.muted) return;
            
            const oscillator = this.context.createOscillator();
            const envelope = this.context.createGain();
            
            oscillator.connect(envelope);
            envelope.connect(this.gainNode);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            const now = this.context.currentTime;
            envelope.gain.setValueAtTime(0, now);
            envelope.gain.linearRampToValueAtTime(0.1, now + 0.01);
            envelope.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            
            oscillator.start(now);
            oscillator.stop(now + 0.05);
        }, 1000);
    },
    
    stopTicking() {
        if (this.tickingInterval) {
            clearInterval(this.tickingInterval);
            this.tickingInterval = null;
        }
    }
};

const Notify = {
    permission: 'default',
    
    init() {
        if ('Notification' in window) {
            this.permission = Notification.permission;
            
            if (State.settings.notifications && this.permission === 'default') {
                this.requestPermission();
            }
        }
    },
    
    async requestPermission() {
        if (!('Notification' in window)) return false;
        
        try {
            this.permission = await Notification.requestPermission();
            return this.permission === 'granted';
        } catch (error) {
            console.error('Failed to request notification permission:', error);
            return false;
        }
    },
    
    send(title, body) {
        if (!State.settings.notifications) return;
        
        if ('Notification' in window && this.permission === 'granted' && document.hidden) {
            const notification = new Notification(title, {
                body: body,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🍅</text></svg>',
                tag: 'pomodoro-timer',
                requireInteraction: false
            });
            
            setTimeout(() => notification.close(), 5000);
            
            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        } else {
            this.showBanner(title, body);
        }
    },
    
    showBanner(title, body) {
        const banner = document.getElementById('notificationBanner');
        banner.innerHTML = `<strong>${title}</strong><br>${body}`;
        banner.classList.add('show');
        
        setTimeout(() => {
            banner.classList.remove('show');
        }, 5000);
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    Storage.load();
    State.init();
    UI.init();
    Audio.init();
    Notify.init();
    
    // Detect system theme preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && !Storage.load()) {
        State.settings.theme = 'dark';
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem(Storage.prefix + 'state')) {
            State.settings.theme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', State.settings.theme);
        }
    });
    
    // Save state before unload
    window.addEventListener('beforeunload', () => {
        Storage.save();
    });
    
    // Periodic save (every 30 seconds)
    setInterval(() => {
        Storage.save();
    }, 30000);
});
