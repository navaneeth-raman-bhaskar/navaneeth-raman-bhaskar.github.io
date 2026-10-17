function initializeFinder({ body, homeScreen, homeButton, menuAppName, appWindows, folderIds, labels, openApp, setLastLauncher }) {
    const folderBrowserViews = new Map();
    let galleryItems = [];
    let openFinderFolderView = null;
    let returnToFinderHome = null;

    function buildFolderBrowser(id) {
        const win = appWindows.find((item) => item.dataset.window === id);
        const content = win?.querySelector(".window-content");
        if (!content) return;
        content.classList.add("finder-browser-host");

        const sourceSelector = {
            experience: ".timeline-item",
            education: ".timeline-item",
            skills: ".skill-card",
            certifications: ".certification-item",
            awards: ".award-item",
            references: ".reference-card",
            gallery: ".gallery-item",
            contact: ".contact-card",
        }[id];
        const sources = [...content.querySelectorAll(sourceSelector)];
        const records = sources.map((source, index) => {
            const text = (selector) => source.querySelector(selector)?.textContent?.trim() || "";
            const summary = (...selectors) => selectors.map(text).find(Boolean) || "";
            const details = (selector) => [...source.querySelectorAll(selector)].map((item) => item.textContent.trim()).filter(Boolean);
            let name = "";
            let meta = "";
            let extension = "rtf";
            let kind = "file";
            let fileType = "document";
            let description = "";
            let href = "";
            let appType = "";
            let children;
            let recordOrganization = "";
            let recordDate = "";
            let recordRole = "";
            let tags = [];
            let issuer = "";
            let achievement = "";
            let quote = [];
            let medal = "";
            let verified = false;

            if (id === "experience" || id === "education") {
                const title = text(".timeline-title");
                const organization = text(".timeline-company");
                recordRole = title;
                recordOrganization = organization;
                recordDate = text(".timeline-date");
                name = title + (organization ? " — " + organization : "") || labels[id] + " " + (index + 1);
                meta = (text(".timeline-date") || labels[id]) + " · Rich Text Document";
                description = summary(".timeline-content p", ".timeline-content") || "Portfolio document";
                children = details(".timeline-content li");
                description = children[0] || "Portfolio document";
                tags = details(".tech-tags .tag");
            } else if (id === "skills") {
                name = text(".skill-title") || "Skills " + (index + 1);
                children = [...source.querySelectorAll(".skill-list .tag")].map((tag) => ({
                    name: tag.textContent.trim(), meta: "Plain Text · Skill", extension: "txt", kind: "file", fileType: "text", description: tag.textContent.trim(),
                }));
                children.forEach((child) => {
                    child.fileType = "skill";
                    child.meta = "Technology Profile / TXT";
                    child.category = name;
                    child.description = "A skill in " + name.toLowerCase() + ".";
                });
                kind = "folder";
                fileType = "folder";
                extension = "";
                meta = "Folder · " + children.length + " files";
                description = "A collection of " + name.toLowerCase() + " skills.";
            } else if (id === "certifications") {
                name = text(".certification-name") || "Certificate " + (index + 1);
                issuer = text(".certification-issuer") || "Certificate";
                verified = !!source.querySelector(".certification-checkmark");
                meta = (text(".certification-issuer") || "Certificate") + " · PDF Document";
                extension = "pdf";
                fileType = "pdf";
                description = summary(".certification-description", ".certification-issuer") || "Professional certification document.";
            } else if (id === "awards") {
                name = text(".award-title") || "Award " + (index + 1);
                recordDate = text(".award-year");
                issuer = text(".award-institution");
                achievement = text(".award-achievement");
                medal = source.querySelector(".award-medal")?.className.split(" ").pop() || "gold";
                meta = [text(".award-year"), text(".award-institution")].filter(Boolean).join(" · ") + " · PDF Document";
                extension = "pdf";
                fileType = "pdf";
                description = summary(".award-achievement", ".award-institution") || "Award and achievement record.";
            } else if (id === "references") {
                name = text(".reference-name") || "Reference " + (index + 1);
                recordRole = text(".reference-role") || "Recommendation";
                meta = (text(".reference-role") || "Recommendation") + " · Rich Text Document";
                quote = details(".reference-quote p");
                description = quote[0] || "Professional reference.";
            } else if (id === "gallery") {
                const media = galleryItems[index];
                name = media?.title || text(".gallery-title") || "Gallery item " + (index + 1);
                const isVideo = media?.type === "video";
                extension = isVideo ? "mov" : "jpg";
                fileType = isVideo ? "video" : "image";
                meta = isVideo ? "QuickTime Movie" : "JPEG Image";
                description = media?.description || text(".gallery-description");
                href = media?.thumbnail || "";
            } else if (id === "contact") {
                const label = text(".contact-label") || "Contact " + (index + 1);
                const value = text(".contact-value");
                name = label === "Email" ? "Mail" : label === "Location" ? "Maps" : label;
                kind = "app";
                extension = "app";
                fileType = "application";
                appType = label.toLowerCase();
                meta = "Application";
                description = value;
                href = source.querySelector(".contact-value a")?.href || (label === "Location"
                    ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(value)
                    : "");
            }

            return { name, meta, extension, source, kind, fileType, description, href, appType, children, organization: recordOrganization, date: recordDate, role: recordRole, tags, issuer, achievement, quote, medal, verified };
        });

        const originalContent = document.createElement("div");
        originalContent.className = id === "gallery"
            ? "finder-original-content photos-content"
            : "finder-original-content";
        while (content.firstChild) originalContent.append(content.firstChild);
        originalContent.hidden = true;

        const browser = document.createElement("div");
        browser.className = "finder-browser";
        browser.dataset.folderId = id;
        const toolbar = document.createElement("div");
        toolbar.className = "finder-toolbar";
        const rootButton = document.createElement("button");
        rootButton.className = "finder-nav-button";
        rootButton.type = "button";
        rootButton.dataset.openRoot = "true";
        rootButton.textContent = "‹";
        rootButton.setAttribute("aria-label", "Back to Home");
        const folderUp = document.createElement("button");
        folderUp.className = "finder-nav-button finder-up-button";
        folderUp.type = "button";
        folderUp.textContent = "‹";
        folderUp.setAttribute("aria-label", "Back to parent folder");
        folderUp.hidden = true;
        const path = document.createElement("div");
        path.className = "finder-path";
        path.textContent = `Macintosh HD  ›  Users  ›  Navaneeth  ›  ${labels[id]}`;
        toolbar.append(rootButton, folderUp, path);

        const listing = document.createElement("div");
        listing.className = "finder-browser-columns";
        const listPanel = document.createElement("div");
        listPanel.className = "finder-list-panel";
        const listHeading = document.createElement("div");
        listHeading.className = "finder-list-heading";
        listHeading.innerHTML = '<span>Name</span><span>Kind</span>';
        const list = document.createElement("div");
        list.className = "finder-list";
        list.setAttribute("role", "listbox");
        list.setAttribute("aria-label", `${labels[id]} folder contents`);
        listPanel.append(listHeading, list);
        const preview = document.createElement("aside");
        preview.className = "finder-preview";
        preview.setAttribute("aria-live", "polite");
        const placeholder = document.createElement("p");
        placeholder.className = "finder-preview-empty";
        placeholder.textContent = "Select a file to preview it.";
        preview.append(placeholder);
        listing.append(listPanel, preview);

        const detail = document.createElement("div");
        detail.className = "finder-file-view";
        detail.hidden = true;
        const detailBack = document.createElement("button");
        detailBack.className = "finder-back-button";
        detailBack.type = "button";
        detailBack.textContent = "‹ Back to folder";
        const detailBody = document.createElement("div");
        detailBody.className = "finder-document";
        detail.append(detailBack, detailBody);
        detailBack.addEventListener("click", () => {
            detail.hidden = true;
            listing.hidden = false;
            path.textContent = `Macintosh HD  ›  Users  ›  Navaneeth  ›  ${labels[id]}${currentSubfolder ? `  ›  ${currentSubfolder}` : ""}`;
        });

        const stack = [];
        let currentRecords = records;
        let currentSubfolder = "";
        let selectedFolderItem = null;
        const itemIconMarkup = (record) => {
            if (record.kind === "folder") {
                return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 6.4a2 2 0 0 1 2-2h5l2 2h8a2 2 0 0 1 2 2v1H2.5z"/><path d="M2.5 9h19l-1.8 10.2a2 2 0 0 1-2 1.7H5.1a2 2 0 0 1-2-1.7z"/></svg>';
            }
            if (record.kind === "app") {
                if (record.appType === "phone") return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3.5 4.5 5c-.8.5-.9 1.6-.6 2.5 2 6.1 6.5 10.6 12.6 12.6.9.3 2 .2 2.5-.6l1.5-2.5-4.3-3-2 2a15 15 0 0 1-6.3-6.3l2-2z"/></svg>';
                if (record.appType === "location") return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-7.1 7-13a7 7 0 1 0-14 0c0 5.9 7 13 7 13Z"/><circle cx="12" cy="9" r="2.5"/></svg>';
                return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="3"/><path d="m4 7 8 6 8-6"/></svg>';
            }
            if (record.fileType === "skill") {
                const mark = String(record.name || "T").replace(/[^a-z0-9]/gi, "").slice(0, 2).toUpperCase();
                return `<span class="finder-skill-row-mark">${mark}</span>`;
            }
            if (record.fileType === "image") return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="3.5" width="19" height="17" rx="2.5"/><circle cx="8" cy="9" r="1.5"/><path d="m4 18 6-6 3 3 3-4 4 6"/></svg>';
            if (record.fileType === "video") return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="4" width="13" height="16" rx="2"/><path d="m15.5 9 6-3v12l-6-3z"/><path d="m7.5 8 5 4-5 4z"/></svg>';
            if (record.fileType === "pdf") return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 2.5h9l5 5v14H5z"/><path d="M14 2.5v5h5"/><path d="M7.5 14.5h9"/><text x="7" y="19" font-size="4.2" font-weight="700">PDF</text></svg>';
            return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 2.5h9l5 5v14H5z"/><path d="M14 2.5v5h5M8 12h8M8 15.5h8M8 19h5"/></svg>';
        };

        function renderRows(items, subfolder = "") {
            currentSubfolder = subfolder;
            folderUp.hidden = stack.length === 0;
            list.replaceChildren();
            preview.replaceChildren();
            const empty = document.createElement("p");
            empty.className = "finder-preview-empty";
            empty.textContent = "Select a file to preview it.";
            preview.append(empty);
            path.textContent = `Macintosh HD  ›  Users  ›  Navaneeth  ›  ${labels[id]}${subfolder ? `  ›  ${subfolder}` : ""}`;
            items.forEach((record) => {
                const row = document.createElement("button");
                row.className = `finder-row is-${record.kind}`;
                row.type = "button";
                row.dataset.fileType = record.fileType || (record.kind === "folder" ? "folder" : record.kind === "app" ? "application" : "document");
                if (record.appType) row.dataset.appType = record.appType;
                if (record.fileType === "skill") row.dataset.skillKey = record.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                row.setAttribute("role", "option");
                row.setAttribute("aria-selected", "false");
                row.innerHTML = `<span class="finder-row-icon" aria-hidden="true">${itemIconMarkup(record)}</span><span class="finder-row-name"></span><span class="finder-row-kind"></span>`;
                row.querySelector(".finder-row-name").textContent = record.kind === "folder" ? record.name : `${record.name}.${record.extension}`;
                row.querySelector(".finder-row-kind").textContent = record.meta;
                row.addEventListener("click", () => {
                    selectedFolderItem = row;
                    if (window.matchMedia("(max-width: 820px)").matches) {
                        openRecord(record);
                        return;
                    }
                    list.querySelectorAll(".finder-row").forEach((item) => {
                        item.classList.remove("selected");
                        item.setAttribute("aria-selected", "false");
                    });
                    row.classList.add("selected");
                    row.setAttribute("aria-selected", "true");
                    showPreview(record);
                });
                row.addEventListener("dblclick", () => {
                    selectedFolderItem = row;
                    openRecord(record);
                });
                row.addEventListener("keydown", (event) => {
                    if (event.key === "Enter") {
                        selectedFolderItem = row;
                        openRecord(record);
                    }
                });
                list.append(row);
            });
        }

        function resetFolderView() {
            stack.length = 0;
            currentRecords = records;
            currentSubfolder = "";
            selectedFolderItem = null;
            detail.hidden = true;
            listing.hidden = false;
            renderRows(records);
        }

        function appendRecordPreview(record, target, expanded = false) {
            target.replaceChildren();
            const make = (tag, className, value = "") => {
                const element = document.createElement(tag);
                if (className) element.className = className;
                if (value) element.textContent = value;
                return element;
            };

            if (record.kind === "folder") {
                const card = make("section", "finder-collection-card");
                const hero = make("div", "finder-collection-hero");
                const folderIcon = make("div", "finder-collection-icon");
                folderIcon.innerHTML = itemIconMarkup(record);
                const count = make("div", "finder-collection-count", String(record.children?.length || 0));
                count.setAttribute("aria-label", `${record.children?.length || 0} skills`);
                hero.append(folderIcon, count);
                const eyebrow = make("p", "finder-visual-eyebrow", "SKILL COLLECTION");
                const title = make("h3", "finder-visual-title", record.name);
                const description = make("p", "finder-visual-copy", record.description || "A curated toolkit.");
                const grid = make("div", "finder-skill-tile-grid");
                (record.children || []).forEach((child) => {
                    const tile = make("div", "finder-skill-tile");
                    const mark = String(child.name || "T").replace(/[^a-z0-9]/gi, "").slice(0, 2).toUpperCase();
                    tile.append(make("span", "finder-skill-tile-mark", mark), make("span", "finder-skill-tile-name", child.name));
                    grid.append(tile);
                });
                card.append(hero, eyebrow, title, description, grid);
                target.append(card);
            } else if (record.kind === "app") {
                const appCard = make("section", `finder-app-card is-${record.appType}`);
                const appIcon = make("div", "finder-preview-app-icon is-" + record.appType);
                appIcon.innerHTML = itemIconMarkup(record);
                const details = make("div", "finder-app-card-details");
                details.append(make("span", "finder-visual-eyebrow", "APPLICATION"), make("h3", "finder-visual-title", record.name));
                const value = make("p", "finder-app-value", record.description || "Open this app to continue.");
                const footer = make("div", "finder-app-card-footer", record.appType === "email" ? "Compose a message" : record.appType === "phone" ? "Start a call" : "View on the map");
                details.append(value, footer);
                appCard.append(appIcon, details);
                target.append(appCard);
            } else if (record.fileType === "image" && record.href) {
                const frame = make("div", "finder-media-frame is-image");
                const image = make("img", "finder-preview-image");
                image.src = record.href;
                image.alt = record.name;
                image.loading = "lazy";
                frame.append(image);
                if (record.description) frame.append(make("p", "finder-media-caption", record.description));
                target.append(frame);
            } else if (record.fileType === "video" && record.href) {
                const frame = make("div", "finder-media-frame is-video");
                const video = make("video", "finder-preview-video");
                video.src = record.href;
                video.controls = true;
                video.preload = "metadata";
                video.playsInline = true;
                frame.append(video);
                if (record.description) frame.append(make("p", "finder-media-caption", record.description));
                target.append(frame);
            } else if (record.fileType === "skill") {
                const card = make("section", "finder-skill-profile");
                const accent = make("div", "finder-skill-profile-accent");
                const mark = String(record.name || "T").replace(/[^a-z0-9]/gi, "").slice(0, 2).toUpperCase();
                accent.append(make("span", "finder-skill-profile-mark", mark), make("span", "finder-skill-profile-orbit"));
                const content = make("div", "finder-skill-profile-content");
                content.append(make("span", "finder-visual-eyebrow", "TECHNOLOGY PROFILE"), make("h3", "finder-visual-title", record.name), make("p", "finder-skill-category", record.category || "Technical skill"));
                const note = make("div", "finder-skill-profile-note");
                note.append(make("span", "finder-skill-note-dot"), make("span", "", record.description || "A skill in the toolkit."));
                content.append(note);
                card.append(accent, content);
                target.append(card);
            } else if (record.fileType === "pdf") {
                const isAward = id === "awards";
                const sheet = make("section", `finder-certificate-sheet${isAward ? " is-award" : ""}`);
                const top = make("div", "finder-certificate-topline");
                top.append(make("span", "finder-visual-eyebrow", isAward ? "HONORS & AWARDS" : "CERTIFICATE"));
                if (record.date) top.append(make("span", "finder-certificate-year", record.date));
                const seal = make("div", `finder-certificate-seal${record.medal ? " is-" + record.medal : ""}`);
                seal.innerHTML = isAward
                    ? '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M20 9h24v14c0 9-5 15-12 15s-12-6-12-15V9Zm0 5H9v6c0 8 5 12 13 12m22-18h11v6c0 8-5 12-13 12M32 38v9m-11 8h22l-3-8H24z"/><path d="m32 13 2.4 4.8 5.3.8-3.8 3.7.9 5.3-4.8-2.5-4.8 2.5.9-5.3-3.8-3.7 5.3-.8z"/></svg>'
                    : '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="28" r="19"/><path d="m22 45-4 15 14-7 14 7-4-15M23 28l6 6 13-14"/></svg>';
                const title = make("h3", "finder-certificate-title", record.name);
                const issuer = make("p", "finder-certificate-issuer", record.issuer || "Professional record");
                const achievement = make("div", "finder-certificate-achievement", record.achievement || (record.verified ? "Certificate verified" : "Professional certification"));
                const footer = make("div", "finder-certificate-footer");
                footer.append(make("span", "finder-certificate-rule"), make("span", "finder-certificate-seal-label", isAward ? "RECOGNITION" : record.verified ? "VERIFIED" : "CREDENTIAL"));
                sheet.append(top, seal, make("span", "finder-certificate-kicker", isAward ? "AWARDED TO" : "PRESENTED TO"), title, issuer, achievement, footer);
                target.append(sheet);
            } else if (record.quote?.length) {
                const card = make("section", "finder-quote-card");
                const quoteMark = make("span", "finder-quote-mark", "“");
                quoteMark.setAttribute("aria-hidden", "true");
                const excerpt = make("blockquote", "finder-quote-text", record.quote[0]);
                const attribution = make("div", "finder-quote-attribution");
                const initials = (record.name.match(/\b\w/g) || []).slice(0, 2).join("").toUpperCase();
                const avatar = make("span", "finder-quote-avatar", initials);
                const identity = make("span", "finder-quote-identity");
                identity.append(make("strong", "", record.name), make("small", "", record.role || "Professional reference"));
                attribution.append(avatar, identity);
                card.append(quoteMark, excerpt, attribution);
                if (expanded) {
                    record.quote.slice(1).forEach((paragraph) => card.insertBefore(make("p", "finder-quote-extra", paragraph), attribution));
                }
                target.append(card);
            } else if (id === "experience" || id === "education") {
                const card = make("section", `finder-career-sheet${id === "education" ? " is-education" : ""}`);
                const top = make("div", "finder-career-topline");
                top.append(make("span", "finder-visual-eyebrow", id === "education" ? "ACADEMIC RECORD" : "CAREER RECORD"));
                if (record.date) top.append(make("span", "finder-career-period", record.date));
                const identity = make("div", "finder-career-identity");
                const monogram = (record.organization || "N").split(/\s+/).filter(Boolean).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
                identity.append(make("span", "finder-career-monogram", monogram), make("div", "finder-career-company", record.organization || "Portfolio"));
                const title = make("h3", "finder-career-title", record.role || record.name);
                const focus = make("div", "finder-career-focus");
                focus.append(make("span", "finder-visual-eyebrow", "ROLE HIGHLIGHT"), make("p", "", record.description || "Professional experience and impact."));
                const stats = make("div", "finder-career-stats");
                const statOne = make("div", "finder-career-stat");
                statOne.append(make("strong", "", String(record.children?.length || 0)), make("span", "", id === "education" ? "milestones" : "highlights"));
                const statTwo = make("div", "finder-career-stat");
                statTwo.append(make("strong", "", String(record.tags?.length || 0)), make("span", "", "technologies"));
                stats.append(statOne, statTwo);
                const highlights = make("div", "finder-highlight-grid");
                (record.children || []).slice(1, expanded ? record.children.length : 2).forEach((item, index) => {
                    const highlight = make("div", "finder-highlight-item");
                    highlight.append(make("span", "finder-highlight-index", String(index + 1).padStart(2, "0")), make("p", "", item));
                    highlights.append(highlight);
                });
                const tags = make("div", "finder-tech-chips");
                (record.tags || []).slice(0, expanded ? record.tags.length : 6).forEach((tag) => tags.append(make("span", "finder-tech-chip", tag)));
                card.append(top, identity, title, focus, stats, highlights);
                if (record.tags?.length) card.append(tags);
                target.append(card);
            } else {
                const card = make("section", "finder-document-cover");
                const icon = make("div", "finder-preview-file-art is-document");
                icon.innerHTML = itemIconMarkup(record);
                const extension = make("span", "", record.extension.toUpperCase());
                icon.append(extension);
                card.append(icon, make("span", "finder-visual-eyebrow", "DOCUMENT PREVIEW"), make("h3", "finder-visual-title", record.name), make("p", "finder-visual-copy", record.description || "Portfolio document"));
                target.append(card);
            }

        }

        function showPreview(record) {
            preview.replaceChildren();
            const previewTitle = document.createElement("h2");
            previewTitle.textContent = record.name;
            const previewMeta = document.createElement("p");
            previewMeta.className = "finder-preview-meta";
            previewMeta.textContent = record.meta;
            const previewContent = document.createElement("div");
            previewContent.className = "finder-preview-content";
            appendRecordPreview(record, previewContent);
            const open = document.createElement("button");
            open.className = "finder-open-button";
            open.type = "button";
            open.textContent = record.kind === "folder" ? "Open Folder" : record.kind === "app" ? "Open " + record.name : record.fileType === "image" || record.fileType === "video" ? "Open in Gallery" : "Open File";
            open.addEventListener("click", () => openRecord(record));
            preview.append(previewTitle, previewMeta, previewContent, open);
        }

        function openRecord(record) {
            if (record.kind === "folder") {
                stack.push({ records: currentRecords, path: currentSubfolder });
                currentRecords = record.children || [];
                currentSubfolder = record.name;
                renderRows(currentRecords, currentSubfolder);
                return;
            }
            if (record.kind === "app") {
                if (record.href) window.open(record.href, "_blank", "noopener,noreferrer");
                return;
            }
            if (id === "gallery" && record.source) {
                record.source.click();
                lastFocusedElement = selectedFolderItem;
                return;
            }
            listing.hidden = true;
            detail.hidden = false;
            path.textContent = "Macintosh HD  ›  Users  ›  Navaneeth  ›  " + labels[id] + "  ›  " + record.name + "." + record.extension;
            detailBody.replaceChildren();
            const heading = document.createElement("h2");
            heading.textContent = record.name + "." + record.extension;
            const meta = document.createElement("p");
            meta.className = "finder-preview-meta";
            meta.textContent = record.meta;
            const content = document.createElement("div");
            content.className = "finder-document-content";
            detailBody.append(heading, meta, content);
            appendRecordPreview(record, content, true);
        }

        rootButton.addEventListener("click", () => openApp("files"));
        folderUp.addEventListener("click", () => {
            const parent = stack.pop();
            if (!parent) return;
            detail.hidden = true;
            listing.hidden = false;
            currentRecords = parent.records;
            currentSubfolder = parent.path;
            renderRows(currentRecords, currentSubfolder);
        });
        renderRows(records);
        browser.append(toolbar, listing, detail);
        content.append(browser, originalContent);
        folderBrowserViews.set(id, { browser, originalContent, content, reset: resetFolderView });
    }

    folderIds.forEach((id) => {
        if (id !== "gallery") buildFolderBrowser(id);
    });

    const rootFinderContent = document.querySelector("#files .finder-content");
    if (rootFinderContent) {
        const layout = document.createElement("div");
        layout.className = "finder-root-layout";
        const sidebar = document.createElement("aside");
        sidebar.className = "finder-sidebar";
        sidebar.innerHTML = '<h3>Favorites</h3><button class="selected" type="button" data-finder-location="home" aria-current="page"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m2 9 8-7 8 7v8a1 1 0 0 1-1 1h-5v-5H8v5H3a1 1 0 0 1-1-1V9Z" fill="currentColor"/></svg><span>Navaneeth</span></button><h3>Locations</h3><button type="button" data-finder-location="macintosh-hd"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm0 3v8h12V5H4Zm1 10v1h2v-1H5Zm4 0v1h2v-1H9Zm4 0v1h2v-1h-2Z" fill="currentColor"/></svg><span>Macintosh HD</span></button>';
        const main = document.createElement("div");
        main.className = "finder-root-main";
        const toolbar = document.createElement("div");
        toolbar.className = "finder-toolbar finder-root-toolbar";
        const nav = document.createElement("nav");
        nav.className = "finder-path";
        nav.setAttribute("aria-label", "Folder path");
        toolbar.append(nav);
        const rootItems = [...rootFinderContent.children].filter((child) => !child.classList.contains("finder-heading"));
        const homeView = document.createElement("div");
        homeView.className = "finder-home-view";
        rootItems.forEach((child) => homeView.append(child));
        main.append(toolbar, homeView);
        layout.append(sidebar, main);
        rootFinderContent.replaceChildren(layout);

        const makeLocationView = (title, description) => {
            const view = document.createElement("section");
            view.className = "finder-location-view";
            const heading = document.createElement("h2");
            heading.className = "section-title";
            heading.textContent = title;
            const intro = document.createElement("p");
            intro.className = "finder-intro";
            intro.textContent = description;
            const grid = document.createElement("div");
            grid.className = "folder-grid";
            view.append(heading, intro, grid);
            return { view, grid };
        };
        const addLocationFolder = (grid, name, description, onOpen) => {
            const folder = document.createElement("button");
            folder.type = "button";
            folder.className = "folder-card finder-location-card";
            folder.innerHTML = '<span aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M4 13a4 4 0 0 1 4-4h12l5 5h15a4 4 0 0 1 4 4v17a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V13Z" fill="#55adf5" stroke="#267bd3" stroke-width="2"/><path d="M5 19h39" fill="none" stroke="rgba(255,255,255,.72)" stroke-width="2"/></svg></span><strong></strong><small></small>';
            folder.querySelector("strong").textContent = name;
            folder.querySelector("small").textContent = description;
            folder.addEventListener("click", onOpen);
            grid.append(folder);
        };
        const disk = makeLocationView("Macintosh HD", "Browse this Mac.");
        addLocationFolder(disk.grid, "Users", "User folders", () => showFinderLocation("users"));
        const users = makeLocationView("Users", "Choose a user folder.");
        addLocationFolder(users.grid, "Navaneeth", "Home folder", () => showFinderLocation("home"));
        main.append(disk.view, users.view);

        const pathSegments = {
            "macintosh-hd": [{ label: "Macintosh HD", location: "macintosh-hd" }],
            users: [{ label: "Macintosh HD", location: "macintosh-hd" }, { label: "Users", location: "users" }],
            home: [{ label: "Macintosh HD", location: "macintosh-hd" }, { label: "Users", location: "users" }, { label: "Navaneeth", location: "home" }],
        };
        function showFinderLocation(location) {
            main.replaceChildren(toolbar, homeView, disk.view, users.view);
            const views = { home: homeView, "macintosh-hd": disk.view, users: users.view };
            Object.entries(views).forEach(([key, view]) => { view.hidden = key !== location; });
            sidebar.querySelectorAll("[data-finder-location]").forEach((button) => {
                const selected = button.dataset.finderLocation === (location === "home" ? "home" : "macintosh-hd");
                button.classList.toggle("selected", selected);
                if (selected) button.setAttribute("aria-current", "page");
                else button.removeAttribute("aria-current");
            });
            nav.replaceChildren();
            pathSegments[location].forEach((segment, index) => {
                if (index) {
                    const separator = document.createElement("span");
                    separator.className = "finder-crumb-separator";
                    separator.setAttribute("aria-hidden", "true");
                    separator.textContent = "›";
                    nav.append(separator);
                }
                const crumb = document.createElement("button");
                crumb.type = "button";
                crumb.className = "finder-crumb";
                crumb.textContent = segment.label;
                if (index === pathSegments[location].length - 1) crumb.setAttribute("aria-current", "page");
                else crumb.addEventListener("click", () => showFinderLocation(segment.location));
                nav.append(crumb);
            });
            const title = document.querySelector("#files .window-title");
            if (title) title.textContent = location === "home" ? "Navaneeth" : location === "users" ? "Users" : "Macintosh HD";
            const version = document.querySelector("#files .window-version");
            if (version) version.textContent = "";
            if (body.dataset.activeApp === "files") {
                body.dataset.activeKind = "app";
                history.replaceState({ portfolioApp: "files", openAsApp: false }, "", `${window.location.pathname}${window.location.search}#files`);
            }
        }
        returnToFinderHome = () => {
            showFinderLocation("home");
        };
        openFinderFolderView = (id, updateAddress, opener) => {
            const folderView = folderBrowserViews.get(id);
            if (!folderView) return;
            if (body.dataset.activeApp !== "files") {
                appWindows.find((app) => app.dataset.window === "files")?.classList.add("finder-folder-open");
                openApp("files", false, opener);
            }
            folderView.reset?.();
            main.replaceChildren(folderView.browser);
            folderView.browser.hidden = false;
            folderView.originalContent.hidden = true;
            folderView.content.classList.remove("finder-browser-host");
            body.dataset.activeApp = "files";
            body.dataset.activeKind = "folder";
            homeScreen.hidden = true;
            homeButton.hidden = false;
            menuAppName.textContent = "Finder";
            setLastLauncher(opener);
            const title = document.querySelector("#files .window-title");
            if (title) title.textContent = labels[id] || "Finder";
            document.querySelectorAll(".dock-item").forEach((item) => {
                item.classList.toggle("active", item.dataset.openApp === "files");
            });
            if (updateAddress) {
                history.replaceState({ portfolioApp: id, openAsApp: false }, "", `${window.location.pathname}${window.location.search}#${id}`);
            }
        };
        sidebar.addEventListener("click", (event) => {
            const button = event.target.closest("[data-finder-location]");
            if (button) showFinderLocation(button.dataset.finderLocation);
        });
        showFinderLocation("home");
    }
    return {
        buildFolderBrowser,
        getFolderView: (id) => folderBrowserViews.get(id),
        openFinderFolderView,
        returnToFinderHome,
        setGalleryItems: (items) => { galleryItems = items; },
    };
}
