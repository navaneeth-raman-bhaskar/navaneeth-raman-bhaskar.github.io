(() => {
    const body = document.body;
    const html = document.documentElement;
    const homeScreen = document.getElementById("desktopHome");
    const homeIndicator = document.getElementById("homeIndicator");
    const themeButton = document.getElementById("themeToggle");
    const statusTime = document.getElementById("statusTime");
    const statusDate = document.getElementById("statusDate");
    const statusClock = document.getElementById("statusClock");
    const menuAppName = document.getElementById("menuAppName");
    const appWindows = [...document.querySelectorAll(".desktop .window[data-window]")];
    const appIds = appWindows.map((app) => app.dataset.window);
    const folderIds = new Set(["experience", "skills", "education", "certifications", "awards", "references", "gallery", "contact"]);
    let lastLauncher = null;
    const labels = {
        files: "Finder",
        experience: "Experience",
        skills: "Skills",
        education: "Education",
        certifications: "Certifications",
        awards: "Awards",
        references: "References",
        gallery: "Media",
        contact: "Contact",
        terminal: "Terminal",
        pdf: "Adobe Acrobat",
        textedit: "TextEdit",
        settings: "System Settings",
    };

    // Portfolio sections are Finder folders. Their existing cards become files inside them.
    document.querySelectorAll("[data-open-app]").forEach((launcher) => {
        const id = launcher.dataset.openApp;
        if (!folderIds.has(id) || launcher.dataset.openMode === "app") return;
        launcher.dataset.openFolder = id;
        delete launcher.dataset.openApp;
        if (launcher.classList.contains("desktop-icon")) {
            const icon = launcher.querySelector(".app-icon");
            if (icon) {
                icon.className = "desktop-folder-icon";
                icon.innerHTML = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M4 13a4 4 0 0 1 4-4h12l5 5h15a4 4 0 0 1 4 4v17a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V13Z"/><path d="M5 19h39"/></svg>';
            }
        }
    });
    const resumeDesktopIcon = document.querySelector('.desktop-icon[href*="resume.pdf"] .app-icon');
    if (resumeDesktopIcon) {
        resumeDesktopIcon.className = "desktop-file-icon";
        resumeDesktopIcon.innerHTML = '<svg viewBox="0 0 48 54" aria-hidden="true"><path d="M8 2.5h21l11 11v35a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-43a3 3 0 0 1 3-3Z"/><path d="M29 3v11h11M11 24h24M11 31h24M11 38h17"/><path d="M12 18h13"/></svg>';
    }

    const finder = initializeFinder({
        body,
        homeScreen,
        homeIndicator,
        menuAppName,
        appWindows,
        folderIds,
        labels,
        openApp,
        setLastLauncher: (launcher) => { lastLauncher = launcher || lastLauncher; },
    });

    function applyTheme(theme) {
        const value = theme === "light" ? "light" : "dark";
        html.dataset.theme = value;
        body.dataset.theme = value;
        themeButton.setAttribute("aria-label", `Switch to ${value === "dark" ? "light" : "dark"} appearance`);
        themeButton.setAttribute("aria-pressed", String(value === "light"));
        if (typeof window.syncSettingsTheme === "function") {
            window.syncSettingsTheme(value);
        }
    }

    function syncMaximizedDock() {
        const maximizedApp = appWindows.find((app) => app.classList.contains("app-active") && app.classList.contains("is-maximized"));
        if (maximizedApp) body.dataset.maximizedApp = maximizedApp.dataset.window;
        else delete body.dataset.maximizedApp;
    }

    let savedTheme = "dark";
    try {
        savedTheme = localStorage.getItem("theme") || "dark";
    } catch {
        // The desktop still starts normally when browser storage is unavailable.
    }
    applyTheme(savedTheme);

    themeButton.addEventListener("click", () => {
        const nextTheme = body.dataset.theme === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
        try {
            localStorage.setItem("theme", nextTheme);
        } catch {
            // Theme selection remains active for this page session.
        }
        if (typeof window.playSystemSound === "function") {
            window.playSystemSound("switch");
        }
    });

    function goHome(updateAddress = true) {
        const previousApp = body.dataset.activeApp;
        appWindows.forEach((app) => {
            app.classList.remove("app-active", "is-maximized", "finder-folder-open");
            app.setAttribute("aria-hidden", "true");
        });
        syncMaximizedDock();
        homeScreen.hidden = false;
        homeIndicator.hidden = true;
        menuAppName.textContent = "Finder";
        delete body.dataset.activeApp;
        delete body.dataset.activeKind;
        document.querySelectorAll(".dock-item").forEach((item) => item.classList.remove("active"));
        document.querySelector('.dock-item[data-open-app="files"]')?.classList.add("active");
        const focusTarget = lastLauncher?.closest(".window")
            ? document.querySelector(`#desktopHome [data-open-app="${previousApp}"], #desktopHome [data-open-folder="${previousApp}"]`)
            : lastLauncher;
        (focusTarget && !focusTarget.hidden ? focusTarget : homeScreen.querySelector("[data-open-app], [data-open-folder]"))?.focus();
        lastLauncher = null;
        if (updateAddress && window.location.hash) {
            history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
        }
    }

    function openApp(id, updateAddress = true, opener = null, openAsApp = false) {
        if (folderIds.has(id) && !openAsApp && finder.openFinderFolderView) {
            finder.openFinderFolderView(id, updateAddress, opener);
            return;
        }
        const target = appWindows.find((app) => app.dataset.window === id);
        if (!target) return;
        const folderMode = folderIds.has(id) && !openAsApp;
        const folderView = finder.getFolderView(id);
        if (folderView) {
            if (folderView.browser.parentElement === folderView.content) {
                folderView.browser.hidden = !folderMode;
                folderView.originalContent.hidden = folderMode;
                folderView.content.classList.toggle("finder-browser-host", folderMode);
            } else if (openAsApp) {
                folderView.originalContent.hidden = false;
            }
        }
        const launchIcon = opener?.querySelector(".app-icon, .folder-card > span, svg") || opener;
        const openerRect = launchIcon?.getBoundingClientRect();

        appWindows.forEach((app) => {
            app.classList.toggle("app-active", app === target);
            app.classList.remove("is-maximized");
            app.setAttribute("aria-hidden", app === target ? "false" : "true");
        });
        syncMaximizedDock();
        homeScreen.hidden = true;
        homeIndicator.hidden = false;
        menuAppName.textContent = folderMode ? "Finder" : id === "gallery" && openAsApp ? "Gallery" : labels[id] || "Finder";
        body.dataset.activeApp = id;
        const currentFinderFolder = id === "files"
            ? target.querySelector(".finder-root-main > .finder-browser")?.dataset.folderId
            : "";
        body.dataset.activeKind = folderMode || currentFinderFolder ? "folder" : "app";
        if (openerRect && openerRect.width && openerRect.height) {
            const targetRect = target.getBoundingClientRect();
            const originX = Math.max(0, Math.min(targetRect.width, openerRect.left + openerRect.width / 2 - targetRect.left));
            const originY = Math.max(0, Math.min(targetRect.height, openerRect.top + openerRect.height / 2 - targetRect.top));
            target.style.setProperty("--launch-origin", `${originX}px ${originY}px`);
        } else {
            target.style.setProperty("--launch-origin", "50% 50%");
        }
        document.querySelectorAll(".dock-item").forEach((item) => {
            item.classList.toggle("active", folderMode ? item.dataset.openApp === "files" : item.dataset.openApp === id);
        });
        if (updateAddress) {
            const addressId = currentFinderFolder || id;
            history.replaceState({ portfolioApp: addressId, openAsApp: currentFinderFolder ? false : openAsApp }, "", `${window.location.pathname}${window.location.search}#${addressId}`);
        }
        const appHeading = target.querySelector(".window-title") || target.querySelector(".window-header");
        appHeading?.setAttribute("tabindex", "-1");
        appHeading?.focus({ preventScroll: true });
        if (id === "terminal" && window.matchMedia("(min-width: 821px)").matches) {
            document.getElementById("terminalInput")?.focus({ preventScroll: true });
        }
    }

    homeIndicator.addEventListener("click", () => goHome());
    let homeSwipeStartY = null;
    window.addEventListener("pointerdown", (event) => {
        if (event.pointerType !== "touch" || !body.dataset.activeApp || !window.matchMedia("(max-width: 820px)").matches) {
            homeSwipeStartY = null;
            return;
        }
        homeSwipeStartY = event.clientY >= window.innerHeight - 90 ? event.clientY : null;
    }, { passive: true });
    window.addEventListener("pointerup", (event) => {
        if (homeSwipeStartY === null) return;
        if (homeSwipeStartY - event.clientY > 70 && body.dataset.activeApp) goHome();
        homeSwipeStartY = null;
    }, { passive: true });
    window.addEventListener("pointercancel", () => { homeSwipeStartY = null; }, { passive: true });

    let headerSwipeStartY = null;
    let headerSwipeStartX = null;
    window.addEventListener("pointerdown", (event) => {
        if (!body.dataset.activeApp || !window.matchMedia("(max-width: 820px)").matches) return;
        if (event.target.closest(".desktop .window-header")) {
            headerSwipeStartY = event.clientY;
            headerSwipeStartX = event.clientX;
        }
    }, { passive: true });
    window.addEventListener("pointerup", (event) => {
        if (headerSwipeStartY !== null) {
            const dy = event.clientY - headerSwipeStartY;
            const dx = Math.abs(event.clientX - (headerSwipeStartX ?? event.clientX));
            if (dy > 50 && dy > dx && body.dataset.activeApp) {
                goHome();
            }
            headerSwipeStartY = null;
            headerSwipeStartX = null;
        }
    }, { passive: true });
    window.addEventListener("pointercancel", () => {
        headerSwipeStartY = null;
        headerSwipeStartX = null;
    }, { passive: true });

    initializeDock(labels);

    document.addEventListener("click", (event) => {
        const homeTarget = event.target.closest("[data-go-home]");
        if (homeTarget) {
            goHome();
            return;
        }
        const rootTarget = event.target.closest("[data-open-root]");
        if (rootTarget) {
            if (finder.returnToFinderHome) finder.returnToFinderHome();
            else openApp("files");
            return;
        }
        const fileTarget = event.target.closest("[data-finder-file]");
        if (fileTarget) {
            lastLauncher = fileTarget;
            const fileId = fileTarget.dataset.finderFile;
            if (fileId === "about-me") {
                openApp("files", true, fileTarget);
                finder.showAboutFile?.();
            }
            return;
        }
        const folderTarget = event.target.closest("[data-open-folder]");
        if (folderTarget) {
            lastLauncher = folderTarget;
            openApp(folderTarget.dataset.openFolder, true, folderTarget);
            return;
        }
        const appTarget = event.target.closest("[data-open-app]");
        if (appTarget) {
            lastLauncher = appTarget;
            if (appTarget.dataset.openApp === "files" && body.dataset.activeApp !== "files") {
                finder.returnToFinderHome?.();
            }
            openApp(appTarget.dataset.openApp, true, appTarget, appTarget.dataset.openMode === "app");
        }
    });

    // Existing window dots become accessible controls: close/minimize return to desktop;
    // zoom toggles a larger app window.
    document.querySelectorAll(".window .window-controls .window-control").forEach((oldControl) => {
        const control = document.createElement("button");
        const className = [...oldControl.classList].find((name) => name.startsWith("control-"));
        const action = className?.replace("control-", "") || "window";
        control.type = "button";
        control.className = oldControl.className;
        if (oldControl.id) control.id = oldControl.id;
        control.setAttribute("aria-label", action === "close" ? "Close app" : action === "minimize" ? "Minimize app" : "Zoom app window");
        control.title = control.getAttribute("aria-label");
        oldControl.replaceWith(control);
        control.addEventListener("click", (event) => {
            event.stopPropagation();
            const app = control.closest(".window");
            if (action === "maximize") {
                app?.classList.toggle("is-maximized");
                syncMaximizedDock();
            } else {
                goHome();
            }
        });
    });

    document.querySelectorAll(".desktop .window[data-window]").forEach((app) => {
        app.setAttribute("aria-hidden", "true");
    });

    homeScreen.hidden = false;
    homeIndicator.hidden = true;
    const initialApp = window.location.hash.slice(1).toLowerCase();
    const initialOpenAsApp = history.state?.portfolioApp === initialApp
        ? history.state.openAsApp === true
        : initialApp === "gallery" || initialApp === "pdf";
    if (initialApp === "about-me" || initialApp === "about") {
        openApp("files", false, null);
        finder.showAboutFile?.();
    } else if (appIds.includes(initialApp)) {
        openApp(initialApp, false, null, initialOpenAsApp);
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !document.querySelector("#mediaModal.active, #pdfModal.active, #textEditModal.active") && body.dataset.activeApp) goHome();
        if (event.altKey && event.key === "ArrowLeft" && body.dataset.activeApp) {
            event.preventDefault();
            goHome();
        }
    });

    function updateClock() {
        const now = new Date();
        statusDate.textContent = new Intl.DateTimeFormat(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
        }).format(now).replace(",", "");
        statusClock.textContent = new Intl.DateTimeFormat(undefined, {
            hour: "numeric",
            minute: "2-digit",
        }).format(now);
        statusTime.dateTime = now.toISOString();
    }
    updateClock();
    window.setInterval(updateClock, 30_000);

    initializeGallery({
        body,
        initialApp,
        initialOpenAsApp,
        openApp,
        buildFolderBrowser: (id) => finder.buildFolderBrowser(id),
        setGalleryItems: finder.setGalleryItems,
    });
    initializeTerminal({ folderIds, labels, openApp });
    if (typeof initializePdfViewer === "function") {
        initializePdfViewer({ openApp });
    }
    if (typeof initializeTextEdit === "function") {
        initializeTextEdit({ openApp });
    }
    if (typeof initializeSettings === "function") {
        initializeSettings({ openApp, applyTheme });
    }

    if (initialApp === "about-me" || initialApp === "about") {
        window.openRichTextDocument?.();
    }

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./service-worker.js").catch(() => {});
    }
})();
