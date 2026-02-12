import { useState } from 'react';
import type { ComponentType, SVGProps } from 'react';
import styled, { keyframes, css } from 'styled-components';

import LoginIcon from "../../assets/icons/login.svg?react";
import PasswordIcon from "../../assets/icons/password.svg?react";
import EyeIcon from "../../assets/icons/eye.svg?react";

type StyledFieldProps = {
  $visible: boolean
}

const StyledLoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  height: fit-content;
  width: fit-content;
  padding: 10px 20px;
`;

const expandLogin = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledField = styled.div<StyledFieldProps>`
  display: ${({ $visible }) => $visible ? "flex" : "none"};
  flex-direction: row;
  background: hsla(0, 0%, 100%, 0.5);
  box-shadow: 0 0 2em hsl(231deg 62% 94%);
  padding: 1em;
  gap: 0.5em;
  border-radius: 20px;
  color: hsl(0deg 0% 30%);
  width: 200px;

  ${({ $visible }) =>
    $visible &&
    css`
      animation: ${expandLogin} 1s ease-out forwards;
    `}
`

const StyledInput = styled.input`
  width: 100%;
  outline: none;
  border: none;
  &::placeholder {
    color: hsl(0deg 0% 0%);
    font-size: 0.9em;
  } 
`

const createStyledIcon = (IconComponent: ComponentType<SVGProps<SVGSVGElement>>) => styled(IconComponent)`
  height: 20px;
  width: 20px;
  transition: transform 0.4s;
  cursor: pointer;
  vertical-align: bottom;

  &:hover {
      transform: scale(1.1);
  }
`

const StyledLoginIcon = createStyledIcon(LoginIcon);
const StyledPasswordIcon = createStyledIcon(PasswordIcon);
const StyledEyeIcon = createStyledIcon(EyeIcon);

const StyledButton = styled.button`
  padding: 1em;
  background: hsl(233deg 36% 38%);
  color: hsl(0 0 100);
  border: none;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
`

const Login = () => {
  const [showLogin, setShowLogin] = useState<boolean>(false);

  function toggleLoginVisible() {
    if (showLogin) {

    } else {
      setShowLogin(prev => !prev);
    }
  }

  return (
    <StyledLoginWrapper>
      <StyledField $visible={showLogin}>
        <StyledLoginIcon/>
        <StyledInput type="text" name="login" placeholder="Login"/>
      </StyledField>
      <StyledField $visible={showLogin}>
        <StyledPasswordIcon/>
        <StyledInput type="password" name="email" placeholder="Password"/>
        <StyledEyeIcon/>
      </StyledField>
      <StyledButton onClick={toggleLoginVisible}>
        Login
      </StyledButton>
    </StyledLoginWrapper>
  )
}

export default Login