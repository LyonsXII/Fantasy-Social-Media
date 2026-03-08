import styled from 'styled-components';
import { useState, useEffect, useRef, useCallback } from 'react';
import axios from "axios";

import CharacterImage from '../General/CharacterImage';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const StyledMainContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 60%;
  width: 100%;
  padding: 1.6rem 1.6rem 1.6rem 1.6rem;
  gap: 0.6rem;
  background: white;
  box-shadow: 0 6px 20px rgba(0,0,0,0.06);

  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 
    0 6px 20px rgba(0,0,0,0.06),
    0px 4px 4px rgba(0,0,0,0.1);
  }
`;

const StyledOptionText = styled.p`
  font-size: 1.6rem;
  font-weight: 600;
  user-select: none;
  cursor: pointer;
`;

const StyledCharactersContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  height: 100%;
  width: 100%;
  gap: 0.6rem;
  overflow-y: auto;
  scroll-behavior: smooth;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

type CharType = {
  charId: number
  name: string
  image: string
}

const CharactersMenu = () => {
  const [chars, setChars] = useState<CharType[]>([]);
  const [lastId, setLastId] = useState<number | null>(null);
  const [furtherContentAvailable, setFurtherContentAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLImageElement | null>(null);

  const fetchChars = useCallback(async () => {
    if (loading || !furtherContentAvailable) return;

    setLoading(true);
    try {
      const { data } = await axios.get<CharType[]>(`${backendUrl}/characters`, 
        {
          params: { lastId: lastId }
        }
      );

      const charsArray = data ?? [];
      setChars(prev => [...prev, ...charsArray]);

      if (charsArray.length > 0) {
        setLastId(data[data.length-1].charId);
      } else {
        setFurtherContentAvailable(false);
      }
    } catch (error) {
      console.error("Character search failed", error);
    } finally {
      setLoading(false);
    }
  }, [loading, furtherContentAvailable, lastId]);

  // Fetch posts for feed
  useEffect(() => {
    if (lastId != null) return
    fetchChars();
  }, [lastId]);

  // Create observer to load more posts as needed
  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting) {
          fetchChars();
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
  }, [fetchChars]);

  return (
    <StyledMainContainer>
      <StyledOptionText>
        Characters
      </StyledOptionText>

      <StyledCharactersContainer>
        {chars && chars.map((char, i) => {
          if (i < chars.length - 1) {
            return <CharacterImage key={char.charId} alt="Character image" size="160px" imagePath={char.image}/>
          } else {
            return <CharacterImage key={char.charId} alt="Character image" ref={observerRef} size="160px" imagePath={char.image}/>
          }
        })}
      </StyledCharactersContainer>

    </StyledMainContainer>
  )
}

export default CharactersMenu
