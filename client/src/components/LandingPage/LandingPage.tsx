import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styled from 'styled-components';

import FlexboxContainer from '../General/FlexboxContainer.tsx';
import Login from './Login.tsx';
import Marquee from './Marquee.tsx';

const StyledBackground = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
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

const LandingPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin(token: string) {
    login(token);
    navigate('/feed');
  }

  return (
    <FlexboxContainer height="100dvh" width="100dvw" $direction="column">
      <Login handleLogin={handleLogin}/>
      <Marquee $direction="horizontal" $length={20} $offset="6dvh" $size="20dvh"/>
      <Marquee $direction="vertical" $length={5} $offset="5.5dvw" $size="28dvw"/>

      <StyledBackground/>
    </FlexboxContainer>
  )
}

export default LandingPage
