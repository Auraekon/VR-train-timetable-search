import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography
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

function reduceISODateToHoursMinutes(date) {
    let tempTimeStampArray = date.split("T")[1].split(".")[0].split(":");
    tempTimeStampArray[0] = parseInt(tempTimeStampArray[0]) + 2;
    return (tempTimeStampArray[0] + "." + tempTimeStampArray[1]);
}

function TrainTable(props) {
  let rowShadeTicker = true;
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

              let rowShadeColor = rowShadeTicker ? "#f9f9f9" : "#ffffff";
              rowShadeTicker = rowShadeTicker ? false : true;
              return (
                <TableRow key={n.trainNumber} style={{backgroundColor: rowShadeColor}}>
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
                          let tempTimeStamp = (m.liveEstimateTime ? m.liveEstimateTime : m.scheduledTime);
                          return reduceISODateToHoursMinutes(tempTimeStamp);
                        }
                      }
                      if (m.stationShortCode === props.currentSearchedStation.stationShortCode && m.type === "DEPARTURE" && props.queryType === "departing") {
                        if (m.cancelled == true) {
                          return "cancelled";
                        } else {
                          let tempTimeStamp = (m.liveEstimateTime ? m.liveEstimateTime : m.scheduledTime);
                          return reduceISODateToHoursMinutes(tempTimeStamp);
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

  render() {
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
