import React from 'react';
import {Modal, Button, Accordion, BPanel} from '@sketchpixy/rubix';
import Spinner from 'react-spinner';
import {toTitleCase} from '../utilities/util';

export default class Template extends React.Component {
  constructor(props) {
    super(props);
  }

  handleUseClick(fullTittle,content) {
    this.props.handleUse({title: fullTittle, content: content});
  }

  render() {
    let {showModal, handleHide, template, group, handleUse, showSpinner} = this.props;
    let self = this;

    return (
      <Modal show={showModal} onHide={handleHide} bsSize="lg">
        <Modal.Header closeButton>
           <Modal.Title>{`Template Pesan Untuk Grup Penyakit ${toTitleCase(group)}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Accordion defaultActiveKey='1'>
          {(showSpinner) ? <Spinner style={{marginBottom: "50px"}}/> : ""}
          {template.map(function (d,i) {
            let title = (d.title.length > 50) ?
                        `${d.title.substr(0,50)} ...` :
                        d.title;
            let fullTittle = d.title;
            let content = d.content;
            return (
              <BPanel key={i} header={fullTittle} eventKey={i} style={{cursor: "pointer", display:"inline-block", width:"100%"}}>
                <p>{content}</p>
                <Button bsStyle="primary" onClick={self.handleUseClick.bind(self,fullTittle,content)}>Gunakan Template</Button>
              </BPanel>
            )
          })}
          </Accordion>
        </Modal.Body>
        <Modal.Footer>
           <Button onClick={handleHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
