/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 */
import React from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';

import { reduxHooks } from 'hooks';
import CourseCard from 'containers/CourseCard';
import { RobboCardPreviewParam, RobboPreviewCardId } from 'data/constants/app';

import messages from './messages';
import './index.scss';

const exitPreviewUrl = () => {
  const url = new URL(window.location.href);
  url.searchParams.delete(RobboCardPreviewParam);
  return `${url.pathname}${url.search}${url.hash}`;
};

/**
 * Course card preview for the course team (`?robbo_card_preview=<course key>`, opened from
 * the course editor): the real CourseCard as a learner sees it right after enrolling.
 * LMS adds `robboCardPreview` to the init response only for users who can edit the course.
 */
export const RobboCardPreview = () => {
  const { formatMessage } = useIntl();
  const preview = reduxHooks.useRobboCardPreview();

  if (!preview?.card) {
    return null;
  }

  return (
    <section className="robbo-card-preview" aria-labelledby="robbo-card-preview-title">
      <div className="robbo-card-preview__note">
        <p className="robbo-card-preview__eyebrow">{formatMessage(messages.eyebrow)}</p>
        <h2 id="robbo-card-preview-title" className="robbo-card-preview__title">
          {formatMessage(messages.title)}
        </h2>
        <p className="robbo-card-preview__text">
          {formatMessage(messages.text, { courseName: preview.courseName })}
          {' '}
          {formatMessage(messages.note)}
        </p>
        <div className="robbo-card-preview__actions">
          {preview.catalogPreviewUrl && (
            <a className="robbo-card-preview__link" href={preview.catalogPreviewUrl}>
              {formatMessage(messages.catalogLink)}
            </a>
          )}
          {preview.studioUrl && (
            <a className="robbo-card-preview__link" href={preview.studioUrl}>
              {formatMessage(messages.studioLink)}
            </a>
          )}
          <a className="robbo-card-preview__link robbo-card-preview__link--muted" href={exitPreviewUrl()}>
            {formatMessage(messages.exitLink)}
          </a>
        </div>
      </div>
      <CourseCard cardId={RobboPreviewCardId} />
    </section>
  );
};

export default RobboCardPreview;
