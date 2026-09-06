import styled from 'styled-components';
import { useState, useEffect } from 'react';

const StyledMainContainer = styled.div<{$expanded: boolean}>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  height: 150px;
  max-height: ${({ $expanded }) => $expanded ? "150px" : "clamp(30px, 10dvh, 80px)"};
  width: 100%;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.07);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.05);
  border-radius: 0rem 0.8rem 0.8rem 0rem;
  overflow: hidden;
  cursor: pointer;

  transition: box-shadow 0.2s ease, max-height 1s ease;

  &:hover {
    box-shadow: 
    0 6px 20px rgba(0,0,0,0.06),
    0px 4px 4px rgba(0,0,0,0.1);
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

const StyledInputContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
  width: 100%;
  min-width: 20%;
  padding: 0rem 1rem 2rem 1rem;
  gap: 0.6rem;
`;

const StyledInput = styled.input`
  height: fit-content;
  flex-grow: 1;
  padding: 0.4rem;
  font-size: 1rem;
`;

const StyledButton = styled.button`
  height: fit-content;
  width: 30%;
  padding: 0.4rem;
  font-size: 1rem;
`;

type TextSearchProps = {
  setSearchText: (text: string) => void;
};

const TextSearch = ({ setSearchText } : TextSearchProps) => {
  const [expanded, setExpanded] = useState(false);
  const [userInput, setUserInput] = useState("");

  function updateUserInput(text: string) {
    setUserInput(text);
  };

  useEffect(() => {
    if (userInput == "") {
      setSearchText("");
    }
  }, [userInput]);

  return (
    <StyledMainContainer $expanded={expanded}>
      <StyledTextContainer onClick={() => setExpanded(prev => !prev)}>
        <StyledOptionText>
          Search
        </StyledOptionText>
      </StyledTextContainer>

      {expanded && 
        <StyledInputContainer
          as="form"
          onSubmit={(e) => {
            e.preventDefault();
            setSearchText(userInput);
          }}
        >
          <StyledInput 
            type="search"
            autoComplete="off" 
            name="char" 
            value={userInput} 
            placeholder="Enter text to search..." 
            onChange={(e) => updateUserInput(e.target.value)}
          />
          <StyledButton type="submit">
            Search
          </StyledButton>
        </StyledInputContainer>
      }
    </StyledMainContainer>
  )
}

export default TextSearch
