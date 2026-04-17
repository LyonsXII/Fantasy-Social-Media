import styled from 'styled-components';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const StyledContainer = styled.div`
  display: flex;
  height: 100dvh;
  width: 100dvw;
`

export interface CharacterImageProps {
  alt: string
  size: string
  imagePath?: string
  updateChar?: () => void;
}

const PostPage = () => {

    return (
      <StyledContainer>

      </StyledContainer>
    );
  }

export default PostPage;