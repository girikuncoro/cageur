import React from 'react';
import classNames from 'classnames';
import { IndexRoute, Route } from 'react-router';
import { Grid, Row, Col, MainContainer } from '@sketchpixy/rubix';

/* Common Components */
import Footer from './common/footer';
import Header from './common/header';
import Sidebar from './common/sidebar';

/* Pages */
// Mailbox
import Outbox from './routes/Outbox';
import Mail from './routes/Mail';
import Compose from './routes/Compose';
import Analytics from './routes/Analytics';

// Patient Information
import PatientInfo from './routes/PatientInfo';

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
  <Route path="/" component={App}>
    <Route path='mailbox/outbox' component={Outbox} />
    <Route path='mailbox/mail/:group_name/:status/:content/:date' component={Mail} />
    <Route path="mailbox/compose" component={Compose} />
    <Route path="patient-information" component={PatientInfo} />
    <Route path="analytics" component={Analytics} />
  </Route>
);
