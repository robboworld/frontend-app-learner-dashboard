import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@openedx/paragon';

import useCardDetailsData from './hooks';
import './index.scss';

export const CourseCardDetails = ({ cardId }) => {
  const {
    resumeMessage,
    accessMessage,
    isEntitlement,
    isFulfilled,
    canChange,
    openSessionModal,
    changeOrLeaveSessionMessage,
  } = useCardDetailsData({ cardId });

  const showResumeMessage = resumeMessage;
  const showAccessMessage = !(isEntitlement && !isFulfilled) && accessMessage;
  const showSessionButton = isEntitlement && isFulfilled && canChange;
  const textItems = [showResumeMessage, showAccessMessage].filter(Boolean);

  if (textItems.length === 0 && !showSessionButton) {
    return null;
  }

  return (
    <span className="small" data-testid="CourseCardDetails">
      {textItems.map((item, index) => (
        <React.Fragment key={item}>
          {index > 0 && ' • '}
          {item}
        </React.Fragment>
      ))}
      {showSessionButton && (
        <>
          {textItems.length > 0 && ' • '}
          <Button variant="link" size="inline" className="m-0 p-0" onClick={openSessionModal}>
            {changeOrLeaveSessionMessage}
          </Button>
        </>
      )}
    </span>
  );
};

CourseCardDetails.propTypes = {
  cardId: PropTypes.string.isRequired,
};

CourseCardDetails.defaultProps = {};

export default CourseCardDetails;
