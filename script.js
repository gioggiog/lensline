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

    // 3. Scroll Reveal (fade up when elements enter the screen)
    //    To animate anything new, just add class="reveal" to it.
    //    Optional stagger: style="--d:.15s"
    const revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                el.classList.add('visible');
                revealObserver.unobserve(el);

                // Clean up after the animation so it doesn't interfere with filtering
                setTimeout(() => {
                    el.classList.remove('reveal', 'visible');
                    el.style.removeProperty('--d');
                }, 1500);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        revealEls.forEach(el => revealObserver.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('visible'));
    }

    // 4. Portfolio Category Filter (smooth fade instead of instant jump)
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const matches = filterValue === 'all' || item.classList.contains(filterValue);

                if (matches) {
                    if (item.style.display === 'none') {
                        item.style.display = '';
                        item.classList.add('filter-hide');
                        void item.offsetWidth; // force reflow so the fade-in plays
                    }
                    requestAnimationFrame(() => item.classList.remove('filter-hide'));
                } else {
                    item.classList.add('filter-hide');
                    setTimeout(() => {
                        if (item.classList.contains('filter-hide')) {
                            item.style.display = 'none';
                        }
                    }, 350);
                }
            });
        });
    });

    // 5. Lightbox Album Viewer (smooth open, slide/fade between photos)
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const closeLightbox = document.getElementById('closeLightbox');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let currentAlbumImages = [];
    let currentIndex = 0;
    let isBusy = false;

    function updateCounter() {
        lightboxCounter.textContent = `${currentIndex + 1} / ${currentAlbumImages.length}`;
    }

    // Load neighbouring photos in the background so "next" feels instant
    function preloadNeighbours() {
        const total = currentAlbumImages.length;
        [(currentIndex + 1) % total, (currentIndex - 1 + total) % total].forEach(i => {
            const img = new Image();
            img.src = currentAlbumImages[i];
        });
    }

    // Called by the onclick on each gallery card (titles argument is no longer used)
    window.openAlbum = function (images) {
        currentAlbumImages = images;
        currentIndex = 0;
        isBusy = false;

        lightboxImg.style.transition = 'none';
        lightboxImg.style.opacity = '0';
        lightboxImg.style.transform = 'scale(0.96)';
        lightboxImg.src = currentAlbumImages[0];
        updateCounter();

        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';

        void lightboxImg.offsetWidth;
        lightboxImg.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        lightboxImg.style.opacity = '1';
        lightboxImg.style.transform = 'scale(1)';

        preloadNeighbours();
    };

    // dir: 1 = next (slides left), -1 = previous (slides right)
    function changeImage(newIndex, dir) {
        if (isBusy || currentAlbumImages.length < 2) return;
        isBusy = true;

        // Fade + slide the current photo out
        lightboxImg.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        lightboxImg.style.opacity = '0';
        lightboxImg.style.transform = `translateX(${-40 * dir}px)`;

        setTimeout(() => {
            currentIndex = newIndex;
            const src = currentAlbumImages[currentIndex];
            const loader = new Image();

            const show = () => {
                lightboxImg.src = src;
                // Start the new photo off to the side, then glide it in
                lightboxImg.style.transition = 'none';
                lightboxImg.style.transform = `translateX(${40 * dir}px)`;
                void lightboxImg.offsetWidth;
                lightboxImg.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
                lightboxImg.style.opacity = '1';
                lightboxImg.style.transform = 'translateX(0)';
                updateCounter();
                preloadNeighbours();
                isBusy = false;
            };

            loader.onload = show;
            loader.onerror = show;
            loader.src = src;
        }, 250);
    }

    function showNext() {
        changeImage((currentIndex + 1) % currentAlbumImages.length, 1);
    }

    function showPrev() {
        changeImage((currentIndex - 1 + currentAlbumImages.length) % currentAlbumImages.length, -1);
    }

    function closeLb() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    closeLightbox.addEventListener('click', closeLb);
    lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
    lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

    // Click the dark background to close
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLb();
    });

    // Keyboard: Esc, left arrow, right arrow
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLb();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });

    // Swipe left/right on phones
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        const diff = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(diff) > 50) {
            diff < 0 ? showNext() : showPrev();
        }
    }, { passive: true });
});
