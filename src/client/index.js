import * as d3 from 'd3';

document.addEventListener('DOMContentLoaded', () => {
  app().catch(err => console.error(err));
});

const width = 507;
const height = 300;
const padding = 50;
const dataUrl = '/api/v1/data';

async function getApiData(url) {
  let data = [];

  try {
    const response = await fetch(dataUrl);
    data = await response.json();
  } catch (e) {
    console.error(e);
  }

  return data;
}

async function app() {
  const svg = d3.select('#chart')
    .append('svg')
    .attr('width', width + 2 * padding)
    .attr('height', height + 2 * padding);

  const tooltip = d3.select('#tooltip');

  const gdpData = await getApiData(dataUrl);

  if (gdpData.length === 0) {
    return;
  }

  d3.select('#title')
    .text(gdpData.name);

  d3.select('#description')
    .html(gdpData.description.replace(/\n/gi, '<br />'))

  const [gdpDates, gdpValues] = gdpData.data.reduce((acc, el) => {
    acc[0].push(new Date(el[0]));
    acc[1].push(el[1]);
    return acc;
  }, [[], []]);
  const barWidth = width / gdpData.data.length;
  const maxValue = d3.max(gdpValues);
  const minValue = 0;
  const maxDate = d3.max(gdpDates);
  const minDate = d3.min(gdpDates);

  const xScale = d3.scaleTime()
    .domain([minDate, maxDate])
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([minValue, maxValue])
    .range([height, 0]);

  const xAxis = d3.axisBottom().scale(xScale);
  const yAxis = d3.axisLeft().scale(yScale);
  const yAxisScale = '';

  console.dir({maxValue, gdpData, minDate, maxDate});

  console.dir(xScale(3));
  console.dir(xScale(new Date()));
  console.dir(d3.max(gdpDates));

  svg.append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr('transform', `translate(${padding}, ${height + padding})`);

  svg.append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('transform', `translate(${padding}, ${padding})`);

  svg.append('g')
    .selectAll('rect')
    .data(gdpData.data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('data-date', d => d[0])
    .attr('data-gdp', d => d[1])
    .attr('x', d => padding + xScale(new Date(d[0])))
    .attr('y', d => padding + yScale(new Date(d[1])))
    .attr('width', barWidth)
    .attr('height', d => height - yScale(new Date(d[1])))
    .on('mouseover', event => {
      const date = event.target.getAttribute('data-date');
      const value = event.target.getAttribute('data-gdp');
      console.dir({event});
      tooltip
        .attr('data-date', date)
        .style('left', `${event.pageX}px`)
        .style('top', `${event.pageY + 20}px`)
        .style('visibility', 'visible')
        .html(`Date: ${date} <br />Value: ${value}`)
      ;
  }).on('mouseout', event => {
    tooltip.style('visibility', 'hidden')
  })
}
