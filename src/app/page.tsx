import ArticleCard from '../components/Article';
import { loadJobStories } from '../lib/hnStories';

export const revalidate = 0;

export default async function Home() {
  const articles = await loadJobStories();

  return (
    <>
      <p className="lede">
        View jobs of the most actively hiring YC companies.
      </p>
      {articles.length === 0 ? (
        <p className="empty">No job stories right now.</p>
      ) : (
        <div className="jobs">
          {articles.map((article) => (
            <ArticleCard key={article.id} {...article} />
          ))}
        </div>
      )}
    </>
  );
}
