import styled from 'styled-components';

import Logo from './Logo';

const HeaderWrapper = styled.header``;

const Header = () => {
  return (
    <HeaderWrapper>
      <nav>
        <Logo />
      </nav>
      {/* <p>View jobs of the most actively hiring YC companies.</p> */}
    </HeaderWrapper>
  );
};

export default Header;
