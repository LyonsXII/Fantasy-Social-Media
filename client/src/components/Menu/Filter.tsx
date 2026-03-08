import styled from 'styled-components';
import { useState } from 'react';

import CharacterSearch from '../General/CharacterSearch';

const StyledMainContainer = styled.div<{$expanded: boolean}>`
  display: flex;
  flex-direction: column;
  height: fit-content;
  min-height: ${({ $expanded }) => $expanded ? "200px" : "0px"};
  width: 100%;
  padding: 1.6rem 1.6rem 1.6rem 1.6rem;
  gap: 0.6rem;
  background: white;
  border: 1px solid rgba(0,0,0,0.06);
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

type FilterProps = {
  setCharacterFilter: (charId: number | null) => void;
};

const Filter = ({ setCharacterFilter } : FilterProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <StyledMainContainer $expanded={expanded}>
      <StyledOptionText onClick={() => setExpanded(prev => !prev)}>
        Filter
      </StyledOptionText>
      {expanded && <CharacterSearch numSuggestions={1} select={setCharacterFilter}/>}
    </StyledMainContainer>
  )
}

export default Filter
