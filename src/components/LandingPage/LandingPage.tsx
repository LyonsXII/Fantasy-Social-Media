import FlexboxContainer from '../General/FlexboxContainer.tsx';
import PrimaryTitle from '../General/PrimaryTitle.tsx';

type LandingPageProps = {
}

const LandingPage: React.FC<LandingPageProps> = (props) => {
  return (
    <FlexboxContainer height="100dvh" width="100dvw">
      <PrimaryTitle fontSize="60px" shadow={8} primaryColour="white" secondaryColour="black">
        Dramatis Personae
      </PrimaryTitle>
    </FlexboxContainer>
  )
}

export default LandingPage
