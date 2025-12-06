document.addEventListener('DOMContentLoaded', () => {

    /* ========================================================= */
    /* 1. SLIDER D'ACCUEIL (Hero) - AJOUT DU SWIPE MOBILE */
    /* ========================================================= */
    const sliderContainer = document.getElementById('sliderContainer');

    // Déclare la variable d'intervalle en dehors du bloc if pour l'arrêter/redémarrer si nécessaire
    let autoSlideInterval;

    if (sliderContainer) {
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const slides = document.querySelectorAll('.slide');

        let currentSlide = 0;
        const totalSlides = slides.length;
        let startX = 0; // Point de départ du toucher
        let isSwiping = false; // Indicateur de balayage

        // Fonction pour mettre à jour la position du slider
        function updateSlider(animate = true) {
            const offset = -currentSlide * 100;
            sliderContainer.style.transition = animate ? 'transform 0.5s ease-in-out' : 'none';
            sliderContainer.style.transform = `translateX(${offset}%)`;
        }

        // Fonction pour démarrer le défilement automatique
        function startAutoSlide() {
            // Nous effaçons toujours l'ancien intervalle avant d'en créer un nouveau
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(() => {
                currentSlide = (currentSlide + 1) % totalSlides;
                updateSlider();
            }, 8000);
        }

        // --- INITIALISATION ---
        updateSlider(false); // 👈 Appel UNIQUE pour initialiser la position (sans animation)
        startAutoSlide(); // 👈 Démarrage du défilement automatique

        // Gestion des boutons de navigation
        nextBtn.addEventListener('click', () => {
            // Arrête et redémarre l'intervalle après une action manuelle
            startAutoSlide();
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        });

        prevBtn.addEventListener('click', () => {
            startAutoSlide();
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
        });

        // --- LOGIQUE DE SWIPE MOBILE ---

        // 1. Début du toucher
        sliderContainer.addEventListener('touchstart', (e) => {
            clearInterval(autoSlideInterval); // Arrête le défilement automatique
            startX = e.touches[0].clientX;
            isSwiping = true;
        });

        // 2. Mouvement du toucher (Votre code de `touchmove` est correct)
        sliderContainer.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;
            const currentX = e.touches[0].clientX;
            const diffX = currentX - startX;
            const containerWidth = sliderContainer.offsetWidth / totalSlides;
            const currentOffset = -currentSlide * 100;
            const dragOffset = (diffX / containerWidth) * 100;

            sliderContainer.style.transition = 'none';
            sliderContainer.style.transform = `translateX(${currentOffset + dragOffset}%)`;
        });

        // 3. Fin du toucher
        sliderContainer.addEventListener('touchend', (e) => {
            if (!isSwiping) return;

            const endX = e.changedTouches[0].clientX;
            const diffX = endX - startX;
            const swipeThreshold = 50;

            if (diffX > swipeThreshold) {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            } else if (diffX < -swipeThreshold) {
                currentSlide = (currentSlide + 1) % totalSlides;
            }

            updateSlider(true);
            isSwiping = false;
            startAutoSlide(); // Redémarre le défilement automatique
        });

        // touchcancel...
        sliderContainer.addEventListener('touchcancel', () => {
            if (isSwiping) {
                updateSlider(true);
                isSwiping = false;
            }
            startAutoSlide(); // Redémarre aussi l'autoslide si le swipe est annulé
        });
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

        // --- LOGIQUE CRUCIALE POUR MOBILE : MISE EN PAUSE SÉCURISÉE ---

        // Fonction qui met la vidéo en pause et affiche le bouton Play
        const initializeVideoState = () => {
            // 1. Assure que la vidéo est en pause et muette
            artisanVideo.pause();
            artisanVideo.muted = true;

            // 2. Affiche le bouton Play
            videoWrapper.classList.remove('playing');
        };

        // Solution A (Idéale) : Attendre que les données de la vidéo soient chargées
        artisanVideo.addEventListener('loadeddata', initializeVideoState);

        // Solution B (Secours) : Utiliser un petit délai si 'loadeddata' ne se déclenche pas bien
        // Ceci s'assure que la vidéo est bien en pause et le bouton affiché.
        setTimeout(initializeVideoState, 1000); // 1 seconde de délai

        // Si la vidéo est chargée au moment où le script s'exécute, on l'initialise immédiatement
        if (artisanVideo.readyState >= 2) { // READY_STATE_ENOUGH_DATA
            initializeVideoState();
        }

        // --- Gestion du Clic (Reste la même) ---

        videoWrapper.addEventListener('click', () => {
            if (artisanVideo.paused) {
                // AVANT de jouer, on s'assure que la vidéo n'est plus muette au clic si elle a été forcée par le JS
                artisanVideo.muted = false;
                artisanVideo.play();
                videoWrapper.classList.add('playing');
            } else {
                // Pause et réactive le muet (pour ne pas avoir de son si elle est relancée par un script)
                artisanVideo.pause();
                artisanVideo.muted = true;
                videoWrapper.classList.remove('playing');
            }
        });

        // Écouteurs d'événements pour le contrôle visuel du bouton
        artisanVideo.addEventListener('play', () => {
            videoWrapper.classList.add('playing');
        });

        artisanVideo.addEventListener('pause', () => {
            videoWrapper.classList.remove('playing');
        });

        artisanVideo.addEventListener('ended', () => {
            videoWrapper.classList.remove('playing');
            artisanVideo.load(); // Recharge la vidéo à son début (affiche l'image poster)
        });
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