import { useState, useEffect } from 'react';
import axios from "axios";
import styled from 'styled-components';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const StyledMainContainer = styled.div`
  position: relative;
  isolation: isolate;
  display: flex;
  height: 30%;
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
  font-size: 1rem;
  font-weight: 600;
  user-select: none;
`;

const StyledInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 20%;
  gap: 0.6rem;
`;

const StyledInput = styled.input`
  height: fit-content;
  width: 100%;
  padding: 0.4rem;
  font-size: 1rem;
`;

const StyledSuggestionsContainer = styled.div`
  height: fit-content;
  max-height: 100%;
  width: 100%;
  border: 1px solid black;
`;

const StyledSuggestion = styled.div`
  height: fit-content;
  width: 100%;
  padding: 0.4rem;
  font-size: 1rem;
  border: 1px solid hsla(0, 0%, 0%, 0.2);

  &:hover {
    background-color: grey;
  }
`;

const CreatePostMenu = () => {
  const [charNameInput, setCharNameInput] = useState("");
  const [suggestions, setSuggestions] = useState<{ name: string; img: string }[]>([]);

  function updateField(text: string) {
  setCharNameInput(text);
  };

  async function fetchCharacters(query: string) {
    try {
      const response = await axios.get(`${backendUrl}/characters/search`, 
        {
          params: { charName: query }
        }
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error("Character search failed", error);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (charNameInput.trim()) {
        fetchCharacters(charNameInput);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [charNameInput]);

  useEffect(() => {
    console.log(suggestions);
  }, [suggestions]);

  return (
    <StyledMainContainer>
      <StyledInputContainer>
        <StyledInput type="text" name="char" value={charNameInput} placeholder="Character Name" onChange={(e) => updateField(e.target.value)}/>
        {suggestions.length > 0 && (
          <StyledSuggestionsContainer>
            {suggestions.map((char) => (
              <StyledSuggestion key={char.name}>
                {char.name}
              </StyledSuggestion>
            ))}
          </StyledSuggestionsContainer>
        )}
    </StyledInputContainer>
    </StyledMainContainer>
  )
}

export default CreatePostMenu
