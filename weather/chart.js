// -------------------------------------------------------------
// AERO TEMP - SVG CHART GENERATOR
// -------------------------------------------------------------

const WeatherChart = (function() {
  // SVG Config
  const width = 1000;
  const height = 150;
  const padding = { top: 25, right: 30, bottom: 25, left: 30 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  /**
   * Calculates Bezier control points for smooth curves
   */
  function getControlPoints(x0, y0, x1, y1, x2, y2, x3, y3, t = 0.15) {
    const cp1x = x1 + t * (x2 - x0);
    const cp1y = y1 + t * (y2 - y0);
    const cp2x = x2 - t * (x3 - x1);
    const cp2y = y2 - t * (y3 - y1);
    return [cp1x, cp1y, cp2x, cp2y];
  }

  /**
   * Generates a cubic bezier SVG path string from points
   */
  function buildBezierPath(points) {
    if (points.length < 2) return '';
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      
      // Virtual neighbors for edge smoothing
      const p0 = points[i - 1] || p1;
      const p3 = points[i + 2] || p2;
      
      const [cp1x, cp1y, cp2x, cp2y] = getControlPoints(
        p0.x, p0.y, 
        p1.x, p1.y, 
        p2.x, p2.y, 
        p3.x, p3.y
      );
      
      // Clamp coordinates to bounds
      const cp1yClamped = Math.max(padding.top, Math.min(height - padding.bottom, cp1y));
      const cp2yClamped = Math.max(padding.top, Math.min(height - padding.bottom, cp2y));
      
      path += ` C ${cp1x} ${cp1yClamped}, ${cp2x} ${cp2yClamped}, ${p2.x} ${p2.y}`;
    }
    return path;
  }

  /**
   * Main Render function
   * @param {Object} options Config options
   *   @param {string} options.svgId ID of SVG element
   *   @param {Array} options.data List of { time: string, value: number }
   *   @param {string} options.type 'temp' | 'rain'
   *   @param {string} options.unit Value suffix (e.g. '°', '%')
   */
  function render(options) {
    const { svgId, data, type, unit } = options;
    const svg = document.getElementById(svgId);
    if (!svg) return;

    // Clear previous contents
    svg.innerHTML = '';

    if (!data || data.length === 0) return;

    // Create definitions for gradients
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    if (type === 'temp') {
      // Temperature stroke gradient (Red to Blue)
      defs.innerHTML = `
        <linearGradient id="temp-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ff7e5f" />
          <stop offset="50%" stop-color="#feb47b" />
          <stop offset="100%" stop-color="#86e3ce" />
        </linearGradient>
        <linearGradient id="temp-area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="rgba(255, 126, 95, 0.25)" />
          <stop offset="100%" stop-color="rgba(15, 23, 42, 0)" />
        </linearGradient>
      `;
    } else {
      // Rain stroke and area gradient (Cyan/Blue)
      defs.innerHTML = `
        <linearGradient id="rain-area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="rgba(6, 182, 212, 0.3)" />
          <stop offset="100%" stop-color="rgba(6, 182, 212, 0)" />
        </linearGradient>
      `;
    }
    svg.appendChild(defs);

    // Find min and max values for scale
    const values = data.map(d => d.value);
    let maxVal = Math.max(...values);
    let minVal = Math.min(...values);

    // Padding values for chart layout consistency
    if (maxVal === minVal) {
      maxVal += 2;
      minVal -= 2;
    } else {
      const paddingVal = (maxVal - minVal) * 0.15;
      maxVal += paddingVal;
      minVal -= paddingVal;
    }

    // Map data to SVG Coordinates
    const points = data.map((d, index) => {
      const x = padding.left + (index / (data.length - 1)) * graphWidth;
      const y = padding.top + (1 - (d.value - minVal) / (maxVal - minVal)) * graphHeight;
      return { x, y, value: d.value, time: d.time };
    });

    // Draw Grid Lines (Vertical & Horizontal)
    // 1. Horizontal gridlines (3 lines)
    for (let i = 0; i <= 2; i++) {
      const y = padding.top + (i / 2) * graphHeight;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', padding.left);
      line.setAttribute('y1', y);
      line.setAttribute('x2', width - padding.right);
      line.setAttribute('y2', y);
      line.setAttribute('class', 'chart-grid-line');
      svg.appendChild(line);
    }

    // 2. Vertical grid lines & labels (every 3rd hour to avoid overcrowding)
    points.forEach((p, i) => {
      if (i % 3 === 0) {
        // Line
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', p.x);
        line.setAttribute('y1', padding.top);
        line.setAttribute('x2', p.x);
        line.setAttribute('y2', height - padding.bottom);
        line.setAttribute('class', 'chart-grid-line');
        svg.appendChild(line);

        // Label
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', p.x);
        text.setAttribute('y', height - padding.bottom + 16);
        text.setAttribute('class', 'chart-label');
        text.textContent = p.time;
        svg.appendChild(text);
      }
    });

    // Build curve line & area path
    const curvePath = buildBezierPath(points);
    const areaPath = `${curvePath} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;

    // Render Area
    const fillArea = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    fillArea.setAttribute('d', areaPath);
    fillArea.setAttribute('fill', type === 'temp' ? 'url(#temp-area-gradient)' : 'url(#rain-area-gradient)');
    svg.appendChild(fillArea);

    // Render Line
    const strokeLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    strokeLine.setAttribute('d', curvePath);
    strokeLine.setAttribute('fill', 'none');
    if (type === 'temp') {
      strokeLine.setAttribute('class', 'chart-line-temp');
    } else {
      strokeLine.setAttribute('class', 'chart-line-rain');
    }
    svg.appendChild(strokeLine);

    // Render dots and set interactive events for tooltip
    const tooltip = document.getElementById('chart-tooltip');
    
    points.forEach((p) => {
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', p.x);
      dot.setAttribute('cy', p.y);
      dot.setAttribute('class', type === 'temp' ? 'chart-dot chart-dot-temp' : 'chart-dot chart-dot-rain');
      
      // Hover listeners
      dot.addEventListener('mouseenter', (e) => {
        if (!tooltip) return;
        
        // Populate tooltip content
        const displayValue = type === 'temp' ? `${Math.round(p.value)}${unit}` : `${Math.round(p.value)}${unit}`;
        const labelText = type === 'temp' ? 'Temp' : 'Precipitation';
        
        tooltip.innerHTML = `
          <div class="chart-tooltip-time">${p.time}</div>
          <div class="chart-tooltip-val" style="color: ${type === 'temp' ? 'var(--accent-sunny)' : 'var(--accent-rainy)'}">
            ${labelText}: ${displayValue}
          </div>
        `;
        
        tooltip.classList.remove('hidden');

        // Position tooltip relative to the SVG container coordinates
        const svgRect = svg.getBoundingClientRect();
        // Since viewBox coordinate space is 1000x150, calculate proportional coordinates in actual pixels
        const scaleX = svgRect.width / width;
        const scaleY = svgRect.height / height;
        
        const tooltipX = p.x * scaleX;
        const tooltipY = p.y * scaleY;
        
        tooltip.style.left = `${tooltipX}px`;
        tooltip.style.top = `${tooltipY}px`;
      });

      dot.addEventListener('mouseleave', () => {
        if (tooltip) tooltip.classList.add('hidden');
      });

      svg.appendChild(dot);
    });
  }

  return {
    render
  };
})();
