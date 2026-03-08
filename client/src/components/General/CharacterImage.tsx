import styled from 'styled-components';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const StyledSuggestionImage = styled.img<{$size: string}>`
  height: ${({ $size }) => $size};
  width: ${({ $size }) => $size};
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  box-shadow: 0 0.2em 0.2em rgba(0, 0, 0, 0.4);
  cursor: pointer;
`

export interface CharacterImageProps {
  alt: string
  size: string
  imagePath?: string
  updateChar?: () => void;
}

const CharacterImage = ({ alt, size, imagePath, updateChar } : CharacterImageProps) => {
  const src = imagePath ? (backendUrl + imagePath) : "/images/unknown.jpg";
  console.log(src);

  return (
    <StyledSuggestionImage src={src} alt={alt} $size={size} onClick={updateChar}/>
  )
}

export default CharacterImage