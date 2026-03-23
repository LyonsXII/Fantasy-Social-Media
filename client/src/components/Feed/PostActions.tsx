import styled from 'styled-components';
import { useState } from 'react';
import type { ComponentType, SVGProps } from 'react';
import axios from "axios";

import CharacterImage from '../General/CharacterImage';
import TextEditor from './TextEditor';
import ReplyFeed from './ReplyFeed.tsx';

import RepliesIcon from "../../assets/icons/replies.svg?react";
import ReplyIcon from "../../assets/icons/reply.svg?react";
import ShareIcon from "../../assets/icons/share.svg?react";
import FavouriteIcon from "../../assets/icons/favourite.svg?react";
import HeartIcon from "../../assets/icons/heart.svg?react";
import LikeIcon from "../../assets/icons/like.svg?react";
import DislikeIcon from "../../assets/icons/dislike.svg?react";

import type { PostType } from './Stream';
import type { ReplyType } from './ReplyFeed';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const StyledMainContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: fit-content;
  flex-shrink: 0;
  width: 100%;
  gap: 0.2rem;
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

const createStyledIcon = (IconComponent: ComponentType<SVGProps<SVGSVGElement>>) => styled(IconComponent)<{ $active?: boolean, $activeColour? : string}>`
  height: 1.6rem;
  width: 1.6rem;
  cursor: pointer;
  vertical-align: bottom;
  path:first-of-type {
    fill: ${({ $active, $activeColour }) => ($active ? $activeColour : "none")};
  }

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
const StyledReplyIcon = createStyledIcon(ReplyIcon);
const StyledShareIcon = createStyledIcon(ShareIcon);
const StyledFavouriteIcon = createStyledIcon(FavouriteIcon);
const StyledHeartIcon = createStyledIcon(HeartIcon);
const StyledLikeIcon = createStyledVoteIcon(LikeIcon);
const StyledDislikeIcon = createStyledVoteIcon(DislikeIcon);

type PostProps = {
  postData: PostType | ReplyType;
  updatePost: (postId: number) => void;
  setRepliesExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  setReplyExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostActions = ({ postData, updatePost, setRepliesExpanded, setReplyExpanded } : PostProps) => {
  const convPostId = "postId" in postData ? postData.postId : null;
  const convReplyId = "replyId" in postData ? postData.replyId : null;
  const [liked, setLiked] = useState(postData.isLiked);
  const [disliked, setDisliked] = useState(postData.isDisliked);
  const [favourited, setFavourited] = useState(postData.isFavourited);
  const [emojied, setEmojied] = useState(postData.isEmojied);

  function convertCounts(num: number): string {
    if (num < 1000) {
      return num.toString();
    } else if (num < 10000) {
      return Math.floor(num / 1000).toString() + "K";
    } else {
      return Math.floor(num / 1000000).toString() + "M";
    }
  }

  type ReactionType = 'like' | 'dislike' | 'love' | 'favourite' | 'emoji';
  async function reactToPost(reactionType: ReactionType, reactionValue?: string) {
    switch(reactionType) {
      case 'like':
        setLiked(prev => !prev);
        break;
      case 'dislike':
        setDisliked(prev => !prev);
        break;
      case 'favourite':
        setFavourited(prev => !prev);
        break;
    }

    try {
      // Update post details in database then refetch latest counts
      await axios.post(`${backendUrl}/react`, {
        "postId": convPostId,
        "replyId": convReplyId,
        "reactionType": reactionType,
        "reactionValue": reactionValue
      });
      if (convReplyId != null) {
        updatePost(convReplyId);
      } else if (convPostId != null) {
        updatePost(convPostId);
      }
    } catch (error) {
      switch(reactionType) {
        case 'like':
          setLiked(prev => !prev);
          break;
        case 'dislike':
          setDisliked(prev => !prev);
          break;
        case 'love':
          setFavourited(prev => !prev);
          break;
      }
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.log(error.response.data.error);
        }
      }
    }
  };

  return (
    <StyledMainContainer>
        <StyledActionBar>
          <StyledActionBarIconContainer>
            <StyledReplyIcon onClick={() => setReplyExpanded(prev => !prev)}/>
            <StyledRepliesIcon onClick={() => setRepliesExpanded(prev => !prev)}/>
            <StyledActionBarText>
              {convertCounts(postData.replies)}
            </StyledActionBarText>
          </StyledActionBarIconContainer>

          <StyledActionBarIconContainer>
            <StyledShareIcon/>
          </StyledActionBarIconContainer>

          <StyledActionBarIconContainer 
            onClick={() => {
            reactToPost("favourite");
          }}>
            <StyledFavouriteIcon $active={favourited} $activeColour="yellow"/>
          </StyledActionBarIconContainer>

          <StyledActionBarIconContainer>
            <StyledHeartIcon $active={emojied} $activeColour="red"/>
              <StyledActionBarText>
                {convertCounts(postData.emojis)}
              </StyledActionBarText>
          </StyledActionBarIconContainer>

          <StyledActionBarIconContainer>
            <StyledLikeIcon 
              $active={liked} 
              $activeColour="green" 
              onClick={() => {
                reactToPost("like");
                if (disliked) {
                  setDisliked(false);
                }
              }}/>
              <StyledActionBarText>
                {convertCounts(postData.likes)}
              </StyledActionBarText>
            <StyledDislikeIcon 
              $active={disliked} 
              $activeColour="red" 
              onClick={() => {
                reactToPost("dislike");
                if (liked) {
                  setLiked(false);
                }
              }}/>
              <StyledActionBarText>
                {convertCounts(postData.dislikes)}
              </StyledActionBarText>
          </StyledActionBarIconContainer>
        </StyledActionBar>
    </StyledMainContainer>
  )
};

export default PostActions
