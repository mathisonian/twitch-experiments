import React from 'react';
import * as d3 from 'd3';

const x = d3.scaleLinear().domain([0, 1]);
const y = d3.scaleLinear().domain([0, 1]);

const NUM_STARS = 200;

const stars = [];

for (var i = 0; i < NUM_STARS; i++) {
  stars.push({
    x: Math.random(),
    y: Math.random()
  })
}

module.exports = ({ width, height }) => {
  x.range([0, width]);
  y.range([0, height]);
  return (
    <g>
      {stars.map((star, i) => {
        return <circle key={i} r={1} fill={'yellow'} cx={x(star.x)} cy={y(star.y)} />
      })}
    </g>
  );
}
