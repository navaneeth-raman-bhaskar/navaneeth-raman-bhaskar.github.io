function initializeTextEdit({ openApp }) {
    const textEditModal = document.getElementById("textEditModal");
    const textEditModalTitle = document.getElementById("textEditModalTitle");
    const textEditModalLocation = document.getElementById("textEditModalLocation");
    const textEditModalBody = document.getElementById("textEditModalBody");
    const textEditModalClose = document.getElementById("textEditModalClose");
    const textEditModalMinimize = document.getElementById("textEditModalMinimize");
    const textEditModalMaximize = document.getElementById("textEditModalMaximize");
    const textEditModalBackBtn = document.getElementById("textEditModalBackBtn");
    const textEditCopyBtn = document.getElementById("textEditCopyBtn");
    const textEditPrintBtn = document.getElementById("textEditPrintBtn");
    const textEditModalContainer = document.querySelector(".textedit-modal-container");
    const textEditBadge = document.querySelector(".textedit-modal-badge");

    let activeDoc = null;
    let lastFocusedElement = null;
    let previousAppName = null;

    function renderAboutMeSheet(container) {
        container.innerHTML = `
            <article class="textedit-paper">
                <header class="textedit-about-header">
                    <div class="textedit-about-bio">
                        <span class="textedit-kicker">ABOUT ME · RICH TEXT DOCUMENT</span>
                        <h1 class="textedit-hero-title">Navaneeth V</h1>
                        <p class="textedit-role-badge">VP (Technical Lead) at Agribazaar</p>
                    </div>
                    <div class="textedit-avatar-wrap">
                        <img src="./assets/images/dp.webp" alt="Navaneeth V" class="textedit-avatar" />
                    </div>
                </header>

                <p class="textedit-lead">
                    I build scalable applications and backend platforms with thoughtful architecture and clear design.
                    My work spans engineering leadership, microservices, payment systems, and real-time platforms.
                </p>

                <div class="textedit-facts-grid">
                    <section class="textedit-fact-card">
                        <span class="textedit-fact-label">ROLE</span>
                        <strong>Technical Leadership</strong>
                        <small>Leading engineering teams and technical strategy</small>
                    </section>
                    <section class="textedit-fact-card">
                        <span class="textedit-fact-label">FOCUS</span>
                        <strong>Backend Architecture</strong>
                        <small>Reliable, secure systems built to scale</small>
                    </section>
                    <section class="textedit-fact-card">
                        <span class="textedit-fact-label">EXPERIENCE</span>
                        <strong>Production Platforms</strong>
                        <small>Payments, bidding, and data services</small>
                    </section>
                </div>

                <section class="textedit-story-section">
                    <h2>What I do</h2>
                    <p>
                        I work across architecture and delivery: shaping technical direction, mentoring engineers,
                        and building services that hold up under real production demands. I care about maintainable code,
                        practical design patterns, and making complex systems easier for teams to evolve.
                    </p>
                </section>

                <section class="textedit-skills-section">
                    <h3>Core Technical Expertise</h3>
                    <div class="textedit-tags-cloud">
                        <span>PHP</span><span>Node.js</span><span>Laravel</span><span>Microservices</span>
                        <span>Payments</span><span>System Design</span><span>MySQL</span><span>Redis</span>
                        <span>AWS</span><span>Docker</span>
                    </div>
                </section>
            </article>
        `;
    }

    function renderGenericDocSheet(item, container) {
        const isExp = item.folderId === "experience" || (item.role && item.organization);
        const isEdu = item.folderId === "education";
        const isRef = item.folderId === "references";
        const isSkill = item.fileType === "skill" || item.fileType === "text";

        const kicker = isExp
            ? "CAREER TIMELINE · RICH TEXT DOCUMENT"
            : isEdu
            ? "EDUCATION · RICH TEXT DOCUMENT"
            : isRef
            ? "PROFESSIONAL RECOMMENDATION · RICH TEXT DOCUMENT"
            : isSkill
            ? "TECHNOLOGY PROFILE · PLAIN TEXT"
            : (item.meta ? item.meta.toUpperCase() : "PORTFOLIO DOCUMENT");

        const highlights = item.children && Array.isArray(item.children)
            ? item.children.map(c => typeof c === "string" ? c : c.name || "")
            : [];

        container.innerHTML = `
            <article class="textedit-paper generic-doc">
                <header class="textedit-doc-header">
                    <span class="textedit-kicker">${kicker}</span>
                    <h1 class="textedit-doc-title">${item.name}</h1>
                    ${item.role ? `<p class="textedit-doc-subtitle"><strong>${item.role}</strong> ${item.organization ? "at " + item.organization : ""}</p>` : ""}
                    ${item.date ? `<div class="textedit-doc-date"><svg viewBox="0 0 20 20" width="13" height="13" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/></svg> <span>${item.date}</span></div>` : ""}
                </header>

                <div class="textedit-doc-content">
                    ${item.description ? `<p class="textedit-lead">${item.description}</p>` : ""}

                    ${item.quote && item.quote.length ? `
                        <blockquote class="textedit-quote-box">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" class="textedit-quote-icon"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                            <p>${item.quote.join("<br/>")}</p>
                        </blockquote>
                    ` : ""}

                    ${highlights.length ? `
                        <div class="textedit-highlights-block">
                            <h3>Key Highlights & Responsibilities</h3>
                            <ul class="textedit-points-list">
                                ${highlights.map(pt => `<li>${pt}</li>`).join("")}
                            </ul>
                        </div>
                    ` : ""}

                    ${item.tags && item.tags.length ? `
                        <div class="textedit-tags-section">
                            <h4>Technologies & Tools</h4>
                            <div class="textedit-tags-cloud">
                                ${item.tags.map(t => `<span>${t}</span>`).join("")}
                            </div>
                        </div>
                    ` : ""}
                </div>
            </article>
        `;
    }

    function openTextEditModal(item, returnFocusTo = null) {
        if (!textEditModal) return;

        // Fallback to About Me if called without item
        if (!item) {
            item = {
                name: "About Me",
                extension: "rtf",
                kind: "file",
                fileType: "document",
                isAbout: true,
                meta: "Rich Text Document"
            };
        }

        activeDoc = item;
        lastFocusedElement = returnFocusTo || document.activeElement;

        const displayName = item.name.endsWith(".rtf") || item.name.endsWith(".txt")
            ? item.name
            : `${item.name}.${item.extension || "rtf"}`;

        let locationPath = "~/Documents";
        if (item.folderId) {
            const folderName = item.folderId.charAt(0).toUpperCase() + item.folderId.slice(1);
            locationPath = `~/Documents/${folderName}`;
        }
        locationPath = `${locationPath}/${displayName}`;

        if (textEditModalTitle) textEditModalTitle.textContent = displayName;
        if (textEditModalLocation) textEditModalLocation.textContent = locationPath;

        if (textEditBadge) {
            const ext = (item.extension || "rtf").toUpperCase();
            textEditBadge.textContent = ext;
            textEditBadge.className = `textedit-modal-badge is-${ext.toLowerCase()}`;
        }

        if (textEditModalBody) {
            textEditModalBody.replaceChildren();
            if (item.isAbout) {
                renderAboutMeSheet(textEditModalBody);
            } else {
                renderGenericDocSheet(item, textEditModalBody);
            }
            textEditModalBody.scrollTop = 0;
        }

        textEditModal.setAttribute("aria-hidden", "false");
        textEditModal.classList.add("active");
        document.body.classList.add("modal-open");

        const menuApp = document.getElementById("menuAppName");
        if (menuApp) {
            previousAppName = menuApp.textContent;
            menuApp.textContent = "TextEdit";
        }

        textEditModalClose?.focus();
    }

    function closeTextEditModal() {
        if (!textEditModal || !textEditModal.classList.contains("active")) return;

        textEditModal.classList.remove("active");
        textEditModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
        textEditModalContainer?.classList.remove("is-maximized");

        const menuApp = document.getElementById("menuAppName");
        if (menuApp && previousAppName) {
            menuApp.textContent = previousAppName;
            previousAppName = null;
        }

        activeDoc = null;
        lastFocusedElement?.focus();
    }

    // Modal Window Controls (Consistent macOS traffic lights)
    if (textEditModalClose) {
        textEditModalClose.addEventListener("click", (e) => {
            e.stopPropagation();
            closeTextEditModal();
        });
    }

    if (textEditModalMinimize) {
        textEditModalMinimize.addEventListener("click", (e) => {
            e.stopPropagation();
            closeTextEditModal();
        });
    }

    if (textEditModalMaximize) {
        textEditModalMaximize.addEventListener("click", (e) => {
            e.stopPropagation();
            textEditModalContainer?.classList.toggle("is-maximized");
        });
    }

    if (textEditModalBackBtn) {
        textEditModalBackBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            closeTextEditModal();
        });
    }

    // Backdrop click to close
    if (textEditModal) {
        textEditModal.addEventListener("click", (e) => {
            if (e.target === textEditModal) {
                closeTextEditModal();
            }
        });
    }

    // Copy action
    if (textEditCopyBtn) {
        textEditCopyBtn.addEventListener("click", () => {
            const paper = textEditModalBody?.querySelector(".textedit-paper");
            if (!paper) return;
            const text = paper.innerText || paper.textContent || "";
            navigator.clipboard?.writeText(text).then(() => {
                const label = textEditCopyBtn.querySelector(".copy-text") || textEditCopyBtn;
                const old = label.textContent;
                label.textContent = "Copied!";
                setTimeout(() => { label.textContent = old; }, 1800);
            }).catch(() => {});
        });
    }

    // Print action
    if (textEditPrintBtn) {
        textEditPrintBtn.addEventListener("click", () => {
            window.print();
        });
    }

    // Keyboard ESC to close modal
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && textEditModal?.classList.contains("active")) {
            e.preventDefault();
            closeTextEditModal();
        }
    });

    // Expose global methods
    window.openRichTextDocument = openTextEditModal;
    window.closeRichTextDocument = closeTextEditModal;
    window.openTextEdit = openTextEditModal;
}
