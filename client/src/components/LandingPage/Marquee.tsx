import styled, { keyframes } from 'styled-components';

type MarqueeProps = {
  $direction: string
  $length: number
}

const scrollHorizontal = keyframes`
  0%   { transform: translateX(0); }
  100% { transform: translateX(50%); }
`;

const scrollVertical = keyframes`
  0%   { transform: translateY(0); }
  100% { transform: translateY(50%); }
`;

const MarqueeWrapper = styled.div<{ $direction? : string }>`
  position: absolute;

  ${({ $direction })  => $direction == "horizontal" &&
    `left: -200dvw;
    bottom: 6dvh;`
  };
  ${({ $direction })  => $direction == "vertical" &&
    `top: -200dvh;
     right: 5.5dvw;`
  };

  height: ${({ $direction }) => $direction == "horizontal" ? "20dvh" : "400dvh"};
  width: ${({ $direction }) => $direction == "horizontal" ? "400dvw" : "28dvw"};
  border-top: 2px solid black;
  border-bottom: 2px solid black;
  box-shadow: 0 0px 20px rgba(0, 0, 0, 1),
    0 0px 20px rgba(0, 0, 0, 1),
    0 0px 20px rgba(0, 0, 0, 1),
    0 0px 10px rgba(0, 0, 0, 1),
    0 0px 10px rgba(0, 0, 0, 1),
    0 0px 10px rgba(0, 0, 0, 1),
    0 0px 10px rgba(0, 0, 0, 1),
    0 0px 10px rgba(0, 0, 0, 1);
`;

const MarqueePortraitsContainer = styled.div<{ $direction? : string }>`
  display: flex;
  flex-direction: ${({ $direction }) => $direction == "horizontal" ? "row" : "column"};
  height: 100%;
  width: 100%;
  
  will-change: transform;
  animation: ${({ $direction }) =>
    $direction === "horizontal"
      ? scrollHorizontal
      : scrollVertical}
    20s linear infinite;
`;

const MarqueePortrait = styled.div<{ $direction : string, $value : number, $src : string}>`
  height: ${({ $direction }) => $direction == "horizontal" ? "100%" : "40dvh"};
  width: ${({ $direction }) => $direction == "horizontal" ? "calc(200dvw / 20)" : "100%"};
  background-image: ${({ $src }) => `url(${$src})`};
  background-size: cover;
  background-position: top;
  background-repeat: no-repeat;
  box-shadow: 
    inset 0 0 50px rgba(0, 0, 0, 5),
    inset 0 0 50px rgba(0, 0, 0, 7),
    inset 0 0 40px rgba(0, 0, 0, 0.7),
    inset 0 0 20px rgba(0, 0, 0, 0.6),
    inset 0 0 20px rgba(0, 0, 0, 0.6);
  filter: brightness(0.95) contrast(1.2) saturate(1.5);
`;

const Marquee = ({ $direction, $length } : MarqueeProps) => {

  return (
    <MarqueeWrapper $direction={$direction}>
      <MarqueePortraitsContainer $direction={$direction}>
          {Array.from({ length: $length }, (_, i) => (
            <MarqueePortrait key={i} $value={i} $direction={$direction} $src={`/images/horizontal_marquee/${i}.jpg`}/>
          ))}
          {Array.from({ length: $length }, (_, i) => (
            <MarqueePortrait key={i + $length} $value={i} $direction={$direction} $src={`/images/horizontal_marquee/${i}.jpg`}/>
          ))}
      </MarqueePortraitsContainer>
    </MarqueeWrapper>
  );
}

export default Marquee