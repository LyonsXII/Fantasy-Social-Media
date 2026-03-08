import styled from 'styled-components';
import { useState, useEffect } from 'react';
import type { ComponentType, SVGProps } from 'react';

import CharacterImage from '../General/CharacterImage';
import TextEditor from './TextEditor';

import RepliesIcon from "../../assets/icons/replies.svg?react";
import ShareIcon from "../../assets/icons/share.svg?react";
import FavouriteIcon from "../../assets/icons/favourite.svg?react";
import HeartIcon from "../../assets/icons/heart.svg?react";
import LikeIcon from "../../assets/icons/like.svg?react";
import DislikeIcon from "../../assets/icons/dislike.svg?react";

const StyledMainContainer = styled.div`
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  height: fit-content;
  flex-shrink: 0;
  width: 100%;
  gap: 0.6rem;
  background: white;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 6px 20px rgba(0,0,0,0.06);
  overflow: hidden;
  cursor: pointer;

  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 
    0 6px 20px rgba(0,0,0,0.06),
    0px 4px 4px rgba(0,0,0,0.1);
  }
`;

const StyledContentContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 1.6rem 1.6rem 0rem 1.6rem;
  gap: 1rem;
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
  gap: 0.8rem;
`;

const StyledActionBarText = styled.p`
  font-size: 1.2rem;
  margin-left: -0.6rem;
  user-select: none;
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
    transform: scale(0.2);
  }
`

const createStyledVoteIcon = (IconComponent: ComponentType<SVGProps<SVGSVGElement>>) => styled(IconComponent)<{ $active?: boolean, $activeColour : string}>`
  height: 1.6rem;
  width: 1.6rem;
  cursor: pointer;
  vertical-align: bottom;

  & path:first-of-type {
    fill: ${({ $active, $activeColour }) => ($active ? $activeColour : "none")};
    stroke: ${({ $active }) => ($active ? "none" : "#1C274C")};
  }

  & path:last-of-type {
    fill: ${({ $active, $activeColour }) => ($active ? $activeColour : "none")};
    stroke: ${({ $active }) => ($active ? "none" : "#1C274C")};
  }

  transition: transform 0.4s ease;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.2);
  }
`

const StyledRepliesIcon = createStyledIcon(RepliesIcon);
const StyledShareIcon = createStyledIcon(ShareIcon);
const StyledFavouriteIcon = createStyledIcon(FavouriteIcon);
const StyledHeartIcon = createStyledIcon(HeartIcon);
const StyledLikeIcon = createStyledVoteIcon(LikeIcon);
const StyledDislikeIcon = createStyledVoteIcon(DislikeIcon);

type PostProps = {
  postData: any
}

const Post = ({ postData } : PostProps) => {
  const [repliesExpanded, setrepliesExpanded] = useState(false);
  const [shareExpanded, setShareExpanded] = useState(false);
  const [favourited, setfavourited] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  function convertCounts(num: number): string {
    if (num < 1000) {
      return num.toString();
    } else if (num < 10000) {
      return Math.floor(num / 1000).toString() + "K";
    } else {
      return Math.floor(num / 1000000).toString() + "M";
    }
  }

  return (
    <StyledMainContainer>
      <StyledContentContainer>
        <CharacterImage
          alt="Character image"
          size="100px"
          imagePath={postData.image} 
        />

        <StyledTextContainer>
          <StyledCharacterName>
            {postData.name}
          </StyledCharacterName>

          {postData.content != "" && <TextEditor showMenu={false} content={postData.content}/>}
        </StyledTextContainer>

      </StyledContentContainer>
      <StyledActionBar>
        <StyledActionBarIconContainer>
          <StyledRepliesIcon/>
          <StyledActionBarText>
            {convertCounts(postData.replies)}
          </StyledActionBarText>
        </StyledActionBarIconContainer>

        <StyledActionBarIconContainer>
          <StyledShareIcon/>
        </StyledActionBarIconContainer>

        <StyledActionBarIconContainer>
          <StyledFavouriteIcon/>
        </StyledActionBarIconContainer>

        <StyledActionBarIconContainer>
          <StyledHeartIcon/>
            <StyledActionBarText>
              {convertCounts(postData.loves)}
            </StyledActionBarText>
        </StyledActionBarIconContainer>

        <StyledActionBarIconContainer>
          <StyledLikeIcon $active={liked} $activeColour="green" onClick={() => setLiked(prev => !prev)}/>
            <StyledActionBarText>
              {convertCounts(postData.likes)}
            </StyledActionBarText>
          <StyledDislikeIcon $active={disliked} $activeColour="red" onClick={() => setDisliked(prev => !prev)}/>
            <StyledActionBarText>
              {convertCounts(postData.dislikes)}
            </StyledActionBarText>
        </StyledActionBarIconContainer>

      </StyledActionBar>
    </StyledMainContainer>
  )
}

export default Post
