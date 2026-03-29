import styled from 'styled-components';
import { useState, useEffect, useRef, useCallback } from 'react';
import axios from "axios";

import CreatePostMenu from './CreatePostMenu';
import CharactersMenu from './CharactersMenu';
import Post from './Post';
import type { ReplyType } from './ReplyFeed';

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

const StyledObserver = styled.div`
  height: 1px;
  width: 1px;
  opacity: 0.01;
  border: 1px solid black;
`;

type StreamProps = {
  showCreatePostMenu: boolean;
  showCharactersMenu: boolean;
  showFavourites: boolean;
  characterFilter: number | null;
  propertyFilter: number | null;
};

export type EmojiKey = "aghast" | "angry" | "astonished" | "bandage" | "bored" | "clown" | "crying" | "dizzy" | "downcast" | "explode" | "heartEyes" | "heavyCrying" | "laughing" | "puppyEyes" | "sad" | "shocked" | "skeptical" | "sleeping" | "sleeping" | "smile" | "wink" | "worried" | "zipper";

export type EmojiEntry = {
  reaction: EmojiKey;
  count: number;
};

export type PostType = {
  postId: number;
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

const Stream = ({ showCreatePostMenu, showCharactersMenu, showFavourites, characterFilter, propertyFilter } : StreamProps) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [lastId, setLastId] = useState<number | null>(null);
  const [lastCreated, setLastCreated] = useState<string | null>(null);
  const [furtherContentAvailable, setFurtherContentAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchPosts = useCallback(async () => {
    if (loading || !furtherContentAvailable) return;

    setLoading(true);
    try {
      const params: any = {};

      if (showFavourites) {
        params.lastCreated = lastCreated;
      } else {
        params.lastId = lastId
        params.charId = characterFilter;
        params.propertyId = propertyFilter;
      }

      const endpoint = showFavourites ? "/favourites" : "/feed";

      const { data } = await axios.get<PostType[]>(
        `${backendUrl}${endpoint}`,
        { params }
      );

      const postsArray = data ?? [];
      setPosts(prev => [...prev, ...postsArray]);

      if (postsArray.length > 0) {
        if (showFavourites) {
          setLastCreated(data[data.length - 1].createdAt);
        } else {
          setLastId(data[data.length-1].postId);
        }
      } else {
        setFurtherContentAvailable(false);
      }
    } catch (error) {
      console.error("Character search failed", error);
    } finally {
      setLoading(false);
    }
  }, [furtherContentAvailable, characterFilter, propertyFilter, showFavourites, lastId, lastCreated]);

  function refetchPosts() {
    setPosts([]);
    setLastId(null);
    setFurtherContentAvailable(true);
  }

  async function updatePost(postId: number) {
    try {
      const { data } = await axios.get(`${backendUrl}/post`, { params: {postId: postId} });
      setPosts(prev =>
        prev.map(item =>
          item.postId === postId ? { ...item, ...data } : item
        )
      );

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.log(error.response.data.error);
        }
      }
    }
  };

  // Reset on filter change
  useEffect(() => {
    setPosts([]);
    setLastId(null);
    setLastCreated(null);
    setFurtherContentAvailable(true);
  }, [characterFilter, propertyFilter, showFavourites]);

  // Create observer to load more posts when reached
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
      {showCreatePostMenu && <CreatePostMenu mode="post" numSuggestions={5} refetchPosts={refetchPosts}/>}
      {showCharactersMenu && <CharactersMenu />}
      {posts.length && posts.map((post) => {
        return <Post key={post.postId} postData={post} updatePost={updatePost} override={showFavourites}/>
      })}
      <StyledObserver ref={observerRef}/>
    </StyledMainContainer>
  )
}

export default Stream
