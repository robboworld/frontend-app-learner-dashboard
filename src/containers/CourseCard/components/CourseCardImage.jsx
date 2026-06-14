/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 */
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';

import { Badge } from '@openedx/paragon';

import track from 'tracking';
import { reduxHooks } from 'hooks';
import { baseAppUrl } from 'data/services/lms/urls';
import verifiedRibbon from 'assets/verified-ribbon.png';
import useActionDisabledState from './hooks';

import messages from '../messages';

const { courseImageClicked } = track.course;

const getCourseImagePlaceholderUrl = () => baseAppUrl('/theming/asset/images/no_course_image.png');

export const CourseCardImage = ({ cardId, orientation }) => {
  const { formatMessage } = useIntl();
  const { bannerImgSrc, bannerImgIsPlaceholder } = reduxHooks.useCardCourseData(cardId);
  const { homeUrl } = reduxHooks.useCardCourseRunData(cardId);
  const { isVerified } = reduxHooks.useCardEnrollmentData(cardId);
  const { disableCourseTitle } = useActionDisabledState(cardId);
  const [usePlaceholder, setUsePlaceholder] = useState(
    bannerImgIsPlaceholder || !bannerImgSrc,
  );

  const placeholderUrl = getCourseImagePlaceholderUrl();

  useEffect(() => {
    setUsePlaceholder(bannerImgIsPlaceholder || !bannerImgSrc);
  }, [cardId, bannerImgIsPlaceholder, bannerImgSrc]);

  const handleImageClicked = reduxHooks.useTrackCourseEvent(courseImageClicked, cardId, homeUrl);
  const handleImageError = useCallback((event) => {
    const img = event.currentTarget;
    if (img.dataset.fallbackApplied !== 'true') {
      img.dataset.fallbackApplied = 'true';
      img.src = placeholderUrl;
      setUsePlaceholder(true);
    }
  }, [placeholderUrl]);

  const imageSrc = usePlaceholder ? placeholderUrl : bannerImgSrc;
  const wrapperClassName = [
    'pgn__card-wrapper-image-cap',
    'overflow-visible',
    orientation,
    usePlaceholder ? 'course-card-image-cap-wrap--placeholder' : '',
  ].filter(Boolean).join(' ');

  const image = (
    <>
      <img
        // w-100 is necessary for images on Safari, otherwise stretches full height of the image
        // https://stackoverflow.com/a/44250830
        className={[
          'pgn__card-image-cap',
          'show',
          'w-100',
          usePlaceholder ? 'course-card-image-cap--placeholder' : '',
        ].filter(Boolean).join(' ')}
        src={imageSrc}
        alt={usePlaceholder ? '' : formatMessage(messages.bannerAlt)}
        onError={handleImageError}
      />
      {
        isVerified && (
          <span
            className="course-card-verify-ribbon-container"
            title={formatMessage(messages.verifiedHoverDescription)}
          >
            <Badge as="div" variant="success" className="w-100">
              {formatMessage(messages.verifiedBanner)}
            </Badge>
            <img src={verifiedRibbon} alt={formatMessage(messages.verifiedBannerRibbonAlt)} />
          </span>
        )
      }
    </>
  );
  return disableCourseTitle
    ? (<div className={wrapperClassName}>{image}</div>)
    : (
      <a
        className={wrapperClassName}
        href={homeUrl}
        onClick={handleImageClicked}
        tabIndex="-1"
      >
        {image}
      </a>
    );
};
CourseCardImage.propTypes = {
  cardId: PropTypes.string.isRequired,
  orientation: PropTypes.string.isRequired,
};

CourseCardImage.defaultProps = {};

export default CourseCardImage;
