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
  
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.props.trainSearchStore.getStationSuggestions(value)
    })
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: text["searchStation"],
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