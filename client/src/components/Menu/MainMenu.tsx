import styled from 'styled-components';

import Characters from '../Feed/CharactersMenu';
import Filter from './Filter';

const StyledMainContainer = styled.div`
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100dvh;
  width: 100%;
  padding: 0.6rem 0rem 0 0rem;
  gap: 0.6rem;
`;

const StyledOption = styled.div`
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  height: fit-content;
  width: 100%;
  padding: 1.6rem 1.6rem 1.6rem 1.6rem;
  gap: 0.6rem;
  background: white;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 6px 20px rgba(0,0,0,0.06);
  overflow: hidden;
  cursor: pointer;

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
`;

type MainMenuProps = {
  toggleShowCreatePostMenu: () => void;
  toggleShowCharactersMenu: () => void;
  setCharacterFilter: (charId: number | null) => void;
  setPropertyFilter: (propertyId: number | null) => void;
};

const MainMenu = ({ toggleShowCreatePostMenu, toggleShowCharactersMenu, setCharacterFilter, setPropertyFilter } : MainMenuProps) => {
  return (
    <StyledMainContainer>
      <StyledOption onClick={toggleShowCreatePostMenu}>
        <StyledOptionText>
          Create Post
        </StyledOptionText>
      </StyledOption>

      <StyledOption onClick={toggleShowCharactersMenu}>
        <StyledOptionText>
          Characters
        </StyledOptionText>
      </StyledOption>

      <StyledOption>
        <StyledOptionText>
          Search
        </StyledOptionText>
      </StyledOption>

      <Filter setCharacterFilter={setCharacterFilter} setPropertyFilter={setPropertyFilter}/>

      <StyledOption>
        <StyledOptionText>
          Log Out
        </StyledOptionText>
      </StyledOption>
    </StyledMainContainer>
  )
}

export default MainMenu
