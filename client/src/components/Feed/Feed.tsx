import styled from 'styled-components';
import { useState } from 'react';

import MainMenu from '../Menu/MainMenu';
import Stream from './Stream';

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
  const [characterFilter, setCharacterFilter] = useState<number | null>(null);

  const toggleShowCreatePostMenu = () => {
    setShowCreatePostMenu(prev => !prev);
  };

  const handleSetCharacterFilter = (charId: number | null) => {
    if (charId) {
      setCharacterFilter(charId)
    } else {
      setCharacterFilter(null);
    }
  };

  return (
    <StyledMainContainer>
      <MainMenu $toggleShowCreatePostMenu={toggleShowCreatePostMenu} setCharacterFilter={handleSetCharacterFilter}/>
      <Stream $showCreatePostMenu={showCreatePostMenu} characterFilter={characterFilter}/>
      <div></div>
    </StyledMainContainer>
  )
}

export default Feed
