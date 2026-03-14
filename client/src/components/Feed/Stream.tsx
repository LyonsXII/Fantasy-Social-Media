import styled from 'styled-components';
import { useState, useEffect, useRef, useCallback } from 'react';
import axios from "axios";

import CreatePostMenu from './CreatePostMenu';
import CharactersMenu from './CharactersMenu';
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
  showCreatePostMenu: boolean;
  showCharactersMenu: boolean;
  characterFilter: number | null;
  propertyFilter: number | null;
};

export type PostType = {
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
  attachment: string;
}

const Stream = ({ showCreatePostMenu, showCharactersMenu, characterFilter, propertyFilter } : StreamProps) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [lastId, setLastId] = useState<number | null>(null);
  const [furtherContentAvailable, setFurtherContentAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchPosts = useCallback(async () => {
    if (loading || !furtherContentAvailable) return;

    setLoading(true);
    try {
      const { data } = await axios.get<PostType[]>(`${backendUrl}/feed`, 
        {
          params: { charId: characterFilter, propertyId: propertyFilter, lastId: lastId }
        }
      );

      const postsArray = data ?? [];
      setPosts(prev => [...prev, ...postsArray]);

      if (postsArray.length > 0) {
        setLastId(data[data.length-1].postId);
      } else {
        setFurtherContentAvailable(false);
      }
    } catch (error) {
      console.error("Character search failed", error);
    } finally {
      setLoading(false);
    }
  }, [loading, furtherContentAvailable, characterFilter, lastId]);

  // Reset on filter change
  useEffect(() => {
    setPosts([]);
    setLastId(null);
    setFurtherContentAvailable(true);
  }, [characterFilter, propertyFilter]);

  // Create observer on new last post to load more posts when reached
  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting) {
          fetchPosts();
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0,
      }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [fetchPosts]);

  return ( 
    <StyledMainContainer>
      {showCreatePostMenu && <CreatePostMenu />}
      {showCharactersMenu && <CharactersMenu />}
      {posts && posts.map((post, i) => {
        if (i < posts.length - 1) {
          return <Post key={post.postId} postData={post}/>
        } else {
          return <Post key={post.postId} postData={post}/>
        }
      })}
      <div ref={observerRef} style={{"height": "1px", "width": "1px", "border": "1px solid black", "opacity": "0.01"}}/>
    </StyledMainContainer>
  )
}

export default Stream
