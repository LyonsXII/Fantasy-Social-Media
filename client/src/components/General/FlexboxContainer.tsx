import styled from 'styled-components';

type FlexboxContainerProps = {
  children?: React.ReactNode
  height?: string
  width?: string
  $direction?: string
}

const StyledMainContainer = styled.div<FlexboxContainerProps>`
  display: flex;
  flex-direction: ${({ $direction }) => $direction || 'row'};
  align-items: center;
  justify-content: center;
  height: ${({ height }) => height || '100%'};
  width: ${({ width }) => width || '100%'};
  border: 1px solid cyan;
`;

const FlexboxContainer = ({ children, height, width, $direction } : FlexboxContainerProps) => {
  return (
    <StyledMainContainer height={height} width={width} $direction={$direction}>
      {children}
    </StyledMainContainer>
  )
}

export default FlexboxContainer
