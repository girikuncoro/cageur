import React, {Component} from 'react';
import Spinner from 'react-spinner';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

class CustomCell extends Component {

  render() {
    let renderCustomCell = this.props.cell.map(function(d,i) {
      return (<li key={i}>{d}</li>)
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

    return (
      <BootstrapTable data={patients}
                      options={options}
                      striped
                      hover
                      pagination
                      cellEdit={ cellEdit }>
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
          <TableHeaderColumn isKey dataField='line_id' dataSort
                              filter={
                                  { type: 'TextFilter',
                                    placeholder: 'cari ID'
                                  }
                              }>
                                LineID
          </TableHeaderColumn>
      </BootstrapTable>
    );
  }
}
