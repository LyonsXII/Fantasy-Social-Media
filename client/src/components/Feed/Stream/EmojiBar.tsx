import styled from 'styled-components';
import type { ComponentType, SVGProps } from 'react';

import type { ReactionType } from './PostActions';

import SmileIcon from "../../../assets/icons/emojis/smile.svg?react";
import WinkIcon from "../../../assets/icons/emojis/wink.svg?react";
import WorriedIcon from "../../../assets/icons/emojis/worried.svg?react";
import BoredIcon from "../../../assets/icons/emojis/bored.svg?react";
import SadIcon from "../../../assets/icons/emojis/sad.svg?react";
import AstonishedIcon from "../../../assets/icons/emojis/astonished.svg?react";
import AngryIcon from "../../../assets/icons/emojis/angry.svg?react";
import ZipperIcon from "../../../assets/icons/emojis/zipper.svg?react";
import ClownIcon from "../../../assets/icons/emojis/clown.svg?react";
import CryingIcon from "../../../assets/icons/emojis/crying.svg?react";
import DowncastIcon from "../../../assets/icons/emojis/downcast.svg?react";
import DizzyIcon from "../../../assets/icons/emojis/dizzy.svg?react";
import ExplodeIcon from "../../../assets/icons/emojis/explode.svg?react";
import BandageIcon from "../../../assets/icons/emojis/bandage.svg?react";
import AghastIcon from "../../../assets/icons/emojis/aghast.svg?react";
import ShockedIcon from "../../../assets/icons/emojis/shocked.svg?react";
import SkepticalIcon from "../../../assets/icons/emojis/skeptical.svg?react";
import HeavyCryingIcon from "../../../assets/icons/emojis/heavyCrying.svg?react";
import PuppyEyesIcon from "../../../assets/icons/emojis/puppyEyes.svg?react";
import LaughingIcon from "../../../assets/icons/emojis/laughing.svg?react";
import SleepingIcon from "../../../assets/icons/emojis/sleeping.svg?react";
import HeartEyesIcon from "../../../assets/icons/emojis/heartEyes.svg?react";
import CancelIcon from "../../../assets/icons/cancel.svg?react";

const StyledActionBar = styled.div`
  display: flex;
  justify-content: center;
  height: 4rem;
  width: 100%;
`;

const StyledActionBarIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 1rem;
`;

const createStyledIcon = (IconComponent: ComponentType<SVGProps<SVGSVGElement>>) => styled(IconComponent)<{ $size?: string, $marginLeft?: string }>`
  height: ${({ $size }) => $size ? $size : "2.4rem"};
  width: ${({ $size }) => $size ? $size : "2.4rem"};
  margin-left: ${({ $marginLeft }) => $marginLeft ? $marginLeft : "0"};
  cursor: pointer;
  vertical-align: bottom;

  transition: transform 0.4s ease;

  &:hover {
    transform: scale(1.05);
  }
