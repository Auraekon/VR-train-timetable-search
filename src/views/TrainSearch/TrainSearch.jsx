import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import {
  Typography,
} from '@material-ui/core';
import text from 'texts/fi';
import TrainTimeTable from './TrainTimeTable/TrainTimeTable';
import AutosuggestSearchBar from './AutosuggestSearchBar/AutosuggestSearchBar';

const styles = {
autoSuggestSearchBar: {
  marginTop: 40,
  marginBottom: 50
}
}


@inject('trainSearchStore')
@observer
export default class TrainSearch extends Component {

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

    return (
      <Grid item xs={12}>
      <div style={styles.autoSuggestSearchBar}>
      <Typography>
        <b>{text["searchWithStationName"]}</b>
      </Typography>
      <AutosuggestSearchBar/>
      </div>
        <TrainTimeTable
          data={data}
          tableCols={tableCols}
        />
      </Grid>
    );
  }
}