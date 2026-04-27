import React from 'react';
import PropTypes from 'prop-types';

import { Container, Col, Row } from '@openedx/paragon';

export const courseListColumnLayout = {
  lg: { span: 12, offset: 0 },
  xl: { span: 12, offset: 0 },
};

export const DashboardLayout = ({ children }) => (
  <Container fluid size="xl">
    <Row className="dashboard-main-row justify-content-center">
      <Col {...courseListColumnLayout} className="course-list-column">
        {children}
      </Col>
    </Row>
  </Container>
);

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
