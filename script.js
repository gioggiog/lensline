document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Hamburger Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            } else {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            }
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // 2. Dark / Light Mode Toggle
    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
        const themeIcon = themeToggleBtn.querySelector('i');
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            if (document.body.classList.contains('light-theme')) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            } else {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        });
    }

    // 3. Portfolio Category Filter Buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // 4. Interactive Lightbox Album Viewer
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const closeLightbox = document.getElementById('closeLightbox');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let currentAlbumImages = [];
    let currentAlbumTitles = [];
    let currentIndex = 0;

    const albumTriggers = document.querySelectorAll('.album-trigger');

    albumTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            try {
                currentAlbumImages = JSON.parse(trigger.getAttribute('data-images'));
                currentAlbumTitles = JSON.parse(trigger.getAttribute('data-titles'));
                currentIndex = 0;
                updateLightboxContent();
                lightbox.classList.remove('hidden');
                lightbox.classList.add('flex');
            } catch (err) {
                console.error("Error parsing album images JSON:", err);
            }
        });
    });

    function updateLightboxContent() {
        if (currentAlbumImages.length > 0) {
            lightboxImg.src = currentAlbumImages[currentIndex];
            lightboxTitle.textContent = currentAlbumTitles[currentIndex] || '';
            lightboxCounter.textContent = `${currentIndex + 1} / ${currentAlbumImages.length}`;
        }
    }

    if (closeLightbox) {
        closeLightbox.addEventListener('click', () => {
            lightbox.classList.add('hidden');
            lightbox.classList.remove('flex');
        });
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentAlbumImages.length > 0) {
                currentIndex = (currentIndex - 1 + currentAlbumImages.length) % currentAlbumImages.length;
                updateLightboxContent();
            }
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentAlbumImages.length > 0) {
                currentIndex = (currentIndex + 1) % currentAlbumImages.length;
                updateLightboxContent();
            }
        });
    }

    // Close lightbox on clicking outside the image container
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.add('hidden');
                lightbox.classList.remove('flex');
            }
        });
    }
});

const albumTriggers = document.querySelectorAll('.album-trigger');

    albumTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            try {
                const imagesAttr = trigger.getAttribute('data-images');
                const titlesAttr = trigger.getAttribute('data-titles');
                
                if (imagesAttr && titlesAttr) {
                    currentAlbumImages = JSON.parse(imagesAttr);
                    currentAlbumTitles = JSON.parse(titlesAttr);
                    currentIndex = 0;
                    updateLightboxContent();
                    lightbox.classList.remove('hidden');
                    lightbox.classList.add('flex');
                }
            } catch (err) {
                console.error("Error parsing album images JSON:", err);
            }
        });
    });
