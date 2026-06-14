/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 */
import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  progressAria: {
    id: 'learner-dash.courseCard.progress.aria',
    description: 'Course card progress bar aria label',
    defaultMessage: 'Course progress',
  },
  unitsCount: {
    id: 'learner-dash.courseCard.progress.unitsCount',
    description: 'Course card progress units completed count',
    defaultMessage: '{completed} of {total} units completed',
  },
});

export default messages;
