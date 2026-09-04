import {
  isNavigationalFetchFailure,
  isRequestCancellation,
} from './requests';

describe('request failure helpers', () => {
  test('detects axios cancel codes', () => {
    expect(isRequestCancellation({ code: 'ERR_CANCELED' })).toBe(true);
    expect(isRequestCancellation({ name: 'CanceledError' })).toBe(true);
    expect(isRequestCancellation({ message: 'Request aborted' })).toBe(true);
  });

  test('treats axios Network Error without response as navigational', () => {
    expect(isNavigationalFetchFailure({
      isAxiosError: true,
      message: 'Network Error',
    })).toBe(true);
  });

  test('does not treat HTTP 500 as navigational', () => {
    expect(isNavigationalFetchFailure({
      isAxiosError: true,
      message: 'Request failed with status code 500',
      response: { status: 500 },
    })).toBe(false);
  });
});
