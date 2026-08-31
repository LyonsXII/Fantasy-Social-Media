import styled from 'styled-components';
import { useState, useEffect } from 'react';
import type { ComponentType, SVGProps } from 'react';

import ShareIcon from "../../assets/icons/share.svg?react";
import CancelIcon from "../../assets/icons/cancel.svg?react";
import CopyIcon from "../../assets/icons/copy.svg?react";

const StyledMainContainer = styled.div<{height?: string, width?: string,  $expanded?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${({ height }) => height || "100%"};
  width: ${({ width }) => width || "100%"};
  /* gap: ${({ $expanded }) => $expanded ? "3rem" : "0rem"}; */

  transition: gap 1s ease;
`;

const StyledClickableIcon = styled.div<{ $expanded?: boolean }>`
  display: inline-flex;
  max-width: ${({ $expanded }) => $expanded ? "40px" : "0"};
  opacity: ${({ $expanded }) => $expanded ? "1" : "0"};
  cursor: pointer;
  overflow: hidden;
  margin-right: 10px;

  transition: max-width 1s ease,  0.5s ease;

  & > svg {
    transition: transform 0.4s ease;
  }

  &:hover > svg {
    transform: scale(1.1);
  }

  &:active > svg {
    transform: scale(0.2);
  }
`;

const StyledTextContainer = styled.div<{ $expanded?: boolean }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
  width: 80%;
  max-width: ${({ $expanded }) => $expanded ? "400px" : "0px"};
  opacity: ${({ $expanded }) => $expanded ? "1" : "0"};
  flex: 1;
  background-color: #f1f1f1;
  padding: ${({ $expanded }) => $expanded ? "0.8rem 1rem 0.6rem 1rem" : "0.8rem 0rem 0.6rem 0rem"};
  border-radius: 0.4rem;
  gap: 1rem;

  transition: max-width 1s ease, paddding 1s ease,  1s ease;

  overflow: hidden;
`
// Literally just here to stop the flexbox centering for the two text items from being different since the message text is absolute and ignores padding / gap, so there's a slight positioning difference
const StyledTextArea = styled.div`
  position: relative;

  flex: 1;
  min-width: 0;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledLink = styled.a`
  text-decoration: none;
  color: inherit;

  &:visited,
  &:hover,
  &:active {
    color: inherit;
    text-decoration: none;
  }
`

const StyledLinkText = styled.p<{ $visible: boolean }>`
  opacity: ${({ $visible }) => $visible ? 1 : 0};
  transition: opacity 0.3s ease;
`

const StyledMessageText = styled.p<{ $visible: boolean }>`
  position: absolute;
  inset: 0;

  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;

  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const createStyledIcon = (IconComponent: ComponentType<SVGProps<SVGSVGElement>>) => styled(IconComponent)<{ $size?: string, $marginLeft?: string }>`
  height: ${({ $size }) => $size ? $size : "2.4rem"};
  width: ${({ $size }) => $size ? $size : "2.4rem"};
  margin-left: ${({ $marginLeft }) => $marginLeft ? $marginLeft : "0"};
  cursor: pointer;
  vertical-align: bottom;
  flex-shrink: 0;
  /* border: 1px solid red; */

  transition: transform 0.4s ease;

  &:hover {
    transform: scale(1.1);
  }
`

const StyledShareIcon = createStyledIcon(ShareIcon);
const StyledCancelIcon = createStyledIcon(CancelIcon);
const StyledCopyIcon = createStyledIcon(CopyIcon);

type FlexboxContainerProps = {
  height?: string
  width?: string
  text: string
  shareExpanded: boolean;
  setShareExpanded: (value: boolean) => void;
}

const PopUp = ({ height, width, text, shareExpanded, setShareExpanded } : FlexboxContainerProps) => {
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    if (showCopied) {
      setTimeout(() => {
        setShowCopied(false);
      }, 2000);
    }
  }, [showCopied])

  return (
    <StyledMainContainer height={height} width={width} $expanded={shareExpanded}>
      <StyledClickableIcon $expanded={!shareExpanded} onClick={() => {setShareExpanded(true)}}>
        <StyledShareIcon $size="1.6rem"/>
      </StyledClickableIcon>

      <StyledTextContainer $expanded={shareExpanded}>
        <StyledCancelIcon $size="20px" onClick={() => setShareExpanded(false)}/>

        <StyledTextArea>
          <StyledLink href={text}>
            <StyledLinkText $visible={!showCopied}>
              {text}
            </StyledLinkText>
          </StyledLink>
          <StyledMessageText $visible={showCopied}>
            Copied!
          </StyledMessageText>
        </StyledTextArea>

        <StyledCopyIcon 
          $size="23px" 
          onClick={() => {
            navigator.clipboard.writeText(text);
            setShowCopied(true);
          }}/>
      </StyledTextContainer>
    </StyledMainContainer>
  )
}

export default PopUp
