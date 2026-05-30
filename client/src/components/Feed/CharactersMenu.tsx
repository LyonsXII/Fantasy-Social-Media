import styled, { css, keyframes } from 'styled-components';
import { useState, useEffect, useRef, useCallback } from 'react';
import axios from "axios";

import CharacterImage from '../General/CharacterImage';
import Search from '../General/Search';

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

const StyledMainContainer = styled.div<{$visible: boolean, $entering: boolean}>`
  height: calc(100% - 0.6rem);
  max-height: ${({ $visible }) => $visible ? "100%" : "0px"};
  width: 100%;
  background: white;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 6px 20px rgba(0,0,0,0.06);
  /* overflow: hidden; Breaks everything for some reason, fix at some point*/

  transition: box-shadow 0.2s ease, max-height 1s ease;

  ${({ $entering }) =>
    $entering &&
    css`
      animation: ${enterAnimation} 1s ease-out forwards;
    `}

  ${({ $entering }) =>
    !$entering &&
    css`
      animation: ${exitAnimation} 1s ease-in forwards;
    `}
    
  &:hover {
    box-shadow: 
    0 6px 20px rgba(0,0,0,0.06),
    0px 4px 4px rgba(0,0,0,0.1);
  }
`;

const StyledPaddingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
  padding: 1.6rem 1.6rem 2rem 1.6rem;
  gap: 1rem;
`

const StyledOptionText = styled.p`
  font-size: 1rem;
  user-select: none;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.8);
`;

const StyledCharactersContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  min-height: calc(320px + 2rem);
  width: 100%;
  gap: 0.6rem;
  padding-bottom: 2rem;
  overflow-y: auto;
  scroll-behavior: smooth;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const StyledGenreButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  height: fit-content;
  gap: 0.6rem;
  width: 100%;
`;

const StyledButton = styled.button<{$active : boolean}>`
  height: 40px;
  width: fit-content;
  padding: 0.4rem 0.8rem;
  gap: 2rem;
  background: white;
  border: 1px solid rgba(0,0,0,0.2);
  box-shadow: 0 6px 20px rgba(0,0,0,0.06);
  background-color: ${({ $active }) => $active ? "green" : "none"};
`;

type CharType = {
  charId: number
  name: string
  image: string
}

type CharactersMenuProps = {
  playCharactersMenuExit?: boolean;
  streamRef: React.RefObject<HTMLDivElement | null>;
};

const CharactersMenu = ({ playCharactersMenuExit, streamRef } : CharactersMenuProps) => {
  const [chars, setChars] = useState<CharType[]>([]);
  const [lastId, setLastId] = useState<number | null>(null);
  const [furtherContentAvailable, setFurtherContentAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLImageElement | null>(null);
  const [tags, setTags] = useState<{tagId: number, tag: string, category: string}[]>([]);
  const [charNameInput, setCharNameInput] = useState<number | null>(null);
  const [propertyNameInput, setPropertyNameInput] = useState<number | null>(null);
  type TagFilterState = Record<string, boolean>;
  const [tagFilters, setTagFilters] = useState<TagFilterState>({});

  // Animation parameters
  const [visible, setVisible] = useState(false);

  const fetchChars = useCallback(async () => {
    console.log("fired");
    if (loading || !furtherContentAvailable) return;
    console.log("past loading / further content available");

    setLoading(true);
    try {
      // Convert genre tags into array or null ready for backend request
      const activeTags = Object.entries(tagFilters)
        .filter(([_, active]) => active)
        .map(([tag]) => tag);
      const tagParam = activeTags.length > 0 ? activeTags.join(",") : null;

      const { data } = await axios.get<CharType[]>(`${backendUrl}/characters`, 
        {
          params: { charId: charNameInput, propertyId: propertyNameInput, tagFilters: tagParam, lastId: lastId }
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
  }, [loading, furtherContentAvailable, lastId, charNameInput, propertyNameInput, tagFilters]);

  async function fetchTags() {
    try {
      const response = await axios.get(`${backendUrl}/tags`, {
        params: {}
      });
      setTags(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 400) {
            console.log(error.response.data.error);
          }
        }
      }
    }
  };

  const toggleTag = (tag: number) => {
    setTagFilters(prev => ({
      ...prev,
      [tag]: !prev[tag]
    }));
  };

  // Reset on filter change
  useEffect(() => {
    setChars([]);
    setLastId(null);
    setFurtherContentAvailable(true);
  }, [charNameInput, propertyNameInput, tagFilters]);

  // Create observer to load more characters as user scrolls
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

  // Fetch all possible tags
  useEffect(() => {
    fetchTags();
  }, []);

  // Create tag filters
  useEffect(() => {
    const initialFilters = Object.fromEntries(tags.map(t => [t.tagId.toString(), false]));
    setTagFilters(initialFilters);
  }, [tags]);

  // Scroll back to top on load
  useEffect(() => {
    streamRef.current?.scrollTo({ top: 0, behavior: "auto" });
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
      $visible={!playCharactersMenuExit ? visible : !playCharactersMenuExit} 
      $entering={!playCharactersMenuExit}
    >
      <StyledPaddingWrapper>
        <Search direction="row" height="94px" width="100%" numSuggestions={1} showPropFilter={true} selectChar={setCharNameInput} selectProperty={setPropertyNameInput}/>

        <StyledCharactersContainer>
          {chars && chars.map((char, i) => {
            if (i < chars.length - 1) {
              return <CharacterImage key={char.charId} alt="Character image" size="160px" imagePath={char.image}/>
            } else {
              return <CharacterImage key={char.charId} alt="Character image" size="160px" imagePath={char.image}/>
            }
          })}
          <div ref={observerRef} style={{"height": "1px", "width": "1px", "border": "1px solid black", "opacity": "0.01"}}/>
        </StyledCharactersContainer>

        <StyledGenreButtonsContainer>
          {tags && tags.map((tag) => {
            return (
              <StyledButton key={tag.tag} onClick={() => toggleTag(tag.tagId)} $active={tagFilters[tag.tagId]}>
                <StyledOptionText>
                  {tag.tag}
                </StyledOptionText>
              </StyledButton>
            )})}
        </StyledGenreButtonsContainer>
      </StyledPaddingWrapper>
    </StyledMainContainer>
  )
}

export default CharactersMenu
