import styled from 'styled-components';
import {  useState, useEffect, useRef, useCallback } from 'react';
import axios from "axios";

import Reply from './Reply';
import CreatePostMenu from './CreatePostMenu';

import type { EmojiEntry } from './Stream';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const StyledMainContainer = styled.div<{ $replyExpanded: boolean, $numReplies: number }>`
  display: flex;
  flex-direction: column;
  height: fit-content;
  flex-shrink: 0;
  width: 100%;
  gap: 0.2rem;
  margin-top: ${({ $replyExpanded, $numReplies }) => $replyExpanded || ($numReplies > 0) ? "0" : "calc(-0.2rem - 2px)"};
`;

const StyledObserver = styled.div`
  height: 1px;
  width: 1px;
  opacity: 0.01;
  border: 1px solid black;
`;

export type ReplyType = {
  replyId: number;
  parentReplyId?: number;
  postId: number;
  owner_id: number;
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

type ReplyFeedProps = {
  postId: number;
  parentReplyId?: number;
  overrideData?: ReplyType[];
  override?: boolean;
  depth: number;
  replyExpanded: boolean;
  repliesExpanded: boolean;
  setReplyExpanded: (value: boolean) => void;
  updatePost: (postId: number) => void;
  updateParentReply?: (parentReplyId: number) => void;
}

const ReplyFeed = ({ postId, parentReplyId, override, overrideData, depth, replyExpanded, repliesExpanded, setReplyExpanded, updatePost, updateParentReply } : ReplyFeedProps) => {
  const [replies, setReplies] = useState<ReplyType[]>(
    overrideData ?? []);
  const [lastId, setLastId] = useState<number | null>(null);
  const [furtherContentAvailable, setFurtherContentAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchReplies = useCallback(async () => {
    if (loading || !furtherContentAvailable) return;

    setLoading(true);
    try {
      const { data } = await axios.get<ReplyType[]>(`${backendUrl}/replies`, 
        {
          params: { postId: postId, parentReplyId: parentReplyId, lastId: lastId }
        }
      );

      const repliesArray = data ?? [];
      setReplies(prev => [...prev, ...repliesArray]);

      if (repliesArray.length > 0) {
        setLastId(data[data.length-1].replyId);
      } else {
        setFurtherContentAvailable(false);
      }
    } catch (error) {
      console.error("Character search failed", error);
    } finally {
      setLoading(false);
    }
  }, [loading, furtherContentAvailable, lastId]);

  function refetchReplies() {
    setReplies([]);
    setLastId(null);
    setFurtherContentAvailable(true);
    updatePost(postId); // Update replies count on main post
    if (updateParentReply && parentReplyId) {
      updateParentReply(parentReplyId); // Update replies count on parent reply
    }
  }

  async function updateReply(replyId: number) {
    try {
      const { data } = await axios.get(`${backendUrl}/reply`, { params: {replyId: replyId} });
      setReplies(prev =>
        prev.map(item =>
          item.replyId === replyId ? { ...item, ...data } : item
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

  // Create observer to load more posts when reached
  useEffect(() => {
    if (!observerRef.current || override) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting) {
          fetchReplies();
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
  }, [fetchReplies]);

  return (
    <StyledMainContainer $replyExpanded={replyExpanded} $numReplies={replies.length}>
      {replyExpanded && !override && 
        <CreatePostMenu 
          mode="reply" 
          postId={postId} 
          height="250px" 
          numSuggestions={3}
          depth={depth - 1}
          parentReplyId={parentReplyId} 
          refetchReplies={refetchReplies}
          closeMenu={setReplyExpanded}
        />
      }
      {repliesExpanded && (
        <>
          {replies.length > 0 && replies.map((reply) => (
            <Reply 
              key={reply.replyId} 
              replyData={reply} 
              updateReply={updateReply}
              updatePost={updatePost}
              override={override ? true : false}
              depth={depth}
            />
          ))}
          <StyledObserver ref={observerRef}/>
        </>
      )}
    </StyledMainContainer>
  )
};

export default ReplyFeed