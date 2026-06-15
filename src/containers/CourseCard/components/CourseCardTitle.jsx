import React from 'react';
import PropTypes from 'prop-types';

import { reduxHooks } from 'hooks';
import CourseCardStatus from './CourseCardStatus';

export const CourseCardTitle = ({ cardId }) => {
  const { courseName } = reduxHooks.useCardCourseData(cardId);

  return (
    <div className="course-card-title-wrap">
      <CourseCardStatus cardId={cardId} />
      <h3>
        <span className="course-card-title" data-testid="CourseCardTitle">{courseName}</span>
      </h3>
    </div>
  );
};

CourseCardTitle.propTypes = {
  cardId: PropTypes.string.isRequired,
};

CourseCardTitle.defaultProps = {};

export default CourseCardTitle;
