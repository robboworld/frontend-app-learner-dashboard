import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';

import {
  Button,
  Form,
  ModalPopup,
  breakpoints,
  useWindowSize,
} from '@openedx/paragon';
import { Tune } from '@openedx/paragon/icons';

import { reduxHooks } from 'hooks';

import FilterForm from './components/FilterForm';
import SortForm from './components/SortForm';
import useCourseFilterControlsData from './hooks';
import messages from './messages';

import './index.scss';

export const CourseFilterControls = ({
  sortBy,
  setSortBy,
  filters,
}) => {
  const { formatMessage } = useIntl();
  const hasCourses = reduxHooks.useHasCourses();
  const {
    isOpen,
    open,
    close,
    target,
    setTarget,
    handleFilterChange,
    handleSortChange,
  } = useCourseFilterControlsData({
    filters,
    setSortBy,
  });
  const { width } = useWindowSize();
  const isMobile = width < breakpoints.small.minWidth;

  return (
    <div id="course-filter-controls">
      <Button
        ref={setTarget}
        variant="outline-primary"
        iconBefore={Tune}
        onClick={open}
        disabled={!hasCourses}
      >
        {formatMessage(messages.refine)}
      </Button>
      <Form>
        <ModalPopup
          positionRef={target}
          isOpen={isOpen}
          onClose={close}
          placement="bottom-end"
        >
          <div
            id="course-filter-controls-card"
            className={[
              'bg-white p-3 rounded shadow d-flex',
              isMobile ? 'flex-column robbo-course-filter-card--stacked' : 'flex-row',
            ].join(' ')}
          >
            <div className="filter-form-col">
              <FilterForm {...{ filters, handleFilterChange }} />
            </div>
            <hr
              className={
                isMobile
                  ? 'w-100 bg-primary-200 my-3 mx-0'
                  : 'h-100 bg-primary-200 mx-3 my-0'
              }
            />
            <div className="filter-form-col text-left m-1">
              <SortForm {...{ sortBy, handleSortChange }} />
            </div>
          </div>
        </ModalPopup>
      </Form>
    </div>
  );
};
CourseFilterControls.propTypes = {
  sortBy: PropTypes.string.isRequired,
  setSortBy: PropTypes.func.isRequired,
  filters: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default CourseFilterControls;
