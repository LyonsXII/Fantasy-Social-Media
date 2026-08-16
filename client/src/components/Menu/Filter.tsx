import styled from 'styled-components';
import { useState } from 'react';

import Search from '../General/Search';

const StyledMainContainer = styled.div<{$expanded: boolean}>`
  display: flex;
  flex-direction: column;
  height: auto;
  max-height: ${({ $expanded }) => $expanded ? "400px" : "80px"};
  width: 100%;
  padding: 1.6rem 1.6rem 1.6rem 1.6rem;
  gap: 0.6rem;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.07);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.05);
  border-radius: 0rem 0.8rem 0.8rem 0rem;
  overflow: hidden;

  transition: box-shadow 0.2s ease, max-height 1s ease;

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
  setPropertyFilter: (propertyId: number | null) => void;
};

const Filter = ({ setCharacterFilter, setPropertyFilter } : FilterProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <StyledMainContainer $expanded={expanded}>
      <StyledOptionText onClick={() => setExpanded(prev => !prev)}>
        Filter
      </StyledOptionText>
      <Search 
        direction="column" 
        numSuggestions={1} 
        showPropFilter={true} 
        selectChar={setCharacterFilter} 
        selectProperty={setPropertyFilter}
      />
    </StyledMainContainer>
  )
}

export default Filter
