import { cleanup, render } from '@testing-library/react'
import Header from '../components/Header';
import '@testing-library/jest-dom'

beforeEach(cleanup)

describe('Header', () => {
	it('renders a title', async () => {
		const { getByText } = render(<Header />);
		expect(getByText('Jobs')).toBeVisible();
	});
});