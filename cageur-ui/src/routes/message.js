import React from 'react';

import {
  Form, FormGroup, FormControl, Col,
  Button, ControlLabel,Modal
} from '@sketchpixy/rubix';

export default class Message extends React.Component {
  constructor(props) {
    super(props);

    this.state = { showModal: false };
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  render() {
    return (
      <div>
        <Form horizontal>
        	<FormGroup controlId="formHorizontalEmail">
        	  <Col componentClass={ControlLabel} sm={2}>
        		  Group
        	  </Col>
        	  <Col sm={10}>
        		  <FormControl type="text" placeholder="Group" />
        	  </Col>
        	</FormGroup>

          <FormGroup controlId="formControlsTextarea">
            <Col componentClass={ControlLabel} sm={2}>
              Message
            </Col>
            <Col sm={10}>
        	    <FormControl componentClass="textarea" placeholder="Message" />
            </Col>
        	</FormGroup>

        	<FormGroup>
            <Col smOffset={2} sm={10}>
          		<Button type="submit">
          		  Schedule
          		</Button>
              <Button bsStyle="primary" onClick={::this.open}>
                Template
              </Button>
              <Button bsStyle="success" type="submit">
                Send Now
              </Button>
            </Col>
        	</FormGroup>
        </Form>
        <Modal show={this.state.showModal} onHide={::this.close}>
    		  <Modal.Header closeButton>
    			   <Modal.Title>Group Message Template</Modal.Title>
    		  </Modal.Header>
    		  <Modal.Body>
            <h1>All</h1>
            <ul>
              <li>Bla 1</li>
              <li>Bla 2</li>
              <li>Bla 3</li>
            </ul>
            <h1>Asam Urat</h1>
            <ul>
              <li>Bla 1</li>
              <li>Bla 2</li>
              <li>Bla 3</li>
            </ul>
            <h1>Diabetes</h1>
            <ul>
              <li>Bla 1</li>
              <li>Bla 2</li>
              <li>Bla 3</li>
            </ul>
    		  </Modal.Body>
    		  <Modal.Footer>
    			   <Button onClick={::this.close}>Close</Button>
    		  </Modal.Footer>
    		</Modal>
      </div>


    );
  }
}
