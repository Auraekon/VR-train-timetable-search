import React, { Component } from 'react';
import { Grid, CircularProgress} from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import {
  Typography,
} from '@material-ui/core';
import text from 'texts/fi';
import TrainTimeTable from './TrainTimeTable/TrainTimeTable';
import AutosuggestSearchBar from 'components/AutosuggestSearchBar/AutosuggestSearchBar';

const styles = {
autoSuggestSearchBar: {
  marginTop: 40,
  marginBottom: 50
}
}


@inject('trainSearchStore')
@observer
export default class TrainSearch extends Component {
  constructor() {
    super();
  }


  componentDidMount() {
    console.log("didmount");
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

  const stationSearchBarProps = {
    label: text["fromStation"],
    target: "fromStation"
  };

  const searchProps = {
    label: text["searchStation"],
    searchBarProps: [
      {
        trainQueryFunctionName: "fetchTrainInformationByStation",
        target: "arriving"
      },
      {
        trainQueryFunctionName: "fetchTrainInformationByStation",
        target: "departing"
      },
    ],
  }


  if (this.props.trainSearchStore.fetchStationsMetadataState !== 'done') {
    return <CircularProgress />; // wait until the fetch is done and the store is updated
  } else {
    return (
      <Grid item xs={12}>
      <div style={styles.autoSuggestSearchBar}>
      <Typography>
        <b>{text["searchWithStationName"]}</b>
      </Typography>
      <AutosuggestSearchBar
      data={searchProps}
      />
      </div>
        <TrainTimeTable
          data={data}
          tableCols={tableCols}
        />
      </Grid>
    );
    }
  }
}