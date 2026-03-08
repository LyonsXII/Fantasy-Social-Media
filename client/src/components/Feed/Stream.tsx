import styled from 'styled-components';
import { useState, useEffect } from 'react';
import axios from "axios";

import CreatePostMenu from './CreatePostMenu';
import Post from './Post';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const StyledMainContainer = styled.div`
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100dvh;
  width: 100%;
  padding: 0.6rem 0.6rem 0 0.6rem;
  gap: 0.6rem;
  overflow-y: auto;
  scroll-behavior: smooth;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

type StreamProps = {
  $showCreatePostMenu: boolean;
  characterFilter: number | null;
};

type PostType = {
  postId: number;
  name: string;
  image: string;
  content: string;
  replies: number;
  loves: number;
  likes: number;
  dislikes: number;
  createdAt: string;
  updatedAt: string;
}

const Stream = ({ $showCreatePostMenu, characterFilter } : StreamProps) => {
  const [posts, setPosts] = useState<PostType[]>();

  async function fetchPosts() {
    try {
      const { data } = await axios.get<PostType[]>(`${backendUrl}/feed`, 
        {
          params: { charId: characterFilter }
        }
      );

      setPosts(data);
    } catch (error) {
      console.error("Character search failed", error);
    }
  };

  // Fetch posts for feed
  useEffect(() => {
    fetchPosts();
    }, [characterFilter]);

  return (
    <StyledMainContainer>
      {$showCreatePostMenu && <CreatePostMenu />}
      {posts && posts.map((post) => {
        return <Post key={post.postId} postData={post}/>
      })}
    </StyledMainContainer>
  )
}

export default Stream
