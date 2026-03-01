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

const StyledSuggestionImagesContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  height: 100%;
  width: 80%;
  padding-left: 1rem;
  gap: 0.6rem;
`

const StyledSuggestionImage = styled.div<{ $imageUrl: string }>`
  height: 80px;
  width: 80px;
  border-radius: 100%;
  background-image: ${({ $imageUrl }) => {
    const fullUrl = backendUrl + $imageUrl;
    console.log("Image URL:", fullUrl);
    return `url(${fullUrl})`;
  }};
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  box-shadow: 0 0.2em 0.2em rgba(0, 0, 0, 0.4);
  cursor: pointer;
`

const CreatePostMenu = () => {
  const [charNameInput, setCharNameInput] = useState("");
  const [suggestions, setSuggestions] = useState<{ id: number, name: string; image: string }[]>([]);

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

  // TEMPORARY - DELETE THIS MICHAEL IF YOU'RE DONE WITH IT
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

      <StyledSuggestionImagesContainer>
        {suggestions.length > 0 && (
          suggestions.map((char) => (
            <StyledSuggestionImage 
              key={char.name} 
              $imageUrl={char.image}
            />
          ))
        )}
      </StyledSuggestionImagesContainer>
    </StyledMainContainer>
  )
}

export default CreatePostMenu
