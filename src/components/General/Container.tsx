import React from 'react'

import { StyledMainContainer } from './General.styles.ts';

type ContainerProps = {
  children?: React.ReactNode
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <StyledMainContainer height="100dvh" width="100dvw">
      {children}
    </StyledMainContainer>
  )
}

export default Container
