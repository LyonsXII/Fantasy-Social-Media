import styled from 'styled-components';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom'
import axios from "axios";

import { useAuth } from '../../context/AuthContext';

import Post from '../Feed/Stream/Post';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const StyledContainer = styled.div`
  display: flex;
  height: 100dvh;
  width: 100dvw;
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

export type PostType = {
  postId: number;
  ownerId: number;
  name: string;
  image: string;
  content: string;
  replies: number;
  emojis: number;
  likes: number;
  dislikes: number;
  createdAt: string;
  updatedAt: string;
  attachment: string;
  isLiked: boolean;
  isDisliked: boolean;
  isFavourited: boolean;
  isEmojied: boolean;
  replyChain?: ReplyType[];
  emojiCounts: EmojiEntry[];
  currentEmojiReaction: string;
}

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<PostType | null>(null);

  const { accessToken } = useAuth();

  async function fetchPost(postId: number) {
    try {
      const { data } = await axios.get(
        `${backendUrl}/post`,
        {
          params: {
            postId: postId,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
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
      {post && <Post key={Number(postId)} postData={post} updatePost={fetchPost} override={false}/>}
    </StyledContainer>
  );
}

export default PostPage;