import FlexboxContainer from '../General/FlexboxContainer.tsx';
import PrimaryTitle from '../General/PrimaryTitle.tsx';
import Login from './Login.tsx';
import Marquee from './Marquee.tsx';

const LandingPage = () => {
  return (
    <FlexboxContainer height="100dvh" width="100dvw" $direction="column">
      {/* <PrimaryTitle
        $fontSize="4rem"
        $backgroundImage="data:image/svg+xml,%3Csvg width='2250' height='900' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg%3E%3Cpath fill='%2300A080' d='M0 0h2255v899H0z'/%3E%3Ccircle cx='366' cy='207' r='366' fill='%2300FDCF'/%3E%3Ccircle cx='1777.5' cy='318.5' r='477.5' fill='%2300FDCF'/%3E%3Ccircle cx='1215' cy='737' r='366' fill='%23008060'/%3E%3C/g%3E%3C/svg%3E"
        $backgroundSize="110% auto"
      >
        Dramatis Personae
      </PrimaryTitle> */}
      <Login/>
      <Marquee $direction="horizontal" $length={20} />
      <Marquee $direction="vertical" $length={5} />
    </FlexboxContainer>
  )
}

export default LandingPage
