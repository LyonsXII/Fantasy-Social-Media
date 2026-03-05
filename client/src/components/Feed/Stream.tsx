import styled from 'styled-components';

import CreatePostMenu from './CreatePostMenu';
import Post from './Post';

type StreamProps = {
  $showCreatePostMenu: boolean;
};

const StyledMainContainer = styled.div`
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100dvh;
  width: 100%;
  padding: 0.6rem 0.6rem 0 0.6rem;
  gap: 0.6rem;
`;

const Stream = ({ $showCreatePostMenu } : StreamProps) => {

  return (
    <StyledMainContainer>
      {$showCreatePostMenu && <CreatePostMenu />}
      <Post $postId={1}/>
      <Post $postId={2}/>
      <Post $postId={3}/>
    </StyledMainContainer>
  )
}

export default Stream
