import React from 'react';

import {
  Form, FormGroup, FormControl, Col,
  Button, ControlLabel
} from '@sketchpixy/rubix';

export default class Message extends React.Component {
  render() {
    return (
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
            <Button bsStyle="primary" type="submit">
              Template
            </Button>
            <Button bsStyle="success" type="submit">
              Send Now
            </Button>
          </Col>
      	</FormGroup>
      </Form>
    );
  }
}
