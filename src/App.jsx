import React from 'react';
import { Helmet } from 'react-helmet';

import { useIntl } from '@edx/frontend-platform/i18n';
import { logError } from '@edx/frontend-platform/logging';
import { initializeHotjar } from '@edx/frontend-enterprise-hotjar';

import { ErrorPage, AppContext } from '@edx/frontend-platform/react';
import { Alert } from '@openedx/paragon';

import { RequestKeys } from 'data/constants/requests';
import store from 'data/store';
import {
  selectors,
  actions,
} from 'data/redux';
import { reduxHooks } from 'hooks';
import Dashboard from 'containers/Dashboard';

import track from 'tracking';

import fakeData from 'data/services/lms/fakeData/courses';

import AppWrapper from 'containers/WidgetContainers/AppWrapper';
import LearnerDashboardHeader from 'containers/LearnerDashboardHeader';

import { getConfig } from '@edx/frontend-platform';
import messages from './messages';
import './App.scss';

const RobboFooter = () => (
  <div className="wrapper wrapper-footer">
    <footer id="footer" className="robbo-site-footer">
      <div className="robbo-site-footer__inner">
        <div className="robbo-footer__left">
          <div className="robbo-footer__brand">
            <span className="robbo-footer__logo" aria-label="РОББО">
              РОББО
              <sup className="robbo-footer__reg" aria-hidden="true">®</sup>
            </span>
          </div>
          <p className="robbo-footer__copyright">
            © ООО «РОББО ТЕХНОЛОГИИ», {new Date().getFullYear()}
          </p>
        </div>
        <div className="robbo-footer__center">
          <nav className="robbo-footer__nav" aria-label="Документы">
            <ul className="robbo-footer__links">
              <li>
                <a href="https://edurobbo.ru/doc" target="_blank" rel="noopener noreferrer">
                  Сведения об образовательной организации
                </a>
              </li>
              <li>
                <a href="https://robbo.ru/wp-content/uploads/policy.pdf" target="_blank" rel="noopener noreferrer">
                  Политика обработки персональных данных
                </a>
              </li>
              <li>
                <a href="https://robbo.ru/wp-content/uploads/agree.pdf" target="_blank" rel="noopener noreferrer">
                  Согласие на обработку персональных данных
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="robbo-footer__contacts">
          <p className="robbo-footer__contacts-title">Контактные данные:</p>
          <p className="robbo-footer__contacts-line">
            Почта <a href="mailto:skill@robbo.ru">skill@robbo.ru</a>
          </p>
        </div>
      </div>
    </footer>
  </div>
);

export const App = () => {
  const { authenticatedUser } = React.useContext(AppContext);
  const { formatMessage } = useIntl();
  const isFailed = {
    initialize: reduxHooks.useRequestIsFailed(RequestKeys.initialize),
    refreshList: reduxHooks.useRequestIsFailed(RequestKeys.refreshList),
  };
  const hasNetworkFailure = isFailed.initialize || isFailed.refreshList;
  const { supportEmail } = reduxHooks.usePlatformSettingsData();
  const loadData = reduxHooks.useLoadData();

  React.useEffect(() => {
    if (authenticatedUser?.administrator || getConfig().NODE_ENV === 'development') {
      window.loadEmptyData = () => {
        loadData({ ...fakeData.globalData, courses: [] });
      };
      window.loadMockData = () => {
        loadData({
          ...fakeData.globalData,
          courses: [
            ...fakeData.courseRunData,
            ...fakeData.entitlementData,
          ],
        });
      };
      window.store = store;
      window.selectors = selectors;
      window.actions = actions;
      window.track = track;
    }
    if (getConfig().HOTJAR_APP_ID) {
      try {
        initializeHotjar({
          hotjarId: getConfig().HOTJAR_APP_ID,
          hotjarVersion: getConfig().HOTJAR_VERSION,
          hotjarDebug: !!getConfig().HOTJAR_DEBUG,
        });
      } catch (error) {
        logError(error);
      }
    }
  }, [authenticatedUser, loadData]);
  return (
    <>
      <Helmet>
        <title>{formatMessage(messages.pageTitle)}</title>
        <link rel="shortcut icon" href={getConfig().FAVICON_URL} type="image/x-icon" />
      </Helmet>
      <div>
        <AppWrapper>
          <LearnerDashboardHeader />
          <main id="main">
            {hasNetworkFailure
              ? (
                <Alert variant="danger">
                  <ErrorPage message={formatMessage(messages.errorMessage, { supportEmail })} />
                </Alert>
              ) : (
                <Dashboard />
              )}
          </main>
        </AppWrapper>
        <RobboFooter />
      </div>
    </>
  );
};

export default App;
