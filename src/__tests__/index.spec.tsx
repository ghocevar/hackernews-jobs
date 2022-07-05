import { render, waitFor } from '@testing-library/react'
import Home from '../pages/index'
import fetcher from '../utils/fetcher'
import '@testing-library/jest-dom'
import { allArticles } from '../fixtures'

jest.mock('../utils/fetcher.ts')

const fetcherMock = fetcher as jest.MockedFunction<typeof fetcher>

describe('Home', () => {
  fetcherMock.mockImplementation(() => Promise.resolve({allArticles}))
  
  it('render a home page', async () => {
    const { getByText, getByTestId } = render(<Home />)
    await waitFor(() => [
        expect(getByText('Jobs')).toBeTruthy(),
        expect(getByText('React Job')).toBeVisible(),
        expect(getByTestId('article-by').textContent).toEqual('By: ghocevar'),
    ])
  })
})