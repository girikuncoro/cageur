import React from 'react';
import classNames from 'classnames';
import { withRouter } from 'react-router';

import {
  Row,
  Col,
  Icon,
  Grid,
  Label,
  Badge,
  Panel,
  Button,
  PanelLeft,
  PanelBody,
  ListGroup,
  LoremIpsum,
  ButtonGroup,
  ButtonToolbar,
  ListGroupItem,
  PanelContainer,
} from '@sketchpixy/rubix';

class InboxNavItem extends React.Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={8} collapseLeft collapseRight>
            <Icon glyph={this.props.glyph} className='inbox-item-icon'/>
            <span>{this.props.title}</span>
          </Col>
          <Col xs={4} className='text-right' collapseLeft collapseRight>
            <div style={{marginTop: 5}}><Label className={this.props.labelClass}>{this.props.labelValue}</Label></div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

class OutboxNavTag extends React.Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12} collapseLeft collapseRight>
            <Badge className={this.props.badgeClass}>{' '}</Badge>
            <span>{this.props.title}</span>
          </Col>
        </Row>
      </Grid>
    );
  }
}

@withRouter
class OutboxItem extends React.Component {
  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.router.push('/mailbox/mail');
  }
  render() {
    var classes = classNames({
      'inbox-item': true,
      'unread': this.props.unread
    });

    var linkProps = {
      href: '/mailbox/mail',
      onClick: ::this.handleClick,
      className: classes,
    };

    return (
      <a {...linkProps}>
        <div className='inbox-avatar'>
          <img src={this.props.src} width='40' height='40' className={this.props.imgClass + ' hidden-xs'} />
          <div className='inbox-avatar-name'>
            <div className='fg-darkgrayishblue75'>{this.props.name}</div>
            <div><small><Badge className={this.props.labelClass} style={{marginRight: 5, display: this.props.labelValue ? 'inline':'none'}}>{this.props.labelValue}</Badge><span>{this.props.description}</span></small></div>
          </div>
          <div className='inbox-date hidden-sm hidden-xs fg-darkgray40 text-right'>
            <div style={{position: 'relative', top: 5}}>{this.props.date}</div>
            <div style={{position: 'relative', top: -5}}><small>#{this.props.itemId}</small></div>
          </div>
        </div>
      </a>
    );
  }
}

@withRouter
export default class Outbox extends React.Component {
  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    this.props.router.push('/mailbox/compose');
  }

  render() {
    return (
      <div>
        <PanelContainer className='inbox' collapseBottom controls={false}>
          <Panel>
            <PanelBody style={{paddingTop: 0}}>
              <Grid>
                <Row>
                  <Col xs={8} style={{paddingTop: 12.5}}>
                    <ButtonToolbar className='inbox-toolbar'>
                      <ButtonGroup>
                        <Button bsStyle='blue' onClick={::this.handleClick}>
                          <Icon glyph='icon-fontello-edit-1'/>
                        </Button>
                      </ButtonGroup>
                      <ButtonGroup>
                        <Button outlined onlyOnHover bsStyle='darkgreen45'><Icon glyph='icon-fontello-reply'/></Button>
                        <Button outlined onlyOnHover bsStyle='darkgreen45' className='hidden-xs'><Icon glyph='icon-fontello-reply-all-1'/></Button>
                        <Button outlined onlyOnHover bsStyle='darkgreen45'><Icon glyph='icon-fontello-forward'/></Button>
                      </ButtonGroup>
                      <ButtonGroup className='hidden-xs'>
                        <Button outlined onlyOnHover bsStyle='danger' className='text-center'><Icon glyph='icon-fontello-attention-alt'/></Button>
                        <Button outlined onlyOnHover bsStyle='danger'><Icon glyph='icon-fontello-trash-1'/></Button>
                      </ButtonGroup>
                    </ButtonToolbar>
                  </Col>
                  <Col xs={4} className='text-right'>
                    <div className='inbox-avatar'>
                      <img src='/imgs/app/avatars/avatar0.png' width='40' height='40' />
                      <div className='inbox-avatar-name hidden-xs hidden-sm'>
                        <div>Anna Sanchez</div>
                        <div><small>Mailbox</small></div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Grid>
              <hr style={{margin: 0}}/>
              <Panel horizontal>
                <PanelLeft className='panel-sm-3 inbox-nav hidden-xs'>
                  <Grid>
                    <Row>
                      <Col xs={12}>
                        <h6><small className='fg-darkgray'>MAILBOXES</small></h6>
                        <ListGroup className='list-bg-blue'>
                          <ListGroupItem active>
                            <InboxNavItem glyph='icon-dripicons-return' title='Pesan Terkirim' />
                          </ListGroupItem>
                        </ListGroup>
                        <hr/>
                        <h6><small className='fg-darkgray'>OTHERS</small></h6>
                        <ListGroup>
                          <ListGroupItem>
                            <InboxNavItem glyph='icon-fontello-trash-1' title='Trash' />
                          </ListGroupItem>
                        </ListGroup>
                        <hr/>
                        <h6><small className='fg-darkgray'>TAGS</small></h6>
                        <ListGroup>
                          <ListGroupItem>
                            <OutboxNavTag title='#sometag' badgeClass='bg-green fg-white' />
                          </ListGroupItem>
                          <ListGroupItem>
                            <OutboxNavTag title='#anothertag' badgeClass='bg-red fg-white' />
                          </ListGroupItem>
                        </ListGroup>
                      </Col>
                    </Row>
                  </Grid>
                </PanelLeft>
                <PanelBody className='panel-sm-9 panel-xs-12' style={{ paddingTop: 0 }}>
                  <Grid>
                    <Row>
                      <Col xs={12}>
                        <OutboxItem itemId={1} src='/imgs/app/avatars/avatar5.png' imgClass='border-green' name='Jordyn Ouellet (8)' labelValue='SOME LABEL' labelClass='bg-green fg-white' description={<span><strong>Early access: </strong><span><LoremIpsum query='1s'/></span></span>} date='Aug 20th' />
                        <OutboxItem itemId={5} src='/imgs/app/avatars/avatar11.png' imgClass='border-purple' name='Crystal Ford' labelValue='SOME LABEL' labelClass='bg-purple fg-white' description={<span><LoremIpsum query='1s'/></span>} date='Aug 16th' />
                      </Col>
                    </Row>
                  </Grid>
                </PanelBody>
              </Panel>
            </PanelBody>
          </Panel>
        </PanelContainer>
      </div>
    );
  }
}
