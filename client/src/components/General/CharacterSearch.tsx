import { useState, useEffect } from 'react';
import axios from "axios";
import styled from 'styled-components';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const StyledMainContainer = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;
  gap: 0.6rem;
`;

const StyledInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 20%;
  gap: 0.6rem;
`;

const StyledInput = styled.input`
  height: fit-content;
  width: 100%;
  padding: 0.4rem;
  font-size: 1rem;
  margin-top: 15px;
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

const StyledSuggestionImagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: fit-content;
  min-width: 60px;
  gap: 0.6rem;
  margin: 0rem 1rem;
`

const StyledSuggestionImage = styled.img`
  height: 60px;
  width: 60px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0.2em 0.2em rgba(0, 0, 0, 0.4);
  cursor: pointer;
`

const StyledCreatePostContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  gap: 0.6rem;
`;

export const StyledMessageText = styled.div<{ $showMessageText : boolean }>`
  height: 1rem;
  width: 100%;
  font-size: 1rem;
  opacity: 0.8;
  padding-left: 1rem;
`;

type Character = {
  charId: number;
  name: string;
  image: string;
};

export interface CharacterSearchProps {
  $numSuggestions: number,
  select: (charId: number) => void
}

const CharacterSearch = ({ $numSuggestions, select } : CharacterSearchProps) => {
  const [charNameInput, setCharNameInput] = useState("");
  const [suggestions, setSuggestions] = useState<Character[]>([]);
  const [denySuggestionsUpdate, setDenySuggestionsUpdate] = useState(false);
  const [showSuggestionsList, setShowSuggestionsList] = useState(true);

  function updateField(text: string) {
    setCharNameInput(text);
  };

  async function fetchCharacters(charNameInput: string) {
    try {
      const response = await axios.get(`${backendUrl}/characters/search`, 
        {
          params: { text: charNameInput }
        }
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error("Character search failed", error);
    }
  };

  function handleSuggestions(charNameInput: string) {
    if (denySuggestionsUpdate) return;

    setShowSuggestionsList(true);

    const timeout = setTimeout(() => {
      if (charNameInput.trim() != "") {
        fetchCharacters(charNameInput);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
  };

  function updateSelectedCharacter(char: Character) {
    setSuggestions([{ charId: char.charId, name: char.name, image: char.image}]);
    setDenySuggestionsUpdate(true);
    setCharNameInput(char.name);
    setShowSuggestionsList(false);
  }

  // Update suggestions
  useEffect(() => {
    handleSuggestions(charNameInput);
  }, [charNameInput]);

  // Deny update of suggestions when character chosen
  useEffect(() => {
    if (!denySuggestionsUpdate) return;

    const timeout = setTimeout(() => {
      setDenySuggestionsUpdate(false);
    }, 100);
  }, [denySuggestionsUpdate]);

  return (
    <StyledMainContainer>
      <StyledInputContainer>
        <StyledInput type="text" name="char" value={charNameInput} placeholder="Character Name" onChange={(e) => updateField(e.target.value)} onFocus={() => {
          handleSuggestions(charNameInput);
          setShowSuggestionsList(true);
        }}/>
        {suggestions.length > 0 && showSuggestionsList && (
          <StyledSuggestionsContainer>
            {suggestions.slice(0, $numSuggestions).map((char) => (
              <StyledSuggestion key={char.name} 
                onClick={() => {
                  updateSelectedCharacter(char);
                  select(char.charId);
                }
              }>
                {char.name}
              </StyledSuggestion>
            ))}
          </StyledSuggestionsContainer>
        )}
      </StyledInputContainer>

      <StyledSuggestionImagesContainer>
        {suggestions.length == 0 && (
          <StyledSuggestionImage key="unknown" src="/images/unknown.jpg"/>
        )}
        {suggestions.length > 0 && (
          suggestions.slice(0, $numSuggestions).map((char) => (
            <StyledSuggestionImage 
              key={char.name}
              src={backendUrl + char.image}
              onClick={() => {
                updateSelectedCharacter(char)
                select(char.charId);
              }}
            />
          ))
        )}
      </StyledSuggestionImagesContainer>
    </StyledMainContainer>
  )
}

export default CharacterSearch