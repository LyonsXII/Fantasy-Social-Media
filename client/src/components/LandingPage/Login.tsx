import { useState, useEffect } from 'react';
import axios from "axios";

import { StyledContentWrapper, StyledMessageText, StyledLoginWrapper, StyledFieldsWrapper, StyledField, StyledInput, StyledLoginButtonWrapper, StyledLoginButton, StyledLoginButtonText, StyledNewUserWrapper, StyledNewUserButton, StyledLoginIcon, StyledPasswordIcon, StyledEyeIcon, StyledNewUserIcon } from './Login.styles';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

type LoginProps = {
  login: string;
  password: string;
};

export interface LoginRouteProps {
  handleLogin: (token: string) => void;
}

const Login = ({ handleLogin } : LoginRouteProps) => {
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [showLoginOutro, setShowLoginOutro] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [submitMode, setSubmitMode] = useState<"login" | "register">("login");
  const [showSubmitModeTransition, setShowSubmitModeTransition] = useState<boolean>(false);
  const [messageText, setMessageText] = useState<string>("");
  const [showMessageText, setShowMessageText] = useState<boolean>(false);

  const [details, setDetails] = useState<LoginProps>({ 
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
      handleLogin(response.data.token);

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
        setShowSubmitModeTransition(false);
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
            <StyledInput type={passwordVisible ? "text" : "password"} name="password" value={details.password} placeholder="Password" onChange={((e) => updateField("password", e.target.value))}/>
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