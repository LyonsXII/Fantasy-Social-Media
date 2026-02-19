import styled, { keyframes } from 'styled-components';

const scroll = keyframes`
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(50%);
  }
`;

const MarqueeWrapper = styled.div`
  position: absolute;
  right: 5.5dvw;
  top: -200dvh;
  height: 400dvh;
  width: 28dvw;
  border-left: 2px solid black;
  border-right: 2px solid black;
  box-shadow: 0 0px 30px rgba(0, 0, 0, 1),
    0 0px 30px rgba(0, 0, 0, 1),
    0 0px 30px rgba(0, 0, 0, 1),
    0 0px 20px rgba(0, 0, 0, 1),
    0 0px 20px rgba(0, 0, 0, 1),
    0 0px 20px rgba(0, 0, 0, 1),
    0 0px 20px rgba(0, 0, 0, 1),
    0 0px 20px rgba(0, 0, 0, 1);
`;

const MarqueePortraitsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  will-change: transform;
  animation: ${scroll} 20s linear infinite;
`;

const MarqueePortrait = styled.div<{ $value : number, $src : string}>`
  height: 40dvh;
  min-height: 40dvh;
  width: 100%;
  background-image: ${({ $src }) => `url(${$src})`};
  background-size: cover;
  background-position: top;
  background-repeat: no-repeat;
  box-shadow:
    inset 0 0 140px rgba(0, 0, 0, 5),
    inset 0 0 100px rgba(0, 0, 0, 7),
    inset 0 0 100px rgba(0, 0, 0, 0.7),
    inset 0 0 60px rgba(0, 0, 0, 0.6),
    inset 0 0 60px rgba(0, 0, 0, 0.6);
  filter: brightness(0.95) contrast(1.2) saturate(1.5);
`;

const VerticalMarquee = () => {

  return (
    <MarqueeWrapper>
      <MarqueePortraitsContainer>
          {Array.from({ length: 5 }, (_, i) => (
            <MarqueePortrait key={i} $value={i} $src={`/images/horizontal_marquee/${i}.jpg`}/>
          ))}
          {Array.from({ length: 5 }, (_, i) => (
            <MarqueePortrait key={i + 5} $value={i} $src={`/images/horizontal_marquee/${i}.jpg`}/>
          ))}
      </MarqueePortraitsContainer>
    </MarqueeWrapper>
  );
}

export default VerticalMarquee