import styled from 'styled-components';

const HeaderWrapper = styled.header`
  display: flex;
  padding-left: 2.25rem;
  padding-bottom: 10px;
  align-items: center;

  .header__logo {
    height: 60px;
  }

  .header__title {
    font-size: 1.1rem;
    padding-left: 35px;
  }

  .header__title:hover {
    cursor: pointer;
    color: ${({ theme }) => theme.colors.blue};
  }
`;

export default HeaderWrapper;
