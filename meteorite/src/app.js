import React, { Component } from 'react';
import Universe from './components/universe';
import Meta from './components/meta';

let interval, yearInterval;
class App extends Component {

  state = {
    year: 1804,
    precision: 0,
    width: window.innerWidth,
    height: window.innerHeight
  }

  constructor(props) {
    super(props);
    window.onresize = () => {
      this.setState({
        width: window.innerWidth,
        height: window.innerHeight
      })
    };
    this.handleYearChange = this.handleYearChange.bind(this);
    this.handlePrecisionChanged = this.handlePrecisionChanged.bind(this);
  }

  componentDidMount() {
    yearInterval = setInterval(() => {
      this.setState({
        year: (+this.state.year) + 1,
        precision: 0
      })
      clearInterval(interval);
      let count = 0;
      interval = setInterval(() => {
        this.setState({
          precision: count / 100
        });

        count++;
        if (count === 100) {
          clearInterval(interval);
        }
      }, 10);

      if (this.state.year > 2016) {
        clearInterval(yearInterval);
      }
    }, 10000);
  }

  handleYearChange(event) {
    // this.setState({
    //   year: event.target.value,
    //   precision: 0
    // });

  }

  handlePrecisionChanged(event) {
    // this.setState({
    //   precision: event.target.value
    // });
  }

  render() {
    const w = this.state.width;
    const h = this.state.height;

    return (
      <div className="App">
        <Universe width={w} height={h} year={(+this.state.year) + (+this.state.precision)} />
        <Meta min={1804} max={2016} year={this.state.year} onYearChanged={this.handleYearChange} onPrecisionChanged={this.handlePrecisionChanged} precision={this.state.precision} />
      </div>
    );
  }
}

export default App;
