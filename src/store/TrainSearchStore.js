import { observable, action } from 'mobx';
import ApiClient from './ApiClient';

const apiURL = 'http://rata.digitraffic.fi/api/v1';

export default class TrainSearchStore extends ApiClient {
  @observable
  trainTimeTableData = {
    arriving: [],
    departing: []
  };
  @observable
  currentSearchedStation = {};
  @observable
  stationMetadata = [];
  @observable
  fetchStationsMetadataState = "pending";
  @observable
  fetchTrainsOfOneStationState = "pending";


  @action
  escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

    // Get metadata array of all VR train stations
    @action
    getStationsMetadata() {
      this.fetchStationsMetadataState = 'pending';
      this.api()
        .get(apiURL + "/metadata/stations")
        .then(response => response.data)
        .then(this.getStationsMetadataSuccess)
        .catch(this.getStationsMetadataError);
    }
  
    @action.bound
    getStationsMetadataSuccess(response) {
      this.stationMetadata = response;
      this.fetchStationsMetadataState = 'done';
    }
    
    @action.bound
    getStationsMetadataError(error) {
      console.log(error);
    }

    // search stations based on their name and initiate departing and arriving train search of the first station in the received array
    @action
    getStationSuggestions(value) {
      const escapedValue = this.escapeRegexCharacters(value.trim());
      
      if (escapedValue === '') {
        return [];
      }
    
      const regex = new RegExp('^' + escapedValue, 'i');
      const stations = this.stationMetadata.filter(station => regex.test(station.stationName));
      this.fetchTrainInformationByStation(stations[0], "arriving");
      this.fetchTrainInformationByStation(stations[0], "departing");
      return stations;
    }


  // fetch list of trains arriving to or departing from a station
  @action
  fetchTrainInformationByStation(station, searchType) {
    this.currentSearchedStation = station ? station : this.stationMetadata[0];
    const stationShortCode = this.currentSearchedStation.stationShortCode;
    console.log("shortcode", stationShortCode);

    let searchString; 

    switch (searchType) {
      case "arriving":
      searchString = `/live-trains/station/${stationShortCode}?minutes_before_departure=0&minutes_after_departure=0&minutes_before_arrival=240&minutes_after_arrival=0`;
          break;
      case "departing":
      searchString = `/live-trains/station/${stationShortCode}?minutes_before_departure=240&minutes_after_departure=0&minutes_before_arrival=0&minutes_after_arrival=0`;
          break;
    }

    this.fetchTrainsOfOneStationState = 'pending';
    this.api()
      .get(apiURL + searchString)
      .then(response => response.data)
      .then((response) => this.fetchTrainInformationByStationSuccess(response, searchType))
      .catch(this.fetchTrainInformationByStationError)
  }

  @action
  fetchTrainInformationByStationSuccess(response, searchType) {
    this.trainTimeTableData[searchType] = response;
    this.fetchTrainsOfOneStationState = 'done';
  }

  @action.bound
  fetchTrainInformationByStationError(error) {
    console.log(error);
  }
}