import React from 'react';
const topojson = require('topojson');

const worldMapData = require('../../data/simpler-world');

const countries = topojson.feature(worldMapData, worldMapData.objects.land);
const countryBoundries = topojson.feature(worldMapData, worldMapData.objects.countries);

module.exports = ({ path, graticule }) => {

  return (
    <g>
      <path d={path({type: 'Sphere'})} fill={'blue'} />
      {
        graticule.lines().map((line, i) => {
          return (
            <path key={i} d={path(line)} stroke={'rgba(0, 0, 200, 0.8)'} fill={'none'} />
          )
        })
      }
      <path d={path(countries)} fill={'#93a55f'} />
      <path d={path(countryBoundries)} stroke={'#83954f'} fill={'none'} strokeWidth={2} />
    </g>
  )
}
