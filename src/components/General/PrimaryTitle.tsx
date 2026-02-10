import styled, { keyframes } from 'styled-components';

type PrimaryTitleProps = {
  children?: string
  fontSize?: string | number
  shadow?: number
  primaryColour?: string
  secondaryColour?: string
}

const slidingBackground = keyframes`
  0%, 100% {
    background-position: 0 40%;
  }

  50% {
    background-position: 100% 40%;
  }
`;

const StyledTitleWrapper = styled.div`
  background: url("https://images.unsplash.com/photo-1452697620382-f6543ead73b5") no-repeat left / 120%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100dvh;
  width: 100dvw;

  animation: ${slidingBackground} 40s linear infinite;
`;

const generateTextShadow = (layers: number, color: string) =>
  Array.from({ length: layers }, (_, i) => {
    const offset = i + 1;
    return `${offset}px ${offset}px ${color}`;
  }).join(", ");

const StyledTitle = styled.h1<PrimaryTitleProps>`
  background: ${({ primaryColour }) => primaryColour};
  color: ${({ primaryColour }) => primaryColour};
  font-family: "Montserrat", sans-serif;
  font-size: ${({ fontSize }) => fontSize};
  letter-spacing: 1vw;
  margin: 0;
  mix-blend-mode: lighten;
  text-transform: uppercase;
  text-shadow: ${({ shadow, secondaryColour }) => 
    `0 0 0px, ${generateTextShadow(Number(shadow), secondaryColour || 'black')}`};

  &:before {
    color: ${({ primaryColour }) => primaryColour};
    content: attr(data-text);
    margin-left: -1%;
    margin-top: -1%;
    position: absolute;
  }
`;

const PrimaryTitle = ({ children, fontSize, shadow, primaryColour, secondaryColour } : PrimaryTitleProps) => {
  return (
    <StyledTitleWrapper>
      <StyledTitle fontSize={fontSize} shadow={shadow} primaryColour={primaryColour} secondaryColour={secondaryColour}>
        {children}
      </StyledTitle>
    </StyledTitleWrapper>
  )
}

export default PrimaryTitle