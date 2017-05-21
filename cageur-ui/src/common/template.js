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

    const emptyTemplate = (<div className='inbox-avatar-name'
                              style={{
                                'width': '100%',
                                'height': '100%',
                                'display': 'inline-block',
                                'paddingBottom': '10px',
                                'paddingTop': '70px',
                                'textAlign': 'center',
                              }}>
                              Template tidak tersedia
                          </div>)

    const renderTemplate = (template.length !== 0) ?
      (template.map(function (d,i) {
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
          })
      ) : emptyTemplate;

    return (
      <Modal show={showModal} onHide={handleHide} bsSize="lg">
        <Modal.Header closeButton>
           <Modal.Title>{`Template Pesan Untuk Grup Penyakit ${toTitleCase(group)}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Accordion defaultActiveKey='1'>
          {(showSpinner) ? <Spinner style={{marginBottom: "50px"}}/> : renderTemplate}
          </Accordion>
        </Modal.Body>
        <Modal.Footer>
           <Button onClick={handleHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
