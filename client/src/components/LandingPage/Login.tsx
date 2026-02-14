import { useState, useRef, useLayoutEffect } from 'react';
import type { ComponentType, SVGProps } from 'react';
import styled, { keyframes, css } from 'styled-components';
import axios from "axios";

import LoginIcon from "../../assets/icons/login.svg?react";
import PasswordIcon from "../../assets/icons/password.svg?react";
import EyeIcon from "../../assets/icons/eye.svg?react";
import NewUserIcon from "../../assets/icons/new.svg?react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

type StyledLoginButton = {
  $expanded: boolean
  $heightAdjust: number
}

type LoginProps = {
  login: string;
  password: string;
};

const StyledContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  height: fit-content;
  width: 40dvw;
  padding: 10px 20px;
`;

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

const StyledFieldsWrapper = styled.div<{$visible: boolean}>`
  transform-origin: top;
  transform: ${({ $visible }) => $visible ? "scaleY(1)" : "scaleY(0)"};
  transition: transform 0.8s ease;
`

const StyledField = styled.div<{$visible: boolean}>`
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

const StyledNewUserWrapper = styled.div<{ $visible : boolean}>`
  display: ${({ $visible }) => $visible ? "flex" : "none"};
  align-items: center;
  height: 200px;

  transform-origin: top;
  transform: ${({ $visible }) => $visible ? "scaleY(1)" : "scaleY(0)"};
  transition: transform 0.8s ease;

  ${({ $visible }) =>
    $visible &&
    css`
      animation: ${expandLogin} 1s ease-out forwards;
    `}
`;

const StyledNewUserButton = styled.button<{ $expanded : boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  height: fit-content;
  width: 140px;
  padding: 1em;
  background: hsl(233deg 36% 38%);
  color: hsl(0 0 100);
  border: none;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;

  transition: width 0.8s ease, transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const createStyledIcon = (IconComponent: ComponentType<SVGProps<SVGSVGElement>>) => styled(IconComponent)`
  height: 20px;
  width: 20px;
  cursor: pointer;
  vertical-align: bottom;
  transition: transform 0.4s;

  &:hover {
      transform: scale(1.1);
  }
`

const StyledLoginIcon = createStyledIcon(LoginIcon);
const StyledPasswordIcon = createStyledIcon(PasswordIcon);
const StyledEyeIcon = createStyledIcon(EyeIcon);
const StyledNewUserIcon = createStyledIcon(NewUserIcon);

// Avoiding relayouts by using wrapper preset to max button width
const StyledLoginButtonWrapper = styled.div<StyledLoginButton>`
  margin-top: ${({ $heightAdjust }) => $heightAdjust ? `-${$heightAdjust}px` : "0px"};
  display: flex;
  justify-content: center;
  height: fit-content;
  padding: 10px 0px;
  gap: 10px;
  width: 240px;

  transition: transform 0.8s ease;
  transform: ${({ $expanded, $heightAdjust }) => $expanded ? `translateY(${$heightAdjust}px)` : "translateY(0px)"};
`

const StyledLoginButton = styled.button<StyledLoginButton>`
  width: ${({ $expanded }) => $expanded ? "200px" : "100px"};
  padding: 1em;
  background: hsl(233deg 36% 38%);
  color: hsl(0 0 100);
  border: none;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;

  transition: width 0.8s ease, transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }
`

const Login = () => {
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const fieldsHeightRef = useRef<HTMLDivElement>(null);
  const [fieldsHeight, setFieldsHeight] = useState<number>(0)
  const [submitMode, setSubmitMode] = useState<string>("login");

  const [details, setDetails] = useState<{ login: string; password: string }>({ 
    "login": "", 
    "password": "" 
  });

  function toggleLoginVisible() {
    if (showLogin) {
      setShowLogin(prev => !prev);
    } else {
      setShowLogin(prev => !prev);
    }
  };

  function updateField<K extends keyof LoginProps>(
    field: K,
    value: LoginProps[K]
  ) {
    setDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  function togglePasswordVisible() {
    setPasswordVisible(prev => !prev);
  };

  function toggleSubmitMode() {
    if (submitMode == "login") {
      setSubmitMode("register");
    } else {
      setSubmitMode("login");
    }
  };

  async function handleMode() {
    if (submitMode === "login") {
      await login();
    } else {
      await register();
    }
  };

  async function register() {
    try {
      // Post request to backend
      const registerDetails = {
        "login": details.login, 
        "password": details.password
      };
      const response = await axios.post(`${backendUrl}/register`, registerDetails);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  async function login() {
    try {
      const loginDetails = {
        "login": details.login, 
        "password": details.password
      };
      const response = await axios.post(`${backendUrl}/login`, loginDetails);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useLayoutEffect(() => {
    if (fieldsHeightRef.current) {
      setFieldsHeight(fieldsHeightRef.current.offsetHeight);
    }
  }, [showLogin]);

  return (
    <StyledContentWrapper>
      <StyledLoginWrapper>
        <StyledFieldsWrapper $visible={showLogin}>
          <StyledField $visible={showLogin}>
            <StyledLoginIcon/>
            <StyledInput type="text" name="login" value={details.login} placeholder="Login" onChange={((e) => updateField("login", e.target.value))}/>
          </StyledField>
          <StyledField ref={fieldsHeightRef} $visible={showLogin}>
            <StyledPasswordIcon/>
            <StyledInput type={passwordVisible ? "text" : "password"} name="email" value={details.password} placeholder="Password" onChange={((e) => updateField("password", e.target.value))}/>
            <StyledEyeIcon onClick={togglePasswordVisible}/>
          </StyledField>
        </StyledFieldsWrapper>
        <StyledLoginButtonWrapper $expanded={showLogin} $heightAdjust={fieldsHeight}>
          <StyledLoginButton onClick={showLogin ? handleMode : toggleLoginVisible} $expanded={showLogin} $heightAdjust={fieldsHeight}>
            {submitMode == "login" ? "Login" : "Register"}
          </StyledLoginButton>
        </StyledLoginButtonWrapper>
      </StyledLoginWrapper>

      <StyledNewUserWrapper $visible={showLogin}>
        <StyledNewUserButton onClick={toggleSubmitMode} $expanded={showLogin}>
          New User?
          <StyledNewUserIcon/>
        </StyledNewUserButton>
      </StyledNewUserWrapper>
    </StyledContentWrapper>
  )
}

export default Login