import styled from 'styled-components';
import { useState } from 'react';

import CharacterImage from '../../General/CharacterImage.tsx';
import TextEditor from '../Stream/TextEditor.tsx';
import ReplyFeed from '../Stream/ReplyFeed.tsx';
import PostActions from '../Stream/PostActions.tsx';
import PostReactions from '../Stream/PostReactions.tsx';

import type { PostType } from '../Stream/Stream.tsx';
import type { ReplyType } from '../Stream/ReplyFeed.tsx';

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
  font-size: 1rem;
`;

const StyledPostImage = styled.img`
  height: fit-content;
  max-height: 300px;
  width: fit-content;
  margin: 20px 0px 20px 20px;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 6px 20px rgba(0,0,0,0.06);
`;

const StyledEditContainer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`

const StyledButton = styled.button`
  padding: 0.2rem 0.4rem;
  font-size: 1rem;
  border: 1px solid rgba(0,0,0,0.4);
  box-shadow: 0 6px 20px rgba(0,0,0,0.06);
  cursor: pointer;
`;

const StyledTimestampsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

type PostProps = {
  postData: PostType
  updatePost: (postId: number) => void;
  override?: boolean;
}

const Post = ({ postData, updatePost, override } : PostProps) => {
  const [repliesExpanded, setRepliesExpanded] = useState(false);
  const [replyExpanded, setReplyExpanded] = useState(false);
  // const [shareExpanded, setShareExpanded] = useState(false);
  const [overrideData] = useState<ReplyType[] | null>(
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
              {postData.name}_
              {postData.postId}
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

        <StyledEditContainer>
          <StyledButton>
            Edit
          </StyledButton>
          <StyledTimestampsContainer>
            {postData.createdAt &&
              <StyledDataText>
                Created:{" "}
                {
                  new Intl.DateTimeFormat("en-GB", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(postData.createdAt))
                }
              </StyledDataText>
            }
            {postData.updatedAt &&
              <StyledDataText>
                Updated:{" "}
                {
                  new Intl.DateTimeFormat("en-GB", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(postData.updatedAt))
                }
              </StyledDataText>
            }
          </StyledTimestampsContainer>
        </StyledEditContainer>
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
