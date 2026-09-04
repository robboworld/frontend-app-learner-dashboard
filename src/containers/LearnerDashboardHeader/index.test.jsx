import { mergeConfig } from '@edx/frontend-platform';
import { shallow } from '@edx/react-unit-test-utils';
import { RobboHeader } from 'robbo-layout';

import { markNavigatingAway } from 'data/navigationAway';
import LearnerDashboardHeader from '.';

jest.mock('data/navigationAway', () => ({
  markNavigatingAway: jest.fn(),
}));
jest.mock('@edx/frontend-platform/analytics', () => ({
  sendTrackEvent: jest.fn(),
}));
jest.mock('containers/MasqueradeBar', () => 'MasqueradeBar');
jest.mock('./ConfirmEmailBanner', () => 'ConfirmEmailBanner');

const assignMock = jest.fn();

describe('LearnerDashboardHeader', () => {
  const originalLocation = global.location;

  beforeAll(() => {
    delete global.location;
    global.location = { ...originalLocation, assign: assignMock };
  });

  afterAll(() => {
    global.location = originalLocation;
  });

  beforeEach(() => {
    assignMock.mockClear();
    markNavigatingAway.mockClear();
  });

  test('render', () => {
    mergeConfig({ LMS_BASE_URL: 'http://localhost:18000', ORDER_HISTORY_URL: 'test-url' });
    const wrapper = shallow(<LearnerDashboardHeader />);
    expect(wrapper.snapshot).toMatchSnapshot();
    expect(wrapper.instance.findByType('ConfirmEmailBanner')).toHaveLength(1);
    expect(wrapper.instance.findByType('MasqueradeBar')).toHaveLength(1);
    expect(wrapper.instance.findByType(RobboHeader)).toHaveLength(1);
    const event = { preventDefault: jest.fn() };
    wrapper.instance.findByType(RobboHeader)[0].props.onCatalogClick(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(markNavigatingAway).toHaveBeenCalled();
    expect(assignMock).toHaveBeenCalledWith('http://localhost:18000/courses');
    expect(wrapper.instance.findByType(RobboHeader)[0].props.activeSection).toBe('dashboard');
  });

  test('should display Help link if SUPPORT_URL is set', () => {
    mergeConfig({ SUPPORT_URL: 'http://localhost:18000/support' });
    const wrapper = shallow(<LearnerDashboardHeader />);
    expect(wrapper.instance.findByType(RobboHeader)).toHaveLength(1);
  });
  test('should display Programs link if it is enabled by configuration', () => {
    mergeConfig({ ENABLE_PROGRAMS: true });
    const wrapper = shallow(<LearnerDashboardHeader />);
    expect(wrapper.instance.findByType(RobboHeader)).toHaveLength(1);
  });
});
