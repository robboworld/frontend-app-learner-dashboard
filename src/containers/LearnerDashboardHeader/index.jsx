import React from 'react';

import MasqueradeBar from 'containers/MasqueradeBar';
import { usePlatformSettingsData } from 'data/redux/hooks';
import urls from 'data/services/lms/urls';
import { RobboHeader } from 'robbo-layout';

import ConfirmEmailBanner from './ConfirmEmailBanner';

import { findCoursesNavClicked } from './hooks';

export const LearnerDashboardHeader = () => {
  const { courseSearchUrl } = usePlatformSettingsData() || {};

  const exploreCoursesClick = () => {
    findCoursesNavClicked(urls.baseAppUrl(courseSearchUrl));
  };

  return (
    <>
      <ConfirmEmailBanner />
      <RobboHeader activeSection="dashboard" onCatalogClick={exploreCoursesClick} collapseNavIntoUserMenuOnNarrow />
      <MasqueradeBar />
    </>
  );
};

LearnerDashboardHeader.propTypes = {};

export default LearnerDashboardHeader;
