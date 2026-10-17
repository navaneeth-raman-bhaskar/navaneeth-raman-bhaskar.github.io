function initializeFinder({ body, homeScreen, homeIndicator, menuAppName, appWindows, folderIds, labels, openApp, setLastLauncher }) {
    let galleryItems = [];
    let openFinderFolderView = null;
    let returnToFinderHome = null;
    let navigateFinderLocation = null;

    // SVG templates
    const SVG_FOLDER = `
        <svg viewBox="0 0 88 72" class="mac-folder-svg" aria-hidden="true">
            <path d="M7 11C7 7.7 9.7 5 13 5H33C35.5 5 37.8 6.6 39.5 8.7L42.5 12.5H75C78.3 12.5 81 15.2 81 18.5V58C81 61.3 78.3 64 75 64H13C9.7 64 7 61.3 7 58V11Z" fill="url(#macFolderBack)"/>
            <path d="M7 23C7 19.7 9.7 17 13 17H75C78.3 17 81 19.7 81 23V58.5C81 62.5 78 65.5 74 65.5H14C10 65.5 7 62.5 7 58.5V23Z" fill="url(#macFolderFront)" filter="url(#macFolderDepth)"/>
            <line x1="11" y1="18.5" x2="77" y2="18.5" stroke="rgba(255,255,255,0.7)" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
    `;

    const SVG_FILE_PDF = `
        <svg viewBox="0 0 68 84" class="mac-file-svg" aria-hidden="true">
            <path d="M8 6C8 3.8 9.8 2 12 2H46L60 16V78C60 80.2 58.2 82 56 82H12C9.8 82 8 80.2 8 78V6Z" fill="#ffffff" stroke="#cbd3dc" stroke-width="1"/>
            <path d="M46 2V14C46 15.1 46.9 16 48 16H60" fill="#d9e0ea" stroke="#b8c2ce" stroke-width="1"/>
            <rect x="15" y="44" width="38" height="18" rx="3.5" fill="#e93d3d"/>
            <text x="34" y="57" fill="#ffffff" font-family="-apple-system, sans-serif" font-size="10" font-weight="800" text-anchor="middle">PDF</text>
            <line x1="16" y1="24" x2="38" y2="24" stroke="#a0aab8" stroke-width="2" stroke-linecap="round"/>
            <line x1="16" y1="31" x2="42" y2="31" stroke="#a0aab8" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `;

    const SVG_FILE_RTF = `
        <svg viewBox="0 0 68 84" class="mac-file-svg" aria-hidden="true">
            <path d="M8 6C8 3.8 9.8 2 12 2H46L60 16V78C60 80.2 58.2 82 56 82H12C9.8 82 8 80.2 8 78V6Z" fill="#ffffff" stroke="#cbd3dc" stroke-width="1"/>
            <path d="M46 2V14C46 15.1 46.9 16 48 16H60" fill="#d9e0ea" stroke="#b8c2ce" stroke-width="1"/>
            <line x1="16" y1="26" x2="42" y2="26" stroke="#487ee6" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="16" y1="35" x2="52" y2="35" stroke="#909cb0" stroke-width="1.8" stroke-linecap="round"/>
            <line x1="16" y1="43" x2="52" y2="43" stroke="#909cb0" stroke-width="1.8" stroke-linecap="round"/>
            <line x1="16" y1="51" x2="46" y2="51" stroke="#909cb0" stroke-width="1.8" stroke-linecap="round"/>
            <line x1="16" y1="59" x2="50" y2="59" stroke="#909cb0" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
    `;

    const SVG_FILE_TXT = `
        <svg viewBox="0 0 68 84" class="mac-file-svg" aria-hidden="true">
            <path d="M8 6C8 3.8 9.8 2 12 2H46L60 16V78C60 80.2 58.2 82 56 82H12C9.8 82 8 80.2 8 78V6Z" fill="#ffffff" stroke="#cbd3dc" stroke-width="1"/>
            <path d="M46 2V14C46 15.1 46.9 16 48 16H60" fill="#d9e0ea" stroke="#b8c2ce" stroke-width="1"/>
            <line x1="16" y1="26" x2="36" y2="26" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="16" y1="35" x2="52" y2="35" stroke="#909cb0" stroke-width="1.8" stroke-linecap="round"/>
            <line x1="16" y1="43" x2="48" y2="43" stroke="#909cb0" stroke-width="1.8" stroke-linecap="round"/>
            <line x1="16" y1="51" x2="52" y2="51" stroke="#909cb0" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
    `;

    // Dock-matching application icons
    const SVG_DOCK_TERMINAL = `
        <svg viewBox="0 0 64 64" class="finder-app-icon" aria-hidden="true">
            <defs>
                <linearGradient id="finderTermFrame" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#76849b"/><stop offset=".5" stop-color="#354257"/><stop offset="1" stop-color="#111827"/></linearGradient>
                <linearGradient id="finderTermScreen" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#202b3b"/><stop offset="1" stop-color="#090e17"/></linearGradient>
                <linearGradient id="finderTermGloss" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff" stop-opacity=".3"/><stop offset=".5" stop-color="#fff" stop-opacity=".04"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
                <clipPath id="finderTermClip"><rect x="4" y="4" width="56" height="56" rx="17"/></clipPath>
            </defs>
            <rect x="3.5" y="3.5" width="57" height="57" rx="17.5" fill="url(#finderTermFrame)"/>
            <g clip-path="url(#finderTermClip)">
                <rect x="8" y="9" width="48" height="46" rx="11" fill="url(#finderTermScreen)"/>
                <path d="M8 20V15a6 6 0 0 1 6-6h36a6 6 0 0 1 6 6v5H8Z" fill="#38465a"/>
                <circle cx="16" cy="14.5" r="1.8" fill="#ff6259"/>
                <circle cx="22.5" cy="14.5" r="1.8" fill="#ffc14d"/>
                <circle cx="29" cy="14.5" r="1.8" fill="#35c96f"/>
                <path d="m17 29 9 7-9 7" fill="none" stroke="#f5f8ff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M31 43h13" fill="none" stroke="#78dcff" stroke-width="3.2" stroke-linecap="round"/>
                <path d="M4 5h56v23C43 16 23 16 4 31V5Z" fill="url(#finderTermGloss)"/>
            </g>
            <rect x="4" y="4" width="56" height="56" rx="17" fill="none" stroke="#fff" stroke-opacity=".34" stroke-width="1.2"/>
        </svg>
    `;

    const SVG_DOCK_PHOTOS = `
        <svg viewBox="0 0 64 64" class="finder-app-icon" aria-hidden="true">
            <defs>
                <linearGradient id="finderPhotosBg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#edf2fa"/></linearGradient>
            </defs>
            <rect x="3.5" y="3.5" width="57" height="57" rx="17.5" fill="url(#finderPhotosBg)"/>
            <g transform="translate(32 32) scale(0.78)">
                <path d="M0 0C-4-6-7-13-7-19c0-6 3-10 7-10s7 4 7 10C7-13 4-6 0 0Z" fill="#f24845"/>
                <path d="M0 0C-4-6-7-13-7-19c0-6 3-10 7-10s7 4 7 10C7-13 4-6 0 0Z" fill="#ff9632" transform="rotate(45)"/>
                <path d="M0 0C-4-6-7-13-7-19c0-6 3-10 7-10s7 4 7 10C7-13 4-6 0 0Z" fill="#ffd43b" transform="rotate(90)"/>
                <path d="M0 0C-4-6-7-13-7-19c0-6 3-10 7-10s7 4 7 10C7-13 4-6 0 0Z" fill="#5bc46b" transform="rotate(135)"/>
                <path d="M0 0C-4-6-7-13-7-19c0-6 3-10 7-10s7 4 7 10C7-13 4-6 0 0Z" fill="#36c3ac" transform="rotate(180)"/>
                <path d="M0 0C-4-6-7-13-7-19c0-6 3-10 7-10s7 4 7 10C7-13 4-6 0 0Z" fill="#3797f4" transform="rotate(225)"/>
                <path d="M0 0C-4-6-7-13-7-19c0-6 3-10 7-10s7 4 7 10C7-13 4-6 0 0Z" fill="#7859df" transform="rotate(270)"/>
                <path d="M0 0C-4-6-7-13-7-19c0-6 3-10 7-10s7 4 7 10C7-13 4-6 0 0Z" fill="#c94ec8" transform="rotate(315)"/>
                <circle r="5" fill="#fff"/>
            </g>
            <rect x="4" y="4" width="56" height="56" rx="17" fill="none" stroke="#fff" stroke-opacity=".82" stroke-width="1.2"/>
        </svg>
    `;

    const SVG_DOCK_ACROBAT = `
        <svg viewBox="0 0 64 64" class="finder-app-icon" aria-hidden="true">
            <defs>
                <linearGradient id="finderAcrobatBg" x1="0" y1="0" x2="0" y2="1">
                    <stop stop-color="#ff3b30"/>
                    <stop offset=".45" stop-color="#e01212"/>
                    <stop offset="1" stop-color="#a80707"/>
                </linearGradient>
                <linearGradient id="finderAcrobatTopSheen" x1="0" y1="0" x2="0" y2="1">
                    <stop stop-color="#ffffff" stop-opacity=".24"/>
                    <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
                </linearGradient>
                <clipPath id="finderAcrobatClip">
                    <rect x="3.5" y="3.5" width="57" height="57" rx="17.5"/>
                </clipPath>
            </defs>
            <rect x="3.5" y="3.5" width="57" height="57" rx="17.5" fill="url(#finderAcrobatBg)"/>
            <g clip-path="url(#finderAcrobatClip)">
                <rect x="3.5" y="3.5" width="57" height="24" fill="url(#finderAcrobatTopSheen)"/>
                <g transform="translate(0.5 0)" fill="#ffffff">
                    <path d="M43.8 35.8c-1.3-.9-3.5-1.4-6.4-1.4-1.2 0-2.4.1-3.6.3-1.6-1.5-3.3-3.7-4.8-6.4 1.1-3.6 1.8-6.9 1.8-9.4 0-2.6-.9-4.3-2.6-4.3-1.2 0-2.2.9-2.5 2.4-.6 3.1.2 6.6 2.1 10.7-.7 2.4-1.7 5.1-3 8-3.7 1.9-8.4 4.8-10.2 7.7-1.4 2.2-1.2 4.4.4 5.3 1.1.6 2.5.7 4 .2 3.6-1.1 7.4-4.5 10.6-9.8 2.6-.9 5.3-1.6 8-2.2 2.3 2.5 4.9 4.1 7.4 4.6 1.3.3 2.5.2 3.4-.4 1.7-1.1 1.7-3.6-.7-5.3zm-24.6 9c-.9 1-1.8 1.4-2.5 1.4-.4 0-.8-.1-1-.4-.3-.4-.3-1.1.2-2.1 1.1-2 3.9-4.5 6.7-6.2-1.7 3.5-2.7 6.1-3.4 7.3zm8.9-26.7c.3 0 .7.5.8 1.4 0 1.5-.4 3.7-1.1 6.3-1.1-2.9-1.6-5.3-1.4-6.7.2-.7.8-1 1.7-1zm-2.4 17.5c1-1.8 2-3.6 2.9-5.3 1.2 1.9 2.5 3.6 3.8 4.9-2.1.4-4.3.9-6.7 1.4v-1zm16.5 4.3c-.4.2-1.1.1-2.1-.2-1.5-.4-3.1-1.4-4.6-2.9 1.8-.1 3.4 0 4.6.4 1.8.6 2.6 1.7 2.1 2.7z"/>
                </g>
            </g>
            <rect x="4" y="4" width="56" height="56" rx="17" fill="none" stroke="#fff" stroke-opacity=".34" stroke-width="1.2"/>
        </svg>
    `;

    const SVG_DOCK_TEXTEDIT = `
        <svg viewBox="0 0 64 64" class="finder-app-icon" aria-hidden="true">
            <defs>
                <linearGradient id="finderTextEditBg" x1="0" y1="0" x2="1" y2="1">
                    <stop stop-color="#ffffff"/>
                    <stop offset="1" stop-color="#edf1f7"/>
                </linearGradient>
                <linearGradient id="finderTextEditPen" x1="0" y1="0" x2="1" y2="1">
                    <stop stop-color="#343942"/>
                    <stop offset=".6" stop-color="#1d2026"/>
                    <stop offset="1" stop-color="#0a0c0f"/>
                </linearGradient>
                <linearGradient id="finderTextEditGold" x1="0" y1="0" x2="1" y2="1">
                    <stop stop-color="#ffd60a"/>
                    <stop offset="1" stop-color="#c99700"/>
                </linearGradient>
                <clipPath id="finderTextEditClip">
                    <rect x="3.5" y="3.5" width="57" height="57" rx="17.5"/>
                </clipPath>
                <filter id="finderTextEditPenShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="-1" dy="2" stdDeviation="1.5" flood-color="#000" flood-opacity="0.32"/>
                </filter>
            </defs>
            <rect x="3.5" y="3.5" width="57" height="57" rx="17.5" fill="url(#finderTextEditBg)"/>
            <g clip-path="url(#finderTextEditClip)">
                <line x1="12" y1="18" x2="40" y2="18" stroke="#0a84ff" stroke-opacity=".45" stroke-width="2" stroke-linecap="round"/>
                <line x1="12" y1="26" x2="52" y2="26" stroke="#8e8e93" stroke-opacity=".3" stroke-width="1.8" stroke-linecap="round"/>
                <line x1="12" y1="33" x2="52" y2="33" stroke="#8e8e93" stroke-opacity=".3" stroke-width="1.8" stroke-linecap="round"/>
                <line x1="12" y1="40" x2="52" y2="40" stroke="#8e8e93" stroke-opacity=".3" stroke-width="1.8" stroke-linecap="round"/>
                <line x1="12" y1="47" x2="38" y2="47" stroke="#8e8e93" stroke-opacity=".3" stroke-width="1.8" stroke-linecap="round"/>
                <g transform="translate(34 10) rotate(42)" filter="url(#finderTextEditPenShadow)">
                    <rect x="-3.5" y="6" width="7" height="28" rx="2" fill="url(#finderTextEditPen)"/>
                    <rect x="-3.5" y="10" width="7" height="2" fill="url(#finderTextEditGold)"/>
                    <rect x="-3.5" y="24" width="7" height="2.5" fill="url(#finderTextEditGold)"/>
                    <path d="M-3 26.5 L0 36 L3 26.5 Z" fill="url(#finderTextEditGold)"/>
                    <path d="M-1.2 30 L0 36 L1.2 30 Z" fill="#2c3038"/>
                    <line x1="0" y1="31" x2="0" y2="35" stroke="#fff" stroke-width="0.5"/>
                    <path d="M1 8 L1 19 L2.5 19 L2.5 8 Z" fill="url(#finderTextEditGold)"/>
                    <circle cx="1.75" cy="19.5" r="1" fill="url(#finderTextEditGold)"/>
                </g>
            </g>
            <rect x="4" y="4" width="56" height="56" rx="17" fill="none" stroke="#fff" stroke-opacity=".82" stroke-width="1.2"/>
        </svg>
    `;

    const HTML_DOCK_MAIL = `
        <div class="dock-tile dock-tile-email">
            <img class="dock-tile-img" src="./assets/images/gmail.png" alt="Mail" aria-hidden="true">
        </div>
    `;

    const HTML_DOCK_MAPS = `
        <div class="dock-tile dock-tile-maps">
            <img class="dock-tile-img" src="./assets/images/maps.png" alt="Maps" aria-hidden="true">
        </div>
    `;

    const HTML_DOCK_WHATSAPP = `
        <div class="dock-tile dock-tile-whatsapp">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2a9.92 9.92 0 0 0-8.53 15l-1.3 4.75 4.86-1.28A9.94 9.94 0 1 0 12.04 2Zm0 18.08a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-2.88.76.77-2.8-.2-.31a8.11 8.11 0 1 1 6.74 3.66Zm4.45-6.08c-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.95-1.2-.72-.64-1.21-1.44-1.35-1.68-.14-.24-.01-.37.1-.49.11-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.46-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.09 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.52.1.46-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z"/></svg>
        </div>
    `;

    const HTML_DOCK_PHONE = `
        <div class="dock-tile dock-tile-phone">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3.5 10 3l1.7 4.2-2 1.6a15 15 0 0 0 5.5 5.5l1.6-2L21 14l-.5 3c-.3 1.7-1.8 2.8-3.5 2.5A17.5 17.5 0 0 1 4.5 7C4.2 5.3 5.3 3.8 7 3.5Z"/></svg>
        </div>
    `;

    const HTML_DOCK_LINKEDIN = `
        <div class="dock-tile dock-tile-linkedin">
            <svg viewBox="0 0 512 512" aria-hidden="true"><g transform="translate(32 32)"><path d="M100.28 448H7.4V148.9h92.88zm-46.44-339C24.7 109 1.2 84.3 1.2 53.8 1.2 24.1 25 0 53.8 0c28.9 0 52.6 24.1 52.6 53.8 0 29.4-23.5 55.2-52.6 55.2zM447.9 448h-92.7V302.4c0-34.7-.7-79.4-48.4-79.4-48.4 0-55.8 37.8-55.8 76.9V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.6-48.4 87.7-48.4 93.8 0 111.2 61.8 111.2 142.3V448z"/></g></svg>
        </div>
    `;

    const HTML_DOCK_GITHUB = `
        <div class="dock-tile dock-tile-github">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.1c-3.14.68-3.8-1.33-3.8-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.02 1.74 2.67 1.24 3.32.95.1-.74.4-1.24.73-1.53-2.5-.29-5.13-1.25-5.13-5.57 0-1.23.44-2.23 1.16-3.02-.12-.29-.5-1.44.11-2.99 0 0 .95-.3 3.08 1.15a10.7 10.7 0 0 1 5.61 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.55.23 2.7.11 2.99.73.79 1.16 1.79 1.16 3.02 0 4.33-2.63 5.28-5.14 5.56.41.36.78 1.04.78 2.1v3.13c0 .3.2.65.78.54A11.2 11.2 0 0 0 12 .8Z"/></svg>
        </div>
    `;

    // Parse records from existing window contents
    const folderRecords = new Map();

    function parseFolderRecords(id) {
        const win = appWindows.find((item) => item.dataset.window === id);
        const content = win?.querySelector(".window-content");
        if (!content) return [];

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
        return sources.map((source, index) => {
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

            return {
                name,
                meta,
                extension,
                source,
                kind,
                fileType,
                description,
                href,
                appType,
                children,
                organization: recordOrganization,
                date: recordDate,
                role: recordRole,
                tags,
                issuer,
                achievement,
                quote,
                medal,
                verified,
                folderId: id === "skills" ? null : id
            };
        });
    }

    folderIds.forEach((id) => {
        folderRecords.set(id, parseFolderRecords(id));
    });

    // Root Documents items
    const rootPortfolioItems = [
        { name: "Experience", kind: "folder", folderId: "experience", meta: "Folder · Career Timeline", date: "Oct 2026", size: "4 items" },
        { name: "Skills", kind: "folder", folderId: "skills", meta: "Folder · Technology & Tools", date: "Oct 2026", size: "6 folders" },
        { name: "Education", kind: "folder", folderId: "education", meta: "Folder · Degrees & Schools", date: "Oct 2026", size: "2 items" },
        { name: "Certifications", kind: "folder", folderId: "certifications", meta: "Folder · Verified Credentials", date: "Oct 2026", size: "3 items" },
        { name: "Awards", kind: "folder", folderId: "awards", meta: "Folder · Honors & Recognitions", date: "Oct 2026", size: "2 items" },
        { name: "References", kind: "folder", folderId: "references", meta: "Folder · Professional Recommendations", date: "Oct 2026", size: "3 items" },
        { name: "Media", kind: "folder", folderId: "gallery", meta: "Folder · Talks & DevFest Photos", date: "Oct 2026", size: "16 items" },
        { name: "Contact", kind: "folder", folderId: "contact", meta: "Folder · Communication Apps", date: "Oct 2026", size: "4 items" },
        { name: "About Me", extension: "rtf", kind: "file", fileType: "document", isAbout: true, meta: "Rich Text Document", date: "Oct 2026", size: "4 KB" },
        { name: "Resume", extension: "pdf", kind: "file", fileType: "pdf", isResume: true, meta: "PDF Document", date: "Oct 2026", size: "123 KB" }
    ];

    // Applications folder items
    const applicationsItems = [
        { name: "TextEdit", extension: "app", kind: "app", appId: "textedit", meta: "Application", date: "Oct 2026", size: "16 MB" },
        { name: "Adobe Acrobat", extension: "app", kind: "app", appId: "pdf", meta: "Application", date: "Oct 2026", size: "42 MB" },
        { name: "Terminal", extension: "app", kind: "app", appId: "terminal", meta: "Application", date: "Oct 2026", size: "12 MB" },
        { name: "Photos", extension: "app", kind: "app", appId: "gallery", meta: "Application", date: "Oct 2026", size: "28 MB" },
        { name: "Mail", extension: "app", kind: "app", appType: "email", href: "mailto:navaneeth@example.com", meta: "Application", date: "Oct 2026", size: "8 MB" },
        { name: "Maps", extension: "app", kind: "app", appType: "location", href: "https://maps.google.com", meta: "Application", date: "Oct 2026", size: "14 MB" },
        { name: "WhatsApp", extension: "app", kind: "app", appType: "whatsapp", href: "https://wa.me/", meta: "Application", date: "Oct 2026", size: "18 MB" },
        { name: "Phone", extension: "app", kind: "app", appType: "phone", href: "tel:+910000000000", meta: "Application", date: "Oct 2026", size: "5 MB" }
    ];

    const rootFinderContent = document.querySelector("#files .finder-content");
    if (!rootFinderContent) return;

    // Inject SVG Gradient defs into document once
    if (!document.getElementById("macFinderGradients")) {
        const defsContainer = document.createElement("div");
        defsContainer.id = "macFinderGradients";
        defsContainer.innerHTML = `
            <svg width="0" height="0" style="position:absolute;pointer-events:none;">
                <defs>
                    <linearGradient id="macFolderBack" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#4aa3f8"/>
                        <stop offset="100%" stop-color="#1f71d8"/>
                    </linearGradient>
                    <linearGradient id="macFolderFront" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#76c3ff"/>
                        <stop offset="28%" stop-color="#46a2fb"/>
                        <stop offset="100%" stop-color="#1871e2"/>
                    </linearGradient>
                    <filter id="macFolderDepth" x="-10%" y="-10%" width="120%" height="135%">
                        <feDropShadow dx="0" dy="2.5" stdDeviation="2" flood-color="#093d79" flood-opacity="0.38"/>
                    </filter>
                </defs>
            </svg>
        `;
        document.body.appendChild(defsContainer);
    }

    // Build Macintosh Finder Window Layout
    const layout = document.createElement("div");
    layout.className = "mac-finder-layout";

    // Sidebar
    const sidebar = document.createElement("aside");
    sidebar.className = "mac-finder-sidebar";
    sidebar.innerHTML = `
        <div class="sidebar-section">
            <div class="sidebar-section-title">Favourites</div>
            <button type="button" class="sidebar-item" data-location="airdrop">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 18a6 6 0 0 1-4.24-1.76l1.41-1.41A4 4 0 0 0 12 16a4 4 0 0 0 2.83-1.17l1.41 1.41A6 6 0 0 1 12 18Zm0-4a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0-8a10 10 0 0 0-7.07 2.93l1.41 1.41A8 8 0 0 1 12 8a8 8 0 0 1 5.66 2.34l1.41-1.41A10 10 0 0 0 12 6Z"/></svg>
                <span>AirDrop</span>
            </button>
            <button type="button" class="sidebar-item" data-location="recents">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>
                <span>Recents</span>
            </button>
            <button type="button" class="sidebar-item" data-location="applications">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m5 19 6.2-14.4a1 1 0 0 1 1.6 0L19 19M7.5 13.5h9"/></svg>
                <span>Applications</span>
            </button>
            <button type="button" class="sidebar-item" data-location="downloads">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 3.5 3.5 3.5-3.5M12 7.5v8"/></svg>
                <span>Downloads</span>
            </button>
        </div>

        <div class="sidebar-section">
            <div class="sidebar-section-title">iCloud</div>
            <button type="button" class="sidebar-item" data-location="icloud-drive">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17.5 19H9a5 5 0 0 1-1.2-9.85A6.5 6.5 0 0 1 19.8 12.5 4 4 0 0 1 17.5 19Z"/></svg>
                <span>iCloud Drive</span>
            </button>
            <button type="button" class="sidebar-item selected" data-location="documents">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 3h8l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M14 3v5h5"/></svg>
                <span>Documents</span>
            </button>
            <button type="button" class="sidebar-item" data-location="desktop">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>
                <span>Desktop</span>
            </button>
            <button type="button" class="sidebar-item" data-location="shared">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>Shared</span>
            </button>
        </div>

        <div class="sidebar-section">
            <div class="sidebar-section-title">Locations</div>
            <button type="button" class="sidebar-item" data-location="macintosh-hd">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="7" cy="12" r="1" fill="currentColor"/><circle cx="10" cy="12" r="1" fill="currentColor"/></svg>
                <span>Macintosh HD</span>
            </button>
            <button type="button" class="sidebar-item" data-location="network">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 0 1 4 9 15 15 0 0 1-4 9 15 15 0 0 1-4-9 15 15 0 0 1 4-9Z"/></svg>
                <span>Network</span>
            </button>
        </div>

        <div class="sidebar-section">
            <div class="sidebar-section-title">Tags</div>
            <button type="button" class="sidebar-item" data-location="tag-red"><span class="tag-dot red"></span><span>Red</span></button>
            <button type="button" class="sidebar-item" data-location="tag-orange"><span class="tag-dot orange"></span><span>Orange</span></button>
            <button type="button" class="sidebar-item" data-location="tag-yellow"><span class="tag-dot yellow"></span><span>Yellow</span></button>
        </div>
    `;

    // Main Content
    const main = document.createElement("main");
    main.className = "mac-finder-main";

    // Toolbar
    const toolbar = document.createElement("div");
    toolbar.className = "mac-finder-toolbar";
    toolbar.innerHTML = `
        <div class="toolbar-nav">
            <button type="button" class="sidebar-toggle-btn" title="Toggle Sidebar" aria-label="Toggle Sidebar">
                <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2v8h3V6H5zm5 0v8h5V6h-5z" clip-rule="evenodd"/></svg>
            </button>
            <div class="nav-arrows">
                <button type="button" class="nav-btn btn-back" title="Back" aria-label="Go Back">
                    <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                </button>
                <button type="button" class="nav-btn btn-forward" title="Forward" aria-label="Go Forward">
                    <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg>
                </button>
            </div>
            <span class="folder-title">Documents</span>
        </div>
        <div class="toolbar-actions">
            <div class="view-switchers">
                <button type="button" class="view-btn view-icons selected" title="As Icons" aria-label="As Icons">
                    <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1.2"/><rect x="9" y="1" width="6" height="6" rx="1.2"/><rect x="1" y="9" width="6" height="6" rx="1.2"/><rect x="9" y="9" width="6" height="6" rx="1.2"/></svg>
                </button>
                <button type="button" class="view-btn view-list" title="As List" aria-label="As List">
                    <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor"><path fill-rule="evenodd" d="M2 3.5h12v1.5H2zm0 4h12v1.5H2zm0 4h12v1.5H2z"/></svg>
                </button>
            </div>
            <div class="finder-search-wrap">
                <svg viewBox="0 0 20 20" width="13" height="13" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/></svg>
                <input type="search" class="finder-search-input" placeholder="Search" aria-label="Search folder">
            </div>
        </div>
    `;

    // View Container
    const viewContainer = document.createElement("div");
    viewContainer.className = "mac-finder-view-container";

    const iconGrid = document.createElement("div");
    iconGrid.className = "mac-finder-icon-grid";
    iconGrid.style.display = "grid";

    const listView = document.createElement("div");
    listView.className = "mac-finder-list-view is-hidden";
    listView.hidden = true;
    listView.style.display = "none";

    viewContainer.append(iconGrid, listView);

    // Status bar
    const statusBar = document.createElement("div");
    statusBar.className = "mac-finder-status-bar";
    statusBar.textContent = "10 items, 452.1 GB available";

    main.append(toolbar, viewContainer, statusBar);
    layout.append(sidebar, main);
    rootFinderContent.replaceChildren(layout);

    // State management
    const historyStack = [];
    let historyIndex = -1;
    let currentViewMode = "icons"; // "icons" or "list"
    let currentItems = rootPortfolioItems;
    let currentTitle = "Documents";
    let currentLocation = "documents";
    let currentSubfolder = null;
    let selectedItemElement = null;
    let justNavigated = false;

    const folderTitleEl = toolbar.querySelector(".folder-title");
    const btnBack = toolbar.querySelector(".btn-back");
    const btnForward = toolbar.querySelector(".btn-forward");
    const btnViewIcons = toolbar.querySelector(".view-icons");
    const btnViewList = toolbar.querySelector(".view-list");
    const searchInput = toolbar.querySelector(".finder-search-input");
    const sidebarToggleBtn = toolbar.querySelector(".sidebar-toggle-btn");

    function updateNavControls() {
        btnBack.classList.toggle("active", historyIndex > 0);
        btnForward.classList.toggle("active", historyIndex < historyStack.length - 1);
        folderTitleEl.textContent = currentTitle;

        const winTitle = document.querySelector("#files .window-title");
        if (winTitle) winTitle.textContent = currentTitle;
    }

    function getItemIconMarkup(item) {
        if (item.kind === "folder") {
            return SVG_FOLDER;
        }
        if (item.extension === "pdf") {
            return SVG_FILE_PDF;
        }
        if (item.extension === "rtf" || item.fileType === "document") {
            return SVG_FILE_RTF;
        }
        if (item.extension === "txt" || item.fileType === "text" || item.fileType === "skill") {
            return SVG_FILE_TXT;
        }
        if (item.kind === "app") {
            const id = (item.appId || "").toLowerCase();
            const type = (item.appType || "").toLowerCase();
            const name = (item.name || "").toLowerCase();

            if (id === "terminal" || name === "terminal") {
                return SVG_DOCK_TERMINAL;
            }
            if (id === "gallery" || id === "photos" || name === "photos" || name === "gallery") {
                return SVG_DOCK_PHOTOS;
            }
            if (id === "pdf" || name.includes("acrobat")) {
                return SVG_DOCK_ACROBAT;
            }
            if (id === "textedit" || name === "textedit") {
                return SVG_DOCK_TEXTEDIT;
            }
            if (type === "email" || name === "mail" || name === "gmail") {
                return HTML_DOCK_MAIL;
            }
            if (type === "location" || name === "maps" || name === "map") {
                return HTML_DOCK_MAPS;
            }
            if (type === "whatsapp" || name === "whatsapp") {
                return HTML_DOCK_WHATSAPP;
            }
            if (type === "phone" || name === "phone") {
                return HTML_DOCK_PHONE;
            }
            if (type === "linkedin" || name === "linkedin") {
                return HTML_DOCK_LINKEDIN;
            }
            if (type === "github" || name === "github") {
                return HTML_DOCK_GITHUB;
            }
            return '<div class="dock-tile" style="background: linear-gradient(145deg, #8e8e93, #636366); color:#fff;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="4"/></svg></div>';
        }
        if (item.fileType === "image" && item.href) {
            return `<div class="mac-image-thumb"><img src="${item.href}" alt="${item.name}" loading="lazy"/></div>`;
        }
        if (item.fileType === "video") {
            return `<div class="mac-video-thumb">${SVG_FILE_RTF}<span class="video-play-badge">▶</span></div>`;
        }
        return SVG_FILE_RTF;
    }

    function renderItems(items) {
        selectedItemElement = null;
        if (currentViewMode === "icons") {
            iconGrid.hidden = false;
            iconGrid.classList.remove("is-hidden");
            iconGrid.style.display = "grid";

            listView.hidden = true;
            listView.classList.add("is-hidden");
            listView.style.display = "none";

            renderIconGrid(items);
        } else {
            iconGrid.hidden = true;
            iconGrid.classList.add("is-hidden");
            iconGrid.style.display = "none";

            listView.hidden = false;
            listView.classList.remove("is-hidden");
            listView.style.display = "block";

            renderListView(items);
        }
        statusBar.textContent = `${items.length} item${items.length === 1 ? "" : "s"}, 452.1 GB available`;
    }

    function renderIconGrid(items) {
        iconGrid.replaceChildren();
        if (!items.length) {
            iconGrid.innerHTML = '<div class="finder-empty-state"><p>This folder is empty.</p></div>';
            return;
        }

        items.forEach((item) => {
            const card = document.createElement("div");
            card.className = `finder-item is-${item.kind}`;
            card.tabIndex = 0;
            card.setAttribute("role", "button");
            card.setAttribute("aria-label", item.name);

            const iconWrap = document.createElement("div");
            iconWrap.className = "folder-icon-wrap";
            iconWrap.innerHTML = getItemIconMarkup(item);

            const label = document.createElement("span");
            label.className = "item-name";
            label.textContent = item.kind === "file" && item.extension ? `${item.name}.${item.extension}` : item.name;

            card.append(iconWrap, label);

            card.addEventListener("click", () => {
                if (justNavigated) return;
                if (selectedItemElement) selectedItemElement.classList.remove("selected");
                selectedItemElement = card;
                card.classList.add("selected");
                openItem(item);
            });

            card.addEventListener("dblclick", (e) => {
                e.preventDefault();
                openItem(item);
            });

            card.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openItem(item);
                }
            });

            iconGrid.append(card);
        });
    }

    function renderListView(items) {
        listView.replaceChildren();
        if (!items.length) {
            listView.innerHTML = '<div class="finder-empty-state"><p>This folder is empty.</p></div>';
            return;
        }

        const table = document.createElement("table");
        table.className = "mac-list-table";
        table.innerHTML = `
            <thead>
                <tr>
                    <th class="col-name">Name</th>
                    <th class="col-date">Date Modified</th>
                    <th class="col-size">Size</th>
                    <th class="col-kind">Kind</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        const tbody = table.querySelector("tbody");
        items.forEach((item) => {
            const tr = document.createElement("tr");
            tr.tabIndex = 0;
            const displayName = item.kind === "file" && item.extension ? `${item.name}.${item.extension}` : item.name;
            const displayKind = item.kind === "folder" ? "Folder" : item.kind === "app" ? "Application" : item.extension ? `${item.extension.toUpperCase()} Document` : item.meta || "File";

            tr.innerHTML = `
                <td class="col-name">
                    <div class="col-name-content">
                        <span class="list-row-icon">${getItemIconMarkup(item)}</span>
                        <span class="list-row-title">${displayName}</span>
                    </div>
                </td>
                <td class="col-date">${item.date || "Oct 2026"}</td>
                <td class="col-size">${item.size || (item.kind === "folder" ? "--" : "12 KB")}</td>
                <td class="col-kind">${displayKind}</td>
            `;

            tr.addEventListener("click", () => {
                if (justNavigated) return;
                listView.querySelectorAll("tr").forEach(r => r.classList.remove("selected"));
                tr.classList.add("selected");
                openItem(item);
            });

            tr.addEventListener("dblclick", (e) => {
                e.preventDefault();
                openItem(item);
            });
            tr.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openItem(item);
                }
            });
            tbody.append(tr);
        });

        listView.append(table);
    }

    function openItem(item) {
        if (item.kind === "folder") {
            justNavigated = true;
            setTimeout(() => { justNavigated = false; }, 320);

            // 1. If folder has explicit child items (e.g. skills within a category)
            if (item.children && Array.isArray(item.children) && item.children.length > 0) {
                navigateToChildren(item.children, item.name);
                return;
            }

            // 2. If it references a predefined sidebar location (e.g. Documents, Desktop, Applications, Users, Shared)
            if (item.isLocationRef) {
                navigateToLocation(item.isLocationRef);
                return;
            }

            // 3. If it has a known folderId
            if (item.folderId && item.folderId !== currentLocation) {
                navigateToFolder(item.folderId, item.name);
                return;
            }

            if (item.children) {
                navigateToChildren(item.children, item.name);
                return;
            }

            if (item.folderId) {
                navigateToFolder(item.folderId, item.name);
                return;
            }

            // 4. System or empty folder placeholder
            navigateToChildren([], item.name);
            return;
        }

        if (item.isResume || (item.extension === "pdf" && item.name.toLowerCase().includes("resume"))) {
            if (typeof window.openPdfDocument === "function") {
                window.openPdfDocument("Resume.pdf", "desktop");
            } else if (openApp) {
                openApp("pdf");
            }
            return;
        }

        if (item.extension === "pdf") {
            const yearOrIssuer = item.date || item.issuer || "";
            if (typeof window.openPdfDocument === "function") {
                const opened = window.openPdfDocument(item.name, yearOrIssuer);
                if (opened) return;
            }
            if (openApp) openApp("pdf");
            return;
        }

        if (item.kind === "app") {
            if (item.appId === "textedit") {
                if (typeof window.openRichTextDocument === "function") {
                    window.openRichTextDocument();
                }
                return;
            }
            if (item.href) {
                window.open(item.href, "_blank", "noopener,noreferrer");
            } else if (item.appId && openApp) {
                openApp(item.appId, true, null, true);
            }
            return;
        }

        if (item.fileType === "image" || item.fileType === "video") {
            if (item.source) {
                item.source.click();
            } else if (openApp) {
                openApp("gallery");
            }
            return;
        }

        // Open rich text document in dedicated TextEdit modal
        if (typeof window.openRichTextDocument === "function") {
            window.openRichTextDocument(item);
            return;
        }
    }

    function navigateToLocation(locId, pushHistory = true) {
        currentLocation = locId;
        currentSubfolder = null;
        let items = [];
        let title = "Documents";

        sidebar.querySelectorAll(".sidebar-item").forEach(btn => {
            const isMatch = btn.dataset.location === locId;
            btn.classList.toggle("selected", isMatch);
            if (isMatch) btn.setAttribute("aria-current", "page");
            else btn.removeAttribute("aria-current");
        });

        if (locId === "documents") {
            items = rootPortfolioItems;
            title = "Documents";
        } else if (locId === "desktop") {
            items = rootPortfolioItems.filter(i => i.name !== "Education" && i.name !== "References");
            title = "Desktop";
        } else if (locId === "applications") {
            items = applicationsItems;
            title = "Applications";
        } else if (locId === "downloads") {
            items = [
                { name: "Resume", extension: "pdf", kind: "file", fileType: "pdf", isResume: true, meta: "PDF Document", date: "Oct 2026", size: "123 KB" },
                { name: "cover-letter", extension: "pdf", kind: "file", fileType: "pdf", meta: "PDF Document", date: "Oct 2026", size: "221 KB" },
                { name: "Certificates-Bundle", extension: "zip", kind: "file", fileType: "archive", meta: "ZIP Archive", date: "Oct 2026", size: "4.2 MB" }
            ];
            title = "Downloads";
        } else if (locId === "recents") {
            items = [
                { name: "Resume", extension: "pdf", kind: "file", fileType: "pdf", isResume: true, meta: "PDF Document", date: "Today, 8:40 PM", size: "123 KB" },
                { name: "About Me", extension: "rtf", kind: "file", fileType: "document", isAbout: true, meta: "Rich Text Document", date: "Today, 8:38 PM", size: "4 KB" },
                { name: "Experience", kind: "folder", folderId: "experience", meta: "Folder", date: "Today, 8:35 PM", size: "4 items" },
                { name: "Certifications", kind: "folder", folderId: "certifications", meta: "Folder", date: "Today, 8:30 PM", size: "3 items" }
            ];
            title = "Recents";
        } else if (locId === "icloud-drive") {
            items = [
                { name: "Documents", kind: "folder", isLocationRef: "documents", meta: "Folder", date: "Oct 2026", size: "10 items" },
                { name: "Desktop", kind: "folder", isLocationRef: "desktop", meta: "Folder", date: "Oct 2026", size: "8 items" },
                { name: "Shared", kind: "folder", isLocationRef: "shared", meta: "Folder", date: "Oct 2026", size: "2 items" }
            ];
            title = "iCloud Drive";
        } else if (locId === "shared") {
            items = [
                { name: "Agribazaar-Architecture", kind: "folder", folderId: "experience", meta: "Folder", date: "Oct 2026", size: "Shared folder" },
                { name: "Portfolio-Public", kind: "folder", isLocationRef: "documents", meta: "Folder", date: "Oct 2026", size: "Public folder" }
            ];
            title = "Shared";
        } else if (locId === "macintosh-hd") {
            items = [
                { name: "Applications", kind: "folder", isLocationRef: "applications", meta: "Folder", date: "Oct 2026", size: "7 items" },
                { name: "Users", kind: "folder", isLocationRef: "users", meta: "Folder", date: "Oct 2026", size: "1 item" },
                { name: "System", kind: "folder", meta: "System Folder", date: "Sep 2026", size: "--" }
            ];
            title = "Macintosh HD";
        } else if (locId === "users") {
            items = [
                { name: "Navaneeth", kind: "folder", isLocationRef: "documents", meta: "Home Folder", date: "Oct 2026", size: "10 items" }
            ];
            title = "Users";
        } else if (locId === "network") {
            items = [
                { name: "Navaneeth-MacBook-Pro", kind: "folder", meta: "Network Share", date: "Online", size: "--" },
                { name: "Agribazaar-Production-Cluster", kind: "folder", meta: "Production Cloud", date: "Online", size: "--" }
            ];
            title = "Network";
        } else if (locId === "airdrop") {
            items = [];
            title = "AirDrop";
        } else if (locId.startsWith("tag-")) {
            const tagColor = locId.replace("tag-", "");
            title = tagColor.charAt(0).toUpperCase() + tagColor.slice(1);
            if (tagColor === "red") {
                items = rootPortfolioItems.filter(i => i.name === "Experience" || i.name === "Resume" || i.name === "Contact");
            } else if (tagColor === "orange") {
                items = rootPortfolioItems.filter(i => i.name === "Skills" || i.name === "Education");
            } else {
                items = rootPortfolioItems.filter(i => i.name === "Certifications" || i.name === "Awards" || i.name === "References");
            }
        }

        currentItems = items;
        currentTitle = title;

        if (pushHistory) {
            historyStack.splice(historyIndex + 1);
            historyStack.push({ type: "location", locId, items, title });
            historyIndex = historyStack.length - 1;
        }

        updateNavControls();
        renderItems(items);

        if (locId === "airdrop") {
            iconGrid.innerHTML = `
                <div class="airdrop-view">
                    <div class="airdrop-radar">
                        <div class="airdrop-circle c1"></div>
                        <div class="airdrop-circle c2"></div>
                        <div class="airdrop-circle c3"></div>
                        <svg viewBox="0 0 24 24" class="airdrop-radar-icon" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 18a6 6 0 0 1-4.24-1.76l1.41-1.41A4 4 0 0 0 12 16a4 4 0 0 0 2.83-1.17l1.41 1.41A6 6 0 0 1 12 18Zm0-4a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0-8a10 10 0 0 0-7.07 2.93l1.41 1.41A8 8 0 0 1 12 8a8 8 0 0 1 5.66 2.34l1.41-1.41A10 10 0 0 0 12 6Z"/></svg>
                    </div>
                    <h3>AirDrop</h3>
                    <p>Share instantly with people nearby.</p>
                    <small>Allow me to be discovered by: <strong>Contacts Only</strong></small>
                </div>
            `;
        }
    }

    function navigateToFolder(folderId, titleName = null, pushHistory = true) {
        const records = folderRecords.get(folderId) || [];
        const title = titleName || labels[folderId] || "Folder";
        currentItems = records;
        currentTitle = title;
        currentLocation = folderId;

        if (pushHistory) {
            historyStack.splice(historyIndex + 1);
            historyStack.push({ type: "folder", folderId, items: records, title });
            historyIndex = historyStack.length - 1;
        }

        updateNavControls();
        renderItems(records);
    }

    function navigateToChildren(children, titleName = "Folder", pushHistory = true) {
        currentItems = children;
        currentTitle = titleName;

        if (pushHistory) {
            historyStack.splice(historyIndex + 1);
            historyStack.push({ type: "children", items: children, title: titleName });
            historyIndex = historyStack.length - 1;
        }

        updateNavControls();
        renderItems(children);
    }

    // Navigation Buttons
    btnBack.addEventListener("click", () => {
        if (historyIndex > 0) {
            historyIndex--;
            const state = historyStack[historyIndex];
            if (state.type === "location") {
                navigateToLocation(state.locId, false);
            } else if (state.type === "folder") {
                navigateToFolder(state.folderId, state.title, false);
            } else if (state.type === "children") {
                navigateToChildren(state.items, state.title, false);
            }
        }
    });

    btnForward.addEventListener("click", () => {
        if (historyIndex < historyStack.length - 1) {
            historyIndex++;
            const state = historyStack[historyIndex];
            if (state.type === "location") {
                navigateToLocation(state.locId, false);
            } else if (state.type === "folder") {
                navigateToFolder(state.folderId, state.title, false);
            } else if (state.type === "children") {
                navigateToChildren(state.items, state.title, false);
            }
        }
    });

    // View Switchers
    btnViewIcons.addEventListener("click", () => {
        if (currentViewMode === "icons") return;
        currentViewMode = "icons";
        btnViewIcons.classList.add("selected");
        btnViewList.classList.remove("selected");
        viewContainer.scrollTop = 0;
        renderItems(currentItems);
    });

    btnViewList.addEventListener("click", () => {
        if (currentViewMode === "list") return;
        currentViewMode = "list";
        btnViewList.classList.add("selected");
        btnViewIcons.classList.remove("selected");
        viewContainer.scrollTop = 0;
        renderItems(currentItems);
    });

    // Search filter
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
            renderItems(currentItems);
            return;
        }
        const filtered = currentItems.filter(item =>
            item.name.toLowerCase().includes(query) ||
            (item.meta && item.meta.toLowerCase().includes(query)) ||
            (item.description && item.description.toLowerCase().includes(query))
        );
        renderItems(filtered);
    });

    // Sidebar interaction
    sidebar.addEventListener("click", (e) => {
        const itemBtn = e.target.closest(".sidebar-item");
        if (itemBtn && itemBtn.dataset.location) {
            navigateToLocation(itemBtn.dataset.location);
            if (window.matchMedia("(max-width: 820px)").matches) {
                sidebar.classList.remove("mobile-open");
            }
        }
    });

    // Mobile Sidebar Toggle
    sidebarToggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("mobile-open");
    });

    // Open from external triggers (Desktop icons, dock, URL hash)
    openFinderFolderView = (id, updateAddress, opener) => {
        if (body.dataset.activeApp !== "files") {
            appWindows.find((app) => app.dataset.window === "files")?.classList.add("finder-folder-open");
            openApp("files", false, opener);
        }

        body.dataset.activeApp = "files";
        body.dataset.activeKind = "folder";
        homeScreen.hidden = true;
        homeIndicator.hidden = false;
        menuAppName.textContent = "Finder";
        setLastLauncher(opener);

        document.querySelectorAll(".dock-item").forEach((item) => {
            item.classList.toggle("active", item.dataset.openApp === "files");
        });

        if (id && id !== "files" && folderRecords.has(id)) {
            if (historyStack.length === 0) {
                historyStack.push({ type: "location", locId: "documents", items: rootPortfolioItems, title: "Documents" });
                historyIndex = 0;
            }
            navigateToFolder(id);
        } else {
            navigateToLocation("documents");
        }

        if (updateAddress) {
            history.replaceState({ portfolioApp: id || "files", openAsApp: false }, "", `${window.location.pathname}${window.location.search}#${id || "files"}`);
        }
    };

    returnToFinderHome = () => {
        navigateToLocation("documents");
    };

    navigateFinderLocation = (location) => {
        navigateToLocation(location);
    };

    // Initialize at Documents
    navigateToLocation("documents");

    return {
        buildFolderBrowser: () => {},
        getFolderView: (id) => null,
        openFinderFolderView,
        returnToFinderHome,
        showAboutFile: () => {
            const about = rootPortfolioItems.find(i => i.isAbout);
            if (about && typeof window.openRichTextDocument === "function") {
                window.openRichTextDocument(about);
            }
        },
        setGalleryItems: (items) => {
            galleryItems = items;
            folderRecords.set("gallery", parseFolderRecords("gallery"));
        },
    };
}
