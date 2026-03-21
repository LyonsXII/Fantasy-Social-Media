import styled from 'styled-components';
import { useState } from 'react';

import CharacterImage from '../General/CharacterImage';
import TextEditor from './TextEditor';
import PostActions from './PostActions';
import ReplyFeed from './ReplyFeed';

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

const StyledMainPostContainer = styled.div`
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
`

const StyledContentContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 1.6rem 1.6rem 1.6rem 1.6rem;
  gap: 1rem;
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

const StyledTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.2rem;
`;

type ReplyProps = {
  replyData: ReplyType;
  updateReply: (replyId: number) => void;
}

const Reply = ({ replyData, updateReply } : ReplyProps) => {
  const [repliesExpanded, setRepliesExpanded] = useState(false);

  return (
    <StyledMainContainer>
      <StyledMainPostContainer>
        <StyledContentContainer>
          <CharacterImage
            alt="Character image"
            size="70px"
            imagePath={replyData.image} 
          />
          <StyledTextContainer>
            <StyledCharacterName>
              {replyData.name}
              {replyData.replyId}
            </StyledCharacterName>

            {replyData.content != "" && <TextEditor showMenu={false} content={replyData.content}/>}
            {replyData.attachment && <StyledPostImage src={backendUrl + "/" + replyData.attachment}/>}
          </StyledTextContainer>
        </StyledContentContainer>

        <PostActions postData={replyData} updatePost={updateReply} setRepliesExpanded={setRepliesExpanded}/>

        <StyledDataText>
          {new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date(replyData.createdAt))
          }
        </StyledDataText>
      </StyledMainPostContainer>

      {repliesExpanded && <ReplyFeed postId={replyData.postId} parentReplyId={replyData.replyId}/>}
    </StyledMainContainer>
  )
};

export default Reply