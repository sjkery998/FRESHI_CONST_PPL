import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled Components
const CarouselCase = styled.div`
    width: 100vw;
    height: 27vh;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
`;

const CarouselImageCase = styled.div`
    // background-color: green;
    flex: 1;
    position: relative;
`;

const CarouselImage = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    right: ${(props) => props.$position};
    transition: ${(props) => (props.$instant ? 'none' : 'right 0.2s ease')};
    
    /* Tambahkan img tag di dalam div */
    img {
        width: 100%;
        height: 100%;
        object-fit: cover; /* Atur gambar agar tidak stretch, dan tetap memenuhi kontainer */
        object-position: center; /* Menjaga gambar tetap terpusat */
    }
`;

const CarouselBulletCase = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    position: absolute;
    justify-content: center;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.66);
`;

const CarouselBullets = styled.div`
    width: 5px;
    height: 5px;
    margin: 2px;
    background-color: ${(props) => (props.$isActive ? 'black' : 'white')};
    border-radius: 50%;
    transition: background-color 0.2s ease;
`;

// Main Component
function MainCarousel() {
    const [position, setPosition] = useState('-100%');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [instant, setInstant] = useState(false);
    const images = [
        '/images/carousel (1).png',
        '/images/carousel (2).png',
        '/images/carousel (3).png',
        '/images/carousel (4).png',
        '/images/carousel (5).png',
        '/images/carousel (6).png',
        '/images/carousel (7).png',
        '/images/carousel (8).png',
        '/images/carousel (9).png',
        '/images/carousel (10).png',
    ];
    const count = images.length;

    useEffect(() => {
        const timerResetPosition = setTimeout(() => {
            setPosition('0%');
            setInstant(false);
        }, 100);

        const timerNextImage = setTimeout(() => {
            setPosition('-100%');
            setCurrentIndex((prevIndex) => (prevIndex + 1) % count); // Perubahan bullet aktif
            setInstant(true);
        }, 3000);

        return () => {
            clearTimeout(timerResetPosition);
            clearTimeout(timerNextImage);
        };
    }, [currentIndex]);

    return (
        <CarouselCase>
            <CarouselImageCase>
                <CarouselImage
                    $position={position}
                    $instant={instant}
                >
                    <img src={images[currentIndex]} alt={`Carousel image ${currentIndex + 1}`} />
                </CarouselImage>
            </CarouselImageCase>
            <CarouselBulletCase>
                {Array.from({ length: count }).map((_, index) => (
                    <CarouselBullets key={index} $isActive={index === currentIndex} />
                ))}
            </CarouselBulletCase>
        </CarouselCase>
    );
}

export default MainCarousel;
