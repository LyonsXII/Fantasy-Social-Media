import styled, { keyframes } from 'styled-components';

type StyledLetterProps = {
  children: string
  $position: number
  $fontSize?: string
  $backgroundImage?: string
  $backgroundSize?: string
}

type StyledLetterBoxProps = {
  $position: number
  $spaces: number[]
}

type PrimaryTitleProps = {
  children: string
  $fontSize?: string
  $backgroundImage?: string
  $backgroundSize?: string
}

const StyledTitleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0px;
`;

// const StyledTitle = styled.h1<PrimaryTitleProps>`
//   position: relative;
//   font-size: ${({ $fontSize }) => $fontSize};
//   text-transform: uppercase;
//   text-align: center;

//   color: black;
//   @supports (background-clip: text) or (-webkit-background-clip: text) {
//     background-image: 
//       linear-gradient(0deg, rgba(28, 23, 158, 0.3), rgba(41, 219, 210, 0.1)), 
//       url("${({ $backgroundImage }) => $backgroundImage}");
//     background-size: ${({ $backgroundSize }) => $backgroundSize};
//     background-position: center;

//     color: transparent;
//     -webkit-background-clip: text;
//     background-clip: text;
//     -webkit-text-stroke: 1px white;

//     animation: slideBG 10s linear infinite;

//     @keyframes slideBG {
//       0% { background-position: 0 0; }
//       50% { background-position: 100% 50%; }
//       100% { background-position: 0 0; }
//     }
//   }

//   // Separate shadow on lower z-index, preventing issue with transparent text effect
//   &::before{
//     content: attr(data-text);
//     position: absolute;
//     top: 0; left: 0;
//     width: 100%; height: 100%;
//     color: transparent;
//     z-index: -1; /* behind the real text */
//     text-shadow: 2px 2px 5px rgba(0,0,0,0.5); /* solid shadow behind letters */
//   }
// `;

const wave = keyframes`
  0%, 100% { transform: translateY(0); }
  25% { transform: translateY(10px); }
  75% { transform: translateY(-10px); }
`;

const StyledLetterBox = styled.div<StyledLetterBoxProps>`
  width: fit-content;
  margin-right: ${({ $position, $spaces }) => $spaces.includes($position) ? "20px" : "0px"};

  animation: ${wave} 0.7s ease-in-out;
  animation-delay: ${({ $position }) => `${$position * 0.1}s`};
`;

const StyledLetter = styled.h1<StyledLetterProps>`
  position: relative;
  font-size: ${({ $fontSize }) => $fontSize};
  text-transform: uppercase;

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
    width: 100%; height: 100%;
    color: transparent;
    z-index: -1;
    text-shadow: 2px 2px 5px rgba(0,0,0,0.5);
  }
`;

// Main title, includes animated background
const PrimaryTitle = ({ children, $fontSize, $backgroundImage, $backgroundSize } : PrimaryTitleProps) => {
  let spaces = [];
  for (let i = 0; i < children.length; i++) {
    if (children[i] == " ") {
      spaces.push(i)
    }
  }
  console.log(spaces);

  return (
    <StyledTitleWrapper>
      {children.split("").map((char, i) => (
        <StyledLetterBox key={i} $position={i} $spaces={spaces}>
          <StyledLetter key={i} $position={i} data-text={char}  $fontSize={$fontSize} $backgroundImage={$backgroundImage} $backgroundSize={$backgroundSize}>
            {char}
          </StyledLetter>
        </StyledLetterBox>
      ))}
    </StyledTitleWrapper>

  );
}

export default PrimaryTitle