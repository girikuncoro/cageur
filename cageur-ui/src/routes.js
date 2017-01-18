import React from 'react';
import classNames from 'classnames';
import { IndexRoute, Route } from 'react-router';
import { Grid, Row, Col, MainContainer } from '@sketchpixy/rubix';

/* Common Components */
import Footer from './common/footer';
import Header from './common/header';
import Sidebar from './common/sidebar';

/* Pages */
import Message from './routes/message';
import PatientInfo from './routes/patient_info';

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
    {/* <IndexRoute component={Message}/> */}
    <Route path="pesan-grup" component={Message} />
    <Route path="informasi-pasien" component={PatientInfo} />
  </Route>
);
