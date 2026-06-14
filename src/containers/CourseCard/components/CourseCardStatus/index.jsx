/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { useIntl } from '@edx/frontend-platform/i18n';

import { reduxHooks } from 'hooks';

import messages from './messages';
import './index.scss';

const STATUS = {
  notStarted: 'not-started',
  inProgress: 'in-progress',
  completed: 'completed',
};

export const CourseCardStatus = ({ cardId }) => {
  const { formatMessage } = useIntl();
  const { hasStarted } = reduxHooks.useCardEnrollmentData(cardId);
  const { isPassing } = reduxHooks.useCardGradeData(cardId);
  const { isEarned } = reduxHooks.useCardCertificateData(cardId);

  const statusKey = useMemo(() => {
    if (isEarned || isPassing) {
      return STATUS.completed;
    }
    if (hasStarted) {
      return STATUS.inProgress;
    }
    return STATUS.notStarted;
  }, [hasStarted, isEarned, isPassing]);

  const statusMessage = {
    [STATUS.notStarted]: messages.notStarted,
    [STATUS.inProgress]: messages.inProgress,
    [STATUS.completed]: messages.completed,
  }[statusKey];

  return (
    <span
      className={`course-card-status course-card-status--${statusKey}`}
      data-testid="CourseCardStatus"
    >
      {formatMessage(statusMessage)}
    </span>
  );
};

CourseCardStatus.propTypes = {
  cardId: PropTypes.string.isRequired,
};

export default CourseCardStatus;
