import React, {Component} from 'react';

export default class StringEditor extends Component {
  constructor(props) {
    super(props);
    this.updateData = this.updateData.bind(this);
    this.state = {
      value: props.defaultValue,
      open: true,
      patient_id: props.row.id
    };
  }
  focus() {
    this.refs.inputRef.focus();
  }
  updateData() {
    this.props.onUpdate(this.state.value);
    this.props.handlePatientUpdate(this.props.row,this.props.dataField,this.state.value);
  }
  close = () => {
    this.setState({ open: false });
    this.props.onUpdate(this.props.defaultValue);
  }
  render() {

    const fadeIn = this.state.open ? 'in' : '';
    const display = this.state.open ? 'block' : 'none';
    return (
      <span>
        <input
          ref='inputRef'
          className={ ( this.props.editorClass || '') + ' form-control editor edit-text' }
          style={ { display: 'block', width: '100%' } }
          type='text'
          value={ this.state.value }
          onKeyDown={ this.props.onKeyDown }
          onChange={ e => { this.setState({ value: e.currentTarget.value }); } } />
        <button
          className='btn btn-info btn-xs textarea-save-btn'
          onClick={ this.updateData }>
          simpan
        </button>
      </span>
    );
  }
}
