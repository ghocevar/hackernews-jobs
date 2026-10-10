import Image from 'next/image';

export default function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="/">
        <Image src="/ycombinator-logo.png" alt="" width={28} height={28} />
        <span>Hacker News Jobs</span>
      </a>
    </header>
  );
}
