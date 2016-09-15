import React from 'react';
import moment from 'moment';
import _ from 'underscore';
import * as d3 from 'd3';
import lerp from 'lerp';
import chroma from 'chroma-js';

const x = d3.scaleLinear().domain([0, 1]);
const y = d3.scaleLinear().domain([0, 1]);

const colorScale = chroma.scale(['blue', 'yellow', 'red', 'gray']);

const getMeteoritePosition = (meteorite, year, projection, x, y) => {
  const yearInt = Math.floor(year);
  const precision = year - yearInt;

  // if (!meteorite.time) {
  //   console.log(meteorite);
  //   meteorite = meteorite[0];
  // }
  // console.log(precision);

  if (yearInt !== meteorite.time.year()) {
    return projection([+meteorite.reclong, +meteorite.reclat]);
  }

  const start = [x(meteorite.startX), y(meteorite.startY)];
  const end = projection([+meteorite.reclong, +meteorite.reclat]);
  if (precision < meteorite.timeOfYearStart) {
    return start;
  } else if (precision > meteorite.timeOfYearEnd) {
    return end;
  }

  const t = (precision - meteorite.timeOfYearStart) / (meteorite.timeOfYearEnd - meteorite.timeOfYearStart);

  return [lerp(start[0], end[0], t), lerp(start[1], end[1], t)];
}

const getMeteoriteRadius = (meteorite, year) => {
  const yearInt = Math.floor(year);
  const precision = year - yearInt;

  const start = 25;
  const end = 4;
  // if (!meteorite.time) {
  //   console.log(meteorite);
  //   meteorite = meteorite[0];
  // }

  if (yearInt !== meteorite.time.year()) {
    return end;
  }
  if (precision < meteorite.timeOfYearStart) {
    return start;
  } else if (precision > meteorite.timeOfYearEnd) {
    return end;
  }

  const t = (precision - meteorite.timeOfYearStart) / (meteorite.timeOfYearEnd - meteorite.timeOfYearStart);

  return lerp(start, end, t);
}


const getMeteoriteColor = (meteorite, year) => {
  const yearInt = Math.floor(year);
  const precision = year - yearInt;
  const start = 'blue';
  const end = 'gray';
  // if (!meteorite.time) {
  //   console.log(meteorite);
  //   meteorite = meteorite[0];
  // }

  if (yearInt !== meteorite.time.year()) {
    return end;
  }
  if (precision < meteorite.timeOfYearStart) {
    return start;
  } else if (precision > meteorite.timeOfYearEnd) {
    return end;
  }

  const t = (precision - meteorite.timeOfYearStart) / (meteorite.timeOfYearEnd - meteorite.timeOfYearStart);

  return colorScale(t);
}

module.exports = ({ projection, year, meteorites, width, height }) => {

  x.range([0, width]);
  y.range([0, height]);

  const yearInt = Math.floor(year);

  return (
    <g>
      {
        meteorites.map((m, i) => {
          const xy = getMeteoritePosition(m, year, projection, x, y);
          return (
            <circle key={i} cx={xy[0]} cy={xy[1]} r={getMeteoriteRadius(m, year)} stroke={'black'} fill={getMeteoriteColor(m, year)} opacity={(5 - (+yearInt - m.time.year())) / 5} />
          )
        })
      }
    </g>
  )
}
