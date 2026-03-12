import { useState, useEffect } from 'react';
import axios from "axios";
import styled from 'styled-components';

import CharacterImage from './CharacterImage';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const StyledMainContainer = styled.div<{ $direction?: string, $width?: string, $height?: string}>`
  display: flex;
  flex-direction: ${({ $direction }) => $direction ? $direction : "row"};
  align-items: ${({ $direction }) => $direction ? "flex-start" : "center"};
  height: ${({ $direction, $height }) => $direction == "row" ? $height : "fit-content"};
  width: ${({ $width }) => $width ? $width : "100%"};
  gap: 1rem;
`;

const StyledFilterSectionContainer = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  height: fit-content;
  width: 100%;
`;

const StyledInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
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
  line-height: 1rem;
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

const StyledCharacterDescription = styled.div`
  height: 100%;
  width: 100%;
  padding: 0rem 0.6rem;
  font-size: 1rem;
  border: 1px solid red;

  overflow-y: auto;
  scroll-behavior: smooth;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

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
  description: string;
  image: string;
};

type Property = {
  propertyId : number;
  name: string;
}

export interface SearchProps {
  direction?: string,
  height?: string,
  width?: string,
  numSuggestions: number,
  showPropFilter?: boolean,
  showCharDescription?: boolean,
  selectChar: (charId: number | null) => void,
  selectProperty?: (propertyId: number | null) => void
}