`

export const StyledSmileIcon = createStyledIcon(SmileIcon);
export const StyledWinkIcon = createStyledIcon(WinkIcon);
export const StyledWorriedIcon = createStyledIcon(WorriedIcon);
export const StyledBoredIcon = createStyledIcon(BoredIcon);
export const StyledSadIcon = createStyledIcon(SadIcon);
export const StyledAstonishedIcon = createStyledIcon(AstonishedIcon);
export const StyledAngryIcon = createStyledIcon(AngryIcon);
export const StyledZipperIcon = createStyledIcon(ZipperIcon);
export const StyledClownIcon = createStyledIcon(ClownIcon);
export const StyledCryingIcon = createStyledIcon(CryingIcon);
export const StyledDowncastIcon = createStyledIcon(DowncastIcon);
export const StyledDizzyIcon = createStyledIcon(DizzyIcon);
export const StyledExplodeIcon = createStyledIcon(ExplodeIcon);
export const StyledBandageIcon = createStyledIcon(BandageIcon);
export const StyledAghastIcon = createStyledIcon(AghastIcon);
export const StyledShockedIcon = createStyledIcon(ShockedIcon);
export const StyledSkepticalIcon = createStyledIcon(SkepticalIcon);
export const StyledHeavyCryingIcon = createStyledIcon(HeavyCryingIcon);
export const StyledPuppyEyesIcon = createStyledIcon(PuppyEyesIcon);
export const StyledLaughingIcon = createStyledIcon(LaughingIcon);
export const StyledSleepingIcon = createStyledIcon(SleepingIcon);
export const StyledHeartEyesIcon = createStyledIcon(HeartEyesIcon);
export const StyledCancelIcon = createStyledIcon(CancelIcon);

type EmojiBarProps = {
  currentEmojiReaction: string;
  reactToPost: (reactionType: ReactionType, reactionValue: string) => void;
  setEmojiExpanded: (value: boolean) => void;
  setEmojied: (value: boolean) => void;
}

const EmojiBar = ({ currentEmojiReaction, reactToPost, setEmojiExpanded, setEmojied } : EmojiBarProps) => {

  function handleEmojiSelect(emojiType: string) {
    reactToPost("emoji", emojiType);
    if (currentEmojiReaction == emojiType) {
      setEmojied(false);
    } else if (!currentEmojiReaction) {
      setEmojied(true);
    }
    setEmojiExpanded(false);
  }

  return (
    <StyledActionBar>
      <StyledActionBarIconContainer>
        <StyledSmileIcon onClick={() => {handleEmojiSelect("smile")}}/>
      </StyledActionBarIconContainer>

      <StyledActionBarIconContainer>
        <StyledWinkIcon onClick={() => {handleEmojiSelect("wink")}}/>
      </StyledActionBarIconContainer>

      <StyledActionBarIconContainer>
        <StyledWorriedIcon onClick={() => {handleEmojiSelect("worried")}}/>
      </StyledActionBarIconContainer>

      <StyledActionBarIconContainer>
        <StyledBoredIcon onClick={() => {handleEmojiSelect("bored")}}/>
      </StyledActionBarIconContainer>

      <StyledActionBarIconContainer>
        <StyledSadIcon onClick={() => {handleEmojiSelect("sad")}}/>
      </StyledActionBarIconContainer>

      <StyledActionBarIconContainer>
        <StyledAstonishedIcon onClick={() => {handleEmojiSelect("astonished")}}/>
      </StyledActionBarIconContainer>

      <StyledActionBarIconContainer>
        <StyledAngryIcon onClick={() => {handleEmojiSelect("angry")}}/>
      </StyledActionBarIconContainer>

      <StyledActionBarIconContainer>
        <StyledZipperIcon onClick={() => {handleEmojiSelect("zipper")}}/>
      </StyledActionBarIconContainer>

      <StyledActionBarIconContainer>
        <StyledClownIcon onClick={() => {handleEmojiSelect("clown")}}/>
      </StyledActionBarIconContainer>

      <StyledActionBarIconContainer>
        <StyledCryingIcon onClick={() => {handleEmojiSelect("cry")}}/>
      </StyledActionBarIconContainer>

      <StyledActionBarIconContainer>
        <StyledDowncastIcon onClick={() => {handleEmojiSelect("downcast")}}/>
      </StyledActionBarIconContainer>

      <StyledActionBarIconContainer>
        <StyledDizzyIcon onClick={() => {handleEmojiSelect("dizzy")}}/>
      </StyledActionBarIconContainer>

      <StyledActionBarIconContainer>
        <StyledExplodeIcon onClick={() => {handleEmojiSelect("explode")}}/>
      </StyledActionBarIconContainer>

      <StyledActionBarIconContainer>
        <StyledBandageIcon onClick={() => {handleEmojiSelect("bandage")}}/>
      </StyledActionBarIconContainer>

      <StyledActionBarIconContainer>
        <StyledAghastIcon onClick={() => {handleEmojiSelect("aghast")}}/>
      </StyledActionBarIconContainer>

      <StyledActionBarIconContainer>
        <StyledShockedIcon onClick={() => {handleEmojiSelect("shocked")}}/>
      </StyledActionBarIconContainer>

      <StyledActionBarIconContainer>
        <StyledSkepticalIcon onClick={() => {handleEmojiSelect("skeptical")}}/>
      </StyledActionBarIconContainer>

      <StyledActionBarIconContainer>
        <StyledHeavyCryingIcon onClick={() => {handleEmojiSelect("heavyCrying")}}/>
      </StyledActionBarIconContainer>

      <StyledActionBarIconContainer>
        <StyledPuppyEyesIcon onClick={() => {handleEmojiSelect("puppyEyes")}}/>
      </StyledActionBarIconContainer>

      <StyledActionBarIconContainer>
        <StyledLaughingIcon onClick={() => {handleEmojiSelect("laughing")}}/>
      </StyledActionBarIconContainer>

      <StyledActionBarIconContainer>
        <StyledSleepingIcon onClick={() => {handleEmojiSelect("sleeping")}}/>
      </StyledActionBarIconContainer>

      <StyledActionBarIconContainer>
        <StyledHeartEyesIcon onClick={() => {handleEmojiSelect("heartEyes")}}/>
      </StyledActionBarIconContainer>

      <StyledActionBarIconContainer>
        <StyledCancelIcon $size="2rem" $marginLeft="0.2rem" onClick={() => setEmojiExpanded(false)}/>
      </StyledActionBarIconContainer>
    </StyledActionBar>
  )
};

export default EmojiBar
