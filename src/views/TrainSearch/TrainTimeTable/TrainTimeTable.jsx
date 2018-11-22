import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
  CircularProgress
} from '@material-ui/core';
import text from 'texts/fi';
import TableCell from 'components/Table/TableCell';
import { observer, inject } from 'mobx-react';
import componentStyles from 'components/Table/Table.css';

function TabContainer(props) {
  return (
    <Typography component="div">
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

function TrainTable(props) {
  return (
  <TabContainer style={componentStyles.root}>
        <Table style={componentStyles.table}>
          <TableHead>
            <TableRow>
              {/* Create Table Head Row with col names */}
              {props.tableCols.map(n => {
                return <TableCell key={n.name} cellContent={n.name} />;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data.map(n => {
              return (
                <TableRow key={n.trainNumber}>
                  <TableCell cellContent={n.trainType + " " + n.trainNumber} />
                  <TableCell cellContent={
                    props.stationMetadata.map(m => {
                      if (n.timeTableRows[0].stationUICCode === m.stationUICCode) {
                        return m.stationName;
                      }
                    }
                    )} />
                    <TableCell cellContent={
                    props.stationMetadata.map(m => {
                      if (n.timeTableRows[n.timeTableRows.length - 1].stationUICCode === m.stationUICCode) {
                        return m.stationName;
                      }
                    }
                    )} />
                  <TableCell cellContent={   
                    n.timeTableRows.map(m => {
                      if (m.stationShortCode === props.currentSearchedStation.stationShortCode && m.type === "ARRIVAL" && props.queryType === "arriving") {
                        if (m.cancelled == true) {
                          return "cancelled";
                        } else {
                          return (m.liveEstimateTime ? "liv" + m.liveEstimateTime : "sch" + m.scheduledTime);
                        }
                      }
                      if (m.stationShortCode === props.currentSearchedStation.stationShortCode && m.type === "DEPARTURE" && props.queryType === "departing") {
                        if (m.cancelled == true) {
                          return "cancelled";
                        } else {
                          return (m.liveEstimateTime ? "liv" + m.liveEstimateTime : "sch" + m.scheduledTime);
                        }
                      }
                    }
                    )} />
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TabContainer>
  );
}

@inject('trainSearchStore')
@observer
export default class TrainTimeTable extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.trainSearchStore.getStationsMetadata();
  }

  render() {
    if (this.props.trainSearchStore.fetchStationsMetadataState !== 'done') {
      return <CircularProgress />; // wait until the fetch is done and the store is updated
    } else {
      const trainTimeTableData = this.props.trainSearchStore.trainTimeTableData;
      const stationMetadata = this.props.trainSearchStore.stationMetadata;
      const currentSearchedStation = this.props.trainSearchStore.currentSearchedStation;
      const tableCols = this.props.tableCols;
    return (
      <div>
      <Typography>{currentSearchedStation.stationName}</Typography>
        
      <div>
        <Tabs>

          <TabList style={{color: "#4c9900"}}>
            <Tab>{text['arriving']}</Tab>
            <Tab>{text['departing']}</Tab>
          </TabList>

          <TabPanel>
            <TrainTable tableCols={tableCols.arriving} data={trainTimeTableData.arriving} stationMetadata={stationMetadata} currentSearchedStation={currentSearchedStation} queryType={"arriving"}/>
          </TabPanel>
          <TabPanel>
            <TrainTable tableCols={tableCols.departing} data={trainTimeTableData.departing} stationMetadata={stationMetadata} currentSearchedStation={currentSearchedStation} queryType={"departing"}/>
          </TabPanel>
          
        </Tabs>
      </div>
      </div>
    );
  }
}
}