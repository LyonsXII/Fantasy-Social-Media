import { useState, useEffect, useRef } from 'react';
import axios from "axios";
import styled from 'styled-components';

import Search from '../General/Search';
import TextEditor from './TextEditor';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const StyledMainContainer = styled.div`
  display: flex;
  min-height: calc((60px * 5) + (0.6rem * 4) + 3.2rem + 2px);
  flex-shrink: 0;
  width: 100%;
  padding: 1.6rem 1.6rem 1.6rem 1.6rem;
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

const StyledSearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 40%;
  gap: 0.6rem;
`;

const StyledCreatePostContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  gap: 0.6rem;
`;

export const StyledMessageText = styled.div<{ $showMessageText : boolean }>`
  height: 1rem;
  width: 100%;
  font-size: 1rem;
  opacity: 0.8;
  padding-left: 1rem;
`;

const CreatePostMenu = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);
  const [messageText, setMessageText] = useState<string>("");
  const [showMessageText, setShowMessageText] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [attachment, setAttachment] = useState<File | null>(null);
  const maxSize = 5 * 1024 * 1024;
  const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

  async function createPost(postData: any, lenRawText: number){
    try {
      const formData = new FormData();
      formData.append("charId", String(selectedCharacter));
      formData.append("postData", JSON.stringify(postData));
      formData.append("lenRawText", String(lenRawText));

      if (attachment) {
        formData.append("attachment", attachment);
      }

      await axios.post(`${backendUrl}/createPost`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setMessageText("Post created!");
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <StyledMainContainer>
        <StyledSearchContainer>
        <Search direction="column" numSuggestions={5} showPropFilter={false} showCharDescription={true} selectChar={setSelectedCharacter}/>
      </StyledSearchContainer>

      <StyledCreatePostContentContainer>
        <TextEditor 
          createPost={createPost} 
          showMenu={true}
          openPicker={openPicker}
          handleChange={handleChange}
          fileInputRef={fileInputRef}
          attachmentName={attachment ? attachment.name : undefined}
        />
          <StyledMessageText $showMessageText={showMessageText}>
            {messageText}
          </StyledMessageText>
      </StyledCreatePostContentContainer>
    </StyledMainContainer>
  )
}

export default CreatePostMenu
