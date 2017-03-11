import React from 'react';
import classNames from 'classnames';
import { withRouter } from 'react-router';
import { SidebarBtn, Navbar, Grid, Row, Col,
        Nav, NavItem, Icon
} from '@sketchpixy/rubix';

class Brand extends React.Component {
  render() {
    return (
      <Navbar.Header {...this.props}>
        <Navbar.Brand tabIndex='-1'>
          <a href='#'>
            <img src='/imgs/common/logo-cageur.png' alt='cageur'/>
          </a>
        </Navbar.Brand>
      </Navbar.Header>
    );
  }
}

@withRouter
class HeaderNavigation extends React.Component {
  handleSkinSwitch(e) {
    e.preventDefault();
    e.stopPropagation();
    var vexContent;
    vex.open({
      afterOpen: ($vexContent) => {
        vexContent = $vexContent;
        return ReactDOM.render(<Skins id={$vexContent.data().vex.id} />, $vexContent.get(0));
      },
      afterClose: () => {
        ReactDOM.unmountComponentAtNode(vexContent.get(0));
      }
    });
  }

  handleLogout(e) {
    if(localStorage) {localStorage.removeItem('token');}
    this.props.router.push('/login');
  }

  render() {
    return (
      <Nav pullRight>
        <Nav>
          <NavItem className='logout' href='#' onClick={::this.handleLogout}>
            <Icon bundle='fontello' glyph='off-1' />
          </NavItem>
        </Nav>
      </Nav>
    );
  }
}

export default class Header extends React.Component {
  render() {
    return (
      <Grid id='navbar' {...this.props}>
        <Row>
          <Col xs={12}>
            <Navbar fixedTop fluid id='rubix-nav-header'>
              <Row>
                <Col xs={3} visible='xs'>
                  <SidebarBtn />
                </Col>
                <Col xs={6} sm={4}>
                  <Brand />
                </Col>
                <Col xs={3} sm={8} collapseRight className='text-right'>
                  <HeaderNavigation />
                </Col>
              </Row>
            </Navbar>
          </Col>
        </Row>
      </Grid>
    );
  }
}
