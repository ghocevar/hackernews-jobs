import { RESTDataSource } from 'apollo-datasource-rest';

class HackerNewsAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://hacker-news.firebaseio.com/v0/';
  }

  async getAllArticleIds() {
    const result = await this.get('jobstories.json');
    return result;
  }

  async getArticle(articleId) {
    const result = await this.get(`item/${articleId}.json`);
    return result;
  }

  async getAllArticles() {
    const articleIds = await this.getAllArticleIds();

    return Promise.all(
      articleIds.map((articleId) => this.getArticle(articleId))
    );
  }
}

export default HackerNewsAPI;
