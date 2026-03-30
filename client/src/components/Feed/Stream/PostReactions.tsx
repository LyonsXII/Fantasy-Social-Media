import styled from 'styled-components';

import { StyledAghastIcon, StyledAngryIcon, StyledAstonishedIcon, StyledBandageIcon, StyledBoredIcon, StyledClownIcon, StyledCryingIcon, StyledDizzyIcon, StyledDowncastIcon, StyledExplodeIcon, StyledHeartEyesIcon, StyledHeavyCryingIcon, StyledLaughingIcon, StyledPuppyEyesIcon, StyledSadIcon, StyledShockedIcon, StyledSkepticalIcon, StyledSleepingIcon, StyledSmileIcon, StyledWinkIcon, StyledWorriedIcon, StyledZipperIcon } from './EmojiBar.tsx';

import type { EmojiKey, EmojiEntry } from './Stream';

const StyledMainContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  flex-wrap: wrap;
  height: fit-content;
  flex-shrink: 0;
  width: 80%;
  padding: 0.2rem 1rem;
  gap: 0.2rem;
`;

const StyledReactionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 0.8rem;
`;

const StyledReactionText = styled.p`
  font-size: 1.2rem;
  margin-left: -0.6rem;
  user-select: none;
`;

type PostReactionsProps = {
  emojiCounts: EmojiEntry[]
}

const PostReactions = ({ emojiCounts } : PostReactionsProps) => {
  const emojiIconMap: Record<EmojiKey, React.ComponentType<any>> = {
    aghast: StyledAghastIcon,
    angry: StyledAngryIcon,
    astonished: StyledAstonishedIcon,
    bandage: StyledBandageIcon,
    bored: StyledBoredIcon,
    clown: StyledClownIcon,
    crying: StyledCryingIcon,
    dizzy: StyledDizzyIcon,
    downcast: StyledDowncastIcon,
    explode: StyledExplodeIcon,
    heartEyes: StyledHeartEyesIcon,
    heavyCrying: StyledHeavyCryingIcon,
    laughing: StyledLaughingIcon,
    puppyEyes: StyledPuppyEyesIcon,
    sad: StyledSadIcon,
    shocked: StyledShockedIcon,
    skeptical: StyledSkepticalIcon,
    sleeping: StyledSleepingIcon,
    smile: StyledSmileIcon,
    wink: StyledWinkIcon,
    worried: StyledWorriedIcon,
    zipper: StyledZipperIcon
  };

  return (
    <StyledMainContainer>
      {emojiCounts.map(({ reaction, count }) => {
        const Icon = emojiIconMap[reaction];

        if (!Icon) return null;

        return (
          <StyledReactionContainer key={reaction}>
            <Icon/>
            <StyledReactionText>
              x{count}
            </StyledReactionText>
          </StyledReactionContainer>
        );
      })}
    </StyledMainContainer>
  )
};

export default PostReactions
