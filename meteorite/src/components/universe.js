import React, { Component } from 'react';
import * as d3 from 'd3';
import { VictoryAnimation } from 'victory';
import Meteorites from './meteorites';
import Globe from './globe';
import Stars from './stars';

const fullMeteorites = require('../../data/meteorites');
 // = fullMeteorites;//_.first(fullMeteorites, 100);
import moment from 'moment';
import _ from 'underscore';

fullMeteorites.forEach((m) => {
  m.time = moment(m.year);
  m.timeOfYearEnd = 0.5 + Math.random() / 2;
  m.timeOfYearStart = m.timeOfYearEnd - Math.random() / 8;
  m.startX = Math.random() + (Math.random() < 0.5 ? 1 : -1);
  m.startY = Math.random() + (Math.random() < 0.5 ? 1 : -1);
});

const meteorites = fullMeteorites.filter((m) => { return m.time !== undefined });

const meteoriteYearMap = {};
for (var i = 1804; i < 2017; i++) {
  meteoriteYearMap[i] = meteorites.filter((m) => { return  (i - m.time.year()) < 5 && (i - m.time.year()) >= 0; });
}

const DURATION = 10000;
const topojson = require('topojson');

const worldMapData = require('../../data/simpler-world');

const countries = topojson.feature(worldMapData, worldMapData.objects.land);

const projection = d3.geoOrthographic().clipAngle(90);//.precision(0);
const path = d3.geoPath().projection(projection);
const graticule = d3.geoGraticule();

const isOccluded = (coords) => {
  const p = path({type: "LineString", coordinates: [[coords[0] - 0.00001, coords[1] - 0.00001], [coords[0] + 0.00001, coords[1] + 0.00001]]});
  return p === undefined;
};

class Map extends Component {

  state = {
    rotation: 0,
  }

  componentWillMount() {
    const w = this.props.width;
    const h = this.props.height;
    projection.fitSize([w, 0.75 * h], countries).translate([ w / 2, h / 2]);
  }

  componentDidMount() {
    let count = 1;

    const updateRotation  = () => {
      this.setState({
        rotation: 360 * count
      });
      count += 1;
    }

    setInterval(updateRotation, DURATION);
    updateRotation();
  }

  render() {
    const w = this.props.width;
    const h = this.props.height;
    const year = this.props.year;

    // is flying?
    const yearInt = Math.floor(year);
    const precision = year - yearInt;
    const meteoriteSet = meteoriteYearMap[+yearInt];
    const meteoriteGroups = _.groupBy(meteoriteSet, (meteorite) => {
      if (yearInt !== meteorite.time.year()) {
        return 'stationary';
      }

      if (precision < meteorite.timeOfYearStart || precision > meteorite.timeOfYearEnd) {
        return 'stationary';
      }

      return 'flying';
    });



    return (
      <svg width={w} height={h} style={{backgroundColor: '#000'}}>
        <Stars width={w} heinpm ght={h} />
        <VictoryAnimation data={{rotation: this.state.rotation}} duration={DURATION} easing='linear'>
          {(props) => {
            projection.rotate([props.rotation, -20, 0]);

            meteoriteGroups.stationary = (meteoriteGroups.stationary || []).filter((meteorite) => {
              if (precision < meteorite.timeOfYearStart) {
                return false;
              }

              return !isOccluded([+meteorite.reclong, +meteorite.reclat])
            });


            meteoriteGroups.flying = _.groupBy(meteoriteGroups.flying || [], (meteorite) => {
              if (isOccluded([+meteorite.reclong, +meteorite.reclat])) {
                return 'occluded';
              }

              return 'visible';
            });

            return (
              <g>
                <Meteorites year={year} projection={projection} meteorites={meteoriteGroups.flying.occluded || []} width={w} height={h} />
                <Globe path={path} graticule={graticule} />
                <Meteorites year={year} projection={projection} meteorites={meteoriteGroups.stationary || []} width={w} height={h} />
                <Meteorites year={year} projection={projection} meteorites={meteoriteGroups.flying.visible || []} width={w} height={h} />
              </g>
            )
          }}
        </VictoryAnimation>
      </svg>
    );
  }
}

export default Map;
