import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled Component untuk layar transisi
const TransitionOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 10;
  opacity: ${({ opacity }) => opacity}; /* Gunakan opacity yang dikendalikan oleh state */
  transition: opacity 0.1s ease-out; /* Transisi cepat untuk memperlihatkan perubahan */
`;

function Transition() {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity((prevOpacity) => {
        if (prevOpacity > 0) {
          return prevOpacity - 0.05;
        } else {
          clearInterval(interval);
          return 0;
        }
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);
  return opacity > 0 ? <TransitionOverlay opacity={opacity} /> : null;
}

export default Transition;
