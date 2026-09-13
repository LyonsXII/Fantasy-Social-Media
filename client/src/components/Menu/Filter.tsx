import styled from 'styled-components';
import { useState } from 'react';

import Search from '../General/Search';

const StyledMainContainer = styled.button<{$expanded: boolean}>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  height: auto;
  max-height: ${({ $expanded }) => $expanded ? "300px" : "clamp(30px, 10dvh, 80px)"};
  width: 100%;
  padding: 0rem 0rem 1rem 0rem;
  flex-shrink: 0;
  background: linear-gradient(
    to bottom,
    rgb(255, 255, 255),
    rgb(240, 240, 240)
  );
  border: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.05);
  border-radius: 0rem 0.8rem 0.8rem 0rem;
  overflow: hidden;
  font: inherit;
  color: inherit;
  cursor: pointer;

  transition:
    max-height 1s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
  background: linear-gradient(
    to bottom,
    rgb(240, 240, 240),
    rgb(240, 240, 240)
  );
    box-shadow: 
    0 6px 20px rgba(0,0,0,0.06),
    0px 4px 4px rgba(0,0,0,0.1);
  }

  &:active {
    transform: translateY(2px);
    background: rgb(225, 225, 225);

    box-shadow:
      0 2px 6px rgba(0,0,0,0.08),
      0 1px 2px rgba(0,0,0,0.1);
  }
`;

const StyledTextContainer = styled.div`
  display: flex;
  align-items: center;
  min-height: clamp(30px, 10dvh, 80px);
  width: 100%;
`

const StyledOptionText = styled.p`
  margin-left: 1rem;
  font-size: clamp(16px, 2rem, 28px);
  font-weight: 600;
  user-select: none;
`;

const StyledSearchContainer = styled.div`
  height: 100%;
  width: 100%;
`

type FilterProps = {
  setCharacterFilter: (charId: number | null) => void;
  setPropertyFilter: (propertyId: number | null) => void;
};

const Filter = ({ setCharacterFilter, setPropertyFilter } : FilterProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <StyledMainContainer $expanded={expanded}>
      <StyledTextContainer onClick={() => setExpanded(prev => !prev)}>
        <StyledOptionText>
          Filter
        </StyledOptionText>
      </StyledTextContainer>
      <StyledSearchContainer>
        <Search
          direction="column"
          padding="0 1rem 0 1rem"
          numSuggestions={1}
          showPropFilter={true}
          selectChar={setCharacterFilter}
          selectProperty={setPropertyFilter}
        />
      </StyledSearchContainer>

    </StyledMainContainer>
  )
}

export default Filter
