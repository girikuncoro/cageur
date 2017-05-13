import React, {Component} from 'react';
import classNames from 'classnames';
import { Link, withRouter } from 'react-router';
import {API_URL} from '../common/constant';
import {validateEmail} from '../utilities/util';

import {
  Row, Col, Icon, Grid, Form, Badge,
  Panel, Button, PanelBody, FormGroup,
  InputGroup, FormControl, ButtonGroup,
  ButtonToolbar, PanelContainer, Alert
} from '@sketchpixy/rubix';

@withRouter
export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      error: false,
      errorText: '',
    };
  }

  handleEmailInput(e) {
    this.setState({
      email: e.target.value,
      error: false
    })
  }

  handlePasswordInput(e) {
    if(this.state.email.length !== 0 && !validateEmail(this.state.email)) {
      this.setState({
        error: true,
        errorText: 'Alamat email tidak valid'
      })
    }
    this.setState({
      password: e.target.value
    });
  }

  handleLogin(e) {
    e.preventDefault();
    e.stopPropagation();

    const email = this.state.email;
    const pass = this.state.password;

    const endpoint = '/auth';
    const body = {
      email: email,
      password: pass
    }
    fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(body)
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        response.text().then((error) =>{
          switch(JSON.parse(error).message.toUpperCase()) {
              case "AUTHENTICATION FAILED. USER NOT FOUND.":
                this.setState({
                  error: true,
                  errorText: 'Klinik tidak ditemukan'
                })
                break;
              case "AUTHENTICATION FAILED. EMAIL AND PASSWORD NOT MATCHED.":
                this.setState({
                  error: true,
                  errorText: 'Email dan sandi tidak cocok'
                })
                break;
              case `MISSING REQUIRED PARAMETERS "EMAIL" OR "PASSWORD"`:
                this.setState({
                  error: true,
                  errorText: 'Email dan sandi harus diisi'
                })
                break;
          }
          return false;
        })
      }
    })
    .then((responseData) => {
      if (responseData) {
        // If login was successful, set the token in local storage
        localStorage.setItem('token', responseData.token);

        this.handleFirstTime();
      }
    })
    .catch((error) => {
      console.log('Error login', error);
    })
  }

  handleFirstTime() {
    const endpoint = '/profile';
    const token = (localStorage) ? (localStorage.getItem('token')) : '';
    const email = this.state.email;
    
    fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers: { 
        'Content-Type':'application/json',
        'Authorization' : token,
      },
    })
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
    })
    .then((responseData) => {
      if(responseData.data.is_new) {
        localStorage.setItem('email', email);
        this.props.router.push("/dashboard/profile");
      } else {
        // Redirect to dashboard
        this.props.router.push("/dashboard");
      }
    })
    .catch((error) => {
      console.log('Error fetching and parsing user profile data', error);
    })
  }

  handleAlertDismiss() {
    this.setState({
      error: false,
      errorText: ''
    })
  }

  render() {
    let renderError = (this.state.error) ?
    (<Alert bsStyle="danger" onDismiss={::this.handleAlertDismiss}>
        <strong>{this.state.errorText} </strong>
    </Alert>) : "";
    return (
      <div id='auth-container' className='login'>
        <div id='auth-row'>
          <div id='auth-cell'>
            <Grid>
              <Row>
                <Col sm={4} smOffset={4} xs={10} xsOffset={1} collapseLeft collapseRight>
                  <PanelContainer controls={false}>
                    <Panel>
                      <PanelBody style={{padding: 0}}>
                        <div className='text-center bg-darkblue fg-white'>
                          <h3 style={{margin: 0, padding: 25}}>Masuk ke Cageur</h3>
                        </div>
                        <div className='bg-hoverblue fg-black50 text-center' style={{padding: 12.5}}>
                          <div>Anda perlu masuk ke Cageur terlebih dahulu</div>
                          {renderError}
                          <div style={{padding: 25, paddingTop: 0, paddingBottom: 0, margin: 'auto', marginBottom: 25, marginTop: 25}}>
                            <Form onSubmit={::this.handleLogin}>
                              <FormGroup controlId='emailaddress'>
                                <InputGroup bsSize='large'>
                                  <InputGroup.Addon>
                                    <Icon glyph='icon-fontello-mail' />
                                  </InputGroup.Addon>
                                  <FormControl autoFocus
                                                type='email'
                                                className='border-focus-blue'
                                                placeholder='cageur@email.com'
                                                value={this.state.email}
                                                onChange={::this.handleEmailInput}
                                                />
                                </InputGroup>
                              </FormGroup>
                              <FormGroup controlId='password'>
                                <InputGroup bsSize='large'>
                                  <InputGroup.Addon>
                                    <Icon glyph='icon-fontello-key' />
                                  </InputGroup.Addon>
                                  <FormControl type='password'
                                              className='border-focus-blue'
                                              placeholder='sandi'
                                              value={this.state.password}
                                              onChange={::this.handlePasswordInput}
                                              />
                                </InputGroup>
                              </FormGroup>
                              <FormGroup>
                                <Grid>
                                  <Row>
                                    <Col xs={6} collapseLeft collapseRight className='text-right'>
                                      <Button outlined lg type='submit' bsStyle='blue' onClick={::this.handleLogin}>Masuk</Button>
                                    </Col>
                                  </Row>
                                </Grid>
                              </FormGroup>
                            </Form>
                          </div>
                        </div>
                      </PanelBody>
                    </Panel>
                  </PanelContainer>
                </Col>
              </Row>
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}
