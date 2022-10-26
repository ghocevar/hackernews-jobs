import Article from '../components/Article';

import fetcher from '../utils/fetcher';
import GET_ALL_ARTICLES from '../graphql/allArticles';

import { IArticle } from '../interfaces/IArticle';

const getArticles = async () => {
  const { allArticles }: { allArticles: IArticle[] } = await fetcher(
    `https://os2ur82bcc.execute-api.eu-central-1.amazonaws.com/dev/graphql`,
    GET_ALL_ARTICLES
  );

  return allArticles;
};

const Home = async () => {
  const articles = await getArticles();

  return (
    <>
      <p className="description">
        View jobs of the most actively hiring YC companies.
      </p>
      {articles.map((article) => (
        <Article key={article.id} {...article} />
      ))}
    </>
  );
};

export default Home;
