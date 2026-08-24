import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import axios from "axios";

import Post from '../Feed/Stream/Post';

import type { PostType } from '../Feed/Stream/Stream';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const StyledContainer = styled.div`
  display: flex;
  height: 100dvh;
  width: 100dvw;
  justify-content: center;
  margin-top: 10dvh;

  overflow-y: auto;
  scroll-behavior: smooth;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('/images/Patina.jpg') no-repeat center / cover;
    opacity: 0.2;
    z-index: -1;
  }
`

const StyledPostContainer = styled.div`
  width: 80dvw;
`

export interface CharacterImageProps {
  alt: string
  size: string
  imagePath?: string
  updateChar?: () => void;
}

export type EmojiKey = "aghast" | "angry" | "astonished" | "bandage" | "bored" | "clown" | "crying" | "dizzy" | "downcast" | "explode" | "heartEyes" | "heavyCrying" | "laughing" | "puppyEyes" | "sad" | "shocked" | "skeptical" | "sleeping" | "sleeping" | "smile" | "wink" | "worried" | "zipper";

export type EmojiEntry = {
  reaction: EmojiKey;
  count: number;
};

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<PostType | null>(null);

  async function fetchPost(postId: number) {
    try {
      const { data } = await axios.get(
        `${backendUrl}/postAnonymous`,
        {
          params: {
            postId: postId,
          }
        }
      );

      setPost(data);

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.log(error.response.data.error);
        }
      }
    }
  }

  useEffect(() => {
    fetchPost(Number(postId));
  }, [])
  
  return (
    <StyledContainer>
      
      {post && 
        <StyledPostContainer>
          <Post key={Number(postId)} postData={post} updatePost={fetchPost} override={false} anonymous={true}/>
        </StyledPostContainer>
      }
    </StyledContainer>
  );
}

export default PostPage;