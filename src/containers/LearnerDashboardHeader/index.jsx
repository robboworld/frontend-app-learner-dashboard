import React from 'react';

import { getConfig } from '@edx/frontend-platform';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';

import MasqueradeBar from 'containers/MasqueradeBar';
import { RobboHeader, getCatalogUrl } from 'robbo-layout';
import { markNavigatingAway } from 'data/navigationAway';
import { appName, categories, eventNames, linkNames } from 'tracking/constants';

import ConfirmEmailBanner from './ConfirmEmailBanner';

export const LearnerDashboardHeader = () => {
  const exploreCoursesClick = (event) => {
    const catalogUrl = getCatalogUrl(getConfig());
    if (!catalogUrl) {
      return;
    }
    if (event?.preventDefault) {
      event.preventDefault();
    }
    // Mark leave BEFORE any request abort, so ErrorPage never paints.
    markNavigatingAway();
    try {
      sendTrackEvent(eventNames.findCoursesClicked, {
        app_name: appName,
        pageName: 'learner_home',
        linkType: 'button',
        linkCategory: categories.searchButton,
        linkName: linkNames.learnerHomeNavExplore,
      });
    } catch (err) {
      // Tracking must not block navigation.
    }
    // Immediate navigate — do not use createLinkTracker (300ms delay flashes ErrorPage).
    global.location.assign(catalogUrl);
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
