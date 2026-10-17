function initializeDock(labels) {
    const oldDock = document.querySelector(".dock");
    let dock = oldDock;
    if (oldDock) {
        dock = document.createElement("nav");
        dock.className = oldDock.className;
        dock.setAttribute("aria-label", "Dock");
        dock.replaceChildren(...oldDock.childNodes);
        oldDock.replaceWith(dock);
    }

    // Turn the original icon markup into real buttons for keyboard and screen-reader access.
    document.querySelectorAll(".dock-item[data-section]").forEach((oldItem) => {
        const section = oldItem.dataset.section;
        if (!["files", "terminal"].includes(section)) {
            oldItem.remove();
            return;
        }
        const button = document.createElement("button");
        button.type = "button";
        button.className = oldItem.className;
        button.setAttribute("aria-label", labels[section] || section);
        button.title = labels[section] || section;
        button.innerHTML = oldItem.innerHTML;
        button.dataset.openApp = section;
        if (section === "files") button.classList.add("dock-finder");
        oldItem.replaceWith(button);
    });

    const terminalDockItem = document.querySelector('.dock-item[data-open-app="terminal"]');
    if (terminalDockItem) {
        const separator = document.createElement("span");
        separator.className = "dock-separator";
        separator.setAttribute("aria-hidden", "true");
        const lastAppDockItem = document.querySelector('.dock-item[data-open-app="pdf"]') || document.querySelector('.dock-item[data-open-app="gallery"]') || terminalDockItem;
        lastAppDockItem.after(separator);
    }
    document.querySelector('.dock-item[data-open-app="files"]')?.classList.add("active");

    const dockItems = [...dock.querySelectorAll(".dock-item")];
    const dockCanMagnify = window.matchMedia("(min-width: 821px) and (hover: hover) and (pointer: fine)").matches;
    const dockOffsets = new Map();
    let tooltipTimer = 0;
    let tooltipItem = null;
    let dockPointerX = 0;
    let dockMagnificationFrame = 0;

    dockItems.forEach((item) => {
        const label = item.getAttribute("title") || item.getAttribute("aria-label") || "App";
        item.dataset.dockLabel = label;
        item.removeAttribute("title");
        const itemBounds = item.getBoundingClientRect();
        dockOffsets.set(item, itemBounds.left + itemBounds.width / 2 - dock.getBoundingClientRect().left);

        item.addEventListener("focus", () => {
            item.dataset.dockTooltip = "visible";
        });
        item.addEventListener("blur", () => {
            delete item.dataset.dockTooltip;
        });
        item.addEventListener("click", () => {
            if (!dockCanMagnify) return;
            item.classList.remove("is-launching");
            void item.offsetWidth;
            item.classList.add("is-launching");
        });
        item.addEventListener("animationend", (event) => {
            if (event.animationName === "dock-launch-bounce") item.classList.remove("is-launching");
        });

        if (dockCanMagnify) {
            item.addEventListener("pointerenter", (event) => {
                if (event.pointerType === "touch") return;
                window.clearTimeout(tooltipTimer);
                if (tooltipItem) delete tooltipItem.dataset.dockTooltip;
                tooltipItem = item;
                tooltipTimer = window.setTimeout(() => {
                    if (tooltipItem === item) item.dataset.dockTooltip = "visible";
                }, 480);
            });
            item.addEventListener("pointerleave", () => {
                window.clearTimeout(tooltipTimer);
                delete item.dataset.dockTooltip;
                if (tooltipItem === item) tooltipItem = null;
            });
        }
    });

    function setDockMagnification(clientX) {
        const dockLeft = dock.getBoundingClientRect().left;
        const scales = dockItems.map((item) => {
            const distance = Math.abs(clientX - (dockLeft + dockOffsets.get(item)));
            const proximity = Math.max(0, 1 - distance / 105);
            return 1 + 0.18 * proximity ** 2.1;
        });
        dockItems.forEach((item, index) => {
            const scale = scales[index];
            item.style.setProperty("--dock-scale", scale.toFixed(3));
            item.style.setProperty("--dock-inverse-scale", (1 / scale).toFixed(3));
            item.style.zIndex = String(Math.round(scale * 10));
        });
    }

    function resetDockMagnification() {
        window.clearTimeout(tooltipTimer);
        window.cancelAnimationFrame(dockMagnificationFrame);
        dockMagnificationFrame = 0;
        tooltipItem = null;
        dockItems.forEach((item) => {
            delete item.dataset.dockTooltip;
            item.style.removeProperty("--dock-scale");
            item.style.removeProperty("--dock-inverse-scale");
            item.style.removeProperty("z-index");
        });
    }

    if (dockCanMagnify) {
        dock.addEventListener("pointermove", (event) => {
            if (event.pointerType === "touch") return;
            dockPointerX = event.clientX;
            if (dockMagnificationFrame) return;
            const startedAt = window.performance.now();
            const settleDock = (now) => {
                setDockMagnification(dockPointerX);
                if (now - startedAt < 220) {
                    dockMagnificationFrame = window.requestAnimationFrame(settleDock);
                } else {
                    dockMagnificationFrame = 0;
                }
            };
            dockMagnificationFrame = window.requestAnimationFrame(settleDock);
        });
        dock.addEventListener("pointerleave", resetDockMagnification);
        window.addEventListener("resize", () => {
            if (!window.matchMedia("(min-width: 821px) and (hover: hover) and (pointer: fine)").matches) {
                resetDockMagnification();
            }
        });
    }
}
