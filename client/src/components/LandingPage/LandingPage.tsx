import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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

const StyledPillar = styled.div<{$side: "left" | "right"}>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;

  width: 2000px;

  background-image: ${({ $side }) =>
    `url(/images/pillar.webp)`};

  background-repeat: no-repeat;
  background-position: ${({ $side }) =>
    $side === "left" ? "left center" : "right center"};

  background-size: contain;

  pointer-events: none;

  z-index: 5;
`

const LandingPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin(token: string) {
    login(token);
    navigate('/feed');
  }

  const handleMouseMove = (event : any) => {
    const rect = event.currentTarget.getBoundingClientRect();

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

      <StyledPillar $side="left"/>

      <RainBackground/>
      <StyledBackground/>
      <StyledHighlightedBackground/>
    </StyledMainContainer>
  )
}

export default LandingPage
