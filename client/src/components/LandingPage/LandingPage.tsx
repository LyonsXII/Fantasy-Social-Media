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
  background: url('/images/fantasy map edited.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-blend-mode: multiply; 

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('/images/Patina.jpg');
    background-size: cover;
    background-blend-mode: multiply; 
    opacity: 0.7;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, #d3fcff, #29709c);
    opacity: 0.8;
    background-blend-mode: multiply; 
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
