import { useState, useEffect } from 'react';
import axios from "axios";
import styled from 'styled-components';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const StyledMainContainer = styled.div`
  display: flex;
  height: 40%;
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
  margin-top: calc(15px);
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
  gap: 0.6rem;
  margin: 0rem 1rem;
`

const StyledSuggestionImage = styled.div<{ $imageUrl: string }>`
  height: 60px;
  width: 60px;
  border-radius: 100%;
  background-image: ${({ $imageUrl }) => `url(${backendUrl + $imageUrl})`};
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  box-shadow: 0 0.2em 0.2em rgba(0, 0, 0, 0.4);
  cursor: pointer;
`

const StyledCreatePostContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 1.6rem 1.6rem 1.6rem 1.6rem;
  gap: 0.6rem;
`;

type Character = {
  id: number;
  name: string;
  image: string;
};

const CreatePostMenu = () => {
  const [charNameInput, setCharNameInput] = useState("");
  const [suggestions, setSuggestions] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);
  const [denySuggestionsUpdate, setDenySuggestionsUpdate] = useState(false);
  const [showSuggestionsList, setShowSuggestionsList] = useState(true);

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

  function updateSelectedCharacter(char: Character) {
    setSelectedCharacter(char.id);
    setSuggestions([{ id: char.id, name: char.name, image: char.image}]);
    setDenySuggestionsUpdate(true);
    setCharNameInput(char.name);
    setShowSuggestionsList(false);
  }

  // Update suggestions
  useEffect(() => {
    if (denySuggestionsUpdate) return;

    setShowSuggestionsList(true);

    const timeout = setTimeout(() => {
      if (charNameInput.trim()) {
        fetchCharacters(charNameInput);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
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
          fetchCharacters(charNameInput);
          setShowSuggestionsList(true);
        }}/>
        {suggestions.length > 0 && showSuggestionsList && (
          <StyledSuggestionsContainer>
            {suggestions.map((char) => (
              <StyledSuggestion key={char.name} onClick={() => updateSelectedCharacter(char)}>
                {char.name}
              </StyledSuggestion>
            ))}
          </StyledSuggestionsContainer>
        )}
      </StyledInputContainer>

      <StyledSuggestionImagesContainer>
        {suggestions.length > 0 && (
          suggestions.map((char) => (
            <StyledSuggestionImage 
              key={char.name}
              $imageUrl={char.image}
              onClick={() => updateSelectedCharacter(char)}
            />
          ))
        )}
      </StyledSuggestionImagesContainer>

      <StyledCreatePostContentContainer>

      </StyledCreatePostContentContainer>
    </StyledMainContainer>
  )
}

export default CreatePostMenu
