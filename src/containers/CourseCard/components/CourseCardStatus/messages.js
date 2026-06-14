/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 */
import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  notStarted: {
    id: 'learner-dash.courseCard.status.notStarted',
    description: 'Course card status badge when the learner has not started',
    defaultMessage: 'Not started',
  },
  inProgress: {
    id: 'learner-dash.courseCard.status.inProgress',
    description: 'Course card status badge when the learner is in progress',
    defaultMessage: 'In progress',
  },
  completed: {
    id: 'learner-dash.courseCard.status.completed',
    description: 'Course card status badge when the learner completed the course',
    defaultMessage: 'Completed',
  },
});

export default messages;
