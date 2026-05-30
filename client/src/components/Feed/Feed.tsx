import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';

import MainMenu from '../Menu/MainMenu';
import Stream from './Stream/Stream';
import Discover from '../Discover/Discover';

const StyledMainContainer = styled.div`
  display: grid;
  grid-template-columns: 20% 60% 20%;
  min-height: 100vh;
  height: 100dvh;
  width: 100dvw;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('/images/Patina.jpg') no-repeat center / cover;
    opacity: 0.2;
    z-index: -1;
  }
`;

const Feed = () => {
  const [showCreatePostMenu, setShowCreatePostMenu] = useState(false);
  const [showCharactersMenu, setShowCharactersMenu] = useState(false);
  const [characterFilter, setCharacterFilter] = useState<number | null>(null);
  const [propertyFilter, setPropertyFilter] = useState<number | null>(null);
  const [showFavourites, setShowFavourites] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Animation parameters
  const [playCreatePostExit, setPlayCreatePostExit] = useState(false);
  const [playCharactersMenuExit, setPlayCharactersMenuExit] = useState(false);

  const streamRef = useRef<HTMLDivElement | null>(null);

  const toggleShowCreatePostMenu = () => {
    setShowCreatePostMenu(prev => !prev);
  };

  const toggleShowCharactersMenu = () => {
    setShowCharactersMenu(prev => !prev);
  };

  const toggleShowFavouritesMenu = () => {
    setShowFavourites(prev => !prev);
  };

  const handleSetCharacterFilter = (charId: number | null) => {
    if (charId) {
      setCharacterFilter(charId)
    } else {
      setCharacterFilter(null);
    }
  };

  const handleSetPropertyFilter = (propertyId: number | null) => {
    if (propertyId) {
      setPropertyFilter(propertyId)
    } else {
      setPropertyFilter(null);
    }
  };

  // Play exit animation for create post menu then set show to false
  useEffect(() => {
    if (!playCreatePostExit) return;
    setTimeout(() => {
      setShowCreatePostMenu(false);
    }, 600);
  }, [playCreatePostExit]);

  // Play exit animation for create post menu then set show to false
  useEffect(() => {
    if (!playCharactersMenuExit) return;
    setTimeout(() => {
      setShowCharactersMenu(false);
    }, 1000);
  }, [playCharactersMenuExit]);

  return (
    <StyledMainContainer>
      <MainMenu 
        showCreatePostMenu={showCreatePostMenu} 
        setShowCreatePostMenu={setShowCreatePostMenu} 
        setPlayCreatePostExit={setPlayCreatePostExit}
        showCharactersMenu={showCharactersMenu}
        setShowCharactersMenu={setShowCharactersMenu}
        setPlayCharactersMenuExit={setPlayCharactersMenuExit} 
        toggleShowFavouritesMenu={toggleShowFavouritesMenu} 
        setCharacterFilter={handleSetCharacterFilter} 
        setPropertyFilter={handleSetPropertyFilter} 
        setSearchText={setSearchText}/>
      <Stream 
        streamRef={streamRef} 
        showCreatePostMenu={showCreatePostMenu} 
        setShowCreatePostMenu={setShowCreatePostMenu} 
        playCreatePostExit={playCreatePostExit} 
        setPlayCreatePostExit={setPlayCreatePostExit}
        showCharactersMenu={showCharactersMenu}
        setShowCharactersMenu={setShowCharactersMenu}
        playCharactersMenuExit={playCharactersMenuExit}
        setPlayCharactersMenuExit={setPlayCharactersMenuExit}
        showFavourites={showFavourites} 
        characterFilter={characterFilter} 
        propertyFilter={propertyFilter} 
        searchText={searchText}/>
      <Discover/>
    </StyledMainContainer>
  )
}

export default Feed
