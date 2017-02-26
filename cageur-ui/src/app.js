import React, {Component} from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux'
import { Grid, Row, Col, MainContainer } from '@sketchpixy/rubix';
import {API_HEADERS} from './common/constant';
import Footer from './common/footer';
import Header from './common/header';
import Sidebar from './common/sidebar';

@withRouter
export default class App extends Component {
  componentDidMount() {
    // Mutate API_HEADERS
    API_HEADERS['Authorization'] = (localStorage) ?
                                    (localStorage.getItem('token')) : '';

    // Redirect when no token found
    if (localStorage.getItem('token') == '') {
      this.props.router.push("/login");
    }
  }
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
