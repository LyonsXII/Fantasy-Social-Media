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
  left: -100dvw;
  height: 20dvh;
  width: 200dvw;
  border-top: 2px solid black;
  border-bottom: 2px solid black;
`;

const MarqueePortraitsContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  animation: ${scroll} 10s linear infinite;
`;

const MarqueePortrait = styled.div<{ $value : number, $src : string}>`
  height: 100%;
  width: calc(200dvw / 10);
  background-image: ${({ $src }) => `url(${$src})`};
  background-size: cover;         /* make image cover the div */
  background-position: top;    /* keep the focal point centered */
  background-repeat: no-repeat;   /* prevent tiling */
  box-shadow: 
    inset 0 0 50px rgba(0, 0, 0, 1),
    inset 0 0 20px rgba(0, 0, 0, 0.8);
  filter: brightness(0.95) contrast(1.2) saturate(1.5);
`;

const HorizontalMarquee = () => {

  return (
    <MarqueeWrapper>
      <MarqueePortraitsContainer>
          {Array.from({ length: 20 }, (_, i) => (
            <MarqueePortrait key={i} $value={i} $src={`/images/horizontal_marquee/${i}.jpg`}/>
          ))}
      </MarqueePortraitsContainer>
    </MarqueeWrapper>
  );
}

export default HorizontalMarquee