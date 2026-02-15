import { useState, useEffect } from 'react';
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
}

type LoginProps = {
  login: string;
  password: string;
};

const StyledContentWrapper = styled.div<{ $expanded : boolean, $showLoginOutro : boolean }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  height: fit-content;
  width: fit-content;
  padding: 2rem;
  background: ${({ $expanded }) => $expanded ? "hsl(213deg 85% 97%)" : "none"};
  box-shadow: 0 0 2em hsl(231deg 62% 94%);
  border-radius: 30px;

  ${({ $showLoginOutro }) =>
    $showLoginOutro
      ? css`
          animation: ${fadeOut} 400ms ease-in forwards;
        `
      : css`
          animation: ${fadeIn} 400ms ease-out forwards;
        `}
`;

const StyledMessageText = styled.div<{ $showMessageText : boolean }>`
  position: absolute;
  top: 1.8rem;
  left: 3rem;
  height: 1rem;
  width: calc(100% - 6rem);
  font-size: 1rem;
  opacity: 0.8;
`;

const StyledLoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  height: fit-content;
  width: fit-content;
  padding: 2rem 0rem 1.2rem 0rem;
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0px);
  }
  100% {
    opacity: 0;
    transform: translateY(20px);
  }
`;

const StyledFieldsWrapper = styled.div<{$visible: boolean}>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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
  gap: 0.5rem;
  border-radius: 20px;
  color: hsl(0deg 0% 30%);
  width: 200px;

  ${({ $visible }) =>
    $visible &&
    css`
      animation: ${fadeIn} 1s ease-out forwards;
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

const createStyledIcon = (IconComponent: ComponentType<SVGProps<SVGSVGElement>>) => styled(IconComponent)<{$shadow : boolean}>`
  height: 20px;
  width: 20px;
  cursor: pointer;
  vertical-align: bottom;
  transition: transform 0.4s;
  color: white;

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
  margin-top: ${({ $expanded }) => $expanded ? "10px" : "0px"};
  display: flex;
  justify-content: center;
  height: fit-content;
  width: fit-content;

  transition: transform 0.8s ease;
`

const StyledLoginButton = styled.button<StyledLoginButton>`
  width: ${({ $expanded }) => $expanded ? "200px" : "100px"};
  padding: 1em;
  color: hsl(0, 0%, 100%);
  background: linear-gradient(135deg, hsl(233, 36%, 38%), hsl(233, 36%, 45%));
  box-shadow: 0 0 2em hsl(231deg 62% 94%);
  border: none;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;

  transition: width 0.8s ease, transform 0.2s ease;

  ${({ $expanded }) =>
    $expanded &&
    css`
      animation: ${fadeIn} 1s ease-out forwards;
    `}

  &:hover {
    transform: scale(1.02);
  }
`

const StyledLoginButtonText = styled.p<{ $showSubmitModeTransition : boolean }>`
  font-weight: 600;
  ${({ $showSubmitModeTransition }) =>
    $showSubmitModeTransition
      ? css`
          animation: ${fadeOut} 400ms ease-in forwards;
        `
      : css`
          animation: ${fadeIn} 400ms ease-out forwards;
        `}
`;

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
      animation: ${fadeIn} 1s ease-out forwards;
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
  font-weight: 600;
  background: linear-gradient(135deg, hsl(233, 36%, 38%), hsl(233, 36%, 45%));
  color: hsl(0, 0%, 100%);
  box-shadow: 0 0 2em hsl(231deg 62% 94%);
  border: none;
  border-radius: 30px;
  cursor: pointer;

  transition: width 0.8s ease, transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const Login = () => {
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [showLoginOutro, setShowLoginOutro] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [submitMode, setSubmitMode] = useState<string>("login");
  const [showSubmitModeTransition, setShowSubmitModeTransition] = useState<boolean>(false);
  const [messageText, setMessageText] = useState<string>("");
  const [showMessageText, setShowMessageText] = useState<boolean>(false);

  const [details, setDetails] = useState<{ login: string; password: string }>({ 
    "login": "", 
    "password": "" 
  });

  function toggleLoginVisible() {
    if (showLogin) {
      setShowLogin(prev => !prev);
    } else {
      setShowLoginOutro(true);
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
    setShowSubmitModeTransition(true);
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
      await axios.post(`${backendUrl}/register`, registerDetails);
      setMessageText("Account created");
      toggleSubmitMode();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 400) {
            setMessageText(error.response.data.error);
          }
        }
      } else {
        console.log("Something else went wrong.");
      }
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
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 400) {
            setMessageText(error.response.data.error);
          }
        }
      }
    }
  };

  // Toggle fade out / in for login box when expanding
  useEffect(() => {
    if (showLoginOutro) {
      const timer = setTimeout(() => {
        setShowLoginOutro(false);
        setShowLogin(true);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [showLoginOutro]);

  // Toggle text switch for submitMode button
  useEffect(() => {
    if (showSubmitModeTransition) {
      const timer = setTimeout(() => {
        setShowSubmitModeTransition(prev => !prev);
        if (submitMode == "login") {
          setSubmitMode("register");
        } else {
          setSubmitMode("login");
        }
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [showSubmitModeTransition]);

  // Show message text popup temporarily
  useEffect(() => {
    if (messageText != "") {
      setShowMessageText(true)
      const timer = setTimeout(() => {
        setMessageText("");
        setShowMessageText(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [messageText]);

  return (
    <StyledContentWrapper $expanded={showLogin} $showLoginOutro={showLoginOutro}>
      <StyledMessageText $showMessageText={showMessageText}>
        {messageText}
      </StyledMessageText>

      <StyledLoginWrapper>
        <StyledFieldsWrapper $visible={showLogin}>
          <StyledField $visible={showLogin}>
            <StyledLoginIcon $shadow={false}/>
            <StyledInput type="text" name="login" value={details.login} placeholder="Login" onChange={((e) => updateField("login", e.target.value))}/>
          </StyledField>
          <StyledField $visible={showLogin}>
            <StyledPasswordIcon $shadow={false}/>
            <StyledInput type={passwordVisible ? "text" : "password"} name="email" value={details.password} placeholder="Password" onChange={((e) => updateField("password", e.target.value))}/>
            <StyledEyeIcon $shadow={false} onClick={togglePasswordVisible}/>
          </StyledField>
        </StyledFieldsWrapper>
        <StyledLoginButtonWrapper $expanded={showLogin}>
          <StyledLoginButton onClick={showLogin ? handleMode : toggleLoginVisible} $expanded={showLogin}>
            <StyledLoginButtonText $showSubmitModeTransition={showSubmitModeTransition}>{submitMode == "login" ? "Login" : "Register"}</StyledLoginButtonText>
          </StyledLoginButton>
        </StyledLoginButtonWrapper>
      </StyledLoginWrapper>

      <StyledNewUserWrapper $visible={showLogin}>
        <StyledNewUserButton onClick={toggleSubmitMode} $expanded={showLogin}>
          New User?
          <StyledNewUserIcon $shadow={true}/>
        </StyledNewUserButton>
      </StyledNewUserWrapper>
    </StyledContentWrapper>
  )
}

export default Login