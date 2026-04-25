import React from 'react';

import MasqueradeBar from 'containers/MasqueradeBar';
import { reduxHooks } from 'hooks';
import urls from 'data/services/lms/urls';
import { RobboHeader } from 'robbo-layout';

import ConfirmEmailBanner from './ConfirmEmailBanner';

import { findCoursesNavClicked } from './hooks';

export const LearnerDashboardHeader = () => {
  const { courseSearchUrl } = reduxHooks.usePlatformSettingsData();

  const exploreCoursesClick = () => {
    findCoursesNavClicked(urls.baseAppUrl(courseSearchUrl));
  };

  return (
    <>
      <ConfirmEmailBanner />
      <RobboHeader activeSection="dashboard" onCatalogClick={exploreCoursesClick} />
      <MasqueradeBar />
    </>
  );
};

LearnerDashboardHeader.propTypes = {};

export default LearnerDashboardHeader;
