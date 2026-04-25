import React from 'react';

import MasqueradeBar from 'containers/MasqueradeBar';
import { AppContext } from '@edx/frontend-platform/react';
import { reduxHooks } from 'hooks';
import urls from 'data/services/lms/urls';

import ConfirmEmailBanner from './ConfirmEmailBanner';

import { useLearnerDashboardHeaderMenu, findCoursesNavClicked } from './hooks';

import './index.scss';

export const LearnerDashboardHeader = () => {
  const { authenticatedUser } = React.useContext(AppContext);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const { courseSearchUrl } = reduxHooks.usePlatformSettingsData();

  const exploreCoursesClick = () => {
    findCoursesNavClicked(urls.baseAppUrl(courseSearchUrl));
  };

  const learnerHomeHeaderMenu = useLearnerDashboardHeaderMenu({
    courseSearchUrl,
    authenticatedUser,
    exploreCoursesClick,
  });

  return (
    <>
      <ConfirmEmailBanner />
      <header className="robbo-mfe-header">
        <div className="robbo-mfe-header__inner">
          <a className="robbo-mfe-header__brand" href="/" aria-label="РОББО">
            <span className="robbo-mfe-header__wordmark">
              РОББО
              <sup className="robbo-mfe-header__reg" aria-hidden="true">®</sup>
            </span>
          </a>
          <nav className="robbo-mfe-header__nav" aria-label="Основная навигация">
            {learnerHomeHeaderMenu.mainMenu.map((item) => (
              <a
                key={`${item.href}-${item.content}`}
                className={item.isActive ? 'robbo-mfe-header__link active' : 'robbo-mfe-header__link'}
                href={item.href}
                onClick={item.onClick}
              >
                {item.content}
              </a>
            ))}
          </nav>
          <div className="robbo-mfe-header__actions">
            {learnerHomeHeaderMenu.secondaryMenu.map((item) => (
              <a
                key={`${item.href}-${item.content}`}
                className="robbo-mfe-header__secondary-link"
                href={item.href}
              >
                {item.content}
              </a>
            ))}
            <div className="robbo-mfe-user-menu">
              <button
                className="robbo-mfe-user-menu__toggle"
                type="button"
                aria-haspopup="menu"
                aria-expanded={isUserMenuOpen}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <span className="robbo-mfe-user-menu__avatar" aria-hidden="true" />
                <span>{authenticatedUser?.username}</span>
              </button>
              {isUserMenuOpen && (
                <div className="robbo-mfe-user-menu__dropdown" role="menu">
                  {learnerHomeHeaderMenu.userMenu.flatMap((section) => section.items).map((item) => (
                    <a
                      key={`${item.href}-${item.content}`}
                      className="robbo-mfe-user-menu__item"
                      href={item.href}
                      role="menuitem"
                    >
                      {item.content}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <MasqueradeBar />
    </>
  );
};

LearnerDashboardHeader.propTypes = {};

export default LearnerDashboardHeader;
