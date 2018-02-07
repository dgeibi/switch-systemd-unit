import { Component } from 'ink'
import getStates from './getStates'

export default class Provider extends Component {
  state = {
    states: this.fetchStates(),
    outputs: null,
  }

  render() {
    return this.props.render({
      ...this.state,
      setStates: this.setStates,
    })
  }

  fetchStates() {
    return getStates(this.props.dir, this.props.template, this.props.extname)
  }

  setStates = outputs => {
    this.setState({
      states: this.fetchStates(),
      outputs,
    })
  }
}
