function getD3Series(uPlotData, uPlotSeries) {
  return uPlotSeries.slice(1).map((s, i) => ({
    name: s.label,
    values: uPlotData[i + 1],
    color: s.stroke || '#000',
    fill: s.fill || null
  }));
}

function exportCurrentGraphAsSVG() {
  const d3Series = getD3Series(data, series);
  const labels = data[0];
  const width = 1200;
  const height = 500;
  const margin = { top: 40, right: 150, bottom: 50, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  d3.select('#export-svg-temp').remove();

  const svg = d3.select('body').append('svg')
    .attr('id', 'export-svg-temp')
    .attr('width', width)
    .attr('height', height)
    .attr('xmlns', 'http://www.w3.org/2000/svg');

  const chart = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  if (!labels || labels.length === 0 || d3Series.length === 0) {
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '20px')
      .attr('fill', 'red')
      .text('No data to export');
    return;
  }

  const maxValue = auto ? d3.max(d3Series.flatMap(d => d.values.filter(v => v !== null))) : yMax;

  const xScale = xType === 'linear'
    ? d3.scaleLinear().domain([xMin, xMax]).range([0, innerWidth])
    : d3.scalePoint().domain(labels).range([0, innerWidth]).padding(0.5);

  const yScale = d3.scaleLinear()
    .domain([auto ? 0 : yMin, maxValue * (auto ? 1.1 : 1)])
    .nice()
    .range([innerHeight, 0]);

  chart.append('g')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale).tickFormat(d => xType === 'linear' ? d : formatElapsed(d, xTime)))
    .attr('font-size', 14);
  chart.append('g')
    .call(d3.axisLeft(yScale))
    .attr('font-size', 14);

  function createSegments(values) {
    const segments = [];
    let current = [];
    values.forEach((v, i) => {
      if (v !== null && labels[i] !== undefined) {
        current.push({ x: labels[i], y: v, index: i });
      } else if (current.length) {
        segments.push(current); current = [];
      }
    });
    if (current.length) segments.push(current);
    return segments;
  }

  for (const dataset of d3Series) {
    for (const segment of createSegments(dataset.values)) {
      if (segment.length < 2) continue; // skip too-short segments
      chart.append('path')
        .datum(segment)
        .attr('fill', 'none')
        .attr('stroke', dataset.color)
        .attr('stroke-width', 2)
        .attr('d', d3.line()
          .x(d => xScale(d.x))
          .y(d => yScale(d.y))
          .curve(d3.curveMonotoneX)
        );
      if (fill && dataset.fill) {
        chart.append('path')
          .datum(segment)
          .attr('fill', dataset.fill)
          .attr('d', d3.area()
            .x(d => xScale(d.x))
            .y0(innerHeight)
            .y1(d => yScale(d.y))
            .curve(d3.curveMonotoneX)
          );
      }
      if (point) {
        chart.selectAll(null)
          .data(segment)
          .enter()
          .append('circle')
          .attr('cx', d => xScale(d.x))
          .attr('cy', d => yScale(d.y))
          .attr('r', 4)
          .attr('fill', dataset.color)
          .attr('stroke', 'white')
          .attr('stroke-width', 2);
      }
    }
  }

  svg.append('text')
    .attr('x', width / 2)
    .attr('y', margin.top / 2)
    .attr('text-anchor', 'middle')
    .attr('font-size', '16px')
    .attr('font-weight', 'bold')
    .text(title);

  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -(height / 2))
    .attr('y', margin.left / 3)
    .attr('text-anchor', 'middle')
    .attr('font-size', '14px')
    .text(yTitle);

  const legend = svg.append('g')
    .attr('transform', `translate(${innerWidth + margin.left + 20}, ${margin.top})`);
  d3Series.forEach((dataset, i) => {
    const legendItem = legend.append('g')
      .attr('transform', `translate(0, ${i * 25})`);
    legendItem.append('rect')
      .attr('width', 18)
      .attr('height', 4)
      .attr('fill', dataset.color)
      .attr('y', 8);
    legendItem.append('text')
      .attr('x', 24)
      .attr('y', 10)
      .attr('dy', '0.35em')
      .attr('class', 'legend')
      .text(dataset.name);
  });

  const svgString = svg.node().outerHTML;
  const blob = new Blob([svgString], {type: 'image/svg+xml'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'uplot-export.svg';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  svg.remove();
}
document.getElementById('export-svg').addEventListener('click', exportCurrentGraphAsSVG);
