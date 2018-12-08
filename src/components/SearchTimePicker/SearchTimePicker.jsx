import React, {Component} from 'react';
import { observer, inject } from 'mobx-react';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});


@inject('trainSearchStore')
@observer
export default class SearchTimePicker extends Component {
  onChange (event) {
  this.props.trainSearchStore.changeSearchTime(event.target.value);
  }

  render() {
  return (
    <form style={styles.container} noValidate>
      <TextField
        id="date"
        label="Date"
        type="date"
        defaultValue="2017-05-24"
        style={styles.textField}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(event) => this.onChange(event)}
      />
    </form>
  );
}
}