import styled, { keyframes } from 'styled-components';

const scroll = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(50%);
  }
`;

const MarqueeWrapper = styled.div`
  position: absolute;
  bottom: 6dvh;
  left: -200dvw;
  height: 20dvh;
  width: 400dvw;
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

const MarqueePortraitsContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  
  will-change: transform;
  animation: ${scroll} 20s linear infinite;
`;

const MarqueePortrait = styled.div<{ $value : number, $src : string}>`
  height: 100%;
  width: calc(200dvw / 20);
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

const HorizontalMarquee = () => {

  return (
    <MarqueeWrapper>
      <MarqueePortraitsContainer>
          {Array.from({ length: 20 }, (_, i) => (
            <MarqueePortrait key={i} $value={i} $src={`/images/horizontal_marquee/${i}.jpg`}/>
          ))}
          {Array.from({ length: 20 }, (_, i) => (
            <MarqueePortrait key={i + 20} $value={i} $src={`/images/horizontal_marquee/${i}.jpg`}/>
          ))}
      </MarqueePortraitsContainer>
    </MarqueeWrapper>
  );
}

export default HorizontalMarquee