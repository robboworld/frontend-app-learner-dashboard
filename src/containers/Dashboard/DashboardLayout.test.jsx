import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';
import { Col, Row } from '@openedx/paragon';

import DashboardLayout, { courseListColumnLayout } from './DashboardLayout';

const children = 'test-children';

let el;

describe('DashboardLayout', () => {
  beforeEach(() => {
    el = shallow(<DashboardLayout>{children}</DashboardLayout>);
  });

  it('renders a single full-width course list column', () => {
    const columns = el.instance.findByType(Row)[0].findByType(Col);
    expect(columns).toHaveLength(1);
    Object.keys(courseListColumnLayout).forEach((size) => {
      expect(columns[0].props[size]).toEqual(courseListColumnLayout[size]);
    });
  });

  it('displays children in the column', () => {
    const columns = el.instance.findByType(Row)[0].findByType(Col);
    expect(columns[0].children).not.toHaveLength(0);
  });

  test('snapshot', () => {
    expect(el.snapshot).toMatchSnapshot();
  });
});
