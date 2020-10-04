import HeaderWrapper from '../styles/HeaderStyles';

const Header = () => {
  return (
    <HeaderWrapper>
      <img
        className="header__logo"
        src="/ycombinator-logo.png"
        alt="YCombinator Logo"
      />
      <h1 className="header__title">Hacker News Jobs</h1>
    </HeaderWrapper>
  );
};

export default Header;
