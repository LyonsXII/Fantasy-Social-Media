import styled from 'styled-components';
import { useState, useEffect } from 'react';

const StyledMainContainer = styled.div<{$expanded: boolean}>`
  display: flex;
  flex-direction: column;
  height: fit-content;
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

const StyledInputContainer = styled.div`
  display: flex;
  height: 100%;
  min-width: 20%;
  gap: 0.6rem;
`;

const StyledInput = styled.input`
  height: fit-content;
  flex-grow: 1;
  padding: 0.4rem;
  font-size: 1rem;
  margin-top: 15px;
`;

const StyledButton = styled.button`
  height: fit-content;
  width: 30%;
  padding: 0.4rem;
  font-size: 1rem;
  margin-top: 15px;
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
      <StyledOptionText onClick={() => setExpanded(prev => !prev)}>
        Search
      </StyledOptionText>
      {expanded && 
        <StyledInputContainer
          as="form"
          onSubmit={(e) => {
            e.preventDefault();
            setSearchText(userInput);
          }}
        >
          <StyledInput 
            type="text" 
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
