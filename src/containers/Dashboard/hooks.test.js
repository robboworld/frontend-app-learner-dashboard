import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';

import { apiHooks, reduxHooks } from 'hooks';

import appMessages from 'messages';
import * as hooks from './hooks';

jest.mock('hooks', () => ({
  apiHooks: {
    useInitializeApp: jest.fn(),
  },
  reduxHooks: {
    useRequestIsPending: jest.fn(),
    useRequestIsCompleted: jest.fn(),
  },
}));

const initializeApp = jest.fn();
apiHooks.useInitializeApp.mockReturnValue(initializeApp);

describe('Dashboard hooks', () => {
  const { formatMessage } = useIntl();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    reduxHooks.useRequestIsPending.mockReturnValue(false);
    reduxHooks.useRequestIsCompleted.mockReturnValue(false);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('useInitializeDashboard', () => {
    it('dispatches initialize on mount', () => {
      hooks.useInitializeDashboard();
      const mountEffect = React.useEffect.mock.calls[0];
      const [cb, prereqs] = mountEffect;
      expect(prereqs).toEqual([]);
      expect(initializeApp).not.toHaveBeenCalled();
      cb();
      expect(initializeApp).toHaveBeenCalledWith();
    });

    it('retries initialize when request was cleared without completing', () => {
      reduxHooks.useRequestIsPending.mockReturnValue(false);
      reduxHooks.useRequestIsCompleted.mockReturnValue(false);
      hooks.useInitializeDashboard();
      const retryEffect = React.useEffect.mock.calls[1];
      const [retryCb] = retryEffect;
      retryCb();
      expect(initializeApp).not.toHaveBeenCalled();
      jest.runOnlyPendingTimers();
      expect(initializeApp).toHaveBeenCalledWith();
    });

    it('does not retry while pending or completed', () => {
      reduxHooks.useRequestIsPending.mockReturnValue(true);
      reduxHooks.useRequestIsCompleted.mockReturnValue(false);
      hooks.useInitializeDashboard();
      const [retryCb] = React.useEffect.mock.calls[1];
      expect(retryCb()).toBeUndefined();
      expect(initializeApp).not.toHaveBeenCalled();
    });
  });

  describe('useDashboardMessages', () => {
    it('returns spinner screen reader text', () => {
      expect(hooks.useDashboardMessages().spinnerScreenReaderText).toEqual(
        formatMessage(appMessages.loadingSR),
      );
    });
    it('returns page title', () => {
      expect(hooks.useDashboardMessages().pageTitle).toEqual(
        formatMessage(appMessages.pageTitle),
      );
    });
  });
});
