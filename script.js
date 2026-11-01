// IMAGE GALLERY ELEMENTS
const galleryItems = document.querySelectorAll(".gallery-item");
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const imageCount = document.getElementById("imageCount");
const noResults = document.getElementById("noResults");
const filterButtons = document.querySelectorAll(".filters button");

// LIGHTBOX ELEMENTS
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCounter = document.getElementById("lightboxCounter");
const lightboxDownload = document.getElementById("lightboxDownload");
const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// VARIABLES
let currentFilter = "all";
let currentImageIndex = 0;
let visibleImages = [];

// LOAD FAVOURITES FROM LOCAL STORAGE
let favorites = JSON.parse(
    localStorage.getItem("imageGalleryFavorites") || "[]"
);

// UPDATE FAVOURITE BUTTONS
function updateFavoriteButtons() {
    galleryItems.forEach((item, index) => {
        const favoriteBtn = item.querySelector(".favorite-btn");

        if (!favoriteBtn) return;

        if (favorites.includes(index)) {
            favoriteBtn.classList.add("favorited");
            favoriteBtn.innerHTML = "♥";
        } else {
            favoriteBtn.classList.remove("favorited");
            favoriteBtn.innerHTML = "♡";
        }
    });
}

// FILTER AND SEARCH IMAGES
function updateGallery() {
    const searchText = searchInput.value.toLowerCase().trim();

    let visibleCount = 0;
    visibleImages = [];

    galleryItems.forEach((item, index) => {
        const category = item.dataset.category;
        const title = item.dataset.title.toLowerCase();

        const matchesCategory =
            currentFilter === "all" ||
            category === currentFilter ||
            (currentFilter === "favorites" && favorites.includes(index));

        const matchesSearch = title.includes(searchText);

        if (matchesCategory && matchesSearch) {
            item.classList.remove("hide");
            visibleImages.push(item);
            visibleCount++;
        } else {
            item.classList.add("hide");
        }
    });

    imageCount.textContent =
        `Showing ${visibleCount} of ${galleryItems.length} images`;

    noResults.style.display =
        visibleCount === 0 ? "block" : "none";

    updateFavoriteButtons();
}

// CATEGORY FILTER BUTTONS
filterButtons.forEach(button => {
    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentFilter = button.dataset.category;

        updateGallery();
    });
});

// SEARCH IMAGES
searchInput.addEventListener("input", () => {
    clearSearch.style.display =
        searchInput.value.length > 0 ? "block" : "none";

    updateGallery();
});

// CLEAR SEARCH
clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    clearSearch.style.display = "none";

    updateGallery();
});

// FAVOURITE BUTTONS
galleryItems.forEach((item, index) => {
    const favoriteBtn = item.querySelector(".favorite-btn");

    favoriteBtn.addEventListener("click", event => {
        event.stopPropagation();

        if (favorites.includes(index)) {
            favorites = favorites.filter(id => id !== index);
        } else {
            favorites.push(index);
        }

        localStorage.setItem(
            "imageGalleryFavorites",
            JSON.stringify(favorites)
        );

        updateGallery();
    });
});

// IMAGE DOWNLOAD BUTTONS
galleryItems.forEach(item => {
    const downloadBtn = item.querySelector(".download-btn");

    downloadBtn.addEventListener("click", event => {
        event.stopPropagation();
    });
});

// OPEN LIGHTBOX
function openLightbox(index) {
    currentImageIndex = index;

    showLightboxImage();

    lightbox.classList.add("show");
    document.body.style.overflow = "hidden";
}

// DISPLAY LIGHTBOX IMAGE
function showLightboxImage() {
    const item = visibleImages[currentImageIndex];

    if (!item) return;

    const image = item.querySelector("img");
    const title = item.dataset.title;

    lightboxImg.src = image.src;
    lightboxImg.alt = title;

    lightboxTitle.textContent = title;

    lightboxCounter.textContent =
        `${currentImageIndex + 1} / ${visibleImages.length}`;

    lightboxDownload.href = image.src;
    lightboxDownload.download = `${title}.jpg`;
}

// CLICK IMAGE TO OPEN LIGHTBOX
galleryItems.forEach(item => {
    const image = item.querySelector(".image-wrapper img");

    image.addEventListener("click", () => {
        const index = visibleImages.indexOf(item);

        if (index !== -1) {
            openLightbox(index);
        }
    });
});

// NEXT IMAGE
nextBtn.addEventListener("click", () => {
    if (visibleImages.length === 0) return;

    currentImageIndex =
        (currentImageIndex + 1) % visibleImages.length;

    showLightboxImage();
});

// PREVIOUS IMAGE
prevBtn.addEventListener("click", () => {
    if (visibleImages.length === 0) return;

    currentImageIndex =
        (currentImageIndex - 1 + visibleImages.length) %
        visibleImages.length;

    showLightboxImage();
});

// CLOSE LIGHTBOX
function closeLightbox() {
    lightbox.classList.remove("show");
    document.body.style.overflow = "auto";
}

closeBtn.addEventListener("click", closeLightbox);

// CLICK OUTSIDE IMAGE TO CLOSE
lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

// KEYBOARD CONTROLS
document.addEventListener("keydown", event => {

    if (!lightbox.classList.contains("show")) return;

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "ArrowRight") {
        nextBtn.click();
    }

    if (event.key === "ArrowLeft") {
        prevBtn.click();
    }
});

// INITIALIZE GALLERY
updateGallery();