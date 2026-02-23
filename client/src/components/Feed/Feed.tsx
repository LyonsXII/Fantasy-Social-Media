import styled from 'styled-components';

import Stream from './Stream';

const StyledMainContainer = styled.div`
  display: grid;
  grid-template-columns: 20% 60% 20%;
  min-height: 100vh;
  height: 100dvh;
  width: 100dvw;
`;

const Feed = () => {

  return (
    <StyledMainContainer>
      <div></div>
      <Stream/>
      <div></div>
    </StyledMainContainer>
  )
}

export default Feed
