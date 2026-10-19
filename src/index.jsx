/* eslint-disable import/prefer-default-export */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Route, Navigate, Routes,
} from 'react-router-dom';

import {
  AppProvider,
  PageWrap,
} from '@edx/frontend-platform/react';
import store from 'data/store';
import {
  APP_READY,
  APP_INIT_ERROR,
  getConfig,
  initialize,
  subscribe,
  mergeConfig,
} from '@edx/frontend-platform';

import { configuration } from './config';

import messages from './i18n';
import {
  initRobboErrors, RobboErrorBoundary, RobboErrorPage, robboErrorsMiddleware,
} from './robbo-errors';

import App from './App';
import NoticesWrapper from './components/NoticesWrapper';

const initYandexMetrika = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }
  const cfg = getConfig();
  if (!cfg.ENABLE_YANDEX_METRIKA || cfg.YANDEX_METRIKA_COUNTER_ID == null || cfg.YANDEX_METRIKA_COUNTER_ID === '') {
    return;
  }
  const counterId = Number(cfg.YANDEX_METRIKA_COUNTER_ID);
  if (!Number.isFinite(counterId) || counterId <= 0) {
    return;
  }
  const src = `https://mc.yandex.ru/metrika/tag.js?id=${counterId}`;
  const alreadyLoaded = Array.from(document.scripts || []).some(
    (scriptEl) => scriptEl.src === src || scriptEl.src.indexOf('https://mc.yandex.ru/metrika/tag.js') === 0,
  );
  if (!alreadyLoaded) {
    const scriptEl = document.createElement('script');
    scriptEl.async = true;
    scriptEl.src = src;
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(scriptEl, firstScript);
    } else {
      document.head.appendChild(scriptEl);
    }
  }
  window.ym = window.ym || function ymShim() { (window.ym.a = window.ym.a || []).push(arguments); };
  window.ym.l = 1 * new Date();
  window.ym(counterId, 'init', {
    ssr: true,
    webvisor: true,
    clickmap: true,
    ecommerce: 'dataLayer',
    referrer: document.referrer,
    url: window.location.href,
    accurateTrackBounce: true,
    trackLinks: true,
  });
};

// Robbo: human-readable errors with a code and number (src/robbo-errors).
initRobboErrors({ app: 'learner-dashboard' });

subscribe(APP_READY, () => {
  initYandexMetrika();
  const root = createRoot(document.getElementById('root'));

  root.render(
    <StrictMode>
      <AppProvider store={store}>
        <RobboErrorBoundary>
          <NoticesWrapper>
            <Routes>
              <Route path="/" element={<PageWrap><App /></PageWrap>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </NoticesWrapper>
        </RobboErrorBoundary>
      </AppProvider>
    </StrictMode>,
  );
});

// PubSub calls back with (topic, data): the error is the second argument.
subscribe(APP_INIT_ERROR, (message, error) => {
  const root = createRoot(document.getElementById('root'));

  root.render(
    <StrictMode>
      <RobboErrorPage error={error} startup />
    </StrictMode>,
  );
});

export const appName = 'LearnerHomeAppConfig';

initialize({
  authMiddleware: [robboErrorsMiddleware],
  handlers: {
    config: () => {
      mergeConfig(configuration, appName);
    },
  },
  messages,
  requireAuthenticatedUser: true,
});
