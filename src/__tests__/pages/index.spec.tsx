import { render, waitFor } from '@testing-library/react'
import Home from '../../pages/index'
import '@testing-library/jest-dom'

describe('Home', () => {
  it('render a home page', async () => {
    const {getByText} = render(<Home />)
    await waitFor(() => [
        expect(getByText('Jobs')).toBeTruthy()
    ])
  })
})