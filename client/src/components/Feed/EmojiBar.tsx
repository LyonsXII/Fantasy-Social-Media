import styled from 'styled-components';
import type { ComponentType, SVGProps } from 'react';

import SmileIcon from "../../assets/icons/emojis/smile.svg?react";
import WinkIcon from "../../assets/icons/emojis/wink.svg?react";
import WorriedIcon from "../../assets/icons/emojis/worried.svg?react";
import SadIcon from "../../assets/icons/emojis/sad.svg?react";
import AstonishedIcon from "../../assets/icons/emojis/astonished.svg?react";
import AngryIcon from "../../assets/icons/emojis/angry.svg?react";
import ZipperIcon from "../../assets/icons/emojis/zipper.svg?react";
import ClownIcon from "../../assets/icons/emojis/clown.svg?react";
import CryingIcon from "../../assets/icons/emojis/crying.svg?react";
import DowncastIcon from "../../assets/icons/emojis/downcast.svg?react";

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
  gap: 0.8rem;
`;

const createStyledIcon = (IconComponent: ComponentType<SVGProps<SVGSVGElement>>) => styled(IconComponent)`
  height: 2.8rem;
  width: 2.8rem;
  cursor: pointer;
  vertical-align: bottom;

  transition: transform 0.4s ease;

  &:hover {
    transform: scale(1.1);
  }
`

const StyledSmileIcon = createStyledIcon(SmileIcon);
const StyledWinkIcon = createStyledIcon(WinkIcon);
const StyledWorriedIcon = createStyledIcon(WorriedIcon);
const StyledSadIcon = createStyledIcon(SadIcon);
const StyledAstonishedIcon = createStyledIcon(AstonishedIcon);
const StyledAngryIcon = createStyledIcon(AngryIcon);
const StyledZipperIcon = createStyledIcon(ZipperIcon);
const StyledClownIcon = createStyledIcon(ClownIcon);
const StyledCryingIcon = createStyledIcon(CryingIcon);
const StyledDowncastIcon = createStyledIcon(DowncastIcon);

const EmojiBar = () => {

  return (
    <StyledActionBar>
      <StyledActionBarIconContainer>
        <StyledSmileIcon/>
      </StyledActionBarIconContainer>

      <StyledActionBarIconContainer>
        <StyledWinkIcon/>
      </StyledActionBarIconContainer>

      <StyledActionBarIconContainer>
        <StyledWorriedIcon/>
      </StyledActionBarIconContainer>

      <StyledActionBarIconContainer>
        <StyledSadIcon/>
      </StyledActionBarIconContainer>

      <StyledActionBarIconContainer>
        <StyledAstonishedIcon/>
      </StyledActionBarIconContainer>

      <StyledActionBarIconContainer>
        <StyledAngryIcon/>
      </StyledActionBarIconContainer>

      <StyledActionBarIconContainer>
        <StyledZipperIcon/>
      </StyledActionBarIconContainer>

      <StyledActionBarIconContainer>
        <StyledClownIcon/>
      </StyledActionBarIconContainer>

      <StyledActionBarIconContainer>
        <StyledCryingIcon/>
      </StyledActionBarIconContainer>

      <StyledActionBarIconContainer>
        <StyledDowncastIcon/>
      </StyledActionBarIconContainer>
    </StyledActionBar>
  )
};

export default EmojiBar
