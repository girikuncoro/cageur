import React from 'react';
import {Button} from '@sketchpixy/rubix';

export default class TemplateContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDetails: false
    }
  }

  toggleDetails() {
    this.setState({showDetails: !this.state.showDetails})
  }

  handleUseClick() {
    let {fullTittle, content, handleUse} = this.props;
    handleUse({title: fullTittle, content: content})
  }

  render() {
    let {title, fullTittle, content, handleUse} = this.props;
    let {showDetails} = this.state;
    let renderContent = (showDetails) ?
                        (<div style={boxStyle}>
                          <h4>{fullTittle}</h4>
                          <p>{content}</p>
                          <Button bsStyle="primary" onClick={::this.handleUseClick}>Gunakan Template</Button>
                         </div>) : "";

    return (
      <li onClick={::this.toggleDetails}>
        {title}
        <a href="#">show detail</a>
        {renderContent}
      </li>
    );
  }
}

var boxStyle = {
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "black",
  padding: "5px"
}
