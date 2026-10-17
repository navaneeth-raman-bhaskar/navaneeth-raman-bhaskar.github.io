function initializeTerminal({ folderIds, labels, openApp }) {
    const terminalOutput = document.getElementById("terminalContent");
    const terminalInput = document.getElementById("terminalInput");
    const commandHistory = [];
    let historyIndex = -1;
    let currentDirectory = "~";
    const virtualFiles = {
        experience: ["timeline.txt", "positions.txt", "technologies.txt"],
        skills: ["backend.txt", "frontend.txt", "devops.txt", "database.txt"],
        education: ["degrees.txt", "schools.txt"],
        certifications: [
            "data-structures-cert.pdf",
            "algorithms-cert.pdf",
            "json-training-cert.pdf",
            "advanced-php-cert.pdf",
            "baseline-infrastructure-cert.pdf"
        ],
        awards: [
            "it-genius-2011-award.pdf",
            "volleyball-2015-gold-award.pdf",
            "volleyball-2016-silver-award.pdf",
            "volleyball-2017-bronze-award.pdf",
            "volleyball-2010-gold-award.pdf",
            "volleyball-2008-silver-award.pdf"
        ],
        references: ["testimonials.txt", "recommendations.txt"],
        gallery: ["images.txt", "videos.txt"],
        media: ["images.txt", "videos.txt"],
        pdf: [
            "resume.pdf",
            "cover-letter.pdf",
            "data-structures-cert.pdf",
            "algorithms-cert.pdf",
            "json-training-cert.pdf",
            "advanced-php-cert.pdf",
            "baseline-infrastructure-cert.pdf",
            "it-genius-2011-award.pdf",
            "volleyball-2015-gold-award.pdf",
            "volleyball-2016-silver-award.pdf",
            "volleyball-2017-bronze-award.pdf",
            "volleyball-2010-gold-award.pdf",
            "volleyball-2008-silver-award.pdf"
        ],
        contact: ["info.txt", "social.txt"],
    };
    const appShortcuts = new Set([...Object.keys(labels), "media", "acrobat", "adobepdf"]);

    function printTerminalLine(value, kind = "output") {
        const line = document.createElement("div");
        line.className = `terminal-line terminal-${kind}`;
        line.textContent = String(value).replace(/\x1b\[[0-9;]*m/g, "");
        terminalOutput.append(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    function listDirectories() {
        return Object.keys(virtualFiles);
    }

    function executeCommand(rawCommand) {
        const command = rawCommand.trim();
        if (!command) return;
        commandHistory.push(command);
        historyIndex = -1;
        printTerminalLine(`$ ${command}`, "command");
        const [rawName, ...args] = command.split(/\s+/);
        const name = rawName.toLowerCase();
        const argument = args[0]?.toLowerCase();
        let result;

        if (name === "clear") {
            terminalOutput.replaceChildren();
            return;
        }
        if (name === "help") {
            result = "Commands: help, ls, ll, cd, pwd, cat, open, clear, whoami, date, echo.\nUse 'open <app|folder>' for Finder, Terminal, or a portfolio folder.";
        } else if (name === "pwd") {
            result = currentDirectory === "~" ? "/home/guest" : `/home/guest/${currentDirectory}`;
        } else if (name === "ls" || name === "ll") {
            result = currentDirectory === "~"
                ? listDirectories().map((directory) => `${directory}/`).join("  ")
                : (virtualFiles[currentDirectory] || []).join("  ");
        } else if (name === "cd") {
            if (!argument || ["~", "/", "..", "../"].includes(argument)) {
                currentDirectory = "~";
                result = "Returned to home directory.";
            } else if (listDirectories().includes(argument)) {
                currentDirectory = argument;
                result = `Changed directory to ${argument}.`;
            } else {
                result = `cd: no such directory: ${argument}`;
            }
        } else if (name === "cat") {
            if (!argument) {
                result = "Usage: cat <file>";
            } else if (currentDirectory === "~") {
                result = "Open a folder with 'cd <folder>' before reading a file.";
            } else if (!(virtualFiles[currentDirectory] || []).includes(argument)) {
                result = `cat: ${argument}: file not found`;
            } else {
                const app = document.querySelector(`[data-window="${currentDirectory}"] .window-content`);
                result = app?.textContent?.replace(/\s{3,}/g, "\n\n").trim() || "No text available.";
            }
        } else if (name === "whoami") {
            result = "guest@navaneeth.co.in";
        } else if (name === "date") {
            result = new Date().toString();
        } else if (name === "echo") {
            result = args.join(" ");
        } else if (name === "open") {
            if (argument && (argument.endsWith(".pdf") || argument.includes("cert") || argument.includes("award") || argument.includes("resume"))) {
                if (typeof window.openPdfDocument === "function") {
                    const opened = window.openPdfDocument(argument);
                    if (opened) {
                        result = `Opening ${argument} in Adobe Acrobat Reader…`;
                        String(result).split("\n").forEach((line) => printTerminalLine(line));
                        return;
                    }
                }
            }
            const requested = argument === "finder" ? "files" : argument === "media" ? "gallery" : (argument === "acrobat" || argument === "adobepdf") ? "pdf" : argument;
            if (!requested || (!appShortcuts.has(requested) && requested !== "gallery" && requested !== "pdf")) {
                result = "Usage: open <app|folder|file.pdf>";
            } else {
                openApp(requested);
                result = `Opening ${folderIds.has(requested) ? "Finder › " : ""}${labels[requested] || requested}…`;
            }
        } else if (appShortcuts.has(name)) {
            const target = name === "media" ? "gallery" : (name === "acrobat" || name === "adobepdf") ? "pdf" : name;
            openApp(target);
            result = `Opening ${folderIds.has(target) ? "Finder › " : ""}${labels[target] || target}…`;
        } else {
            result = `Command not found: ${rawName}. Type 'help' for commands.`;
        }

        String(result).split("\n").forEach((line) => printTerminalLine(line));
    }

    terminalInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            executeCommand(terminalInput.value);
            terminalInput.value = "";
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (commandHistory.length) {
                historyIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
                terminalInput.value = commandHistory[commandHistory.length - 1 - historyIndex];
            }
        } else if (event.key === "ArrowDown") {
            event.preventDefault();
            if (historyIndex > 0) {
                historyIndex -= 1;
                terminalInput.value = commandHistory[commandHistory.length - 1 - historyIndex];
            } else {
                historyIndex = -1;
                terminalInput.value = "";
            }
        } else if (event.key === "Tab") {
            event.preventDefault();
            const value = terminalInput.value.trim().toLowerCase();
            const parts = value.split(/\s+/);
            const options = parts.length <= 1
                ? [...["help", "ls", "ll", "cd", "pwd", "cat", "open", "clear", "whoami", "date", "echo"], "finder", ...appShortcuts]
                : parts[0] === "open" ? ["finder", ...appShortcuts]
                : parts[0] === "cd" ? ["~", "..", ...listDirectories()] : [];
            const matches = options.filter((option) => option.startsWith(parts.at(-1) || ""));
            if (matches.length === 1) terminalInput.value = parts.length <= 1 ? matches[0] : `${parts[0]} ${matches[0]}`;
            else if (matches.length > 1) printTerminalLine(matches.join("  "));
        }
    });

    terminalOutput.addEventListener("click", () => terminalInput.focus());
    terminalInput.setAttribute("aria-label", "Terminal command");
}
