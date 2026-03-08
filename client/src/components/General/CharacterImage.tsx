import styled from 'styled-components';
import { forwardRef } from 'react';

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

const CharacterImage = forwardRef<HTMLImageElement, CharacterImageProps>(
  ({ alt, size, imagePath, updateChar }, ref) => {
    const src = imagePath ? backendUrl + imagePath : "/images/unknown.jpg";

    return (
      <StyledSuggestionImage
        src={src}
        alt={alt}
        ref={ref}
        $size={size}
        onClick={updateChar}
      />
    );
  }
);

export default CharacterImage;