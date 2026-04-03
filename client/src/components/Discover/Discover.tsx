import styled from 'styled-components';
import { useState, useEffect } from 'react';
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const StyledMainContainer = styled.div`
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100dvh;
  width: 100%;
  padding: 0.6rem 0rem 0 0rem;
  gap: 0.6rem;
`;

const StyledOption = styled.div`
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  height: fit-content;
  width: 100%;
  padding: 1.6rem 1.6rem 1.6rem 1.6rem;
  gap: 0.6rem;
  background: white;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 6px 20px rgba(0,0,0,0.06);
  overflow: hidden;
  cursor: pointer;

  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 
    0 6px 20px rgba(0,0,0,0.06),
    0px 4px 4px rgba(0,0,0,0.1);
  }
`;

const StyledHeaderText = styled.h1`
  font-size: 1.6rem;
  font-weight: 600;
  user-select: none;
`

const StyledGeneralText = styled.h1`
  font-size: 1.2rem;
  line-height: 0.8rem;
  user-select: none;
`

const Discover = () => {
  type TrendingData = {
    topCharacters: string[];
    topProperties: string[];
  };

  const [trending, setTrending] = useState<TrendingData>({
    topCharacters: [],
    topProperties: [],
  });

  async function fetchTrending() {
    try {
      const response = await axios.get(`${backendUrl}/trending`, 
        {
          params: {}
        }
      );
      setTrending({
        topCharacters: response.data.topCharacters ?? [],
        topProperties: response.data.topProperties ?? [],
      });
    } catch (error) {
      console.error("Character search failed", error);
    }
  };

  useEffect(() => {
    fetchTrending();
  }, [])

  return (
    <StyledMainContainer>
      <StyledOption>
        <StyledHeaderText>
          Trending Properties
        </StyledHeaderText>
        {trending.topProperties.length > 0 && trending.topProperties.map((prop, index) => {
          return <StyledGeneralText key={index}>{index + 1}. {prop}</StyledGeneralText>
        })}
      </StyledOption>

      <StyledOption>
        <StyledHeaderText>
          Trending Characters
        </StyledHeaderText>
        {trending.topCharacters.length > 0 && trending.topCharacters.map((prop, index) => {
          return <StyledGeneralText key={index}>{index + 1}. {prop}</StyledGeneralText>
        })}
      </StyledOption>
    </StyledMainContainer>
  )
}

export default Discover
