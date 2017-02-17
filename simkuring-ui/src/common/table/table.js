import React, {Component} from 'react';
import Spinner from 'react-spinner';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import StringEditor from './string-editor';
import ObjectEditor from './object-editor';

function filterLabel(cell, row) {
  return cell.map((d) => d.label)
}


class CustomCell extends Component {

  render() {
    let renderCustomCell = this.props.cell.map(function(d,i) {
      if (typeof d === 'object') {
        return (<li key={i}>{d.label}</li>)
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
    let {patients, showSpinner,
        handlePatientUpdate, handleInitEdit,
        handleDiseaseGroupUpdate} = this.props;

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

    const createNameEditor = (onUpdate, props) =>
                              (<StringEditor onUpdate={ onUpdate } {...props}
                                            handlePatientUpdate={handlePatientUpdate}
                                            dataField='name'/>);
    const createPhoneEditor = (onUpdate, props) =>
                              (<StringEditor onUpdate={ onUpdate } {...props}
                                            handlePatientUpdate={handlePatientUpdate}
                                            dataField='phone_number'/>);
    const createLineIdEditor = (onUpdate, props) =>
                                (<StringEditor onUpdate={ onUpdate } {...props}
                                              handlePatientUpdate={handlePatientUpdate}
                                              dataField='line_id'/>);
    const createDiseaseEditor = (onUpdate, props) =>
                                (<ObjectEditor onUpdate={ onUpdate } {...props}
                                              handleInitEdit={handleInitEdit}
                                              handleDiseaseGroupUpdate={handleDiseaseGroupUpdate}
                                              dataField='disease_group'/>);

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
                              editable={false}
                              dataAlign='center'
                              dataField='num'>
                                No.
          </TableHeaderColumn>
          <TableHeaderColumn  dataSort
                              dataField='name'
                              filter={
                                  { type: 'TextFilter',
                                    placeholder: 'cari nama',
                                    delay: 100
                                  }
                              }
                              customEditor={{getElement: createNameEditor}}>
                                Nama Pasien
          </TableHeaderColumn>
          <TableHeaderColumn  dataField='group'
                              filter={
                                  { type: 'TextFilter',
                                    placeholder: 'cari penyakit',
                                    delay: 100
                                  }
                              }
                              filterValue={ filterLabel }
                              dataFormat = {this.diseaseFormatter}
                              customEditor={{getElement: createDiseaseEditor}}>
                              Penyakit
          </TableHeaderColumn>
          <TableHeaderColumn  dataField='disease_created'
                              filter={
                                  { type: 'TextFilter',
                                    placeholder: 'cari tanggal',
                                    delay: 100
                                  }
                              }
                              editable={false}
                              dataFormat = {this.diseaseFormatter}>
                              Penyakit Muncul
          </TableHeaderColumn>
          <TableHeaderColumn  dataField='patient_created'
                              dataSort
                              editable={false}
                              filter={
                                  { type: 'TextFilter',
                                    placeholder: 'cari tanggal',
                                    delay: 100
                                  }
                              }>
                                Pasien Terdaftar
          </TableHeaderColumn>
          <TableHeaderColumn dataField='phone_number'
                              filter={
                                  { type: 'TextFilter',
                                    placeholder: 'cari nomor',
                                    delay: 100
                                  }
                              }
                              customEditor={{getElement: createPhoneEditor}}>
                                No. Telp
          </TableHeaderColumn>
          <TableHeaderColumn  dataField='line_id'
                              filter={
                                  { type: 'TextFilter',
                                    placeholder: 'cari LineID',
                                    delay: 100
                                  }
                              }
                              customEditor={{getElement: createLineIdEditor}}>
                                LineID
          </TableHeaderColumn>
          <TableHeaderColumn isKey dataField='id' width="70px" >
                                Pasien ID
          </TableHeaderColumn>
      </BootstrapTable>
    );
  }
}
