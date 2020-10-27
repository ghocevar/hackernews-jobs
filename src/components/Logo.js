import Image from 'next/image';
import styled from 'styled-components';

const Line = () => (
  <svg
    viewBox="0 0 24 24"
    width="32"
    height="32"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
    shapeRendering="geometricPrecision"
    style={{ color: '#eaeaea' }}
  >
    <path d="M16.88 3.549L7.12 20.451" />
  </svg>
);

const LogoWrapper = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
`;

const Logo = () => (
  <LogoWrapper>
    <Image
      src="/ycombinator-logo.png"
      height={30}
      width={30}
      alt="YCombinator Logo"
    />
    <Line />
    <h1 className="logo__title">Jobs</h1>
  </LogoWrapper>
);

export default Logo;
