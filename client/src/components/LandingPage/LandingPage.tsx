import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import styled from 'styled-components';

import Login from './Login.tsx';
import Marquee from './Marquee.tsx';
import RainBackground from '../General/RainBackground.tsx';

const StyledMainContainer = styled.div<{$direction: string, $height: string, $width: string}>`
  display: flex;
  flex-direction: ${({ $direction }) => $direction || 'row'};
  align-items: center;
  justify-content: center;
  height: ${({ $height }) => $height || '100%'};
  width: ${({ $width }) => $width || '100%'};

  &::before {
    content: "";
    position: absolute;
    inset: 0;

    box-shadow:
      inset 6px 0 20px rgba(0, 0, 0, 0.8),
      inset 6px 0 20px rgba(0, 0, 0, 0.8);

    pointer-events: none;
  }
`;

const StyledBackground = styled.div`
  position: absolute;
  inset: 0;
  z-index: -2;
  background: 
    url('/images/fantasy map edited.jpg'),
    url('/images/Patina.jpg');
  background-repeat: no-repeat, no-repeat;
  background-size: cover, cover;
  background-blend-mode: multiply;
  opacity: 0.5;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(211, 252, 255, 0.4),
      rgba(41, 112, 156, 0.6)
    );
    pointer-events: none;
  }
`;

const StyledHighlightedBackground = styled.div`
  position: absolute;
  inset: 0;
  z-index: -3;
  background: 
    url('/images/fantasy map edited.jpg'),
    url('/images/Patina.jpg');
  background-repeat: no-repeat, no-repeat;
  background-size: cover, cover;
  background-blend-mode: multiply;
  opacity: 1;

  filter:
    brightness(1.35)
    saturate(1.5)
    contrast(1.1);

  mask-image: radial-gradient(
    circle 350px at var(--mouse-x) var(--mouse-y),
    black 0%,
    rgba(0,0,0,0.8) 20%,
    transparent 80%
  );

  transition: filter 300ms ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(211, 252, 255, 0.4),
      rgba(41, 112, 156, 0.6)
    );
    pointer-events: none;
  }
`;

const StyledMonsterLayer = styled.div`
  position: absolute;
  inset: 0;

  pointer-events: none;

  z-index: 2;

  mask-image: radial-gradient(
    circle 350px at var(--mouse-x) var(--mouse-y),
    black 0%,
    rgba(0,0,0,0.8) 20%,
    transparent 80%
  );
`;

const monsterFloat = keyframes`
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-10px);
  }

  100% {
    transform: translateY(0px);
  }
`;

const StyledMonster = styled.img<{$size: string, $highlighted?: boolean, $active?: boolean}>`
  position: absolute;

  bottom: 33%;
  left: 14%;

  width: ${({ $size }) => $size};
  height: auto;

  pointer-events: none;
  z-index: 2;

  ${({ $highlighted }) =>
    $highlighted
      ? `
        filter:
          brightness(1)
          saturate(0)
          contrast(1.1);
      `
      : `
        opacity: 0.3;

        filter:
          brightness(0.5)
          saturate(0)
          contrast(0.6);
      `}

    ${({ $active }) =>
      $active &&
      `
        animation: ${monsterFloat} 2s ease-in-out infinite;
      `
    }
`;

const StyledPillar = styled.img<{ $side: "left" | "right" }>`
  position: absolute;

  top: 0;
  bottom: 0;

  ${({ $side }) =>
    $side === "left"
      ? `
        left: 0;
        filter:
          drop-shadow(6px 0 4px rgba(0, 0, 0, 0.8))
          drop-shadow(20px 0 25px rgba(0, 0, 0, 0.35))
          brightness(0.7);
      `
      : `
        right: 0;
        filter:
          drop-shadow(-6px 0 4px rgba(0, 0, 0, 0.8))
          drop-shadow(-20px 0 25px rgba(0, 0, 0, 0.35))
          brightness(0.7);
        transform: scaleX(-1);
      `}

  height: 100dvh;
  width: auto;
  opacity: 0.7;

  pointer-events: none;
`;

const LandingPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [monsterActive, setMonsterActive] = useState(false);

  async function handleLogin(token: string) {
    login(token);
    navigate('/feed');
  }

const handleMouseMove = (
  event: React.MouseEvent<HTMLDivElement>
) => {
  const rect =
    event.currentTarget.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  event.currentTarget.style.setProperty(
    "--mouse-x",
    `${x}px`
  );

  event.currentTarget.style.setProperty(
    "--mouse-y",
    `${y}px`
  );
};

  return (
    <StyledMainContainer $height="100dvh" $width="100dvw" $direction="column" onMouseMove={handleMouseMove}>
      <Login handleLogin={handleLogin}/>
      {/* <Marquee $direction="horizontal" $length={20} $offset="6dvh" $size="20dvh"/>
      <Marquee $direction="horizontal" $length={20} $offset="74dvh" $size="20dvh"/> */}
      {/* <Marquee $direction="vertical" $length={5} $offset="5.5dvw" $size="28dvw"/> */}

      <StyledPillar src="/images/pillar.png" $side="left"/>
      <StyledPillar src="/images/pillar.png" $side="right"/>

      <RainBackground/>
      <StyledMonster src="/images/sea monster.png" $size="200px" $highlighted={false}/>
      <StyledMonsterLayer>
        <StyledMonster src="/images/sea monster.png" $size="200px" $highlighted={true} $active={monsterActive}/>
      </StyledMonsterLayer>
      <StyledBackground/>
      <StyledHighlightedBackground/>
    </StyledMainContainer>
  )
}

export default LandingPage
