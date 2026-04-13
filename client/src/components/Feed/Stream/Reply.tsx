import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import axios from "axios";

import CharacterImage from '../../General/CharacterImage';
import TextEditor from './TextEditor';
import PostReactions from './PostReactions';
import PostActions from './PostActions';
import ReplyFeed from './ReplyFeed';

import type { ReplyType } from './ReplyFeed';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const StyledMainContainer = styled.div<{ $depth: number }>`
  display: flex;
  flex-direction: column;
  height: fit-content;
  flex-shrink: 0;
  width: ${({ $depth }) => `calc(100% - (${$depth} * 20px))`};
  min-width: 60%;
  gap: 0.2rem;
`;

const StyledMainPostContainer = styled.div<{ $depth: number }>`
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: fit-content;
  flex-shrink: 0;
  width: 100%;
  gap: 0.6rem;
  background-color: ${({ $depth }) => {
    if ($depth === undefined || $depth === null) {
      return "#ffffff";
    }

    const cappedDepth = Math.min($depth, 4);
    const baseLightness = 100;
    const step = 3;

    return `hsl(255, 0%, ${baseLightness - (cappedDepth * step)}%)`;
  }};
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

const StyledTextContainer = styled.div<{ $editExpanded: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${({ $editExpanded }) => $editExpanded ? "1rem" : "0rem"};
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

type ReplyProps = {
  replyData: ReplyType;
  updateReply: (replyId: number) => void;
  updatePost: (postId: number) => void;
  override?: boolean;
  depth: number;
}

const Reply = ({ replyData, updateReply, updatePost, override, depth } : ReplyProps) => {
  const [repliesExpanded, setRepliesExpanded] = useState(false);
  const [replyExpanded, setReplyExpanded] = useState(false);
  const [editExpanded, setEditExpanded] = useState(false);

  // Props for handling post editing
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentName, setAttachmentName] = useState(replyData.attachment || "");
  const [updateAttachment, setUpdateAttachment] = useState(false);
  const maxSize = 5 * 1024 * 1024;
  const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

  async function editReply(content: any){
    try {
      const formData = new FormData();
      formData.append("replyId", JSON.stringify(replyData.replyId));
      formData.append("content", JSON.stringify(content));

      if (attachment) {
        formData.append("attachment", attachment);
      }

      if (updateAttachment) {
        formData.append("updateAttachment", String(updateAttachment));
      }

      await axios.post(`${backendUrl}/editReply`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      updateReply(replyData.replyId);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.log(error.response.data.error);
        }
      }
    }
  };

  const openPicker = () => {
    fileInputRef.current?.click();
  };

  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type");
      return;
    }

    if (file.size > maxSize) {
      alert("File too large");
      return;
    }

    setAttachment(file);
    setUpdateAttachment(true);
  };

  const removeAttachment = () => {
    setAttachment(null);
    setUpdateAttachment(true);
    setAttachmentName("");
  };

  // Update attachmentName to display new image
  useEffect(() => {
    setAttachmentName(replyData.attachment)
  }, [replyData.attachment]);

  return (
    <StyledMainContainer $depth={depth}>
      <StyledMainPostContainer $depth={depth}>
        <StyledContentContainer>
          <CharacterImage
            alt="Character image"
            size="70px"
            imagePath={replyData.image} 
          />
          <StyledTextContainer $editExpanded={editExpanded}>
            <StyledCharacterName>
              {replyData.name}_{replyData.replyId}
            </StyledCharacterName>

            {replyData.content != "" && 
              <TextEditor 
                createPost={editReply} 
                showMenu={editExpanded} 
                closeMenu={setEditExpanded}
                minimalist={true} 
                content={replyData.content}
                openPicker={openPicker}
                handleAttachment={handleAttachment}
                removeAttachment={removeAttachment}
                fileInputRef={fileInputRef}
                attachmentName={
                  attachment ? attachment.name :
                    attachmentName ? attachmentName.slice(8)
                    : undefined
                }
              />}
            {attachmentName && <StyledPostImage src={backendUrl + "/" + replyData.attachment}/>}
          </StyledTextContainer>
        </StyledContentContainer>

        {replyData.emojiCounts.length > 0 && <PostReactions emojiCounts={replyData.emojiCounts}/>}

        <PostActions 
          postData={replyData}
          currentEmojiReaction={replyData.currentEmojiReaction}
          updatePost={updateReply} 
          setRepliesExpanded={setRepliesExpanded} 
          setReplyExpanded={setReplyExpanded}
        />

        <StyledEditContainer>
          <StyledButton onClick={() => setEditExpanded(prev => !prev)}>
            Edit
          </StyledButton>
          <StyledTimestampsContainer>
            {replyData.createdAt &&
              <StyledDataText>
                Created:{" "}
                {
                  new Intl.DateTimeFormat("en-GB", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(replyData.createdAt))
                }
              </StyledDataText>
            }
            {replyData.updatedAt &&
              <StyledDataText>
                Updated:{" "}
                {
                  new Intl.DateTimeFormat("en-GB", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(replyData.updatedAt))
                }
              </StyledDataText>
            }
          </StyledTimestampsContainer>
        </StyledEditContainer>
      </StyledMainPostContainer>

      {(replyExpanded || repliesExpanded) && 
        <ReplyFeed 
          postId={replyData.postId} 
          parentReplyId={replyData.replyId} 
          override={override}
          overrideData={override ? replyData.replyChain ?? [] : []}
          depth={depth + 1}
          replyExpanded={replyExpanded}
          setReplyExpanded={setReplyExpanded}
          repliesExpanded={repliesExpanded}
          updatePost={updatePost}
          updateParentReply={updateReply}
        />
      }
    </StyledMainContainer>
  )
};

export default Reply