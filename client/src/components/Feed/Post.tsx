import styled from 'styled-components';
import { useState } from 'react';

import CharacterImage from '../General/CharacterImage';
import TextEditor from './TextEditor';
import ReplyFeed from './ReplyFeed.tsx';
import PostActions from './PostActions.tsx';
import PostReactions from './PostReactions.tsx';

import type { PostType } from './Stream';
import type { ReplyType } from './ReplyFeed.tsx';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const StyledMainContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: fit-content;
  flex-shrink: 0;
  width: 100%;
  gap: 0.2rem;
`;

const StyledMainPostContainer = styled.div`
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  align-items: center;
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
`

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

const StyledDataText = styled.p`
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

const StyledPostImage = styled.img`
  height: fit-content;
  max-height: 300px;
  width: fit-content;
  margin: 20px 0px 20px 20px;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 6px 20px rgba(0,0,0,0.06);
`;

type PostProps = {
  postData: PostType
  updatePost: (postId: number) => void;
  override?: boolean;
}

const Post = ({ postData, updatePost, override } : PostProps) => {
  const [repliesExpanded, setRepliesExpanded] = useState(false);
  const [replyExpanded, setReplyExpanded] = useState(false);
  const [shareExpanded, setShareExpanded] = useState(false);
  const [overrideData, setOverrideData] = useState<ReplyType[] | null>(
    postData.replyChain ?? null
  );

  return (
    <StyledMainContainer key={postData.postId}>
      <StyledMainPostContainer>
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
            {postData.attachment && <StyledPostImage src={backendUrl + "/" + postData.attachment}/>}
          </StyledTextContainer>

        </StyledContentContainer>

        {postData.emojiCounts.length > 0 && <PostReactions emojiCounts={postData.emojiCounts}/>}
 
        <PostActions 
          postData={postData} 
          updatePost={updatePost} 
          setRepliesExpanded={setRepliesExpanded} 
          setReplyExpanded={setReplyExpanded}
          currentEmojiReaction={postData.currentEmojiReaction}
        />

        <StyledDataText>
          {postData.createdAt && new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date(postData.createdAt))
          }
        </StyledDataText>
      </StyledMainPostContainer>

      {(repliesExpanded || replyExpanded) && 
        <ReplyFeed 
          postId={postData.postId} 
          overrideData={overrideData ?? undefined} 
          override={override} 
          depth={1}
          replyExpanded={replyExpanded}
          repliesExpanded={repliesExpanded}
        />}
    </StyledMainContainer>
  )
};

export default Post
