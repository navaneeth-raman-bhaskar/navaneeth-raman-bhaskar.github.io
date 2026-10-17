function initializeGallery({ body, initialApp, initialOpenAsApp, openApp, buildFolderBrowser, setGalleryItems }) {
    const galleryItems = [
        { type: "image", thumbnail: "./gallery/organizers.jpg", fullMedia: "./gallery/organizers.jpg", title: "The core team - Devfest 2023", description: "The team behind the curtain — organizers, sponsors, speakers, and volunteers — made this event a huge success." },
        { type: "video", thumbnail: "./gallery/devfest_wrap.mp4", fullMedia: "./gallery/devfest_wrap.mp4", title: "DevFest Wrap 2023", description: "One final moment, a beautiful memory from DevFest 2023." },
        { type: "image", thumbnail: "./gallery/devfest.jpg", fullMedia: "./gallery/devfest.jpg", title: "Co-organizer Dev Fest 2023", description: "Snap during the Google developer fest 2023." },
        { type: "image", thumbnail: "./gallery/devfest_organiser.jpg", fullMedia: "./gallery/devfest_organiser.jpg", title: "Co-organizer Dev Fest 2023", description: "Snap during the Google developer fest 2023." },
        { type: "image", thumbnail: "./gallery/speaker.jpg", fullMedia: "./gallery/speaker.jpg", title: "Love from Laravel-Kerala", description: "A little gesture of love — a memento from the Laravel Kerala Team." },
        { type: "image", thumbnail: "./gallery/speaking.jpg", fullMedia: "./gallery/speaking.jpg", title: "Enhancing Laravel Security & Performance", description: "A snap on the topic Enhancing Laravel Security & Performance." },
        { type: "video", thumbnail: "./gallery/session.mp4", fullMedia: "./gallery/session.mp4", title: "Speaker @ Laravel-Kerala", description: "A session on the topic Enhancing Laravel Security & Performance." },
        { type: "image", thumbnail: "./gallery/lk_tag.jpg", fullMedia: "./gallery/laravel_kerala_won.jpg", title: "Laravel-Kerala Swag", description: "A small gift from the Laravel-Kerala team." },
        { type: "image", thumbnail: "./gallery/laravel_kerala_won.jpg", fullMedia: "./gallery/laravel_kerala_won.jpg", title: "Laravel-Kerala Rapid Fire Winner", description: "Won rapid fire quiz @ Laravel Kerala." },
        { type: "image", thumbnail: "./gallery/laravel_kerala.jpg", fullMedia: "./gallery/laravel_kerala.jpg", title: "Laravel-Kerala", description: "Crowd interaction section @ Laravel-Kerala meetup." },
        { type: "image", thumbnail: "./gallery/google_startup.jpg", fullMedia: "./gallery/google_startup.jpg", title: "Google Startup Success Days @ IIM Calicut", description: "A shot from Google Startup Success Days @ IIM Calicut." },
        { type: "image", thumbnail: "./gallery/gssd_tag.jpg", fullMedia: "./gallery/gssd_tag.jpg", title: "Google Startup Success Days @ IIM Calicut", description: "Attended Google Startup Success Days @ IIM Calicut." },
        { type: "video", thumbnail: "./gallery/gio_group.mp4", fullMedia: "./gallery/gio_group.mp4", title: "Google I/O Extended", description: "Google I/O Extended @ Govt. Cyberpark Calicut." },
        { type: "video", thumbnail: "./gallery/g_io.mp4", fullMedia: "./gallery/g_io.mp4", title: "Team Google I/O Extended", description: "Google I/O Extended attendees @ Govt. Cyberpark Calicut." },
        { type: "image", thumbnail: "./gallery/QuestLead.png", fullMedia: "./gallery/QuestLead.png", title: "Quest Lead", description: "Google Cloud Quest Lead T-Shirt." },
        { type: "video", thumbnail: "./gallery/gcp_champ.mp4", fullMedia: "./gallery/gcp_champ.mp4", title: "GCP Champ", description: "Little love from Google, GCP champ swag box unboxing." },
    ];

    const galleryGrid = document.getElementById("galleryGrid");
    const mediaModal = document.getElementById("mediaModal");
    const modalMediaContainer = document.getElementById("modalMediaContainer");
    const modalTitle = document.getElementById("modalTitle");
    const modalDescription = document.getElementById("modalDescription");
    const modalClose = document.getElementById("modalClose");
    const gallerySearch = document.getElementById("gallerySearch");
    const galleryFilterControls = [...document.querySelectorAll("[data-gallery-filter]")];
    const galleryViewTitle = document.getElementById("galleryViewTitle");
    const galleryViewCount = document.getElementById("galleryViewCount");
    const gallerySectionLabel = document.querySelector(".photos-section-label");
    const galleryEmpty = document.getElementById("galleryEmpty");
    let lastFocusedElement = null;
    let activeGalleryFilter = "all";

    function openMediaModal(item, returnFocusTo) {
        lastFocusedElement = returnFocusTo;
        modalMediaContainer.replaceChildren();
        if (item.type === "video") {
            const video = document.createElement("video");
            video.className = "modal-video";
            video.src = item.fullMedia;
            video.controls = true;
            video.autoplay = true;
            video.playsInline = true;
            video.setAttribute("aria-label", item.title);
            modalMediaContainer.append(video);
            video.play().catch(() => {});
        } else {
            const image = document.createElement("img");
            image.className = "modal-image";
            image.src = item.fullMedia;
            image.alt = item.title;
            modalMediaContainer.append(image);
        }
        modalTitle.textContent = item.title;
        modalDescription.textContent = item.description;
        mediaModal.setAttribute("aria-hidden", "false");
        mediaModal.classList.add("active");
        body.classList.add("modal-open");
        modalClose.focus();
    }

    function closeMediaModal() {
        if (!mediaModal.classList.contains("active")) return;
        mediaModal.classList.remove("active");
        mediaModal.setAttribute("aria-hidden", "true");
        body.classList.remove("modal-open");
        const video = modalMediaContainer.querySelector("video");
        if (video) {
            video.pause();
            video.removeAttribute("src");
            video.load();
        }
        modalMediaContainer.replaceChildren();
        lastFocusedElement?.focus();
    }

    function applyGalleryFilter() {
        if (!galleryGrid) return;
        const query = gallerySearch?.value.trim().toLowerCase() || "";
        const cards = [...galleryGrid.querySelectorAll(".gallery-item")];
        let visibleCount = 0;
        cards.forEach((card, index) => {
            const item = galleryItems[index];
            const searchText = `${item.title} ${item.description}`.toLowerCase();
            const isCommunityEvent = !/quest lead|gcp champ/i.test(searchText);
            const matchesFilter = activeGalleryFilter === "all"
                || (activeGalleryFilter === "photos" && item.type === "image")
                || (activeGalleryFilter === "videos" && item.type === "video")
                || (activeGalleryFilter === "events" && isCommunityEvent);
            const matchesSearch = !query || searchText.includes(query);
            card.hidden = !(matchesFilter && matchesSearch);
            if (!card.hidden) visibleCount += 1;
        });
        galleryFilterControls.forEach((control) => {
            const selected = control.dataset.galleryFilter === activeGalleryFilter;
            control.classList.toggle("selected", selected);
            control.setAttribute("aria-pressed", String(selected));
        });
        const labels = { all: "All Photos", photos: "Photos", videos: "Videos", events: "Community Events" };
        if (galleryViewTitle) galleryViewTitle.textContent = labels[activeGalleryFilter] || labels.all;
        if (gallerySectionLabel) gallerySectionLabel.textContent = activeGalleryFilter === "events" ? "Community Events" : "Highlights";
        if (galleryViewCount) galleryViewCount.textContent = `${visibleCount} ${visibleCount === 1 ? "item" : "items"}`;
        if (galleryEmpty) galleryEmpty.hidden = visibleCount > 0;
    }

    galleryFilterControls.forEach((control) => {
        control.addEventListener("click", () => {
            activeGalleryFilter = control.dataset.galleryFilter || "all";
            applyGalleryFilter();
        });
    });
    gallerySearch?.addEventListener("input", applyGalleryFilter);

    if (galleryGrid) {
        const observer = "IntersectionObserver" in window
            ? new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    const video = entry.target;
                    if (entry.isIntersecting) {
                        if (!video.src) {
                            video.src = video.dataset.src;
                            video.load();
                        }
                        video.play().catch(() => {});
                    } else {
                        video.pause();
                    }
                });
            }, { root: document.querySelector(".photos-main"), rootMargin: "120px", threshold: 0.2 })
            : null;

        galleryItems.forEach((item) => {
            const card = document.createElement("button");
            card.type = "button";
            card.className = "gallery-item";
            card.dataset.mediaType = item.type;
            card.setAttribute("aria-label", `Open ${item.type}: ${item.title}`);

            let media;
            if (item.type === "video") {
                media = document.createElement("video");
                media.className = "gallery-video";
                media.dataset.src = item.thumbnail;
                media.muted = true;
                media.loop = true;
                media.playsInline = true;
                media.preload = "none";
                media.setAttribute("aria-hidden", "true");
                if (observer) observer.observe(media);
            } else {
                media = document.createElement("img");
                media.className = "gallery-image";
                media.src = item.thumbnail;
                media.alt = "";
                media.loading = "lazy";
                media.decoding = "async";
            }
            const thumbnail = document.createElement("span");
            thumbnail.className = "photos-thumbnail";
            thumbnail.append(media);

            if (item.type === "video") {
                const badge = document.createElement("span");
                badge.className = "media-badge";
                badge.textContent = "▶ VIDEO";
                badge.setAttribute("aria-hidden", "true");
                thumbnail.append(badge);
            }

            const caption = document.createElement("span");
            caption.className = "photos-caption";
            const title = document.createElement("span");
            title.className = "gallery-title";
            title.textContent = item.title;
            const description = document.createElement("span");
            description.className = "gallery-description";
            description.textContent = item.description;
            caption.append(title, description);
            card.append(thumbnail, caption);
            card.addEventListener("click", () => openMediaModal(item, card));
            galleryGrid.append(card);
        });
        const videoCount = galleryItems.filter((item) => item.type === "video").length;
        document.getElementById("galleryTotalCount").textContent = String(galleryItems.length);
        document.getElementById("galleryVideoCount").textContent = String(videoCount);
        applyGalleryFilter();
        setGalleryItems(galleryItems);
        buildFolderBrowser("gallery");
        if (initialApp === "gallery") openApp("gallery", false, null, initialOpenAsApp);
    }

    modalClose.addEventListener("click", closeMediaModal);
    mediaModal.addEventListener("click", (event) => {
        if (event.target === mediaModal) closeMediaModal();
    });
    mediaModal.addEventListener("keydown", (event) => {
        if (event.key !== "Tab") return;
        const focusable = [...mediaModal.querySelectorAll("button, video[controls]")];
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && mediaModal?.classList.contains("active")) closeMediaModal();
    });
}
