import styled, { css, keyframes } from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import axios from "axios";

import Search from '../../General/Search';
import TextEditor from './TextEditor';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const enterAnimation = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const exitAnimation = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;

const StyledMainContainer = styled.div<{$height?: string, $depth?: number, $visible: boolean, $entering: boolean}>`
  height: ${({ $height }) => $height ? $height : "calc((60px * 5) + (0.6rem * 4) + 3.2rem + 2px)"};
  max-height: ${({ $visible }) => $visible ? "100%" : "0px"};
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

  transition: box-shadow 0.2s ease, max-height 600ms ease;

  ${({ $entering }) =>
    $entering &&
    css`
      animation: ${enterAnimation} 600ms ease-out forwards;
    `}

  ${({ $entering }) =>
    !$entering &&
    css`
      animation: ${exitAnimation} 600ms ease-in forwards;
    `}

  &:hover {
    box-shadow: 
    0 6px 20px rgba(0,0,0,0.06),
    0px 4px 4px rgba(0,0,0,0.1);
  }
`;

const StyledPaddingWrapper = styled.div`
  display: flex;
  height: 100%;
  padding: 1.6rem 1.6rem 2rem 1.6rem;
`

const StyledSearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 40%;
  gap: 0.6rem;
`;

const StyledCreatePostContentContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

export const StyledMessageText = styled.div<{ $showMessageText : boolean }>`
  position: absolute;
  height: 1rem;
  bottom: -1.25rem;
  left: 1rem;
  width: 100%;
  font-size: 1rem;
  opacity: 0.8;
`;

type CreatePostMenuProps = {
  mode: string;
  height?: string;
  numSuggestions: number;
  depth?: number;
  postId?: number;
  parentReplyId?: number;
  refetchPosts?: () => void;
  refetchReplies?: () => void;
  closeMenu: (value: boolean) => void;
  playCreatePostExit?: boolean;
  streamRef?: React.RefObject<HTMLDivElement | null>;
}

const CreatePostMenu = ({ mode, height, numSuggestions, depth, postId, parentReplyId, refetchPosts, refetchReplies, closeMenu, playCreatePostExit, streamRef } : CreatePostMenuProps) => {
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);
  const [messageText, setMessageText] = useState<string>("");
  const [showMessageText, setShowMessageText] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [attachment, setAttachment] = useState<File | null>(null);
  const maxSize = 5 * 1024 * 1024;
  const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

  // Animation parameters
  const [visible, setVisible] = useState(false);

  async function createPost(content: any){
    try {
      const formData = new FormData();
      formData.append("charId", String(selectedCharacter));
      formData.append("content", JSON.stringify(content));

      if (attachment) {
        formData.append("attachment", attachment);
      }

      await axios.post(`${backendUrl}/createPost`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setMessageText("Post created!");
      refetchPosts?.();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setMessageText(error.response.data.error);
        }
      }
    }
  };

  async function createReply(content: any){
    try {
      const formData = new FormData();
      if (postId) {
        formData.append("postId", String(postId));
      }
      if (parentReplyId != undefined && parentReplyId != null) {
        formData.append("parentReplyId", String(parentReplyId));
      }
      formData.append("charId", String(selectedCharacter));
      formData.append("content", JSON.stringify(content));

      if (attachment) {
        formData.append("attachment", attachment);
      }

      await axios.post(`${backendUrl}/createReply`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setMessageText("Reply created!");
      refetchReplies?.();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setMessageText(error.response.data.error);
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
    console.log(file.type);

    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type");
      return;
    }

    if (file.size > maxSize) {
      alert("File too large");
      return;
    }

    setAttachment(file);
  };

  const removeAttachment = () => {
    setAttachment(null);
  };

  // Show message text popup temporarily
  useEffect(() => {
    if (messageText != "") {
      setShowMessageText(true)
      const timer = setTimeout(() => {
        setMessageText("");
        setShowMessageText(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [messageText]);

  // Scroll back to top on load
  useEffect(() => {
    if (streamRef) {
      streamRef.current?.scrollTo({ top: 0, behavior: "auto" });
    }
  }, []);

  // Janky work around to get an entrance animation to animate for posts
  // Not happy with this but it does work
  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, 0);
  }, [])

  return (
    <StyledMainContainer 
      $height={height} 
      $depth={depth} 
      $visible={!playCreatePostExit ? visible : !playCreatePostExit} 
      $entering={!playCreatePostExit}
    >
      <StyledPaddingWrapper>
          <StyledSearchContainer>
          <Search direction="column" height="100%" numSuggestions={numSuggestions} showPropFilter={false} showCharDescription={true} selectChar={setSelectedCharacter}/>
        </StyledSearchContainer>

        <StyledCreatePostContentContainer>
          <TextEditor
            createPost={mode === "post" ? createPost : createReply} 
            showMenu={true}
            closeMenu={closeMenu}
            openPicker={openPicker}
            handleAttachment={handleAttachment}
            removeAttachment={removeAttachment}
            fileInputRef={fileInputRef}
            attachmentName={attachment ? attachment.name : undefined}
          />
          <StyledMessageText $showMessageText={showMessageText}>
            {messageText}
          </StyledMessageText>
        </StyledCreatePostContentContainer>
      </StyledPaddingWrapper>
    </StyledMainContainer>
  )
};

export default CreatePostMenu
