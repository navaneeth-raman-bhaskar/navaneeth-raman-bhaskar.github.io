/**
 * System Settings Application for macOS Sonoma Portfolio
 * Supports:
 * - Dark / Light / Auto Appearance switcher
 * - Custom Accent Color picker
 * - Wallpaper Presets
 * - Desktop & Dock preferences (size, magnification, clock seconds, date)
 * - Sound & Motion settings (Web Audio sound synthesizer, reduce motion)
 * - About This Mac (System & Architecture Specifications)
 */
function initializeSettings({ openApp, applyTheme: globalApplyTheme } = {}) {
    const html = document.documentElement;
    const body = document.body;

    // Wallpaper Presets
    const WALLPAPERS = {
        sonoma: {
            name: "Sonoma Sunset",
            desc: "Dynamic vibrant gradient (macOS Default)",
            dark: "radial-gradient(ellipse 55% 86% at 8% 17%, rgba(255, 70, 129, .94), transparent 61%), radial-gradient(ellipse 57% 95% at 78% 2%, rgba(136, 87, 255, .98), transparent 59%), radial-gradient(ellipse 72% 59% at 56% 93%, rgba(31, 157, 255, .95), transparent 62%), linear-gradient(145deg, #27134f 0%, #111b48 52%, #07162f 100%)",
            light: "radial-gradient(ellipse 55% 86% at 8% 17%, rgba(255, 102, 149, .93), transparent 61%), radial-gradient(ellipse 57% 95% at 78% 2%, rgba(155, 115, 255, .94), transparent 59%), radial-gradient(ellipse 72% 59% at 56% 93%, rgba(49, 171, 255, .9), transparent 62%), linear-gradient(145deg, #8053b6 0%, #5468bf 52%, #277fbd 100%)",
            preview: "linear-gradient(135deg, #ff4681 0%, #8857ff 50%, #1f9dff 100%)"
        },
        monterey: {
            name: "Monterey Indigo",
            desc: "Deep twilight purple and royal navy",
            dark: "radial-gradient(ellipse 65% 80% at 20% 20%, rgba(120, 40, 200, .9), transparent 60%), radial-gradient(ellipse 60% 70% at 80% 80%, rgba(20, 100, 240, .9), transparent 60%), linear-gradient(135deg, #0d0f2b 0%, #171b4a 50%, #080d26 100%)",
            light: "radial-gradient(ellipse 65% 80% at 20% 20%, rgba(150, 70, 230, .85), transparent 60%), radial-gradient(ellipse 60% 70% at 80% 80%, rgba(50, 130, 255, .85), transparent 60%), linear-gradient(135deg, #6c63b5 0%, #4852a3 50%, #2f367e 100%)",
            preview: "linear-gradient(135deg, #7828c8 0%, #171b4a 50%, #1464f0 100%)"
        },
        ventura: {
            name: "Ventura Amber",
            desc: "Warm golden sunlight and dusky bronze",
            dark: "radial-gradient(ellipse 60% 80% at 20% 10%, rgba(255, 140, 0, .85), transparent 60%), radial-gradient(ellipse 70% 70% at 80% 90%, rgba(220, 60, 20, .85), transparent 60%), linear-gradient(145deg, #3d1b06 0%, #2a1102 50%, #150800 100%)",
            light: "radial-gradient(ellipse 60% 80% at 20% 10%, rgba(255, 160, 30, .85), transparent 60%), radial-gradient(ellipse 70% 70% at 80% 90%, rgba(240, 90, 40, .85), transparent 60%), linear-gradient(145deg, #c77732 0%, #994c19 50%, #662c08 100%)",
            preview: "linear-gradient(135deg, #ff8c00 0%, #dc3c14 50%, #3d1b06 100%)"
        },
        obsidian: {
            name: "Obsidian OLED",
            desc: "Minimalist stealth dark graphite",
            dark: "radial-gradient(ellipse 80% 80% at 50% 20%, rgba(55, 65, 81, .5), transparent 70%), linear-gradient(180deg, #121417 0%, #090a0c 100%)",
            light: "radial-gradient(ellipse 80% 80% at 50% 20%, rgba(180, 190, 205, .5), transparent 70%), linear-gradient(180deg, #e2e5eb 0%, #cbd2dc 100%)",
            preview: "linear-gradient(135deg, #374151 0%, #121417 50%, #090a0c 100%)"
        },
        daybreak: {
            name: "Daybreak Sky",
            desc: "Crisp airy cyan and soft lavender",
            dark: "radial-gradient(ellipse 70% 70% at 20% 30%, rgba(56, 189, 248, .8), transparent 60%), radial-gradient(ellipse 60% 70% at 80% 70%, rgba(167, 139, 250, .8), transparent 60%), linear-gradient(135deg, #1e3a5f 0%, #0f2440 100%)",
            light: "radial-gradient(ellipse 70% 70% at 20% 30%, rgba(56, 189, 248, .85), transparent 60%), radial-gradient(ellipse 60% 70% at 80% 70%, rgba(167, 139, 250, .85), transparent 60%), linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)",
            preview: "linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #a78bfa 100%)"
        }
    };

    // ACCENT COLOR MAP
    const ACCENT_COLORS = {
        blue: { color: "#0a84ff", glow: "rgba(10, 132, 255, 0.24)", name: "Blue" },
        purple: { color: "#a855f7", glow: "rgba(168, 85, 247, 0.24)", name: "Purple" },
        pink: { color: "#ec4899", glow: "rgba(236, 72, 153, 0.24)", name: "Pink" },
        red: { color: "#ef4444", glow: "rgba(239, 68, 68, 0.24)", name: "Red" },
        orange: { color: "#f97316", glow: "rgba(249, 115, 22, 0.24)", name: "Orange" },
        green: { color: "#10b981", glow: "rgba(16, 185, 129, 0.24)", name: "Green" },
        graphite: { color: "#8e8e93", glow: "rgba(142, 142, 147, 0.24)", name: "Graphite" }
    };

    // Load initial state from localStorage
    const settingsState = {
        theme: "dark",
        accent: "blue",
        wallpaper: "sonoma",
        dockSize: "default",
        dockMagnify: true,
        showSeconds: false,
        showDate: true,
        soundEffects: true,
        reduceMotion: false
    };

    try {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) settingsState.theme = storedTheme;
        const storedAccent = localStorage.getItem("settings_accent");
        if (storedAccent && ACCENT_COLORS[storedAccent]) settingsState.accent = storedAccent;
        const storedWallpaper = localStorage.getItem("settings_wallpaper");
        if (storedWallpaper && WALLPAPERS[storedWallpaper]) settingsState.wallpaper = storedWallpaper;
        const storedDockSize = localStorage.getItem("settings_dock_size");
        if (storedDockSize) settingsState.dockSize = storedDockSize;
        const storedMagnify = localStorage.getItem("settings_dock_magnify");
        if (storedMagnify !== null) settingsState.dockMagnify = storedMagnify === "true";
        const storedSeconds = localStorage.getItem("settings_clock_seconds");
        if (storedSeconds !== null) settingsState.showSeconds = storedSeconds === "true";
        const storedDate = localStorage.getItem("settings_clock_date");
        if (storedDate !== null) settingsState.showDate = storedDate === "true";
        const storedSound = localStorage.getItem("settings_sound_effects");
        if (storedSound !== null) settingsState.soundEffects = storedSound === "true";
        const storedMotion = localStorage.getItem("settings_reduce_motion");
        if (storedMotion !== null) settingsState.reduceMotion = storedMotion === "true";
    } catch {}

    // Web Audio synthesizer for tactile macOS sound effects
    let audioCtx = null;
    function playSystemSound(type = "click") {
        if (!settingsState.soundEffects) return;
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === "suspended") {
                audioCtx.resume();
            }
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            const now = audioCtx.currentTime;
            if (type === "click") {
                osc.type = "sine";
                osc.frequency.setValueAtTime(880, now);
                osc.frequency.exponentialRampToValueAtTime(320, now + 0.035);
                gain.gain.setValueAtTime(0.09, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
                osc.start(now);
                osc.stop(now + 0.035);
            } else if (type === "pop") {
                osc.type = "triangle";
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(950, now + 0.05);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
            } else if (type === "switch") {
                osc.type = "sine";
                osc.frequency.setValueAtTime(650, now);
                gain.gain.setValueAtTime(0.07, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
                osc.start(now);
                osc.stop(now + 0.04);
            }
        } catch {}
    }
    window.playSystemSound = playSystemSound;

    // Apply Accent Color
    function applyAccentColor(accentKey) {
        const item = ACCENT_COLORS[accentKey] || ACCENT_COLORS.blue;
        settingsState.accent = accentKey;
        html.style.setProperty("--accent", item.color);
        html.style.setProperty("--accent-glow", item.glow);

        try {
            localStorage.setItem("settings_accent", accentKey);
        } catch {}

        document.querySelectorAll(".settings-accent-dot").forEach((dot) => {
            const isMatch = dot.dataset.accent === accentKey;
            dot.classList.toggle("selected", isMatch);
            dot.setAttribute("aria-checked", String(isMatch));
        });
    }

    // Apply Wallpaper
    function applyWallpaper(wallpaperKey) {
        const wp = WALLPAPERS[wallpaperKey] || WALLPAPERS.sonoma;
        settingsState.wallpaper = wallpaperKey;
        const isLight = body.dataset.theme === "light";
        const gradient = isLight ? wp.light : wp.dark;
        html.style.setProperty("--wallpaper", gradient);

        try {
            localStorage.setItem("settings_wallpaper", wallpaperKey);
        } catch {}

        document.querySelectorAll(".settings-wallpaper-card").forEach((card) => {
            const isMatch = card.dataset.wallpaper === wallpaperKey;
            card.classList.toggle("selected", isMatch);
            card.setAttribute("aria-checked", String(isMatch));
        });

        const previewBanner = document.getElementById("settingsWallpaperPreview");
        if (previewBanner) {
            previewBanner.style.background = wp.preview;
        }
    }

    // Apply Dock Size
    function applyDockSize(size) {
        settingsState.dockSize = size;
        const dock = document.querySelector(".dock");
        if (!dock) return;
        dock.classList.remove("dock-size-small", "dock-size-default", "dock-size-large");
        dock.classList.add(`dock-size-${size}`);

        try {
            localStorage.setItem("settings_dock_size", size);
        } catch {}

        document.querySelectorAll("[data-dock-size]").forEach((btn) => {
            const isMatch = btn.dataset.dockSize === size;
            btn.classList.toggle("selected", isMatch);
            btn.setAttribute("aria-pressed", String(isMatch));
        });
    }

    // Apply Dock Magnification
    function applyDockMagnify(enabled) {
        settingsState.dockMagnify = enabled;
        const dock = document.querySelector(".dock");
        if (dock) {
            dock.classList.toggle("dock-no-magnify", !enabled);
        }
        try {
            localStorage.setItem("settings_dock_magnify", String(enabled));
        } catch {}

        const toggle = document.getElementById("settingsDockMagnifyToggle");
        if (toggle) toggle.checked = enabled;
    }

    // Apply Clock Preferences
    let clockIntervalId = null;
    function applyClockSettings() {
        const statusDate = document.getElementById("statusDate");
        const statusClock = document.getElementById("statusClock");
        const statusTime = document.getElementById("statusTime");
        if (!statusClock) return;

        if (statusDate) {
            statusDate.style.display = settingsState.showDate ? "inline" : "none";
        }

        function updateClockDisplay() {
            const now = new Date();
            if (statusDate && settingsState.showDate) {
                statusDate.textContent = new Intl.DateTimeFormat(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                }).format(now).replace(",", "");
            }

            const options = {
                hour: "numeric",
                minute: "2-digit"
            };
            if (settingsState.showSeconds) {
                options.second = "2-digit";
            }
            statusClock.textContent = new Intl.DateTimeFormat(undefined, options).format(now);
            if (statusTime) statusTime.dateTime = now.toISOString();
        }

        if (clockIntervalId) window.clearInterval(clockIntervalId);
        updateClockDisplay();
        const tickRate = settingsState.showSeconds ? 1000 : 30000;
        clockIntervalId = window.setInterval(updateClockDisplay, tickRate);

        try {
            localStorage.setItem("settings_clock_seconds", String(settingsState.showSeconds));
            localStorage.setItem("settings_clock_date", String(settingsState.showDate));
        } catch {}

        const secondsToggle = document.getElementById("settingsClockSecondsToggle");
        if (secondsToggle) secondsToggle.checked = settingsState.showSeconds;
        const dateToggle = document.getElementById("settingsClockDateToggle");
        if (dateToggle) dateToggle.checked = settingsState.showDate;
    }

    // Apply Sound Effects
    function applySoundSettings(enabled) {
        settingsState.soundEffects = enabled;
        try {
            localStorage.setItem("settings_sound_effects", String(enabled));
        } catch {}
        const toggle = document.getElementById("settingsSoundToggle");
        if (toggle) toggle.checked = enabled;
    }

    // Apply Reduce Motion
    function applyReduceMotion(enabled) {
        settingsState.reduceMotion = enabled;
        body.classList.toggle("reduce-motion", enabled);
        try {
            localStorage.setItem("settings_reduce_motion", String(enabled));
        } catch {}
        const toggle = document.getElementById("settingsMotionToggle");
        if (toggle) toggle.checked = enabled;
    }

    // Apply Appearance (Sync with System / Theme button)
    function applySettingsTheme(theme) {
        settingsState.theme = theme;
        if (theme === "auto") {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            if (typeof globalApplyTheme === "function") {
                globalApplyTheme(prefersDark ? "dark" : "light");
            }
        } else if (typeof globalApplyTheme === "function") {
            globalApplyTheme(theme);
        }

        try {
            localStorage.setItem("theme", theme);
        } catch {}

        document.querySelectorAll(".settings-theme-card").forEach((card) => {
            const isMatch = card.dataset.themeChoice === theme;
            card.classList.toggle("selected", isMatch);
            card.setAttribute("aria-checked", String(isMatch));
        });

        // Reapply current wallpaper palette for the theme
        applyWallpaper(settingsState.wallpaper);
    }

    // Listen to OS theme changes for auto mode
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (settingsState.theme === "auto" && typeof globalApplyTheme === "function") {
            globalApplyTheme(e.matches ? "dark" : "light");
            applyWallpaper(settingsState.wallpaper);
        }
    });

    // Sidebar navigation between settings panes
    const navItems = [...document.querySelectorAll(".settings-nav-item")];
    const panes = [...document.querySelectorAll(".settings-pane")];

    function switchPane(paneId) {
        playSystemSound("click");
        navItems.forEach((btn) => {
            const isMatch = btn.dataset.settingsPane === paneId;
            btn.classList.toggle("active", isMatch);
            btn.setAttribute("aria-selected", String(isMatch));
        });
        panes.forEach((pane) => {
            const isMatch = pane.dataset.pane === paneId;
            pane.classList.toggle("active", isMatch);
            pane.hidden = !isMatch;
        });
    }

    navItems.forEach((btn) => {
        btn.addEventListener("click", () => {
            const paneId = btn.dataset.settingsPane;
            if (paneId) switchPane(paneId);
        });
    });

    // Theme Choice Cards
    document.querySelectorAll(".settings-theme-card").forEach((card) => {
        card.addEventListener("click", () => {
            playSystemSound("switch");
            const choice = card.dataset.themeChoice;
            if (choice) applySettingsTheme(choice);
        });
    });

    // Accent Color Swatches
    document.querySelectorAll(".settings-accent-dot").forEach((dot) => {
        dot.addEventListener("click", () => {
            playSystemSound("click");
            const accent = dot.dataset.accent;
            if (accent) applyAccentColor(accent);
        });
    });

    // Wallpaper Preset Cards
    document.querySelectorAll(".settings-wallpaper-card").forEach((card) => {
        card.addEventListener("click", () => {
            playSystemSound("pop");
            const wp = card.dataset.wallpaper;
            if (wp) applyWallpaper(wp);
        });
    });

    // Dock Size Control
    document.querySelectorAll("[data-dock-size]").forEach((btn) => {
        btn.addEventListener("click", () => {
            playSystemSound("click");
            const size = btn.dataset.dockSize;
            if (size) applyDockSize(size);
        });
    });

    // Dock Magnification Toggle
    const dockMagnifyToggle = document.getElementById("settingsDockMagnifyToggle");
    if (dockMagnifyToggle) {
        dockMagnifyToggle.addEventListener("change", (e) => {
            playSystemSound("switch");
            applyDockMagnify(e.target.checked);
        });
    }

    // Clock Seconds Toggle
    const clockSecondsToggle = document.getElementById("settingsClockSecondsToggle");
    if (clockSecondsToggle) {
        clockSecondsToggle.addEventListener("change", (e) => {
            playSystemSound("switch");
            settingsState.showSeconds = e.target.checked;
            applyClockSettings();
        });
    }

    // Clock Date Toggle
    const clockDateToggle = document.getElementById("settingsClockDateToggle");
    if (clockDateToggle) {
        clockDateToggle.addEventListener("change", (e) => {
            playSystemSound("switch");
            settingsState.showDate = e.target.checked;
            applyClockSettings();
        });
    }

    // Sound Effects Toggle
    const soundToggle = document.getElementById("settingsSoundToggle");
    if (soundToggle) {
        soundToggle.addEventListener("change", (e) => {
            applySoundSettings(e.target.checked);
            playSystemSound("switch");
        });
    }

    // Play Sound Test Button
    const testSoundBtn = document.getElementById("settingsTestSoundBtn");
    if (testSoundBtn) {
        testSoundBtn.addEventListener("click", () => {
            playSystemSound("pop");
        });
    }

    // Reduce Motion Toggle
    const motionToggle = document.getElementById("settingsMotionToggle");
    if (motionToggle) {
        motionToggle.addEventListener("change", (e) => {
            playSystemSound("switch");
            applyReduceMotion(e.target.checked);
        });
    }

    // Settings Search Filtering
    const searchInput = document.getElementById("settingsSearchInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (!query) {
                navItems.forEach((item) => (item.style.display = "flex"));
                return;
            }
            let firstMatchedPane = null;
            navItems.forEach((item) => {
                const paneId = item.dataset.settingsPane;
                const pane = document.querySelector(`.settings-pane[data-pane="${paneId}"]`);
                const itemText = item.textContent.toLowerCase();
                const paneText = pane ? pane.textContent.toLowerCase() : "";
                const matches = itemText.includes(query) || paneText.includes(query);
                item.style.display = matches ? "flex" : "none";
                if (matches && !firstMatchedPane) {
                    firstMatchedPane = paneId;
                }
            });
            if (firstMatchedPane) {
                switchPane(firstMatchedPane);
            }
        });
    }

    // About Pane Action Buttons
    const openTerminalBtn = document.getElementById("settingsOpenTerminal");
    if (openTerminalBtn) {
        openTerminalBtn.addEventListener("click", () => {
            playSystemSound("pop");
            if (openApp) openApp("terminal");
        });
    }

    const openResumeBtn = document.getElementById("settingsOpenResume");
    if (openResumeBtn) {
        openResumeBtn.addEventListener("click", () => {
            playSystemSound("pop");
            if (typeof window.openPdfDocument === "function") {
                window.openPdfDocument("Resume.pdf", "desktop");
            } else if (openApp) {
                openApp("pdf");
            }
        });
    }

    const openContactBtn = document.getElementById("settingsOpenContact");
    if (openContactBtn) {
        openContactBtn.addEventListener("click", () => {
            playSystemSound("pop");
            if (openApp) openApp("contact");
        });
    }

    // Global Dock audio feedback
    document.querySelectorAll(".dock-item").forEach((item) => {
        item.addEventListener("click", () => {
            playSystemSound("pop");
        });
    });

    // Initialize initial state values on load
    applyAccentColor(settingsState.accent);
    applyWallpaper(settingsState.wallpaper);
    applyDockSize(settingsState.dockSize);
    applyDockMagnify(settingsState.dockMagnify);
    applyClockSettings();
    applySoundSettings(settingsState.soundEffects);
    applyReduceMotion(settingsState.reduceMotion);

    // Sync theme UI cards with initial theme
    const activeTheme = body.dataset.theme === "light" ? "light" : "dark";
    document.querySelectorAll(".settings-theme-card").forEach((card) => {
        const isMatch = card.dataset.themeChoice === (settingsState.theme === "auto" ? "auto" : activeTheme);
        card.classList.toggle("selected", isMatch);
        card.setAttribute("aria-checked", String(isMatch));
    });

    // Expose global helper for theme switcher in top bar to keep Settings in sync
    window.syncSettingsTheme = (theme) => {
        settingsState.theme = theme;
        document.querySelectorAll(".settings-theme-card").forEach((card) => {
            const isMatch = card.dataset.themeChoice === theme;
            card.classList.toggle("selected", isMatch);
            card.setAttribute("aria-checked", String(isMatch));
        });
        applyWallpaper(settingsState.wallpaper);
    };
}
