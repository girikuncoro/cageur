import React from 'react';
import classNames from 'classnames';
import { IndexRoute, Route } from 'react-router';
import { Grid, Row, Col, MainContainer } from '@sketchpixy/rubix';

/* Common Components */
import Footer from './common/footer';
import Header from './common/header';
import Sidebar from './common/sidebar';

// Patient Information
import PatientInfo from './routes/patient-info';

class App extends React.Component {
  render() {
    return (
      <MainContainer {...this.props}>
        <Sidebar />
        <Header />
        <div id='body'>
          <Grid>
            <Row>
              <Col xs={12}>
                {this.props.children}
              </Col>
            </Row>
          </Grid>
        </div>
        <Footer />
      </MainContainer>
    );
  }
}

export default (
  <Route path='/' component={App}>
    <Route path="patient-information" component={PatientInfo} />
  </Route>
);
