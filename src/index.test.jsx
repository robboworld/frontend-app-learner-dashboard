import {
  APP_INIT_ERROR,
  APP_READY,
  initialize,
  mergeConfig,
  subscribe,
} from '@edx/frontend-platform';

import { configuration } from './config';
import { initRobboErrors } from './robbo-errors';
import * as app from '.';

// These need to be var not let so they get hoisted
// and can be used by jest.mock (which is also hoisted)
var mockRender; // eslint-disable-line no-var
var mockCreateRoot; // eslint-disable-line no-var
jest.mock('react-dom/client', () => {
  mockRender = jest.fn();
  mockCreateRoot = jest.fn(() => ({
    render: mockRender,
  }));

  return ({
    createRoot: mockCreateRoot,
  });
});

jest.mock('@edx/frontend-platform', () => ({
  mergeConfig: jest.fn(),
  ensureConfig: jest.fn(),
  getConfig: () => ({}), // Yandex Metrika (index.jsx) reads it on APP_READY
  APP_READY: 'app-is-ready-key',
  APP_INIT_ERROR: 'app-init-error',
  initialize: jest.fn(),
  subscribe: jest.fn(),
}));

jest.mock('data/store', () => ({ redux: 'store' }));
jest.mock('./App', () => 'App');
jest.mock('components/NoticesWrapper', () => 'NoticesWrapper');
// Robbo: src/robbo-errors has its own tests; here only its wiring is checked (the real initRobboErrors
// would add its own APP_READY subscriber and shift subscribe.mock.calls).
jest.mock('./robbo-errors', () => ({
  initRobboErrors: jest.fn(),
  RobboErrorBoundary: 'RobboErrorBoundary',
  RobboErrorPage: 'RobboErrorPage',
  robboErrorsMiddleware: 'robboErrorsMiddleware',
}));

describe('app registry', () => {
  let getElement;

  beforeEach(() => {
    mockCreateRoot.mockClear();
    mockRender.mockClear();

    getElement = window.document.getElementById;
    window.document.getElementById = jest.fn(id => ({ id }));
  });
  afterAll(() => {
    window.document.getElementById = getElement;
  });

  test('subscribe: APP_READY.  links App to root element', () => {
    const callArgs = subscribe.mock.calls[0];
    expect(callArgs[0]).toEqual(APP_READY);
    callArgs[1]();
    const [rendered] = mockRender.mock.calls[0];
    expect(rendered).toMatchSnapshot();
  });
  test('subscribe: APP_INIT_ERROR.  snapshot: displays an ErrorPage to root element', () => {
    const callArgs = subscribe.mock.calls[1];
    expect(callArgs[0]).toEqual(APP_INIT_ERROR);
    const error = { message: 'test-error-message' };
    // Robbo: PubSub calls back with (topic, data), the error is the second argument.
    callArgs[1](APP_INIT_ERROR, error);
    const [rendered] = mockRender.mock.calls[0];
    expect(rendered).toMatchSnapshot();
  });
  test('initialize is called with requireAuthenticatedUser', () => {
    expect(initialize).toHaveBeenCalledTimes(1);
    const initializeArg = initialize.mock.calls[0][0];
    expect(initializeArg.requireAuthenticatedUser).toEqual(true);
  });
  test('Robbo: human-readable errors, axios errors through robboErrorsMiddleware', () => {
    expect(initRobboErrors).toHaveBeenCalledWith({ app: 'learner-dashboard' });
    expect(initialize.mock.calls[0][0].authMiddleware).toEqual(['robboErrorsMiddleware']);
  });
  test('initialize config', () => {
    const initializeArg = initialize.mock.calls[0][0];
    initializeArg.handlers.config();
    expect(mergeConfig).toHaveBeenCalledWith(configuration, app.appName);
  });
});
