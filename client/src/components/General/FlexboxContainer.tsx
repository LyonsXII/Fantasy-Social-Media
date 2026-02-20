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
  background: linear-gradient(to bottom, #d3fcff, #29709c);

  &::before { content: ''; position: absolute; inset: 0; background: url('/images/Patina.jpg'); background-repeat: no-repeat, repeat; background-size: cover, 200px 200px; background-blend-mode: multiply; opacity: 0.2; }
`;

const FlexboxContainer = ({ children, height, width, $direction } : FlexboxContainerProps) => {
  return (
    <StyledMainContainer height={height} width={width} $direction={$direction}>
      {children}
    </StyledMainContainer>
  )
}

export default FlexboxContainer
