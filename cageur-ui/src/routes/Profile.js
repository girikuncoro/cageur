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
  Alert,
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
        confirmPassword: '',
        error: false,
        errorText: '',
        success: false,
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

    if (newPassword !== confirmPassword) {
      this.setState({
        error: true,
        errorText: 'Pastikan sandi baru sudah sama dan sesuai'
      })
      return;
    }

    const endpoint = '/profile/password';
    const token = (localStorage) ? (localStorage.getItem('token')) : '';
    const email = (localStorage) ? (localStorage.getItem('email')) : '';

    const body = {
      email: email,
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword
    }

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
      } else {
        response.text().then((error) => {
          this.setState({
            error: true,
            errorText: JSON.parse(error).message
          })
        })

        return false;
      }
    })
    .then((responseData) => {
      if (responseData) {
        this.setState({
          success: true
        })
        let redirect = () => this.props.router.push("/login");
        setTimeout(redirect, 2000);
      }
    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
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

      let renderSuccess = (this.state.success) ?
      (<Alert bsStyle="success">
        <strong> Ubah sandi berhasil, silahkan masuk kembali. Mengarahkan ke halaman masuk ... </strong>
      </Alert>) : "";

      return (
        <PanelContainer controls={false}>
            <Panel>
            <PanelHeader className='bg-green fg-white'>
                <Grid>
                <Row>
                    <Col xs={12}>
                    <h3>Ubah Sandi</h3>
                    </Col>
                </Row>
                </Grid>
            </PanelHeader>
            <PanelBody>
            </PanelBody>
                <Grid>
                    <Row>
                        <Col xs={12}>
                            {renderError}
                            {renderSuccess}
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
