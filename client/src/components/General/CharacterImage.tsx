import styled from 'styled-components';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const StyledSuggestionImage = styled.img`
  height: 60px;
  width: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  box-shadow: 0 0.2em 0.2em rgba(0, 0, 0, 0.4);
  cursor: pointer;
`

export interface CharacterImageProps {
  imagePath: string
}

const CharacterImage = ({ imagePath } : CharacterImageProps) => {
  const src = imagePath ? backendUrl + imagePath: "/images/unknown.jpg";

  return (
    <StyledSuggestionImage src={src} alt="Character portrait"/>
  )
}

export default CharacterImage