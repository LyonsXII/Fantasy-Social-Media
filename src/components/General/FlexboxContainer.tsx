import styled from 'styled-components';

type FlexboxContainerProps = {
  children?: React.ReactNode
  height?: string
  width?: string
}

const StyledMainContainer = styled.div<FlexboxContainerProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${({ height }) => height || '100%'};
  width: ${({ width }) => width || '100%'};
`;

const FlexboxContainer = ({ children, height, width } : FlexboxContainerProps) => {
  return (
    <StyledMainContainer height={height} width={width}>
      {children}
    </StyledMainContainer>
  )
}

export default FlexboxContainer
