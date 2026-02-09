import React from 'react'
import styled from 'styled-components';

type MyComponentProps = {
  // Add your props here
}

export const MyComponent: React.FC<MyComponentProps> = (props) => {
  return (
    <div className={styles.container}>
      {/* Add your content here */}
    </div>
  )
}
