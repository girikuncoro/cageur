import React, {Component} from 'react';
import classNames from 'classnames';
import { Link, withRouter } from 'react-router';
import {API_URL} from '../common/constant';

import {
  Row,
  Col,
  Icon,
  Grid,
  Form,
  Badge,
  Panel,
  Button,
  PanelBody,
  FormGroup,
  LoremIpsum,
  InputGroup,
  FormControl,
  ButtonGroup,
  ButtonToolbar,
  PanelContainer,
} from '@sketchpixy/rubix';

@withRouter
export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };
  }

  handleEmailInput(e) {
    this.setState({ email: e.target.value });
  }

  handlePasswordInput(e) {
    this.setState({ password: e.target.value });
  }

  handleLogin(e) {
    e.preventDefault();
    e.stopPropagation();
    const creds = {
      email: this.state.email,
      password: this.state.password
    }
    const endpoint = '/auth';
    const body = {
      email: creds.email,
      password: creds.password
    }

    fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(body)
    })
    .then(function(response) {
      if (response.ok) {
        return response.json()
      } else {
        // Redirect to login page when response not ok
        this.props.router.push("/login");

        localStorage.setItem('token', '');
      }
    })
    .then((responseData) => {
      console.log(responseData);

      // If login was successful, set the token in local storage
      localStorage.setItem('token', responseData.token);

      // Redirect to dashboard
      this.props.router.push("/dashboard");
    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
      this.setState({
        email: '',
        password: ''
      });
    })
  }

  render() {
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
