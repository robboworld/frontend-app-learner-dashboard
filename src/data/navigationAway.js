/**
 * Copyright (C) 2024-2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Flag set when leaving learner-dashboard for another LMS page (e.g. catalog).
 * In-flight init requests then abort; we must not flash the full-page ErrorPage.
 */

let navigatingAway = false;

export const markNavigatingAway = () => {
  navigatingAway = true;
};

export const isNavigatingAway = () => navigatingAway;

export const resetNavigatingAway = () => {
  navigatingAway = false;
};
