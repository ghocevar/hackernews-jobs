import ArticlesContainer from '../containers/ArticlesContainer';

const { API_URL } = process.env;

const HOUR = 60 * 60;
export const revalidate = 1 * HOUR;

const getArticles = async () => {
  const res = await fetch(API_URL, {
    cache: 'no-cache',
  });

  if (!res.ok) {
    throw new Error('Unable to fetch articles');
  }

  return res.json();
};

const Home = async () => {
  const articles = await getArticles();

  return (
    <>
      <p>View jobs of the most actively hiring YC companies.</p>
      <ArticlesContainer articles={articles} />
    </>
  );
};

export default Home;
