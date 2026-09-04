import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';

import EmptyCourse from '.';

jest.mock('data/redux/hooks', () => ({
  usePlatformSettingsData: jest.fn(() => ({
    courseSearchUrl: '/course-search-url',
  })),
}));

describe('NoCoursesView', () => {
  test('snapshot', () => {
    expect(shallow(<EmptyCourse />).snapshot).toMatchSnapshot();
  });
});
