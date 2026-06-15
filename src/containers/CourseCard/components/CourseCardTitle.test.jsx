import { shallow } from '@edx/react-unit-test-utils';

import { reduxHooks } from 'hooks';
import CourseCardTitle from './CourseCardTitle';

jest.mock('hooks', () => ({
  reduxHooks: {
    useCardCourseData: jest.fn(() => ({ courseName: 'course-name' })),
  },
}));

describe('CourseCardTitle', () => {
  const props = {
    cardId: 'cardId',
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('snapshot', () => {
    test('renders non-clickable course title', () => {
      const wrapper = shallow(<CourseCardTitle {...props} />);
      expect(wrapper.snapshot).toMatchSnapshot();
      const title = wrapper.instance.findByTestId('CourseCardTitle');
      expect(title[0].type).toBe('span');
      expect(title[0].props.onClick).toBeUndefined();
    });
  });
  describe('behavior', () => {
    it('initializes', () => {
      shallow(<CourseCardTitle {...props} />);
      expect(reduxHooks.useCardCourseData).toHaveBeenCalledWith(props.cardId);
    });
  });
});
