import type { ComponentType, SVGProps } from 'react';
import styled, { keyframes, css } from 'styled-components';

import LoginIcon from "../../assets/icons/login.svg?react";
import PasswordIcon from "../../assets/icons/password.svg?react";
import EyeIcon from "../../assets/icons/eye.svg?react";
import NewUserIcon from "../../assets/icons/new.svg?react";

type StyledLoginButton = {
  $expanded: boolean
}

export const StyledContentWrapper = styled.div<{ $expanded : boolean, $showLoginOutro : boolean }>`
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

export const StyledMessageText = styled.div<{ $showMessageText : boolean }>`
  position: absolute;
  top: 1.8rem;
  left: 3rem;
  height: 1rem;
  width: calc(100% - 6rem);
  font-size: 1rem;
  opacity: 0.8;
`;

export const StyledLoginWrapper = styled.div`
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

export const StyledFieldsWrapper = styled.div<{$visible: boolean}>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transform-origin: top;
  transform: ${({ $visible }) => $visible ? "scaleY(1)" : "scaleY(0)"};
  transition: transform 0.8s ease;
`

export const StyledField = styled.div<{$visible: boolean}>`
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

export const StyledInput = styled.input`
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

export const StyledLoginIcon = createStyledIcon(LoginIcon);
export const StyledPasswordIcon = createStyledIcon(PasswordIcon);
export const StyledEyeIcon = createStyledIcon(EyeIcon);
export const StyledNewUserIcon = createStyledIcon(NewUserIcon);

// Avoiding relayouts by using wrapper preset to max button width
export const StyledLoginButtonWrapper = styled.div<StyledLoginButton>`
  margin-top: ${({ $expanded }) => $expanded ? "10px" : "0px"};
  display: flex;
  justify-content: center;
  height: fit-content;
  width: fit-content;

  transition: transform 0.8s ease;
`

export const StyledLoginButton = styled.button<StyledLoginButton>`
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

export const StyledLoginButtonText = styled.p<{ $showSubmitModeTransition : boolean }>`
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

export const StyledNewUserWrapper = styled.div<{ $visible : boolean}>`
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

export const StyledNewUserButton = styled.button<{ $expanded : boolean }>`
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
