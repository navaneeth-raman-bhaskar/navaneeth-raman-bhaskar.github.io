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
        certifications: ["licenses.txt", "courses.txt"],
        awards: ["honors.txt", "achievements.txt"],
        references: ["testimonials.txt", "recommendations.txt"],
        gallery: ["images.txt", "videos.txt"],
        contact: ["info.txt", "social.txt"],
    };
    const appShortcuts = new Set(Object.keys(labels));

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
            const requested = argument === "finder" ? "files" : argument;
            if (!requested || !appShortcuts.has(requested)) {
                result = "Usage: open <finder|terminal|experience|skills|education|certifications|awards|references|gallery|contact>";
            } else {
                openApp(requested);
                result = `Opening ${folderIds.has(requested) ? "Finder › " : ""}${labels[requested]}…`;
            }
        } else if (appShortcuts.has(name)) {
            openApp(name);
            result = `Opening ${folderIds.has(name) ? "Finder › " : ""}${labels[name]}…`;
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
