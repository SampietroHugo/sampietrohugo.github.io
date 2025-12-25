document.addEventListener('DOMContentLoaded', () => {

    const carouselTrack = document.querySelector('.carousel-track');
    const prevButton = document.querySelector('.carousel-btn.prev');
    const nextButton = document.querySelector('.carousel-btn.next');
    const gameCarousel = document.querySelector('.game-carousel');

    if (!carouselTrack || !prevButton || !nextButton || !gameCarousel) {
        console.error("One or more carousel elements were not found.");
        return;
    }

    let animationFrameId;
    let isPaused = true;
    const SCROLL_SPEED = 0.5;
    const MANUAL_SCROLL_DURATION = 500;

    const itemCards = Array.from(carouselTrack.children);
    const numClones = 5;
    const itemWidth = itemCards[0].offsetWidth + 15;
    let totalItems = 0;

    const initializeCarousel = () => {
        itemCards.slice(0, numClones).forEach(item => {
            const clone = item.cloneNode(true);
            carouselTrack.appendChild(clone);
        });

        itemCards.slice(-numClones).reverse().forEach(item => {
            const clone = item.cloneNode(true);
            carouselTrack.prepend(clone);
        });

        totalItems = Array.from(carouselTrack.children).length;

        const initialScroll = numClones * itemWidth;
        carouselTrack.style.scrollBehavior = 'auto';
        carouselTrack.scrollLeft = initialScroll;
    };

    const autoScroll = () => {
        if (isPaused) return;

        carouselTrack.style.scrollBehavior = 'auto';
        carouselTrack.scrollLeft += SCROLL_SPEED;

        const scrollPosition = carouselTrack.scrollLeft;
        const loopEndPoint = numClones * itemWidth;

        if (scrollPosition >= (totalItems - numClones) * itemWidth) {
            carouselTrack.scrollLeft = loopEndPoint;
        }

        animationFrameId = requestAnimationFrame(autoScroll);
    };

    const startAutoplay = () => {
        if (!isPaused) return;
        isPaused = false;
        animationFrameId = requestAnimationFrame(autoScroll);
    };

    const stopAutoplay = () => {
        isPaused = true;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    };

    const handleManualNavigation = (direction) => {
        stopAutoplay();

        carouselTrack.style.scrollBehavior = 'smooth';

        const newPosition = carouselTrack.scrollLeft + (itemWidth * direction);
        carouselTrack.scrollLeft = newPosition;

        setTimeout(() => {
            carouselTrack.style.scrollBehavior = 'auto';

            const loopStartPoint = (totalItems - numClones) * itemWidth;
            const loopEndPoint = numClones * itemWidth;
            const currentPos = carouselTrack.scrollLeft;

            if (currentPos >= loopStartPoint - itemWidth / 2) {
                carouselTrack.scrollLeft = loopEndPoint;
            }
            else if (currentPos <= loopEndPoint - itemWidth / 2) {
                carouselTrack.scrollLeft = (totalItems - numClones * 2) * itemWidth;
            }

            startAutoplay();

        }, MANUAL_SCROLL_DURATION);
    };

    initializeCarousel();

    nextButton.addEventListener('click', () => {
        handleManualNavigation(1);
    });

    prevButton.addEventListener('click', () => {
        handleManualNavigation(-1);
    });

    gameCarousel.addEventListener('mouseenter', stopAutoplay);
    gameCarousel.addEventListener('mouseleave', startAutoplay);

    startAutoplay();
});