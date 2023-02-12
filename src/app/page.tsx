import Article from '../components/Article';
import { IArticle } from '../interfaces/IArticle';

const getArticles = async () => {
  const res = await fetch('http://localhost:8000', {
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
      {articles.map((article: IArticle) => (
        <Article key={article.id} {...article} />
      ))}
    </>
  );
};

export default Home;
