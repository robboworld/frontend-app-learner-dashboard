import React from 'react';
import PropTypes from 'prop-types';

import { Card } from '@openedx/paragon';

import { useIsCollapsed } from './hooks';
import CourseCardBanners from './components/CourseCardBanners';
import CourseCardImage from './components/CourseCardImage';
import CourseCardMenu from './components/CourseCardMenu';
import CourseCardActions from './components/CourseCardActions';
import CourseCardDetails from './components/CourseCardDetails';
import CourseCardProgress from './components/CourseCardProgress';
import CourseCardTitle from './components/CourseCardTitle';

import './CourseCard.scss';

export const CourseCard = ({
  cardId,
}) => {
  const isCollapsed = useIsCollapsed();
  const orientation = isCollapsed ? 'vertical' : 'horizontal';
  const courseCardMenu = <CourseCardMenu cardId={cardId} />;

  return (
    <div className="mb-4.5 course-card" id={cardId} data-testid="CourseCard">
      <Card orientation={orientation}>
        <div className="d-flex flex-column w-100">
          <div
            className={
              isCollapsed
                ? 'course-card-main course-card-main--stacked'
                : 'course-card-main d-flex'
            }
          >
            {isCollapsed ? (
              <div className="course-card-image-row">
                <div className="course-card-image-row__media">
                  <div className="course-card-image-frame">
                    <CourseCardImage cardId={cardId} orientation="horizontal" />
                  </div>
                </div>
              </div>
            ) : (
              <CourseCardImage cardId={cardId} orientation="horizontal" />
            )}
            <Card.Body>
              <Card.Header
                title={<CourseCardTitle cardId={cardId} />}
                actions={courseCardMenu}
              />
              <Card.Section className="pt-0">
                <CourseCardDetails cardId={cardId} />
                <CourseCardProgress cardId={cardId} />
              </Card.Section>
              <Card.Footer className="course-card-footer" orientation={orientation}>
                <div className="course-card-footer__row">
                  <div className="course-card-footer__info">
                    <CourseCardBanners cardId={cardId} />
                  </div>
                  <div className="course-card-footer__actions">
                    <CourseCardActions cardId={cardId} />
                  </div>
                </div>
              </Card.Footer>
            </Card.Body>
          </div>
        </div>
      </Card>
    </div>
  );
};
CourseCard.propTypes = {
  cardId: PropTypes.string.isRequired,
};

export default CourseCard;
