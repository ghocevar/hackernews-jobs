import { render, cleanup, waitFor } from '@testing-library/react';
import Article from '../components/Article';
import { singularArticle } from '../fixtures';
import '@testing-library/jest-dom';

beforeEach(cleanup);

describe('renders the article component with content', () => {
  it('should render the component', async () => {
    const { getByText, getByTestId } = render(<Article {...singularArticle} />);

    await waitFor(() => [
      expect(getByText('React Job')).toBeVisible(),
      expect(getByTestId('article-by').textContent).toEqual('By: ghocevar'),
    ]);
  });

  it('should not render the component', async () => {
    const { queryByText } = render(
      <Article {...singularArticle} url={undefined} />
    );

    await waitFor(() => [expect(queryByText('React Job')).toBeNull()]);
  });
});
