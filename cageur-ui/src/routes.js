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
import Sent from './routes/Sent';
import Scheduled from './routes/Scheduled';
import Mail from './routes/Mail';
import Compose from './routes/Compose';

// Patient Information
import PatientInfo from './routes/PatientInfo';

// Analytics
import Analytics from './routes/Analytics';

// Login UI
import Login from './routes/Login';
import Signup from './routes/Signup';

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

const routes = (
  <Route path="/" component={App}>
    <Route path='mailbox/outbox' component={Outbox}>
        <Route path='sent' component={Sent} />
        <Route path='scheduled' component={Scheduled} />
    </Route>
    <Route path='mailbox/mail/:group_name/:status/:content/:date/:origin' component={Mail} />
    <Route path="mailbox/compose" component={Compose} />
    <Route path="patient-information" component={PatientInfo} />
    <Route path="analytics" component={Analytics} />
  </Route>
);

const basicRoutes = (
  <Route>
    <Route path='login' component={Login} />
    <Route path='signup' component={Signup} />
  </Route>
);

const combinedRoutes = (
  <Route>
    <Route>
      {routes}
    </Route>
    <Route>
      {basicRoutes}
    </Route>
  </Route>
);

export default (
  <Route>
      {combinedRoutes}
  </Route>
);
