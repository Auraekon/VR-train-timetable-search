import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import Autosuggest from 'react-autosuggest'
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Typography,
  CircularProgress
} from '@material-ui/core';
import text from 'texts/fi';
import Search from '@material-ui/icons/Search';
import theme from './AutoSuggestSearch.css';

function getSuggestionValue(suggestion) {
  return suggestion.stationName;
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.stationName}</span>
  );
}

@inject('trainSearchStore')
@observer
export default class AutosuggestSearchBar extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: []
    };    
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };
  
  onSuggestionsFetchRequested = () => {
    this.setState({
      suggestions: this.props.trainSearchStore.getStationSuggestions(this.state.value, this.props.data.searchBarProps)
    })
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: this.props.trainSearchStore.getStationSuggestions(this.state.value, this.props.data.searchBarProps)
    })
  };

  render() {
    console.log("render value", this.state.value);
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: this.props.data.label,
      value,
      onChange: this.onChange
    };
  
    return (
      <Autosuggest 
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        theme={theme}
      />
    );
  }
}