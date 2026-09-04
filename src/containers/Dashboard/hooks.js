import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { apiHooks, reduxHooks } from 'hooks';
import { RequestKeys } from 'data/constants/requests';

import appMessages from 'messages';

export const useInitializeDashboard = () => {
  const initialize = apiHooks.useInitializeApp();
  const initIsPending = reduxHooks.useRequestIsPending(RequestKeys.initialize);
  const initIsCompleted = reduxHooks.useRequestIsCompleted(RequestKeys.initialize);
  const initializeRef = React.useRef(initialize);
  initializeRef.current = initialize;

  React.useEffect(() => {
    initializeRef.current();
    // bfcache restore can revive a tree where initialize was aborted mid-navigation.
    const onPageShow = (event) => {
      if (event.persisted) {
        initializeRef.current();
      }
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

  // After a navigational abort we clear the request (not pending, not completed).
  // Retry so the loading animation stays until data actually lands.
  React.useEffect(() => {
    if (initIsPending || initIsCompleted) {
      return undefined;
    }
    // Defer so we don't double-fire with the mount effect in the same tick.
    const timeoutId = window.setTimeout(() => {
      initializeRef.current();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [initIsPending, initIsCompleted]);
};

export const useDashboardMessages = () => {
  const { formatMessage } = useIntl();
  return {
    spinnerScreenReaderText: formatMessage(appMessages.loadingSR),
    pageTitle: formatMessage(appMessages.pageTitle),
  };
};

export default {
  useInitializeDashboard,
  useDashboardMessages,
};
