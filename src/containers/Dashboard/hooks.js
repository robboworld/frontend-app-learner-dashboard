import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { apiHooks } from 'hooks';

import appMessages from 'messages';

export const useInitializeDashboard = () => {
  const initialize = apiHooks.useInitializeApp();
  React.useEffect(() => { initialize(); }, []); // eslint-disable-line
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
