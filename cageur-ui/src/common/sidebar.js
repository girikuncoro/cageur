import React from 'react';

import {
  Sidebar, SidebarNav, SidebarNavItem,
  SidebarControls, SidebarControlBtn,
  LoremIpsum, Grid, Row, Col,
  Progress, Icon, Label
} from '@sketchpixy/rubix';

import { Link, withRouter } from 'react-router';

@withRouter
class ApplicationSidebar extends React.Component {
  getPath(path) {
    var dir = this.props.location.pathname.search('rtl') !== -1 ? 'rtl' : 'ltr';
    path = `/${path}`;
    return path;
  }
  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <div className='sidebar-nav-container'>
                <SidebarNav style={{marginBottom: 0}} ref={(c) => this._nav = c}>
                <SidebarNavItem glyph='icon-feather-mail' name={<span>Kotak Pesan <Label className='bg-darkgreen45 fg-white'></Label></span>}>
                  <SidebarNav>
                    <SidebarNavItem glyph='icon-dripicons-return' name='Pesan Keluar' href={::this.getPath('mailbox/outbox')} />
                    <SidebarNavItem glyph='icon-dripicons-message' name='Tulis Pesan' href={::this.getPath('mailbox/compose')} />
                  </SidebarNav>
                </SidebarNavItem>
                  <SidebarNavItem glyph='icon-simple-line-icons-users' name='Informasi Pasien' href='/patient-information' />
                </SidebarNav>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

@withRouter
export default class SidebarContainer extends React.Component {
  render() {
    return (
      <div id='sidebar'>
        <div id='avatar'>
          <Grid>
            <Row className='fg-white'>
              <Col xs={4} collapseRight>
                <img src='/imgs/app/avatars/avatar0.png' width='40' height='40' />
              </Col>
              <Col xs={8} collapseLeft id='avatar-col'>
                <div style={{top: 23, fontSize: 16, lineHeight: 1, position: 'relative'}}>Teteh Cageur</div>
                <div>
                  <Progress id='demo-progress' value={30} color='#ffffff'/>
                  <a href='#'>
                    <Icon id='demo-icon' bundle='fontello' glyph='lock-5' />
                  </a>
                </div>
              </Col>
            </Row>
          </Grid>
        </div>
        <SidebarControls>
          <SidebarControlBtn bundle='fontello' glyph='docs' sidebar={0} />
        </SidebarControls>
        <div id='sidebar-container'>
          <Sidebar sidebar={0}>
            <ApplicationSidebar />
          </Sidebar>
        </div>
      </div>
    );
  }
}
