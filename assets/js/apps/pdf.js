function initializePdfViewer({ openApp } = {}) {
    const body = document.body;

    // Comprehensive list of PDF documents across system locations
    // Type 1: resume.pdf and cover-letter.pdf (authentic user documents in ./file/)
    // Type 2: Certificates & Awards (reused from respective portfolio folders #certifications & #awards)
    const pdfDocuments = [
        {
            id: "desktop-resume",
            name: "Resume.pdf",
            fileName: "Resume.pdf",
            locationId: "desktop",
            locationName: "Desktop",
            locationPath: "~/Desktop/Resume.pdf",
            fullPath: "./file/resume.pdf",
            size: "123 KB",
            date: "Oct 2026",
            badge: "Desktop",
            description: "Principal / Full-Stack Engineer Resume — Navaneeth Raman Bhaskar",
            category: "resume"
        },
        {
            id: "file-cover-letter",
            name: "cover-letter.pdf",
            fileName: "cover-letter.pdf",
            locationId: "documents",
            locationName: "Documents / Portfolio",
            locationPath: "~/file/cover-letter.pdf",
            fullPath: "./file/cover-letter.pdf",
            size: "221 KB",
            date: "Oct 2026",
            badge: "file/",
            description: "Software Engineering Leadership & Technical Architect Cover Letter",
            category: "cover-letter"
        },
        // Licenses & Certifications (Reused from #certifications)
        {
            id: "cert-ds",
            name: "Programming Foundations: Data Structures",
            fileName: "data-structures-cert.pdf",
            locationId: "certifications",
            locationName: "Certifications",
            locationPath: "~/Certifications/data-structures-cert.pdf",
            fullPath: "./file/data-structures-cert.pdf",
            size: "124 KB",
            date: "Verified Credential",
            badge: "Certifications",
            certType: "CERTIFICATE OF COMPLETION",
            issuer: "LinkedIn Learning",
            certId: "CERT-LL-DS-2021",
            medal: "📚",
            description: "Demonstrated core mastery of fundamental data structures including arrays, stacks, queues, trees, graphs, and hash tables with complexity analysis.",
            category: "certification"
        },
        {
            id: "cert-algo",
            name: "Programming Foundations: Algorithms",
            fileName: "algorithms-cert.pdf",
            locationId: "certifications",
            locationName: "Certifications",
            locationPath: "~/Certifications/algorithms-cert.pdf",
            fullPath: "./file/algorithms-cert.pdf",
            size: "124 KB",
            date: "Verified Credential",
            badge: "Certifications",
            certType: "CERTIFICATE OF COMPLETION",
            issuer: "LinkedIn Learning",
            certId: "CERT-LL-AL-2021",
            medal: "🔢",
            description: "Mastery of algorithmic complexity, sorting algorithms, binary search, recursion, dynamic programming, and graph traversal.",
            category: "certification"
        },
        {
            id: "cert-json",
            name: "JSON Essential Training",
            fileName: "json-training-cert.pdf",
            locationId: "certifications",
            locationName: "Certifications",
            locationPath: "~/Certifications/json-training-cert.pdf",
            fullPath: "./file/json-training-cert.pdf",
            size: "123 KB",
            date: "Verified Credential",
            badge: "Certifications",
            certType: "CERTIFICATE OF COMPLETION",
            issuer: "LinkedIn Learning",
            certId: "CERT-LL-JSON-2020",
            medal: "📋",
            description: "Proficiency in JSON syntax, schema validation, REST API payloads, asynchronous parsing, and data serialization.",
            category: "certification"
        },
        {
            id: "cert-php",
            name: "Advanced PHP Certification",
            fileName: "advanced-php-cert.pdf",
            locationId: "certifications",
            locationName: "Certifications",
            locationPath: "~/Certifications/advanced-php-cert.pdf",
            fullPath: "./file/advanced-php-cert.pdf",
            size: "123 KB",
            date: "Certified Professional",
            badge: "Certifications",
            certType: "CERTIFICATE OF PROFICIENCY",
            issuer: "Cutshort",
            certId: "CERT-CS-PHP-ADV",
            medal: "🐘",
            description: "Top-tier score in modern PHP, Object-Oriented Programming (OOP) architecture, design patterns, and performance tuning.",
            category: "certification"
        },
        {
            id: "cert-gcp",
            name: "Baseline: Infrastructure",
            fileName: "baseline-infrastructure-cert.pdf",
            locationId: "certifications",
            locationName: "Certifications",
            locationPath: "~/Certifications/baseline-infrastructure-cert.pdf",
            fullPath: "./file/baseline-infrastructure-cert.pdf",
            size: "125 KB",
            date: "Verified Cloud Competency",
            badge: "Certifications",
            certType: "GOOGLE CLOUD SKILL BADGE",
            issuer: "Qwiklabs / Google Cloud",
            certId: "CERT-GCP-QWIK-BASE",
            medal: "☁️",
            description: "Practical hands-on proficiency in Compute Engine instances, VPC networks, Cloud IAM, and Cloud Storage buckets.",
            category: "certification"
        },
        // Honors & Awards (Reused from #awards)
        {
            id: "award-vb-2017",
            name: "Inter Engineering Volleyball — 2nd Runner Up 🥉",
            fileName: "volleyball-2017-bronze-award.pdf",
            locationId: "awards",
            locationName: "Honors & Awards",
            locationPath: "~/Awards/volleyball-2017-bronze-award.pdf",
            fullPath: "./file/volleyball-2017-bronze-award.pdf",
            size: "154 KB",
            date: "2nd Runner-Up - 2017",
            badge: "Awards",
            certType: "SPORTS EXCELLENCE CERTIFICATE",
            issuer: "Mar Athanasius College of Engineering",
            certId: "AWD-MACE-VB-2017",
            medal: "🥉",
            description: "2nd Runner-Up 🥉 Bronze Medal in the All Kerala Inter Engineering College Volleyball Championship (2017).",
            category: "award"
        },
        {
            id: "award-vb-2016",
            name: "Inter Engineering Volleyball — Runner Up 🥈",
            fileName: "volleyball-2016-silver-award.pdf",
            locationId: "awards",
            locationName: "Honors & Awards",
            locationPath: "~/Awards/volleyball-2016-silver-award.pdf",
            fullPath: "./file/volleyball-2016-silver-award.pdf",
            size: "154 KB",
            date: "Runner-Up - 2016",
            badge: "Awards",
            certType: "SPORTS EXCELLENCE CERTIFICATE",
            issuer: "Mar Athanasius College of Engineering",
            certId: "AWD-MACE-VB-2016",
            medal: "🥈",
            description: "Runner-Up 🥈 Silver Medal in the All Kerala Inter Engineering College Volleyball Championship (2016).",
            category: "award"
        },
        {
            id: "award-vb-2015",
            name: "Inter Engineering Volleyball — Winner 🏆 Gold Medal",
            fileName: "volleyball-2015-gold-award.pdf",
            locationId: "awards",
            locationName: "Honors & Awards",
            locationPath: "~/Awards/volleyball-2015-gold-award.pdf",
            fullPath: "./file/volleyball-2015-gold-award.pdf",
            size: "178 KB",
            date: "Champions - 2015",
            badge: "Awards",
            certType: "SPORTS EXCELLENCE CERTIFICATE",
            issuer: "Mar Athanasius College of Engineering",
            certId: "AWD-MACE-VB-2015",
            medal: "🥇",
            description: "1st Place Winner 🏆 Gold Medal in the All Kerala Inter Engineering College Volleyball Championship (2015).",
            category: "award"
        },
        {
            id: "award-it-genius",
            name: "IT GENIUS 2011 - Talent Hunt Examination",
            fileName: "it-genius-2011-award.pdf",
            locationId: "awards",
            locationName: "Honors & Awards",
            locationPath: "~/Awards/it-genius-2011-award.pdf",
            fullPath: "./file/it-genius-2011-award.pdf",
            size: "178 KB",
            date: "State-level Honor - 2011",
            badge: "Awards",
            certType: "HONOR & MERIT AWARD",
            issuer: "C-DIT Kerala (Centre for Development of Imaging Technology)",
            certId: "AWD-CDIT-ITG-2011",
            medal: "🏅",
            description: "Secured 1st Position across the state of Kerala in the Talent Hunt Examination in advanced computing, logic, and informatics.",
            category: "award"
        },
        {
            id: "award-vb-2010",
            name: "Sub District School Volleyball — Winner 🏆",
            fileName: "volleyball-2010-gold-award.pdf",
            locationId: "awards",
            locationName: "Honors & Awards",
            locationPath: "~/Awards/volleyball-2010-gold-award.pdf",
            fullPath: "./file/volleyball-2010-gold-award.pdf",
            size: "177 KB",
            date: "Winner - 2010",
            badge: "Awards",
            certType: "SPORTS EXCELLENCE CERTIFICATE",
            issuer: "Sub District School Games Association",
            certId: "AWD-SDSGA-VB-2010",
            medal: "🥇",
            description: "1st Place Winner 🏆 in the Sub District School Volleyball Championship (2010).",
            category: "award"
        },
        {
            id: "award-vb-2008",
            name: "State Level Volleyball Championship — Runner Up 🥈",
            fileName: "volleyball-2008-silver-award.pdf",
            locationId: "awards",
            locationName: "Honors & Awards",
            locationPath: "~/Awards/volleyball-2008-silver-award.pdf",
            fullPath: "./file/volleyball-2008-silver-award.pdf",
            size: "152 KB",
            date: "Runner-Up - 2008",
            badge: "Awards",
            certType: "SPORTS EXCELLENCE CERTIFICATE",
            issuer: "Kerala State Sports Council",
            certId: "AWD-KSSC-VB-2008",
            medal: "🥈",
            description: "State Level Runner-Up 🥈 in the Volleyball Championship conducted by Kerala State Sports Council (2008).",
            category: "award"
        }
    ];

    // Acrobat File Explorer DOM elements
    const filesContainer = document.getElementById("acrobatFilesContainer");
    const searchInput = document.getElementById("acrobatSearch");
    const viewTitle = document.getElementById("acrobatViewTitle");
    const viewCount = document.getElementById("acrobatViewCount");

    // Independent Adobe PDF Viewer Modal elements (Native Plugin Only)
    const pdfModal = document.getElementById("pdfModal");
    const pdfModalFrame = document.getElementById("pdfModalFrame");
    const pdfModalTitle = document.getElementById("pdfModalTitle");
    const pdfModalLocation = document.getElementById("pdfModalLocation");
    const pdfModalDownload = document.getElementById("pdfModalDownload");
    const pdfModalExternal = document.getElementById("pdfModalExternal");
    const pdfModalClose = document.getElementById("pdfModalClose");
    const pdfModalMinimize = document.getElementById("pdfModalMinimize");
    const pdfModalMaximize = document.getElementById("pdfModalMaximize");
    const pdfModalBackBtn = document.getElementById("pdfModalBackBtn");
    const pdfModalContainer = document.querySelector(".pdf-modal-container");

    // Location count counters in sidebar & mobile filters
    const allCountEl = document.getElementById("acrobatAllCount");
    const desktopCountEl = document.getElementById("acrobatDesktopCount");
    const docCountEl = document.getElementById("acrobatDocCount");
    const certCountEl = document.getElementById("acrobatCertCount");
    const awardCountEl = document.getElementById("acrobatAwardCount");
    const mobileAllCountEl = document.getElementById("acrobatMobileAllCount");
    const mobileDesktopCountEl = document.getElementById("acrobatMobileDesktopCount");
    const mobileDocCountEl = document.getElementById("acrobatMobileDocCount");
    const mobileCertCountEl = document.getElementById("acrobatMobileCertCount");
    const mobileAwardCountEl = document.getElementById("acrobatMobileAwardCount");

    const sidebarItems = [...document.querySelectorAll("[data-acrobat-location]")];
    const quickButtons = [...document.querySelectorAll("[data-acrobat-quick]")];
    const viewListBtn = document.getElementById("acrobatViewListBtn");
    const viewGridBtn = document.getElementById("acrobatViewGridBtn");

    let activeLocation = "all";
    let currentViewMode = "list";
    let lastFocusedElement = null;
    let activeDoc = null;

    // Update dynamic document counts in Acrobat Explorer sidebar
    function refreshCounts() {
        const desktopCount = pdfDocuments.filter((d) => d.locationId === "desktop").length;
        const docCount = pdfDocuments.filter((d) => d.locationId === "documents").length;
        const certCount = pdfDocuments.filter((d) => d.locationId === "certifications").length;
        const awardCount = pdfDocuments.filter((d) => d.locationId === "awards").length;
        if (allCountEl) allCountEl.textContent = String(pdfDocuments.length);
        if (desktopCountEl) desktopCountEl.textContent = String(desktopCount);
        if (docCountEl) docCountEl.textContent = String(docCount);
        if (certCountEl) certCountEl.textContent = String(certCount);
        if (awardCountEl) awardCountEl.textContent = String(awardCount);
        if (mobileAllCountEl) mobileAllCountEl.textContent = String(pdfDocuments.length);
        if (mobileDesktopCountEl) mobileDesktopCountEl.textContent = String(desktopCount);
        if (mobileDocCountEl) mobileDocCountEl.textContent = String(docCount);
        if (mobileCertCountEl) mobileCertCountEl.textContent = String(certCount);
        if (mobileAwardCountEl) mobileAwardCountEl.textContent = String(awardCount);
    }
    refreshCounts();

    /**
     * Opens a PDF document inside the independent modal viewer using the native browser PDF plugin.
     * The native plugin naturally renders the PDF centered horizontally and vertically, with
     * built-in zooming, paging, searching, printing, and downloading.
     */
    function openPdfModal(doc, returnFocusTo = null) {
        if (!doc || !pdfModal) return;
        activeDoc = doc;
        lastFocusedElement = returnFocusTo || document.activeElement;

        if (pdfModalTitle) pdfModalTitle.textContent = doc.name;
        if (pdfModalLocation) pdfModalLocation.textContent = doc.locationPath;

        if (pdfModalDownload) {
            pdfModalDownload.href = doc.fullPath;
            pdfModalDownload.setAttribute("download", doc.fileName);
        }
        if (pdfModalExternal) {
            pdfModalExternal.href = doc.fullPath;
        }

        // Native plugin only: load PDF directly into the iframe
        if (pdfModalFrame) {
            pdfModalFrame.src = doc.fullPath;
        }

        pdfModal.setAttribute("aria-hidden", "false");
        pdfModal.classList.add("active");
        body.classList.add("modal-open");
        pdfModalClose?.focus();
    }

    /**
     * Closes the independent modal viewer and resets the iframe src.
     */
    function closePdfModal() {
        if (!pdfModal || !pdfModal.classList.contains("active")) return;
        pdfModal.classList.remove("active");
        pdfModal.setAttribute("aria-hidden", "true");
        body.classList.remove("modal-open");
        pdfModalContainer?.classList.remove("is-maximized");

        if (pdfModalFrame) {
            pdfModalFrame.src = "";
        }
        activeDoc = null;
        lastFocusedElement?.focus();
    }

    // Modal Window Controls (Consistent macOS traffic lights)
    if (pdfModalClose) {
        pdfModalClose.addEventListener("click", (event) => {
            event.stopPropagation();
            closePdfModal();
        });
    }

    if (pdfModalMinimize) {
        pdfModalMinimize.addEventListener("click", (event) => {
            event.stopPropagation();
            closePdfModal();
        });
    }

    if (pdfModalMaximize) {
        pdfModalMaximize.addEventListener("click", (event) => {
            event.stopPropagation();
            pdfModalContainer?.classList.toggle("is-maximized");
        });
    }

    if (pdfModalBackBtn) {
        pdfModalBackBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            closePdfModal();
        });
    }

    // Modal background click to close
    if (pdfModal) {
        pdfModal.addEventListener("click", (event) => {
            if (event.target === pdfModal) {
                closePdfModal();
            }
        });
    }

    // Escape key closes modal
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && pdfModal?.classList.contains("active")) {
            closePdfModal();
        }
    });

    const PDF_ICON_SVG = `
        <svg viewBox="0 0 24 28" fill="none">
            <path d="M2 2a2 2 0 0 1 2-2h12l6 6v20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2Z" fill="#ff352b"/>
            <path d="M16 0v6h6" fill="#d90d0d"/>
            <path d="M5.5 17c-.4-.2-1-.4-2-.4-.4 0-.7 0-1.1.1-.5-.5-1-1.1-1.4-1.9.3-1 .5-2 .5-2.7 0-.7-.2-1.3-.8-1.3-.4 0-.7.2-.8.7-.2.9.1 2 .6 3.1-.2.8-.5 1.5-.9 2.3-1.1.6-2.5 1.4-3 2.3-.4.7-.3 1.3.2 1.5.3.2.7.2 1.2.1 1.1-.3 2.2-1.3 3.2-2.9.8-.2 1.6-.5 2.3-.7.7.8 1.4 1.2 2.2 1.4.4.1.8.1 1-.2.5-.3.5-1.1-.2-1.5z" transform="translate(12 14) scale(0.55) translate(-7 -11)" fill="#fff"/>
        </svg>
    `;

    function createTableRow(doc) {
        const row = document.createElement("div");
        row.className = "acrobat-row";
        row.setAttribute("role", "button");
        row.setAttribute("tabindex", "0");
        row.setAttribute("aria-label", `Open ${doc.name}`);

        row.innerHTML = `
            <div class="acrobat-cell-name">
                <span class="acrobat-row-icon" aria-hidden="true">${PDF_ICON_SVG}</span>
                <div class="acrobat-row-text">
                    <span class="acrobat-row-title">${doc.name}</span>
                    <span class="acrobat-row-desc">${doc.description}</span>
                    <span class="acrobat-row-meta-mobile">${doc.badge} • ${doc.size}${doc.date ? ' • ' + doc.date : ''}</span>
                </div>
            </div>
            <div class="acrobat-cell-loc" title="${doc.locationPath}">${doc.locationPath}</div>
            <div class="acrobat-cell-date">${doc.date}</div>
            <div class="acrobat-cell-size">${doc.size}</div>
            <div class="acrobat-cell-actions">
                <button class="acrobat-row-btn primary acrobat-btn-open" type="button" title="View PDF">
                    <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4.5c-4.5 0-8 5.5-8 5.5s3.5 5.5 8 5.5 8-5.5 8-5.5-3.5-5.5-8-5.5Z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="10" cy="10" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>
                    <span>Open</span>
                </button>
                <a class="acrobat-row-btn" href="${doc.fullPath}" target="_blank" rel="noopener noreferrer" title="Open in new tab">
                    <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M11 3h6v6M10 10l6.5-6.5M7 4H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
                </a>
                <a class="acrobat-row-btn" href="${doc.fullPath}" download="${doc.fileName}" title="Download">
                    <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3v9m0 0 3.5-3.5M10 12 6.5 8.5M3.5 15.5h13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
                </a>
            </div>
        `;

        row.addEventListener("click", (event) => {
            if (event.target.closest("a")) return;
            openPdfModal(doc, row);
        });

        row.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openPdfModal(doc, row);
            }
        });

        return row;
    }

    function createGridCard(doc) {
        const card = document.createElement("article");
        card.className = "acrobat-grid-card";
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.setAttribute("aria-label", `Open ${doc.name}`);

        card.innerHTML = `
            <div class="acrobat-grid-thumb">
                <span class="acrobat-grid-thumb-icon" aria-hidden="true">${PDF_ICON_SVG}</span>
                <span class="acrobat-grid-badge">${doc.badge}</span>
            </div>
            <div class="acrobat-grid-body">
                <span class="acrobat-grid-title" title="${doc.name}">${doc.name}</span>
                <div class="acrobat-grid-meta">
                    <span>${doc.date}</span>
                    <span>${doc.size}</span>
                </div>
            </div>
        `;

        card.addEventListener("click", () => {
            openPdfModal(doc, card);
        });

        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openPdfModal(doc, card);
            }
        });

        return card;
    }

    /**
     * Renders PDF documents in the Acrobat Explorer right panel using authentic Adobe Acrobat design.
     */
    function renderFiles() {
        if (!filesContainer) return;
        const query = searchInput?.value.trim().toLowerCase() || "";

        const filtered = pdfDocuments.filter((doc) => {
            const matchesLocation = activeLocation === "all" || doc.locationId === activeLocation;
            const matchesQuery = !query
                || doc.name.toLowerCase().includes(query)
                || doc.locationPath.toLowerCase().includes(query)
                || doc.description.toLowerCase().includes(query);
            return matchesLocation && matchesQuery;
        });

        filesContainer.replaceChildren();

        if (viewCount) {
            viewCount.textContent = `${filtered.length} ${filtered.length === 1 ? "file" : "files"}`;
        }

        if (filtered.length === 0) {
            const empty = document.createElement("div");
            empty.className = "acrobat-empty-state";
            empty.innerHTML = `
                <div class="acrobat-empty-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.8">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 8v5M12 16h.01"/>
                    </svg>
                </div>
                <h3>No PDF documents found</h3>
                <p>No files match the location filter and search query "${query}".</p>
            `;
            filesContainer.append(empty);
            return;
        }

        if (currentViewMode === "list") {
            const tableWrap = document.createElement("div");
            tableWrap.className = "acrobat-table-wrap";

            const tableHead = document.createElement("div");
            tableHead.className = "acrobat-table-head";
            tableHead.innerHTML = `
                <div class="acrobat-col-name">File Name</div>
                <div class="acrobat-col-loc">Location</div>
                <div class="acrobat-col-date">Date</div>
                <div class="acrobat-col-size">Size</div>
                <div class="acrobat-col-actions"></div>
            `;
            tableWrap.append(tableHead);

            if (activeLocation === "all") {
                const groups = [
                    { id: "desktop", title: "Desktop", path: "~/Desktop" },
                    { id: "documents", title: "Documents / Portfolio", path: "~/file" },
                    { id: "certifications", title: "Certifications", path: "~/Certifications" },
                    { id: "awards", title: "Honors & Awards", path: "~/Awards" }
                ];

                groups.forEach((grp) => {
                    const grpDocs = filtered.filter((d) => d.locationId === grp.id);
                    if (grpDocs.length === 0) return;

                    const divider = document.createElement("div");
                    divider.className = "acrobat-group-divider";
                    divider.innerHTML = `
                        <span class="acrobat-group-name">${grp.title}</span>
                        <span class="acrobat-group-path">${grp.path}</span>
                        <span class="acrobat-group-rule"></span>
                        <span class="acrobat-group-badge">${grpDocs.length}</span>
                    `;
                    tableWrap.append(divider);

                    grpDocs.forEach((doc) => {
                        tableWrap.append(createTableRow(doc));
                    });
                });
            } else {
                filtered.forEach((doc) => {
                    tableWrap.append(createTableRow(doc));
                });
            }

            filesContainer.append(tableWrap);
        } else {
            const gridWrap = document.createElement("div");
            gridWrap.className = "acrobat-grid-wrap";
            filtered.forEach((doc) => {
                gridWrap.append(createGridCard(doc));
            });
            filesContainer.append(gridWrap);
        }
    }

    function updateActiveLocation(loc) {
        activeLocation = loc || "all";
        sidebarItems.forEach((btn) => {
            const isSelected = btn.dataset.acrobatLocation === activeLocation;
            btn.classList.toggle("selected", isSelected);
            btn.setAttribute("aria-pressed", String(isSelected));
        });

        if (viewTitle) {
            const titles = {
                all: "All PDF Documents",
                desktop: "Desktop (~/Desktop)",
                documents: "Documents / Portfolio (~/file)",
                certifications: "Certifications (~/Certifications)",
                awards: "Honors & Awards (~/Awards)"
            };
            viewTitle.textContent = titles[activeLocation] || "PDF Documents";
        }

        renderFiles();
    }

    sidebarItems.forEach((btn) => {
        btn.addEventListener("click", () => {
            updateActiveLocation(btn.dataset.acrobatLocation);
        });
    });

    viewListBtn?.addEventListener("click", () => {
        currentViewMode = "list";
        viewListBtn.classList.add("selected");
        viewListBtn.setAttribute("aria-pressed", "true");
        viewGridBtn?.classList.remove("selected");
        viewGridBtn?.setAttribute("aria-pressed", "false");
        renderFiles();
    });

    viewGridBtn?.addEventListener("click", () => {
        currentViewMode = "grid";
        viewGridBtn.classList.add("selected");
        viewGridBtn.setAttribute("aria-pressed", "true");
        viewListBtn?.classList.remove("selected");
        viewListBtn?.setAttribute("aria-pressed", "false");
        renderFiles();
    });

    quickButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const target = btn.dataset.acrobatQuick;
            const doc = pdfDocuments.find((d) => d.category === target || d.id === target || d.fileName.toLowerCase() === target.toLowerCase());
            if (doc) {
                openPdfModal(doc, btn);
            }
        });
    });

    searchInput?.addEventListener("input", () => {
        renderFiles();
    });

    // Intercept desktop and finder clicks on resume & cover letter to open in the Adobe PDF viewer modal
    document.querySelectorAll('a[href*="resume.pdf"], a[href*="cover-letter.pdf"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            if (event.metaKey || event.ctrlKey) return;
            const href = link.getAttribute("href") || "";
            const targetCategory = href.includes("cover-letter") ? "cover-letter" : "resume";
            const doc = pdfDocuments.find((d) => d.category === targetCategory);
            if (doc) {
                event.preventDefault();
                openPdfModal(doc, link);
            }
        });
    });

    // Intercept clicks on certificate items in #certifications to open respective PDF
    document.querySelectorAll("#certifications .certification-item").forEach((item) => {
        item.style.cursor = "pointer";
        item.addEventListener("click", () => {
            const titleEl = item.querySelector(".certification-name");
            const title = titleEl?.textContent.trim().toLowerCase() || "";
            const doc = pdfDocuments.find((d) => d.locationId === "certifications" && (
                d.name.toLowerCase().includes(title) || title.includes(d.name.toLowerCase())
            ));
            if (doc) {
                openPdfModal(doc, item);
            }
        });
    });

    // Intercept clicks on award items in #awards to open respective PDF
    document.querySelectorAll("#awards .award-item").forEach((item) => {
        item.style.cursor = "pointer";
        item.addEventListener("click", () => {
            const titleEl = item.querySelector(".award-title");
            const yearEl = item.querySelector(".award-year");
            const title = titleEl?.textContent.trim().toLowerCase() || "";
            const year = yearEl?.textContent.trim() || "";
            const doc = pdfDocuments.find((d) => d.locationId === "awards" && (
                (d.fileName.includes(year) || d.date.includes(year)) &&
                (d.name.toLowerCase().includes(title.slice(0, 15)) || d.description.toLowerCase().includes(year))
            )) || pdfDocuments.find((d) => d.locationId === "awards" && d.name.toLowerCase().includes(title.slice(0, 20)));

            if (doc) {
                openPdfModal(doc, item);
            }
        });
    });

    // Helper to open document by id, name, filename or query
    window.openPdfDocument = (nameOrId, extraContext = "") => {
        if (!nameOrId) return false;
        const q = String(nameOrId).trim().toLowerCase().replace(/\.pdf$/, "");
        const ctx = String(extraContext).trim().toLowerCase();

        let doc = pdfDocuments.find((d) => d.id.toLowerCase() === q || d.fileName.toLowerCase() === q || d.fileName.toLowerCase().replace(/\.pdf$/, "") === q);

        if (!doc && ctx) {
            doc = pdfDocuments.find((d) => {
                const combined = (d.name + " " + d.fileName + " " + d.description + " " + d.date).toLowerCase();
                return combined.includes(q) && combined.includes(ctx);
            });
        }

        if (!doc) {
            doc = pdfDocuments.find((d) => {
                const dName = d.name.toLowerCase();
                const dFile = d.fileName.toLowerCase();
                return dName.includes(q) || q.includes(dName) || dFile.includes(q) || q.includes(dFile);
            });
        }

        if (doc) {
            openPdfModal(doc);
            return true;
        }
        return false;
    };

    window.openPdfModal = openPdfModal;
    window.closePdfModal = closePdfModal;

    // Initial render: ONLY the file listing is rendered. The modal viewer is NOT loaded initially.
    renderFiles();

    return {
        openDocument: window.openPdfDocument,
        openPdfModal
    };
}
