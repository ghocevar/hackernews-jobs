import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, cleanup, waitFor } from '@testing-library/react';

import Index, { getServerSideProps } from '../pages/index';
import { getStory } from '../services/hnApi';
import { storyIds, singularStory } from '../fixtures';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { STORY_INCREMENT } from '../constants';

beforeEach(cleanup);

jest.mock('../hooks/useInfiniteScroll');
jest.mock('../pages/index', () => ({
  getServerSideProps: jest.fn(),
}));
jest.mock('../services/hnApi', () => ({
  getStory: jest.fn(),
}));

test('Renders the application', async () => {
  useInfiniteScroll.mockImplementation(() => ({
    count: STORY_INCREMENT,
  }));
  getServerSideProps.mockImplementation(() => Promise.resolve(singularStory));
  getStory.mockImplementation(() => Promise.resolve(storyIds));

  await act(async () => {
    const { getByText, queryByTestId } = render(<Index />);
    await waitFor(() => [
      expect(getByText('Hacker News Jobs')).toBeTruthy(),
      expect(getByText('React')).toBeTruthy(),
      expect(queryByTestId('story-by').textContent).toEqual('By: ghocevar'),
    ]);
  });
});
