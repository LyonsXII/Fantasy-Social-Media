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
`;

type StreamProps = {
  $showCreatePostMenu: boolean;
  characterFilter: number | null;
};

const Stream = ({ $showCreatePostMenu, characterFilter } : StreamProps) => {
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
  const [posts, setPosts] = useState<PostType[]>();

  function convertCounts(num: number): string {
    if (num < 1000) {
      return num.toString();
    } else if (num < 10000) {
      return Math.floor(num / 1000).toString() + "K";
    } else {
      return Math.floor(num / 1000000).toString() + "M";
    }
  }

  async function fetchPosts() {
    try {
      const { data } = await axios.get<PostType[]>(`${backendUrl}/feed`, 
        {
          params: { charId: characterFilter }
        }
      );

      const formattedPosts = data.map(post => ({
        ...post,
        replies: convertCounts(post.replies),
        loves: convertCounts(post.loves),
        likes: convertCounts(post.likes),
        dislikes: convertCounts(post.dislikes)
      }));

      setPosts(formattedPosts);
    } catch (error) {
      console.error("Character search failed", error);
    }
  };

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
