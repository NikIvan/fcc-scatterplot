import * as d3 from 'd3';
import { getData } from './api';

document.addEventListener('DOMContentLoaded', () => {
  app().catch((err) => console.error(err));
});

const width = 507;
const height = 300;
const padding = 50;
const radius = 5;

async function app() {
  const svg = d3.select('#chart')
    .append('svg')
    .attr('width', width + 2 * padding)
    .attr('height', height + 2 * padding);

  const tooltip = d3.select('#tooltip');

  const dataUrl = '/api/v1/data';
  let cyclistData = await getData(dataUrl);

  if (cyclistData == null) {
    return;
  }

  cyclistData = cyclistData.map((el) => {
    const [minutes, seconds] = el.Time.split(':');
    const newEl = { ...el };
    newEl.dateTime = new Date();
    newEl.dateTime.setMinutes(minutes);
    newEl.dateTime.setSeconds(seconds);
    return newEl;
  });

  console.dir({ cyclistData });

  d3.select('#title')
    .text('Doping in Professional Bicycle Racing');

  // d3.select('#description')
  //   .html(gdpData.description.replace(/\n/gi, '<br />'))
  //
  // const [gdpDates, gdpValues] = gdpData.data.reduce((acc, el) => {
  //   acc[0].push(new Date(el[0]));
  //   acc[1].push(el[1]);
  //   return acc;
  // }, [[], []]);
  // const barWidth = width / gdpData.data.length;

  const maxYear = d3.max(cyclistData, (d) => d.Year + 1);
  const minYear = d3.min(cyclistData, (d) => d.Year - 1);
  const xScale = d3.scaleLinear()
    .domain([minYear, maxYear])
    .range([0, width]);

  const maxTime = d3.max(cyclistData, (d) => d.dateTime);
  const minTime = d3.min(cyclistData, (d) => d.dateTime);
  const yScale = d3.scaleTime()
    .domain([minTime, maxTime])
    .range([0, height]);

  const yearFormat = d3.format('d');
  const xAxis = d3.axisBottom().scale(xScale).tickFormat(yearFormat);

  const timeFormat = d3.timeFormat('%M:%S');
  const yAxis = d3.axisLeft().scale(yScale).tickFormat(timeFormat);
  // const yAxisScale = '';
  //
  // console.dir({maxValue, gdpData, minDate, maxDate});
  //
  // console.dir(xScale(3));
  // console.dir(xScale(new Date()));
  // console.dir(d3.max(gdpDates));
  //
  svg.append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr('transform', `translate(${padding}, ${height + padding})`);
  //
  svg.append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('transform', `translate(${padding}, ${padding})`);
  //
  svg.append('g')
    .selectAll('circle')
    .data(cyclistData)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('data-xvalue', (d) => d.Year)
    .attr('data-yvalue', (d) => d.dateTime.toISOString())
    .attr('data-index', (d, i) => i)
    .attr('cx', (d) => padding + xScale(d.Year))
    .attr('cy', (d) => padding + yScale(d.dateTime))
    .attr('r', radius)
    .on('mouseover', (event) => {
      const year = event.target.getAttribute('data-xvalue');
      const index = event.target.getAttribute('data-index');
      const el = cyclistData[index];

      console.dir({ event, el });
      let html = `Name: ${el.Name} [${el.Nationality}]<br />Year: ${year}<br />Time: ${el.Time}<br />`;

      if (el.Doping) {
        html += `Doping: ${el.Doping}`;
      }

      tooltip
        .attr('data-year', year)
        .style('left', `${event.pageX}px`)
        .style('top', `${event.pageY + 20}px`)
        .style('visibility', 'visible')
        .html(html);
    })
    .on('mouseout', () => {
      tooltip.style('visibility', 'hidden');
    });
}
