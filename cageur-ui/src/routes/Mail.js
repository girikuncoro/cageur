import React from 'react';
import classNames from 'classnames';
import { withRouter } from 'react-router';

import {
  Row,
  Col,
  Icon,
  Grid,
  Badge,
  Panel,
  Button,
  isBrowser,
  PanelBody,
  LoremIpsum,
  FormControl,
  ButtonGroup,
  ButtonToolbar,
  PanelContainer,
} from '@sketchpixy/rubix';

@withRouter
export default class Mail extends React.Component {
  handleClick(e) {
    this.props.router.push('/mailbox/compose');
  }

  handleBackClick(e) {
    this.props.router.push('/mailbox/inbox');
  }

  handleTextareaClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.handleClick();
  }

  print() {
    if (isBrowser()) {
      window.print();
    }
  }

  render() {
    let {group_name, status, title, content, date} = this.props.params;
    let labelValue, labelColor;
    switch(status) {
      case "delivered":
        labelValue = "terkirim";
        labelColor = "green";
        break;
      case "pending":
        labelValue = "tertunda";
        labelColor = "yellow";
        break;
      case "failed":
        labelValue = "gagal";
        labelColor = "red";
        break;
    }

    return (
      <PanelContainer className='inbox' controls={false}>
        <Panel>
          <PanelBody style={{paddingTop: 0}}>
            <Grid>
              <Row className='hidden-print'>
                <Col xs={8} style={{paddingTop: 12.5}}>
                  <ButtonToolbar className='inbox-toolbar'>
                    <ButtonGroup>
                      <Button bsStyle='blue' onClick={::this.handleClick}>
                        <Icon glyph='icon-fontello-edit-1'/>
                      </Button>
                    </ButtonGroup>
                  </ButtonToolbar>
                </Col>
                <Col xs={4} className='text-right'>
                  <div className='inbox-avatar'>
                    <img src='/imgs/app/avatars/avatar0.png' width='40' height='40' />
                    <div className='inbox-avatar-name hidden-xs hidden-sm'>
                      <div>Teteh Cageur</div>
                      <div><small>Rincian Pesan</small></div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Grid>
            <hr style={{margin: 0}}/>
            <Panel horizontal>
              <PanelBody className='panel-sm-9 panel-xs-12' style={{paddingTop: 0}}>
                <Grid>
                  <Row>
                    <Col xs={12}>
                      <div className='inbox-avatar'>
                        <div className='inbox-avatar-name'>
                          <div className='fg-darkgrayishblue75'><strong>Grup Penyakit: </strong>{group_name}</div>
                          <div className='fg-darkgray40'><strong>Judul: </strong>{title}</div>
                        </div>
                        <div className='inbox-date fg-darkgray40 text-right hidden-xs'>
                          <div style={{position: 'relative', top: 5}}>
                            <Badge className={`bg-${labelColor} fg-white`}>
                              {labelValue}
                            </Badge>
                          </div>
                          <div style={{position: 'relative'}}><small>
                              {date}
                            </small>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Grid>
                <hr style={{marginTop: 0}}/>
                <Grid>
                  <Row>
                    <Col xs={12}>
                      <p>
                        {content}
                      </p>
                    </Col>
                  </Row>
                </Grid>
                <hr/>
              </PanelBody>
            </Panel>
          </PanelBody>
        </Panel>
      </PanelContainer>
    );
  }
}
