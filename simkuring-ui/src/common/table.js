import React, {Component} from 'react';
import Spinner from 'react-spinner';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

class StringEditor extends Component {
  constructor(props) {
    super(props);
    this.updateData = this.updateData.bind(this);
    this.state = {
      name: props.defaultValue,
      open: true,
      patient_id: props.row.id
    };
  }
  focus() {
    this.refs.inputRef.focus();
  }
  updateData() {
    this.props.onUpdate(this.state.name);
  }
  close = () => {
    this.setState({ open: false });
    this.props.onUpdate(this.props.defaultValue);
  }
  render() {
    console.log(this.props);

    const fadeIn = this.state.open ? 'in' : '';
    const display = this.state.open ? 'block' : 'none';
    return (
      <span>
        <input
          ref='inputRef'
          className={ ( this.props.editorClass || '') + ' form-control editor edit-text' }
          style={ { display: 'block', width: '100%' } }
          type='text'
          value={ this.state.name }
          onKeyDown={ this.props.onKeyDown }
          onChange={ e => { this.setState({ name: e.currentTarget.value }); } } />
        <button
          className='btn btn-info btn-xs textarea-save-btn'
          onClick={ this.updateData }>
          simpan
        </button>
      </span>
    );
  }
}

class CustomCell extends Component {

  render() {
    let renderCustomCell = this.props.cell.map(function(d,i) {
      if (typeof d === 'object') {
        return (<li key={i}>{d.name}</li>)
      } else {
        return (<li key={i}>{d}</li>)
      }
    })

    return (
      <ul>
        {renderCustomCell}
      </ul>
    )
  }
}

export default class Table extends Component {
  diseaseFormatter(cell, row) {
    let newCell = (typeof cell  === 'string') ? cell.split(',') : cell;
    return <CustomCell cell={newCell}/>
  }

  onRowSelect(row, isSelected, e) {
    let id = row['id'],
        selectedRows = this.props.selectedRows;
    if (isSelected) {
      selectedRows.push(id);
      this.props.handleRowSelection(selectedRows)
    } else {
      let index = selectedRows.indexOf(id);
      if (index > -1) {
        selectedRows.splice(index, 1);
        this.props.handleRowSelection(selectedRows);
      }
    }
  }

  onSelectAll(isSelected, rows) {
    let selectedRows = this.props.selectedRows;
    if (isSelected) {
      rows.map(function(d) {
        selectedRows.push(d['id']);
      })
      this.props.handleRowSelection(selectedRows);
    } else {
      this.props.handleRowSelection([]);
    }
  }

  render() {
    let {patients, showSpinner} = this.props;

    const cellEdit = {
      mode: 'click',
      blurToSave: true
    };

    const noDataText = (showSpinner && patients.length === 0) ?
                        <Spinner style={{marginTop: '40px'}}/> :
                        'Data tidak ditemukan';
    const options = {
      noDataText: noDataText
    }

    const selectRowProp = {
      mode: 'checkbox',
      clickToSelect: true,
      bgColor: 'pink',
      onSelect: this.onRowSelect.bind(this),
      onSelectAll: this.onSelectAll.bind(this)
    };

    const createStringEditor = (onUpdate, props) => (<StringEditor onUpdate={ onUpdate } {...props}/>);

    return (
      <BootstrapTable data={patients}
                      options={options}
                      striped
                      hover
                      pagination
                      cellEdit={cellEdit}
                      selectRow={selectRowProp}>
          <TableHeaderColumn  dataSort
                              width="70px"
                              editable={ false }
                              dataAlign='center'
                              dataField='num'>
                                No.
          </TableHeaderColumn>
          <TableHeaderColumn  dataSort
                              dataField='name'
                              filter={
                                  { type: 'TextFilter',
                                    placeholder: 'cari nama'
                                  }
                              }
                              customEditor={
                                {
                                  getElement: createStringEditor,
                                  customEditorParameters: this.props.handlePatientUpdate
                                }
                              }>
                                Nama Pasien
          </TableHeaderColumn>
          <TableHeaderColumn  dataField='group' dataSort
                              filter={
                                  { type: 'TextFilter',
                                    placeholder: 'cari penyakit'
                                  }
                              }
                              dataFormat = {this.diseaseFormatter}>
                              Penyakit
          </TableHeaderColumn>
          <TableHeaderColumn  dataField='disease_created' dataSort
                              filter={
                                  { type: 'TextFilter',
                                    placeholder: 'cari tanggal'
                                  }
                              }
                              dataFormat = {this.diseaseFormatter}>
                              Penyakit Muncul
          </TableHeaderColumn>
          <TableHeaderColumn  dataField='patient_created'
                              dataSort
                              editable={ false }
                              filter={
                                  { type: 'TextFilter',
                                    placeholder: 'cari tanggal'
                                  }
                              }>
                                Pasien Terdaftar
          </TableHeaderColumn>
          <TableHeaderColumn dataField='phone_number' dataSort
                              filter={
                                  { type: 'TextFilter',
                                    placeholder: 'cari nomor'
                                  }
                              }>
                                No. Telp
          </TableHeaderColumn>
          <TableHeaderColumn  dataField='line_id' dataSort
                              filter={
                                  { type: 'TextFilter',
                                    placeholder: 'cari LineID'
                                  }
                              }>
                                LineID
          </TableHeaderColumn>
          <TableHeaderColumn isKey dataField='id'>
                                Pasien ID
          </TableHeaderColumn>
      </BootstrapTable>
    );
  }
}
