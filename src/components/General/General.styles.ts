import styled from 'styled-components';

interface StyledMainContainerProps {
  height?: string
  width?: string
}

export const StyledMainContainer = styled.div<StyledMainContainerProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${({ height }) => height || '100%'};
  width: ${({ width }) => width || '100%'};
`;