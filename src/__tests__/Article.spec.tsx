import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import Article from '../components/Article';
import '@testing-library/jest-dom'

beforeEach(cleanup)

describe('renders the article component with content', () => {
  it('should render the component', async () => {
    const { getByText, getByTestId } = render(
      <Article title="Test Job" url="https://google.com" by="ghocevar" time={1656936136} />
    );

    await waitFor(() => [
      expect(getByText('Test Job')).toBeVisible(),
      expect(getByTestId('article-by').textContent).toEqual('By: ghocevar'),
    ]);
  })
  
  it('should not render the component', async () => {
    const { queryByText } = render(
      <Article title="Test Job" url={undefined} by="ghocevar" time={1656936136} />
    );

    await waitFor(() => [
      expect(queryByText('Test Job')).toBeNull()
    ]);
  })
});