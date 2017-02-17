import React, {Component} from 'react';
import {compare, toTitleCase} from '../../utilities/util';
import {API_URL, API_HEADERS} from '../../common/constant';
import Select from 'react-select';

export default class ObjectEditor extends Component {
  constructor(props) {
    super(props);
    this.updateData = this.updateData.bind(this);
    this.state = {
      value: props.defaultValue,
      open: true,
      patient_id: props.row.id,
      group: [],
      selectedGroup: this.props.row.group,
    };
  }

  componentDidMount() {
    // Fetching Disease Group Data
    fetch(API_URL+'/disease_group', {
      headers: API_HEADERS
    })
    .then((response) => response.json())
    .then((responseData) => {
      let group = [];
      responseData.data.map(function(d,i) {
        group.push({value: d.id, label: toTitleCase(d.name)});
      })
      group.sort(compare);
      this.setState({group: group});
    })
    .catch((error) => {
      console.log('Error fetching and parsing data', error);
    })
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

  updateGroup(value) {
    this.setState({
        selectedGroup: value
    })
  }
  render() {

    const fadeIn = this.state.open ? 'in' : '';
    const display = this.state.open ? 'block' : 'none';

    const {group, selectedGroup} = this.state;

    function arrowRenderer () {
    	return (
    		<span>+</span>
    	);
    }
    return (
          <span style={selectContainer}>
              <Select
                  arrowRenderer={arrowRenderer}
                  ref="groupDiseaseSelect"
                  matchProp="label"
                  name="select-group-disease"
                  value={selectedGroup}
                  multi={true}
                  options={group}
                  onChange={::this.updateGroup}
                  autofocus={true}
                  clearable={false}/>
              <button
                className='btn btn-info btn-xs textarea-save-btn'
                onClick={ this.updateData }>
                simpan
              </button>
          </span>
    );
  }
}

const selectContainer = {
    'position': 'relative',
    'width': '100%',
    'height': '100%',
    'zIndex': '100000',
    'overflow': 'visible'
}
