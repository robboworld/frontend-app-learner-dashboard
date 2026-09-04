import React from 'react';
import { Helmet } from 'react-helmet';
import { shallow } from '@edx/react-unit-test-utils';

import { useIntl } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';

import { RequestKeys } from 'data/constants/requests';
import {
  useLoadData,
  usePlatformSettingsData,
  useRequestError,
  useRequestIsFailed,
} from 'data/redux/hooks';
import Dashboard from 'containers/Dashboard';
import LearnerDashboardHeader from 'containers/LearnerDashboardHeader';
import AppWrapper from 'containers/WidgetContainers/AppWrapper';
import { App } from './App';
import messages from './messages';

jest.mock('robbo-layout', () => ({ RobboFooter: 'RobboFooter' }));

jest.mock('containers/Dashboard', () => 'Dashboard');
jest.mock('containers/LearnerDashboardHeader', () => 'LearnerDashboardHeader');
jest.mock('containers/WidgetContainers/AppWrapper', () => 'AppWrapper');
jest.mock('data/redux', () => ({
  selectors: 'redux.selectors',
  actions: 'redux.actions',
  thunkActions: 'redux.thunkActions',
}));
jest.mock('data/redux/hooks', () => ({
  useRequestIsFailed: jest.fn(),
  useRequestError: jest.fn(),
  usePlatformSettingsData: jest.fn(),
  useLoadData: jest.fn(),
}));
jest.mock('data/store', () => 'data/store');

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({})),
}));

const loadData = jest.fn();
useLoadData.mockReturnValue(loadData);

let el;

const supportEmail = 'test-support-url';
usePlatformSettingsData.mockReturnValue({ supportEmail });
const httpFailure = { response: { status: 500 } };

describe('App router component', () => {
  const { formatMessage } = useIntl();
  describe('component', () => {
    const runBasicTests = () => {
      test('snapshot', () => { expect(el.snapshot).toMatchSnapshot(); });
      it('displays title in helmet component', () => {
        const control = el.instance
          .findByType(Helmet)[0]
          .findByType('title')[0];
        expect(control.children[0].el).toEqual(formatMessage(messages.pageTitle));
      });
      it('displays learner dashboard header', () => {
        expect(el.instance.findByType(LearnerDashboardHeader).length).toEqual(1);
      });
      it('wraps the header and main components in an AppWrapper widget container', () => {
        const container = el.instance.findByType(AppWrapper)[0];
        expect(container.children[0].type).toEqual('LearnerDashboardHeader');
        expect(container.children[1].type).toEqual('main');
      });
    };
    describe('no network failure', () => {
      beforeAll(() => {
        useRequestIsFailed.mockReturnValue(false);
        useRequestError.mockReturnValue(undefined);
        getConfig.mockReturnValue({});
        el = shallow(<App />);
      });
      runBasicTests();
      it('loads dashboard', () => {
        const main = el.instance.findByType('main')[0];
        expect(main.children.length).toEqual(1);
        const dashboard = main.children[0];
        expect(dashboard.type).toEqual('Dashboard');
        expect(
          dashboard.matches(shallow(<Dashboard />)),
        ).toEqual(true);
      });
    });
    describe('no network failure with optimizely url', () => {
      beforeAll(() => {
        useRequestIsFailed.mockReturnValue(false);
        useRequestError.mockReturnValue(undefined);
        getConfig.mockReturnValue({ OPTIMIZELY_URL: 'fake.url' });
        el = shallow(<App />);
      });
      runBasicTests();
      it('loads dashboard', () => {
        const main = el.instance.findByType('main')[0];
        expect(main.children.length).toEqual(1);
        const dashboard = main.children[0];
        expect(dashboard.type).toEqual('Dashboard');
        expect(
          dashboard.matches(shallow(<Dashboard />)),
        ).toEqual(true);
      });
    });
    describe('no network failure with optimizely project id', () => {
      beforeAll(() => {
        useRequestIsFailed.mockReturnValue(false);
        useRequestError.mockReturnValue(undefined);
        getConfig.mockReturnValue({ OPTIMIZELY_PROJECT_ID: 'fakeId' });
        el = shallow(<App />);
      });
      runBasicTests();
      it('loads dashboard', () => {
        const main = el.instance.findByType('main')[0];
        expect(main.children.length).toEqual(1);
        const dashboard = main.children[0];
        expect(dashboard.type).toEqual('Dashboard');
        expect(
          dashboard.matches(shallow(<Dashboard />)),
        ).toEqual(true);
      });
    });
    describe('initialize failure', () => {
      beforeAll(() => {
        useRequestIsFailed.mockImplementation((key) => key === RequestKeys.initialize);
        useRequestError.mockImplementation((key) => (
          key === RequestKeys.initialize ? httpFailure : undefined
        ));
        getConfig.mockReturnValue({});
        el = shallow(<App />);
      });
      runBasicTests();
      it('loads error page', () => {
        const main = el.instance.findByType('main')[0];
        expect(main.children.length).toEqual(1);
        const alert = main.children[0];
        expect(alert.type).toEqual('Alert');
        expect(alert.children.length).toEqual(1);
        const errorPage = alert.children[0];
        expect(errorPage.type).toEqual('ErrorPage');
        expect(errorPage.props.message).toEqual(formatMessage(messages.errorMessage, { supportEmail }));
      });
    });
    describe('refresh failure', () => {
      beforeAll(() => {
        useRequestIsFailed.mockImplementation((key) => key === RequestKeys.refreshList);
        useRequestError.mockImplementation((key) => (
          key === RequestKeys.refreshList ? httpFailure : undefined
        ));
        getConfig.mockReturnValue({});
        el = shallow(<App />);
      });
      runBasicTests();
      it('loads error page', () => {
        const main = el.instance.findByType('main')[0];
        expect(main.children.length).toEqual(1);
        const alert = main.children[0];
        expect(alert.type).toEqual('Alert');
        expect(alert.children.length).toEqual(1);
        const errorPage = alert.children[0];
        expect(errorPage.type).toEqual('ErrorPage');
        expect(errorPage.props.message).toEqual(formatMessage(messages.errorMessage, { supportEmail }));
      });
    });
    describe('initialize network abort (no HTTP response)', () => {
      beforeAll(() => {
        useRequestIsFailed.mockImplementation((key) => key === RequestKeys.initialize);
        useRequestError.mockReturnValue({ message: 'Network Error', isAxiosError: true });
        getConfig.mockReturnValue({});
        el = shallow(<App />);
      });
      it('still loads dashboard instead of ErrorPage', () => {
        const main = el.instance.findByType('main')[0];
        expect(main.children[0].type).toEqual('Dashboard');
      });
    });
  });
});
