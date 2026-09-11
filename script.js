// ==========================================================================
// COLECCIÓN COMPLETA DE FOTOS EN LA CARPETA
// ==========================================================================
const photos = [
    "ahora1.jpg",
    "ahora2.jpg",
    "ahora3.jpg",
    "alcossebre1.jpg",
    "alcossebre2.jpg",
    "alcossebre3.jpg",
    "alcossebre4.jpg",
    "aquopolis_laura.jpg",
    "aquopolis_laura2.jpg",
    "besohalloween.jpg",
    "besoretiro.jpg",
    "besovideotop.jpg",
    "budapest.jpg",
    "calendar.jpg",
    "comidafamilia1.jpg",
    "comidafamilia2.jpg",
    "comidafamilia3.jpg",
    "comidafamilia4.jpg",
    "erasmus.jpg",
    "foto1.jpg",
    "foto4.jpg",
    "graduacionlaura1.jpg",
    "graduacionlaura2.jpg",
    "graduacionlaura3.jpg",
    "graduacionlaura4.jpg",
    "hero2.jpg",
    "hero3.jpg",
    "laura peque.jpg",
    "map.jpg",
    "mierasmus1.jpg",
    "mierasmus2.jpg",
    "migraduacion1.jpg",
    "migraduacion2.jpg",
    "nosotros.jpg",
    "story_chapter.jpg",
    "tazas.jpg",
    "terceraniversario1.jpg",
    "terceraniversario2.jpg",
    "tuerasmus1.jpg",
    "vuelta1.jpg",
    "vuelta2.jpg",
    "vuelta3.jpg",
    "vueltaerasmus1.jpg",
    "yo peque.jpg"
];

// Configuración del pase de diapositivas (en milisegundos: 2500ms = 2.5 segundos)
const SLIDESHOW_INTERVAL = 2500;

// Referencias DOM
const slide1 = document.getElementById("bg-slide-1");
const slide2 = document.getElementById("bg-slide-2");
const photoCounter = document.getElementById("photo-counter");
const screenCover = document.getElementById("screen-cover");
const screenVideo = document.getElementById("screen-video");
const btnToVideo = document.getElementById("btn-to-video");
const btnToCover = document.getElementById("btn-to-cover");
const mainVideo = document.getElementById("main-video");
const mainYoutube = document.getElementById("main-youtube");

let currentPhotoIndex = -1;
let activeSlideNum = 1;
let slideshowTimer = null;

/**
 * Precargar únicamente la siguiente imagen que se mostrará (Carga Progresiva/Lazy)
 */
function preloadNextPhoto(nextIndex) {
    if (photos[nextIndex]) {
        const img = new Image();
        img.src = encodeURI(photos[nextIndex]);
    }
}

/**
 * Obtener un índice aleatorio asegurando que no se repita consecutivamente
 */
function getRandomPhotoIndex() {
    if (photos.length <= 1) return 0;
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * photos.length);
    } while (newIndex === currentPhotoIndex);
    return newIndex;
}

/**
 * Cambiar la imagen de fondo con efecto suave de fundido (crossfade)
 */
function updateBackgroundSlide() {
    currentPhotoIndex = getRandomPhotoIndex();
    const photoFileName = photos[currentPhotoIndex];
    const photoUrl = `url("${encodeURI(photoFileName)}")`;

    if (activeSlideNum === 1) {
        // Cargar en el slide 2 y activarlo
        if (slide2) {
            slide2.style.backgroundImage = photoUrl;
            slide2.classList.add("active-slide");
        }
        if (slide1) {
            slide1.classList.remove("active-slide");
        }
        activeSlideNum = 2;
    } else {
        // Cargar en el slide 1 y activarlo
        if (slide1) {
            slide1.style.backgroundImage = photoUrl;
            slide1.classList.add("active-slide");
        }
        if (slide2) {
            slide2.classList.remove("active-slide");
        }
        activeSlideNum = 1;
    }

    if (photoCounter) {
        photoCounter.textContent = `Foto ${currentPhotoIndex + 1} de ${photos.length}`;
    }

    // Precargar de forma inteligente solo la Siguiente foto en segundo plano
    const nextPhotoIndex = (currentPhotoIndex + 1) % photos.length;
    preloadNextPhoto(nextPhotoIndex);
}

/**
 * Iniciar el pase de diapositivas aleatorio
 */
function startSlideshow() {
    updateBackgroundSlide();
    if (!slideshowTimer) {
        slideshowTimer = setInterval(updateBackgroundSlide, SLIDESHOW_INTERVAL);
    }
}

/**
 * Detener el pase de diapositivas cuando la portada no está visible
 */
function stopSlideshow() {
    if (slideshowTimer) {
        clearInterval(slideshowTimer);
        slideshowTimer = null;
    }
}

// ==========================================================================
// EVENTOS Y NAVEGACIÓN ENTRE PANTALLAS
// ==========================================================================

// Cambiar a Pantalla 2 (Vídeo)
if (btnToVideo) {
    btnToVideo.addEventListener("click", () => {
        if (screenCover) screenCover.classList.remove("active");
        if (screenVideo) screenVideo.classList.add("active");
        stopSlideshow();

        if (mainVideo) {
            mainVideo.currentTime = 0;
            mainVideo.focus();
        }
    });
}

// Volver a Pantalla 1 (Portada)
if (btnToCover) {
    btnToCover.addEventListener("click", () => {
        // Pausar el vídeo nativo si existe
        if (mainVideo && !mainVideo.paused) {
            mainVideo.pause();
        }

        // Pausar el vídeo de YouTube si se está usando iframe
        if (mainYoutube && mainYoutube.src) {
            const currentSrc = mainYoutube.src;
            mainYoutube.src = currentSrc; // Recargar el src detiene la reproducción y el audio de YouTube al volver
        }

        if (screenVideo) screenVideo.classList.remove("active");
        if (screenCover) screenCover.classList.add("active");
        startSlideshow();
    });
}

// Atajos de teclado útiles
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && screenVideo && screenVideo.classList.contains("active")) {
        if (btnToCover) btnToCover.click();
    }
});

// Inicialización de la aplicación
document.addEventListener("DOMContentLoaded", () => {
    startSlideshow();
});
