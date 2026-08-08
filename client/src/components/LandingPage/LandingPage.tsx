import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

import Login from './Login.tsx';
// import Marquee from './Marquee.tsx';
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
  background-repeat: no-repeat;
  background-size: cover;
  background-blend-mode: multiply;
  background-position: 50% 25%;
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

const StyledHighlightedBackground = styled.div<{ $initialised: boolean }>`
  position: absolute;
  inset: 0;
  z-index: -3;
  background: 
    url('/images/fantasy map edited.jpg'),
    url('/images/Patina.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-blend-mode: multiply;
  background-position: 50% 25%;

  opacity: ${({ $initialised }) => ($initialised ? 1 : 0)};

  filter:
    brightness(1.35)
    saturate(1.5)
    contrast(1.1);

  mask-image: radial-gradient(
    circle 350px at var(--mouse-x, -500px) var(--mouse-y, -500px),
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

const StyledRevealLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;

  mask-image: radial-gradient(
    circle 350px at var(--mouse-x, -500px) var(--mouse-y, -500px),
    black 0%,
    rgba(0,0,0,0.8) 20%,
    transparent 80%
  );
`;

const idleFloat = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-4px);
  }
`;

const StyledFloatingWrapper = styled.div`
  position: absolute;
  inset: 0;

  pointer-events: none;

  animation:
    ${idleFloat}
    2s
    ease-in-out
    infinite;

`

const StyledMonster = styled.img<{$size: string, $highlighted?: boolean, $active?: boolean}>`
  position: absolute;

  bottom: 21%;
  left: 15%;

  width: ${({ $size }) => $size};
  height: auto;

  pointer-events: none;
  z-index: 2;

  ${({ $highlighted }) =>
    $highlighted
      ? `
        opacity: 0.6;
        filter:
          brightness(0.5)
          saturate(0)
          contrast(1);
      `
      : `
        opacity: 0.2;
        filter:
          brightness(0.5)
          saturate(0)
          contrast(0.6);
      `}

  transform: ${({ $active }) => 
    $active 
     ? `translate(-50px, 30px) 
    rotate(8deg)` : 
    `translate(0px, 0px) rotate(0deg)`
  }; 
  
  transition: transform 2.4s cubic-bezier(0.22, 1, 0.36, 1);
`;

const StyledShipwreck = styled.img<{$size: string, $highlighted?: boolean, $active?: boolean}>`
  position: absolute;

  bottom: 76%;
  left: 22%;

  width: ${({ $size }) => $size};
  height: auto;

  pointer-events: none;
  z-index: 2;

  ${({ $highlighted }) =>
    $highlighted
      ? `
        opacity: 0.4;
        filter:
          brightness(0.5)
          saturate(0)
          contrast(1);
      `
      : `
        opacity: 0.2;
        filter:
          brightness(0.5)
          saturate(0)
          contrast(0.6);
      `}

  transform: ${({ $active }) =>
    $active
      ? `
        translate(0px, 10px)
      `
      : `
        translate(0px, 0px)
      `};

transition: transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
`;

const StyledCompass = styled.img<{$size: string, $highlighted?: boolean, $active?: boolean}>`
  position: absolute;

  top: 28.6%;
  left: 9.6%;

  width: ${({ $size }) => $size};
  height: auto;

  ${({ $highlighted }) =>
    $highlighted
      ? `
        opacity: 0.6;
        filter:
          brightness(0.5)
          saturate(0)
          contrast(1);
      `
      : `
        opacity: 0.2;
        filter:
          brightness(0.5)
          saturate(0)
          contrast(0.6);
      `}

  transform: ${({ $active }) =>
    $active
      ? `
        rotate(360deg)
      `
      : `
        rotate(0deg)
      `};

  transition: transform 4s cubic-bezier(0.34, 1.56, 0.64, 1);
`

const LandingPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mouseInitialized, setMouseInitialized] = useState(false);

  // Map element active flags
  const [monsterActive, setMonsterActive] = useState(false);
  const [shipActive, setShipActive] = useState(false);
  const [compassActive, setCompassActive] = useState(false);

  async function handleLogin(token: string) {
    login(token);
    navigate('/feed');
  }

const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
  const rect = event.currentTarget.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  event.currentTarget.style.setProperty("--mouse-x", `${x}px`);
  event.currentTarget.style.setProperty("--mouse-y", `${y}px`);

  setMouseInitialized(true);

  // Trigger monster animation when cursor close
  const monsterX = rect.width * 0.21 + 100;
  const monsterY = rect.height * 0.85;

  const monsterDistance = Math.sqrt(
    Math.pow(event.clientX - rect.left - monsterX, 2) +
    Math.pow(event.clientY - rect.top - monsterY, 2)
  );

  setMonsterActive(monsterDistance < 200);

  // Trigger ship animation when cursor close
  const shipX = rect.width * 0.22 + 100;
  const shipY = rect.height * 0.14;

  const shipDistance = Math.sqrt(
    Math.pow(event.clientX - rect.left - shipX, 2) +
    Math.pow(event.clientY - rect.top - shipY, 2)
  );

  setShipActive(shipDistance < 200);

  // Trigger compass animation when cursor close
  const compassX = rect.width * 0.15;
  const compassY = rect.height * 0.40;

  const compassDistance = Math.sqrt(
    Math.pow(event.clientX - rect.left - compassX, 2) +
    Math.pow(event.clientY - rect.top - compassY, 2)
  );

  setCompassActive(compassDistance < 80);
};

  return (
    <StyledMainContainer $height="100dvh" $width="100dvw" $direction="column" onMouseMove={handleMouseMove}>
      <Login handleLogin={handleLogin}/>
      {/* <Marquee $direction="horizontal" $length={20} $offset="6dvh" $size="20dvh"/>
      <Marquee $direction="horizontal" $length={20} $offset="74dvh" $size="20dvh"/> */}
      {/* <Marquee $direction="vertical" $length={5} $offset="5.5dvw" $size="28dvw"/> */}

      <RainBackground/>
      <StyledCompass src="/images/compass.png" $size="11%" $highlighted={false} $active={compassActive}/>
      <StyledFloatingWrapper>
        <StyledMonster src="/images/sea monster.png" $size="11%" $highlighted={false} $active={monsterActive}/>
        <StyledShipwreck src="/images/shipwreck.png" $size="8%" $highlighted={false} $active={shipActive}/>
      </StyledFloatingWrapper>

      <StyledRevealLayer>
        <StyledCompass src="/images/compass.png" $size="11%" $highlighted={true} $active={compassActive}/>
        <StyledFloatingWrapper>
          <StyledMonster src="/images/sea monster.png" $size="11%" $highlighted={true} $active={monsterActive}/>
          <StyledShipwreck src="/images/shipwreck.png" $size="8%" $highlighted={true} $active={shipActive}/>
        </StyledFloatingWrapper>
      </StyledRevealLayer>

      <StyledBackground/>
      <StyledHighlightedBackground $initialised={mouseInitialized}/>
    </StyledMainContainer>
  )
}

export default LandingPage