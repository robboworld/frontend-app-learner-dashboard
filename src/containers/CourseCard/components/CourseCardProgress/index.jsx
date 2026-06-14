/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 */
import React from 'react';
import PropTypes from 'prop-types';

import { useIntl } from '@edx/frontend-platform/i18n';

import { reduxHooks } from 'hooks';

import messages from './messages';
import './index.scss';

export const CourseCardProgress = ({ cardId }) => {
  const { formatMessage } = useIntl();
  const { progress } = reduxHooks.useCardCourseRunData(cardId);

  if (!progress || progress.totalCount <= 0) {
    return null;
  }

  const { completedCount, totalCount, percent } = progress;

  return (
    <div
      className="course-card-progress"
      data-testid="CourseCardProgress"
    >
      <div
        className="course-card-progress__row"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={formatMessage(messages.progressAria)}
      >
        <div className="course-card-progress__track">
          <div
            className="course-card-progress__bar"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="course-card-progress__percent">{percent}%</span>
      </div>
      <p className="course-card-progress__units">
        {formatMessage(messages.unitsCount, {
          completed: completedCount,
          total: totalCount,
        })}
      </p>
    </div>
  );
};

CourseCardProgress.propTypes = {
  cardId: PropTypes.string.isRequired,
};

export default CourseCardProgress;
