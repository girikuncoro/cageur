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
  componentDidMount() {
    // Redirect when no token found
    if (localStorage.getItem('token') == '') {
      this.props.router.push("/login");
    }
  }

  handleBackClick(e) {
      if (this.props.params.origin === 'scheduled') {
        this.props.router.push('/dashboard/mailbox/outbox/scheduled');
      } else {
        this.props.router.push('/dashboard/mailbox/outbox/sent');
      }
  }

  handleTextareaClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.handleBackClick();
  }

  print() {
    if (isBrowser()) {
      window.print();
    }
  }

  render() {
    let {group_name, status, content, date} = this.props.params;
    let labelValue, labelColor;
    if (this.props.params.origin === 'scheduled') {
        switch(status) {
            case "daily":
              labelValue = "harian";
              labelColor = "green";
              break;
            case "monthly":
              labelValue = "bulanan";
              labelColor = "yellow";
              break;
        }
    } else {
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
                      <Button bsStyle='blue' onClick={::this.handleBackClick}>
                        <Icon glyph='icon-dripicons-arrow-thin-left'/>
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
                        </div>
                        <div className='inbox-date fg-darkgray40 text-right hidden-xs'>
                          <div style={{position: 'relative', top: 5}}>
                            <Badge className={`bg-${labelColor} fg-white`}>
                              {labelValue}
                            </Badge>
                          </div>
                          <div style={{position: 'relative'}}><small>
                              {`${date} WIB`}
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
                      <p style={{marginLeft: "10px"}}>
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
