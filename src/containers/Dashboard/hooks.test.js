import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';

import { apiHooks } from 'hooks';

import appMessages from 'messages';
import * as hooks from './hooks';

jest.mock('hooks', () => ({
  apiHooks: {
    useInitializeApp: jest.fn(),
  },
}));

const initializeApp = jest.fn();
apiHooks.useInitializeApp.mockReturnValue(initializeApp);

describe('CourseCard hooks', () => {
  const { formatMessage } = useIntl();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useInitializeDashboard', () => {
    it('dispatches initialize thunk action on component load', () => {
      hooks.useInitializeDashboard();
      const [cb, prereqs] = React.useEffect.mock.calls[0];
      expect(prereqs).toEqual([]);
      expect(initializeApp).not.toHaveBeenCalled();
      cb();
      expect(initializeApp).toHaveBeenCalledWith();
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
