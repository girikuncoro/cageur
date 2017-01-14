import React from 'react';

import {Modal, Button} from '@sketchpixy/rubix';
import TemplateContent from './templateContent';

export default class Template extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {showModal, handleHide, template, group, handleUse} = this.props;

    return (
      <Modal show={showModal}
        onHide={handleHide}>
        <Modal.Header closeButton>
           <Modal.Title>{`Template Pesan Untuk Grup Penyakit ${group.toUpperCase()}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
          {template.map(function (d,i) {
            let title = (d.title.length > 50) ?
                        `${d.title.substr(0,50)} ...` :
                        d.title;
            let fullTittle = d.title;
            let content = d.content;
            return (
              <TemplateContent
                key={i}
                title={title}
                fullTittle={fullTittle}
                content={content}
                handleUse={handleUse}/>
            )
          })}
          </ul>
        </Modal.Body>
        <Modal.Footer>
           <Button onClick={handleHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
