import React, { Component } from 'react';

// import * as d3 from 'd3';

class Meta extends Component {

  render() {
    const { year, min, max, precision } = this.props;

    return (
      <div style={{position: 'absolute', bottom: 0, right: 0, left: 0}}>
        <h1 style={{color: 'white', textAlign: 'center'}}>{(+year)}</h1>
        <div style={{width: '80%', margin: '0 auto'}}>
          <input type='range' value={year} min={min} max={max} onChange={this.props.onYearChanged} style={{width: '100%'}} />
        </div>
      </div>
    );
  }
}

export default Meta;
