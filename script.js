document.addEventListener('DOMContentLoaded', () => {

    /* ========================================================= */
    /* 1. SLIDER D'ACCUEIL (Hero) */
    /* ========================================================= */
    const sliderContainer = document.getElementById('sliderContainer');
    // Vérifie que les éléments du slider existent avant de les manipuler
    if (sliderContainer) {
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const slides = document.querySelectorAll('.slide');

        let currentSlide = 0;
        const totalSlides = slides.length;

        // Fonction pour mettre à jour la position du slider
        function updateSlider() {
            const offset = -currentSlide * 100;
            sliderContainer.style.transform = `translateX(${offset}%)`;
        }

        // Gestion des boutons de navigation
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        });

        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
        });

        // Défilement automatique toutes les 8 secondes
        setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        }, 8000);
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
});