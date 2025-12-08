document.addEventListener('DOMContentLoaded', () => {

    /* ========================================================= */
    /* 1. SLIDER D'ACCUEIL (Hero) - SANS SWIPE MOBILE */
    /* ========================================================= */
    const sliderContainer = document.getElementById('sliderContainer');

    if (sliderContainer) {
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const slides = document.querySelectorAll('.slide');

        let currentSlide = 0;
        const totalSlides = slides.length;

        // Déclaration de l'intervalle dans la portée du 'if'
        let autoSlideInterval;

        // Fonction pour mettre à jour la position du slider
        function updateSlider(animate = true) {
            const offset = -currentSlide * 100;
            sliderContainer.style.transition = animate ? 'transform 0.5s ease-in-out' : 'none';
            sliderContainer.style.transform = `translateX(${offset}%)`;
        }

        // Fonction pour démarrer/redémarrer le défilement automatique
        function startAutoSlide() {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(() => {
                currentSlide = (currentSlide + 1) % totalSlides;
                updateSlider();
            }, 8000);
        }

        // --- INITIALISATION ---
        updateSlider(false); // Initialise la position sur la première slide SANS transition
        startAutoSlide();     // Démarrage du défilement automatique

        // Gestion des boutons de navigation (Clics)
        nextBtn.addEventListener('click', () => {
            // Redémarre l'intervalle après une action manuelle
            startAutoSlide();
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        });

        prevBtn.addEventListener('click', () => {
            // Redémarre l'intervalle après une action manuelle
            startAutoSlide();
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
        });

        // NOTE : La logique de SWIPE MOBILE (touchstart, touchmove, touchend) est
        // entièrement supprimée ici.
    }

    /* ========================================================= */
    /* 2. MENU MOBILE (Toggle) */
    /* ========================================================= */
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const closeMenuToggle = document.querySelector('.close-menu-toggle');

    // Vérifie que le menu existe avant de manipuler les événements
    if (menuToggle && mainNav && closeMenuToggle) {

        // Ouvre le menu
        menuToggle.addEventListener('click', () => {
            mainNav.classList.add('active'); // Utiliser add pour s'assurer qu'il s'ouvre
        });

        // Ferme le menu
        closeMenuToggle.addEventListener('click', () => {
            mainNav.classList.remove('active');
        });

        // Fermeture automatique si l'utilisateur clique sur un lien (sur mobile)
        const navLinks = document.querySelectorAll('.nav-list a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // S'assure d'exécuter la fermeture uniquement si l'écran est petit
                if (window.innerWidth <= 768) {
                    mainNav.classList.remove('active');
                }
            });
        });
    }


    /* ========================================================= */
    /* 3. VIDÉO À PROPOS (Gestion du Clic & Mobile) */
    /* ========================================================= */
    const videoWrapper = document.querySelector('.video-wrapper');
    const artisanVideo = document.querySelector('.artisan-video');
    const playButton = document.querySelector('.play-button');

    if (videoWrapper && artisanVideo && playButton) {

        // Fonction qui met la vidéo en pause et affiche le bouton Play
        const initializeVideoState = () => {
            artisanVideo.pause();
            artisanVideo.muted = true; // Force le muet à l'initialisation
            videoWrapper.classList.remove('playing');
        };

        // ... (Initialisation et setTimeout restent inchangés) ...
        artisanVideo.addEventListener('loadeddata', initializeVideoState);
        setTimeout(initializeVideoState, 1000);
        if (artisanVideo.readyState >= 2) {
            initializeVideoState();
        }

        // --- Gestion du Clic (CORRIGÉ) ---
        videoWrapper.addEventListener('click', () => {
            if (artisanVideo.paused) {
                // PLAY : On active le son
                artisanVideo.muted = false;
                artisanVideo.play();
                videoWrapper.classList.add('playing');
            } else {
                // PAUSE MANUELLE : On met en pause, mais on ne touche PAS au volume !
                artisanVideo.pause();
                // L'écouteur 'pause' gère le reste
            }
        });

        // Écouteurs d'événements pour le contrôle visuel du bouton
        artisanVideo.addEventListener('play', () => {
            videoWrapper.classList.add('playing');
        });

        artisanVideo.addEventListener('pause', () => {
            // Cet écouteur gère la classe visuelle après une pause manuelle OU Observer
            videoWrapper.classList.remove('playing');
        });

        artisanVideo.addEventListener('ended', () => {
            videoWrapper.classList.remove('playing');
            artisanVideo.load();
        });

        /* --- GESTION DE LA VISIBILITÉ AU SCROLL (Intersection Observer) --- */
        if ('IntersectionObserver' in window) {
            const options = {
                root: null,
                rootMargin: '0px',
                threshold: 0
            };

            const observerCallback = (entries, observer) => {
                entries.forEach(entry => {
                    const video = entry.target;

                    // Si la vidéo joue ET qu'elle n'est PLUS dans le viewport du tout (isIntersecting est faux)
                    if (video.paused === false && !entry.isIntersecting) {
                        video.pause();
                        video.muted = true; // Remettre le muet (pour l'autoplay)
                    }
                });
            };

            const observer = new IntersectionObserver(observerCallback, options);
            observer.observe(artisanVideo);
        }
    }

    /* ========================================================= */
    /* 4. SLIDER AVIS CLIENTS (Logique Scroll-Snap) */
    /* ========================================================= */

    const avisWrapper = document.querySelector('.testimonials-wrapper');
    const nextAvisBtn = document.querySelector('.next-avis-btn');
    const prevAvisBtn = document.querySelector('.prev-avis-btn');
    const avisDots = document.querySelectorAll('.avis-pagination .dot');

    const GAP_WIDTH = 30; // Correspond au gap: 30px dans le CSS

    function getScrollAmount() {
        const wrapperWidth = avisWrapper.offsetWidth;
        const slidesPerView = window.innerWidth <= 600 ? 1 : (window.innerWidth <= 1024 ? 2 : 3);

        // Calcul de la largeur exacte d'une "page" (3 slides + 2 gaps, ou 1 slide)
        if (slidesPerView === 3) {
            // Largeur de la "page" est 100% de la vue
            return wrapperWidth;
        } else if (slidesPerView === 2) {
            // Largeur de la "page" est 100% de la vue
            return wrapperWidth;
        } else {
            // Mobile : Largeur d'une seule slide (100% + gap)
            return avisWrapper.querySelector('.testimonial-card').offsetWidth + GAP_WIDTH;
        }
    }

    if (avisWrapper) {
        // --- Navigation Manuelle ---
        nextAvisBtn.addEventListener('click', () => {
            const scrollAmount = getScrollAmount();
            // Fait défiler le wrapper horizontalement
            avisWrapper.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        prevAvisBtn.addEventListener('click', () => {
            const scrollAmount = getScrollAmount();
            avisWrapper.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        // NOTE : La pagination (dots) et l'autoplay deviennent complexes avec scroll-snap 
        // car on ne connaît plus l'index exact. Je vous recommande de les désactiver 
        // ou de les laisser au "toucher" si vous ne voulez pas d'une logique JS trop lourde.
    }

});