import styled from 'styled-components';
import type { ComponentType, SVGProps } from 'react';

import CancelIcon from "../../assets/icons/cancel.svg?react";
import CopyIcon from "../../assets/icons/copy.svg?react";

const StyledMainContainer = styled.div<{height?: string, width?: string}>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${({ height }) => height || "100%"};
  width: ${({ width }) => width || "100%"};
`;

const StyledTextContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
  width: 80%;
  background-color: #f1f1f1;
  padding: 0.8rem 1rem 0.6rem 1rem;
  border-radius: 0.4rem;
  gap: 1rem;
  flex: 1;

  /* overflow-x: auto; */
`

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

const StyledCancelIcon = createStyledIcon(CancelIcon);
const StyledCopyIcon = createStyledIcon(CopyIcon);

type FlexboxContainerProps = {
  height?: string
  width?: string
  text: string
  closeAction: (value: boolean) => void;
}

const PopUp = ({ height, width, text, closeAction } : FlexboxContainerProps) => {
  return (
    <StyledMainContainer height={height} width={width}>
      <StyledTextContainer>
        <StyledCancelIcon $size="20px" onClick={() => closeAction(false)}/>
        {text}
        <StyledCopyIcon $size="23px" onClick={() => navigator.clipboard.writeText(text)}/>
      </StyledTextContainer>
    </StyledMainContainer>
  )
}

export default PopUp
