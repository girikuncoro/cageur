import React from 'react';
import { withRouter } from 'react-router';
import {API_URL} from '../common/constant';
import 'whatwg-fetch';
import {
  Row,
  Col,
  Grid,
  Icon,
  Form,
  Panel,
  Button,
  PanelBody,
  FormGroup,
  InputGroup,
  PanelHeader,
  FormControl,
  ControlLabel,
  PanelContainer,
} from '@sketchpixy/rubix';

@withRouter
export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    };
  }

  handleOldPasswordInput(e) {
    this.setState({
      oldPassword: e.target.value,
    })
  }

  handleNewPasswordInput(e) {
    this.setState({
      newPassword: e.target.value,
    })
  }

  handleConfirmPasswordInput(e) {
    this.setState({
      confirmPassword: e.target.value,
    })
  }  

  handleChangePassword(e) {
    e.preventDefault();
    e.stopPropagation();

    const oldPassword = this.state.oldPassword;
    const newPassword = this.state.newPassword;
    const confirmPassword = this.state.confirmPassword;

    const endpoint = '/profile/password';
    const token = (localStorage) ? (localStorage.getItem('token')) : '';
    const email = (localStorage) ? (localStorage.getItem('email')) : '';

    const body = {
      email: email,
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword
    }

    console.log(body);
    fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 
        'Content-Type':'application/json',
        'Authorization' : token,
      },
      body: JSON.stringify(body)
    })
    .then((response) => {
      if (response.ok) {
        return response.json()
      } 
    })
    .then((responseData) => {
        this.props.router.push("/login");
    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
    })
  }

  render() {
      return (
        <PanelContainer>
            <Panel>
            <PanelHeader className='bg-green fg-white'>
                <Grid>
                <Row>
                    <Col xs={12}>
                    <h3>Ubah Password</h3>
                    </Col>
                </Row>
                </Grid>
            </PanelHeader>
            <PanelBody>
            </PanelBody>
                <Grid>
                    <Row>
                        <Col xs={12}>
                            <Form onSubmit={::this.handleChangePassword}>
                               <FormGroup>
                                    <ControlLabel>Sandi Lama</ControlLabel>
                                    <InputGroup>
                                        <FormControl  type='password'
                                                      placeholder='sandi' 
                                                      value={this.state.oldPassword}
                                                      onChange={::this.handleOldPasswordInput}/>
                                        <InputGroup.Addon>
                                        <Icon glyph='icon-fontello-key' />
                                        </InputGroup.Addon>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>Sandi Baru</ControlLabel>
                                    <InputGroup>
                                        <FormControl  type='password' 
                                                      placeholder='sandi'
                                                      value={this.state.newPassword}
                                                      onChange={::this.handleNewPasswordInput}/>
                                        <InputGroup.Addon>
                                        <Icon glyph='icon-fontello-key' />
                                        </InputGroup.Addon>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup>
                                    <ControlLabel>Sandi Baru Sekali Lagi</ControlLabel>
                                    <InputGroup>
                                        <FormControl  type='password' 
                                                      placeholder='sandi'
                                                      value={this.state.confirmPassword}
                                                      onChange={::this.handleConfirmPasswordInput}/>
                                        <InputGroup.Addon>
                                        <Icon glyph='icon-fontello-key' />
                                        </InputGroup.Addon>
                                    </InputGroup>
                                </FormGroup>                                
                                <FormGroup>
                                  <Grid>
                                    <Row>
                                      <Col xs={6} collapseLeft collapseRight className='text-right'>
                                        <Button outlined lg type='submit' bsStyle='green' onClick={::this.handleChangePassword}>Ubah Sandi</Button>
                                      </Col>
                                    </Row>
                                  </Grid>
                              </FormGroup>
                            </Form>
                        </Col>
                    </Row>
                </Grid>
            </Panel>
        </PanelContainer>
      )
  }
}
