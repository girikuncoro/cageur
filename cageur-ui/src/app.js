import React, {Component} from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux'
import { Grid, Row, Col, MainContainer } from '@sketchpixy/rubix';
import Footer from './common/footer';
import Header from './common/header';
import Sidebar from './common/sidebar';

@withRouter
export default class App extends Component {
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

// // These props come from the application's
// // state when it is started
// function mapStateToProps(state) {
//
//   console.log(state);
//   const { auth } = state
//   const { isAuthenticated, errorMessage } = auth
//
//   return {
//     isAuthenticated,
//     errorMessage
//   }
// }
//
// export default connect(mapStateToProps)(App)
