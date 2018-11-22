import TrainSearchStore from './TrainSearchStore';

class RootStore {
  constructor() {
    this.trainSearchStore = new TrainSearchStore();
  }
}

const rootStore = (window.store = new RootStore());

export default rootStore;