const Search = ({ direction, height, width, numSuggestions, showPropFilter, showCharDescription, selectChar, selectProperty } : SearchProps) => {
  const [charNameInput, setCharNameInput] = useState("");
  const [propertyNameInput, setPropertyNameInput] = useState("");
  const [charSuggestions, setCharSuggestions] = useState<Character[]>([]);
  const [propertySuggestions, setPropertySuggestions] = useState<Property[]>([]);
  const [denyCharSuggestionsUpdate, setDenyCharSuggestionsUpdate] = useState(false);
  const [denyPropertySuggestionsUpdate, setDenyPropertySuggestionsUpdate] = useState(false);
  const [showCharSuggestionsList, setShowCharSuggestionsList] = useState(true);
  const [showPropertySuggestionsList, setShowPropertySuggestionsList] = useState(true);

  function updateCharField(text: string) {
    if (text.trim() == "") {
      selectChar(null);
    }
    setCharNameInput(text);
  };

  function updatePropertyField(text: string) {
    if (text.trim() == "") {
      selectProperty?.(null);
    }
    setPropertyNameInput(text);
  };

  async function fetchCharacters(charNameInput: string) {
    try {
      const response = await axios.get(`${backendUrl}/characters/search`, 
        {
          params: { text: charNameInput, num: numSuggestions }
        }
      );
      setCharSuggestions(response.data);
    } catch (error) {
      console.error("Character search failed", error);
    }
  };

  async function fetchProperties(propertyNameInput: string) {
    try {
      const response = await axios.get(`${backendUrl}/properties/search`, 
        {
          params: { text: propertyNameInput, num: numSuggestions }
        }
      );
      setPropertySuggestions(response.data);
    } catch (error) {
      console.error("Character search failed", error);
    }
  };

  function handleCharSuggestions(charNameInput: string) {
    if (denyCharSuggestionsUpdate) return;

    setShowCharSuggestionsList(true);

    const timeout = setTimeout(() => {
      if (charNameInput.trim() != "") {
        fetchCharacters(charNameInput);
      } else {
        setCharSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
  };

  function handlePropertySuggestions(propertyNameInput: string) {
    if (denyPropertySuggestionsUpdate) return;

    setShowPropertySuggestionsList(true);

    const timeout = setTimeout(() => {
      if (propertyNameInput.trim() != "") {
        fetchProperties(propertyNameInput);
      } else {
        setPropertySuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
  };

  function updateSelectedCharacter(char: Character) {
    setCharSuggestions([{ charId: char.charId, name: char.name, description: char.description, image: char.image}]);
    setDenyCharSuggestionsUpdate(true);
    setCharNameInput(char.name);
    setShowCharSuggestionsList(false);
  }

  function updateSelectedProperty(property: Property) {
    setPropertySuggestions([{ propertyId: property.propertyId, name: property.name}]);
    setDenyPropertySuggestionsUpdate(true);
    setPropertyNameInput(property.name);
    setShowPropertySuggestionsList(false);
  }

  // Update character suggestions
  useEffect(() => {
    handleCharSuggestions(charNameInput);
  }, [charNameInput]);

  // Update property suggestions
  useEffect(() => {
    handlePropertySuggestions(propertyNameInput);
  }, [propertyNameInput]);

  // Deny update of suggestions when character chosen
  useEffect(() => {
    if (!denyCharSuggestionsUpdate) return;

    const timeout = setTimeout(() => {
      setDenyCharSuggestionsUpdate(false);
    }, 100);
  }, [denyCharSuggestionsUpdate]);

  // Deny update of suggestions when property chosen
  useEffect(() => {
    if (!denyPropertySuggestionsUpdate) return;

    const timeout = setTimeout(() => {
      setDenyPropertySuggestionsUpdate(false);
    }, 100);
  }, [denyPropertySuggestionsUpdate]);

  return (
    <StyledMainContainer $direction={direction} $width={width} $height={height}>
      <StyledFilterSectionContainer>
        <StyledInputContainer>
          <StyledInput 
            type="text" 
            name="char" 
            value={charNameInput} 
            placeholder="Character Name" 
            onChange={(e) => updateCharField(e.target.value)} 
            onFocus={() => {
              fetchCharacters(charNameInput);
              setShowCharSuggestionsList(true);
          }}/>

          {charSuggestions.length > 0 && showCharSuggestionsList && (
            <StyledSuggestionsContainer>
              {charSuggestions.map((char) => (
                <StyledSuggestion key={char.name}                 
                  onClick={() => {
                    updateSelectedCharacter(char);
                    selectChar(char.charId);
                  }
                }>
                  {char.name}
                </StyledSuggestion>
              ))}
            </StyledSuggestionsContainer>
          )}
        </StyledInputContainer>

        <StyledSuggestionImagesContainer>
          {charSuggestions.length > 0 
            ? charSuggestions.map((char) => (
                <CharacterImage 
                  key={char.name}
                  alt="Character image"
                  size="60px"
                  imagePath={char.image}
                  updateChar={() => {
                    updateSelectedCharacter(char);
                    selectChar(char.charId);
                  }
                }/>
              ))
            : (
                <CharacterImage 
                  key="unknown"
                  alt="Placeholder character image"
                  size="60px"
                />
              )
          }
        </StyledSuggestionImagesContainer>
      </StyledFilterSectionContainer>

      {showCharDescription && !showCharSuggestionsList && 
        <StyledCharacterDescription>{charSuggestions[0].description}</StyledCharacterDescription>
      }

      {showPropFilter && 
        <StyledFilterSectionContainer>
          <StyledInputContainer>
            <StyledInput 
              type="text" 
              name="property" 
              value={propertyNameInput} 
              placeholder="Property" 
              onChange={(e) => updatePropertyField(e.target.value)} 
              onFocus={() => {
                fetchProperties(propertyNameInput);
                setShowPropertySuggestionsList(true);
            }}/>

            {propertySuggestions.length > 0 && showPropertySuggestionsList && (
              <StyledSuggestionsContainer>
                {propertySuggestions.map((property) => (
                  <StyledSuggestion key={property.propertyId}                 
                    onClick={() => {
                      updateSelectedProperty(property);
                      selectProperty?.(property.propertyId);
                    }
                  }>
                    {property.name}
                  </StyledSuggestion>
                ))}
              </StyledSuggestionsContainer>
            )}
          </StyledInputContainer>
        </StyledFilterSectionContainer>
      }
    </StyledMainContainer>
  )
}

export default Search