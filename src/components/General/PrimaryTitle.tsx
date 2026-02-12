import styled from 'styled-components';

type PrimaryTitleProps = {
  children?: string
  $fontSize?: string
  $backgroundImage?: string
  $backgroundSize?: string
}

const StyledTitle = styled.h1<PrimaryTitleProps>`
  position: relative;
  font-size: ${({ $fontSize }) => $fontSize};
  text-transform: uppercase;
  text-align: center;

  color: black;
  @supports (background-clip: text) or (-webkit-background-clip: text) {
    background-image: 
      linear-gradient(0deg, rgba(28, 23, 158, 0.3), rgba(41, 219, 210, 0.1)), 
      url("${({ $backgroundImage }) => $backgroundImage}");
    background-size: ${({ $backgroundSize }) => $backgroundSize};
    background-position: center;

    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-stroke: 1px white;

    animation: slideBG 10s linear infinite;

    @keyframes slideBG {
      0% { background-position: 0 0; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0 0; }
    }
  }

  // Separate shadow on lower z-index, preventing issue with transparent text effect
  &::before{
    content: attr(data-text);
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    color: transparent;
    z-index: -1; /* behind the real text */
    text-shadow: 2px 2px 5px rgba(0,0,0,0.5); /* solid shadow behind letters */
  }
`;

// Main title, includes animated background
const PrimaryTitle = ({ children, $fontSize, $backgroundImage, $backgroundSize } : PrimaryTitleProps) => {
  return (
    <StyledTitle data-text={children} $fontSize={$fontSize} $backgroundImage={$backgroundImage} $backgroundSize={$backgroundSize}>
      {children}
    </StyledTitle>
  );
}

export default PrimaryTitle