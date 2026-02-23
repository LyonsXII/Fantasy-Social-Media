import styled from 'styled-components';
import { useState } from 'react';
import type { ComponentType, SVGProps } from 'react';

import RepliesIcon from "../../assets/icons/replies.svg?react";
import ShareIcon from "../../assets/icons/share.svg?react";
import FavouriteIcon from "../../assets/icons/favourite.svg?react";
import EmojiIcon from "../../assets/icons/emoji.svg?react";
import LikeIcon from "../../assets/icons/like.svg?react";
import DisikeIcon from "../../assets/icons/dislike.svg?react";

const StyledMainContainer = styled.div`
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  height: fit-content;
  width: 100%;
  gap: 0.6rem;

  background: white;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.06);

  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('/images/Patina.jpg') no-repeat center / cover;
    opacity: 0.2;
    z-index: -1;
  }

  transition: box-shadow 0.2s ease;
  cursor: pointer;
  &:hover {
    box-shadow: 4px 4px 4px rgba(0,0,0,0.2);
}
`;

const StyledUserIcon = styled.div`
  height: 6rem;
  width: 6rem;
  border-radius: 100%;
  margin-right: 1.2rem;
  background: url('/images/marquee/2.jpg') center / cover no-repeat;
  box-shadow: 0 0.2em 0.2em rgba(0, 0, 0, 0.4);
  cursor: pointer;

  transition: transform 0.4s ease;
  &:hover {
    transform: scale(1.04);
  }
`;

const StyledContentContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 1.6rem 1.6rem 0rem 1.6rem;
`;

const StyledTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.2rem;
`;

const StyledCharacterName = styled.h3`
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
`;

const StyledPostText = styled.p`
  font-size: 1rem;
  color: rgba(0,0,0,0.8);
`;

const StyledActionBar = styled.div`
  display: flex;
  justify-content: space-around;
  height: 4rem;
  width: 100%;
`;

const StyledActionBarIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 0.3rem;
`;

const StyledActionBarText = styled.p`
  font-size: 1.2rem;
`;

const createStyledIcon = (IconComponent: ComponentType<SVGProps<SVGSVGElement>>) => styled(IconComponent)<{ $active?: boolean}>`
  height: 1.6rem;
  width: 1.6rem;
  cursor: pointer;
  vertical-align: bottom;
  color: ${({ $active }) => ($active ? "#3b82f6" : "black")};

  transition: transform 0.4s ease, color 0.25s ease;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.8);
  }
`

const StyledRepliesIcon = createStyledIcon(RepliesIcon);
const StyledShareIcon = createStyledIcon(ShareIcon);
const StyledFavouriteIcon = createStyledIcon(FavouriteIcon);
const StyledEmojiIcon = createStyledIcon(EmojiIcon);
const StyledLikeIcon = createStyledIcon(LikeIcon);
const StyledDislikeIcon = createStyledIcon(DisikeIcon);

const Post = () => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  return (
    <StyledMainContainer>
      <StyledContentContainer>
        <StyledUserIcon/>
        <StyledTextContainer>
          <StyledCharacterName>
            Rand Al'Thor
          </StyledCharacterName>
          <StyledPostText>
            Sorry guys, that got a little bit out of hand!<br/>
            I'm feeling a lot better now.<br/>
          </StyledPostText>
        </StyledTextContainer>
      </StyledContentContainer>
      <StyledActionBar>
        <StyledActionBarIconContainer>
          <StyledRepliesIcon/>
          <StyledActionBarText>
            12
          </StyledActionBarText>
        </StyledActionBarIconContainer>
        <StyledActionBarIconContainer>
          <StyledShareIcon/>
        </StyledActionBarIconContainer>
        <StyledActionBarIconContainer>
          <StyledFavouriteIcon/>
        </StyledActionBarIconContainer>
        <StyledActionBarIconContainer>
          <StyledEmojiIcon/>
        </StyledActionBarIconContainer>
        <StyledActionBarIconContainer>
          <StyledLikeIcon $active={liked} onClick={() => setLiked(prev => !prev)}/>
          <StyledDislikeIcon $active={disliked} onClick={() => setDisliked(prev => !prev)}/>
        </StyledActionBarIconContainer>
      </StyledActionBar>
    </StyledMainContainer>
  )
}

export default Post
