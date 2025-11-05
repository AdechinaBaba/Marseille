document.addEventListener('DOMContentLoaded', () => {
    const sliderContainer = document.getElementById('sliderContainer');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const slides = document.querySelectorAll('.slide');

    let currentSlide = 0;
    const totalSlides = slides.length;

    // Fonction pour mettre à jour la position du slider
    function updateSlider() {
        // Calcule la position de défilement pour afficher la slide actuelle
        const offset = -currentSlide * 100;
        sliderContainer.style.transform = `translateX(${offset}%)`;
    }

    // Gestion du bouton SUIVANT
    nextBtn.addEventListener('click', () => {
        // Passe à la slide suivante (revient à 0 si on dépasse la dernière)
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    });

    // Gestion du bouton PRÉCÉDENT
    prevBtn.addEventListener('click', () => {
        // Passe à la slide précédente (revient à la dernière si on dépasse 0)
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    });

    // Optionnel : Défilement automatique toutes les 7 secondes
    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }, 8000);

    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const closeMenuToggle = document.querySelector('.close-menu-toggle');

    menuToggle.addEventListener('click', () => {
        // Toggle la classe 'active' sur l'élément de navigation
        mainNav.classList.toggle('active');
    });

    closeMenuToggle.addEventListener('click', () => {
        mainNav.classList.remove('active'); // Utiliser remove pour s'assurer qu'il se ferme
    });

    /* Optionnel : Fermeture automatique si l'utilisateur clique sur un lien */
    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                mainNav.classList.remove('active');
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // ... (Code pour le Slider et le Menu Mobile) ...

    // --- NOUVELLE FONCTIONNALITÉ : Vidéo À Propos (Clic pour Lancer) ---
    const videoWrapper = document.querySelector('.video-wrapper');
    const artisanVideo = document.querySelector('.artisan-video');
    const playButton = document.querySelector('.play-button');

    if (videoWrapper && artisanVideo && playButton) {
        // Ajoute un écouteur d'événement au wrapper (qui inclut le bouton play)
        videoWrapper.addEventListener('click', () => {
            if (artisanVideo.paused) {
                artisanVideo.play();
                videoWrapper.classList.add('playing'); // Ajoute la classe 'playing' pour cacher le bouton
            } else {
                artisanVideo.pause();
                videoWrapper.classList.remove('playing'); // Retire la classe si on clique pour mettre en pause
            }
        });

        // Optionnel: Cacher le bouton Play si la vidéo est déjà en train de jouer (ex: si on avait des contrôles visibles)
        artisanVideo.addEventListener('play', () => {
            videoWrapper.classList.add('playing');
        });

        // Optionnel: Réafficher le bouton Play si la vidéo est mise en pause ou terminée
        artisanVideo.addEventListener('pause', () => {
            videoWrapper.classList.remove('playing');
        });
        artisanVideo.addEventListener('ended', () => {
            videoWrapper.classList.remove('playing');
            artisanVideo.load(); // Recharge la vidéo à son début pour une nouvelle lecture
        });
    }
});