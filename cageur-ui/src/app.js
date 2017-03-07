import React, {Component} from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux'
import { Grid, Row, Col, MainContainer } from '@sketchpixy/rubix';
import Footer from './common/footer';
import Header from './common/header';
import Sidebar from './common/sidebar';
import {API_URL} from './common/constant';

@withRouter
export default class App extends Component {
  componentDidMount() {
    // --- Authorization test ---
    // Append token to api headers
    let API_HEADERS = {
      'Content-Type': 'application/json',
    }
    API_HEADERS['Authorization'] = (localStorage) ?
                                    (localStorage.getItem('token')) : '';

    // Fetching Disease Group Data
    fetch(API_URL+'/profile', {
      headers: API_HEADERS
    })
    .then((response) => response.json())
    .then((responseData) => {
      localStorage.setItem('clinic_id', responseData.data.clinic_id);
      return true;
    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
      this.props.router.push("/login");
      localStorage.removeItem('token');
    })
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
