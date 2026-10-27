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
    let revealObserver = null;

    if ('IntersectionObserver' in window) {
        revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                el.classList.add('visible');
                revealObserver.unobserve(el);
                setTimeout(() => {
                    el.classList.remove('reveal', 'visible');
                    el.style.removeProperty('--d');
                }, 1500);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    }

    function watchReveal(el) {
        if (revealObserver) revealObserver.observe(el);
        else el.classList.add('visible');
    }

    document.querySelectorAll('.reveal').forEach(watchReveal);

    // 4. Portfolio Albums
    //    To add a photo: upload it to its folder, then add its file name to that folder's list.
    //    The FIRST file in each list is the cover shown on "All".
    //    File names must match GitHub exactly (including .JPG vs .jpg).
    const albums = [
        {
            key: 'portraits', label: 'Portraits', folder: 'Portraits',
            files: ['1.jpg', '15.jpg', '21.jpg', '23.jpg', '24.jpg', '25.jpg', '26.jpg', '27.jpg',
                    'IMG_3313.jpg', 'IMG_3320.jpg', 'IMG_3326.jpg', 'IMG_4345.jpg',
                    'IMG_8678.jpg', 'IMG_8684.jpg', 'IMG_8712.jpg']
        },
        {
            key: 'events', label: 'Events', folder: 'Events',
            files: ['1.jpg', '2.jpg', 'IMG_9132.jpg', 'IMG_9261.jpg']
        },
        {
            key: 'christening', label: 'Christening', folder: 'Christening',
            files: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg',
                    'IMG_2354.jpg', 'IMG_2380.jpg', 'IMG_2389.jpg', 'IMG_2393.jpg', 'IMG_2402.jpg',
                    'i.jpg', 'im.jpg']
        },
        {
            key: 'pageants', label: 'Pageants', folder: 'Pageants',
            files: ['1.JPG', 'IMG_1170.JPG', 'IMG_1274.JPG', 'IMG_1297.JPG', 'IMG_1322.JPG']
        },
        {
            key: 'concert', label: 'Concert', folder: 'Concert',
            files: ['1.JPG', 'IMG_5505.JPG', 'IMG_5506.JPG', 'IMG_5518.JPG']
        },
        {
            key: 'family', label: 'Family', folder: 'Family Photo',
            files: ['1.jpg', 'IMG_4210.jpg', 'IMG_4217.jpg', 'IMG_4224.jpg',
                    'IMG_4244.jpg', 'IMG_4275.jpg', 'IMG_5422.jpg']
        },
        {
            key: 'street', label: 'Street', folder: 'Street',
            files: ['1.jpg', 'IMG_2071.jpg']
        },
        {
            key: 'travel', label: 'Travel', folder: 'Travel',
            files: ['1.JPG', 'IMG_0681.jpg', 'IMG_0685.jpg', 'IMG_5642grain.jpg']
        }
    ];

    const galleryGrid = document.getElementById('galleryGrid');
    const filterContainer = document.getElementById('filterContainer');

    const COVER_LAYOUT = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8';
    const PHOTO_LAYOUT = 'columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6';

    const srcOf = (album, file) => `selected works/${album.folder}/${file}`;

    // "All" view: one grayscale cover per album
    function buildCovers() {
        galleryGrid.className = COVER_LAYOUT;
        galleryGrid.innerHTML = '';

        albums.forEach((album, i) => {
            const sources = album.files.map(f => srcOf(album, f));
            const item = document.createElement('div');
            item.className = 'gallery-item reveal relative group overflow-hidden cursor-pointer rounded-sm';
            item.style.setProperty('--d', `${(i % 4) * 0.1}s`);
            item.innerHTML = `
                <img src="${sources[0]}" alt="${album.label} album" loading="lazy"
                     class="w-full h-[350px] sm:h-[450px] object-cover grayscale transition-transform duration-500 group-hover:scale-105">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-6 pointer-events-none">
                    <span class="text-xs uppercase tracking-widest text-gray-300">${album.label}</span>
                    <h3 class="font-serif text-xl font-bold">${album.label} Album (${sources.length} Photos)</h3>
                </div>`;
            item.addEventListener('click', () => window.openAlbum(sources, 0));
            galleryGrid.appendChild(item);
            watchReveal(item);
        });
    }

    // Category view: every photo in that album, still grayscale
    function buildPhotos(album) {
        galleryGrid.className = PHOTO_LAYOUT;
        galleryGrid.innerHTML = '';
        const sources = album.files.map(f => srcOf(album, f));

        sources.forEach((src, i) => {
            const item = document.createElement('div');
            item.className = 'gallery-item reveal relative group overflow-hidden cursor-pointer rounded-sm break-inside-avoid mb-4 sm:mb-6';
            item.style.setProperty('--d', `${(i % 3) * 0.1}s`);
            item.innerHTML = `<img src="${src}" alt="${album.label} photo ${i + 1}" loading="lazy"
                     class="w-full h-auto block grayscale transition-transform duration-500 group-hover:scale-105">`;
            item.addEventListener('click', () => window.openAlbum(sources, i));
            galleryGrid.appendChild(item);
            watchReveal(item);
        });
    }

    let currentFilter = 'all';

    function showCategory(key, btn) {
        if (key === currentFilter) return;
        currentFilter = key;

        filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Fade out, swap content, fade back in
        galleryGrid.style.transition = 'opacity 0.3s ease';
        galleryGrid.style.opacity = '0';
        setTimeout(() => {
            if (key === 'all') buildCovers();
            else buildPhotos(albums.find(a => a.key === key));
            galleryGrid.style.opacity = '1';
        }, 300);
    }

    if (galleryGrid && filterContainer) {
        // Build the filter buttons: All + one per album
        filterContainer.innerHTML = '';
        [{ key: 'all', label: 'All' }, ...albums].forEach(f => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn' + (f.key === 'all' ? ' active' : '');
            btn.textContent = f.label;
            btn.dataset.filter = f.key;
            btn.addEventListener('click', () => showCategory(f.key, btn));
            filterContainer.appendChild(btn);
        });

        buildCovers();
    }

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

    function preloadNeighbours() {
        const total = currentAlbumImages.length;
        [(currentIndex + 1) % total, (currentIndex - 1 + total) % total].forEach(i => {
            const img = new Image();
            img.src = currentAlbumImages[i];
        });
    }

    window.openAlbum = function (images, startIndex) {
        currentAlbumImages = images;
        currentIndex = Number.isInteger(startIndex) ? startIndex : 0;
        isBusy = false;

        lightboxImg.style.transition = 'none';
        lightboxImg.style.opacity = '0';
        lightboxImg.style.transform = 'scale(0.96)';
        lightboxImg.src = currentAlbumImages[currentIndex];
        updateCounter();

        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';

        void lightboxImg.offsetWidth;
        lightboxImg.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        lightboxImg.style.opacity = '1';
        lightboxImg.style.transform = 'scale(1)';

        preloadNeighbours();
    };

    function changeImage(newIndex, dir) {
        if (isBusy || currentAlbumImages.length < 2) return;
        isBusy = true;

        lightboxImg.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        lightboxImg.style.opacity = '0';
        lightboxImg.style.transform = `translateX(${-40 * dir}px)`;

        setTimeout(() => {
            currentIndex = newIndex;
            const src = currentAlbumImages[currentIndex];
            const loader = new Image();

            const show = () => {
                lightboxImg.src = src;
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

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLb();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLb();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });

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
