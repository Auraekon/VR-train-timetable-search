import React, { Component } from 'react';
import { Grid, CircularProgress } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import {
  Typography,
} from '@material-ui/core';
import text from 'texts/fi';
import TrainTimeTable from './TrainTimeTable/TrainTimeTable';
import AutosuggestSearchBar from 'components/AutosuggestSearchBar/AutosuggestSearchBar';
import SearchTimePicker from 'components/SearchTimePicker/SearchTimePicker';

const styles = {
autoSuggestSearchBar: {
  marginTop: 40,
  marginBottom: 50
}
}


@inject('trainSearchStore')
@observer
export default class StationSearch extends Component {

  componentDidMount() {
    this.props.trainSearchStore.getStationsMetadata();
   }

  render() {
    const data = this.props.trainSearchStore.trainTimeTableData;
    const tableCols = {
      arriving:
      [
      { name: text['train']},
      { name: text['startTerminus']},
      { name: text['endTerminus']},
      { name: text['arrives']}
    ],
    departing:
    [
      { name: text['train']},
      { name: text['startTerminus']},
      { name: text['endTerminus']},
      { name: text['departs']}
    ]
  };
  const fromStationSearchProps = {
    label: text["fromStation"],
    target: "fromStation"
  };
  const toStationSearchProps = {
    label: text["toStation"],
    target: "toStation"
  };

  if (this.props.trainSearchStore.fetchStationsMetadataState !== 'done') {
    return <CircularProgress />; // wait until the fetch is done and the store is updated
  } else {
      return (
        <Grid container>
        <div style={styles.autoSuggestSearchBar}></div>
        <Grid item xs={3}>
        <Typography>
          <b>{text["searchTrains"]}</b>
        </Typography>
        <AutosuggestSearchBar
        data={fromStationSearchProps}
        />
        <AutosuggestSearchBar
        data={toStationSearchProps}
        />
        </Grid>
        <Grid item xs={2}>
        <SearchTimePicker/>
        </Grid>
        <Grid item xs={12}>
          <TrainTimeTable
            data={data}
            tableCols={tableCols}
          />
        </Grid>
        </Grid>
      );
    }
  }
}