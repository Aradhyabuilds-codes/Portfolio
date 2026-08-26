// -------------------------------------------------------------
// AERO TEMP - CORE DASHBOARD LOGIC
// -------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  // --- STATE SYSTEM ---
  const state = {
    unit: localStorage.getItem('aero_unit') || 'C', // 'C' or 'F'
    currentLocation: JSON.parse(localStorage.getItem('aero_location')) || {
      name: 'London',
      country: 'United Kingdom',
      latitude: 51.5085,
      longitude: -0.1257
    },
    favorites: JSON.parse(localStorage.getItem('aero_favorites')) || [
      { name: 'New York', country: 'United States', latitude: 40.7143, longitude: -74.006 },
      { name: 'Tokyo', country: 'Japan', latitude: 35.6895, longitude: 139.6917 },
      { name: 'Paris', country: 'France', latitude: 48.8534, longitude: 2.3488 }
    ],
    weatherData: null,
    aqiData: null,
    chartType: 'temp', // 'temp' or 'rain'
    activeParticleSystem: null,
    clockInterval: null
  };

  // --- DOM ELEMENTS ---
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const suggestionsBox = document.getElementById('search-suggestions');
  const geoBtn = document.getElementById('geo-btn');
  const favToggleBtn = document.getElementById('fav-toggle-btn');
  const unitCBtn = document.getElementById('unit-c');
  const unitFBtn = document.getElementById('unit-f');
  
  // Spotlight DOM elements
  const currentTempEl = document.getElementById('current-temp');
  const weatherCondEl = document.getElementById('weather-condition');
  const locationNameEl = document.getElementById('location-name');
  const locationCountryEl = document.getElementById('location-country');
  const tempMaxEl = document.getElementById('temp-max');
  const tempMinEl = document.getElementById('temp-min');
  const currentDateEl = document.getElementById('current-date');
  const currentTimeEl = document.getElementById('current-time');
  const weatherVisualIcon = document.getElementById('weather-visual-icon');
  
  // Favorites DOM
  const favoritesListEl = document.getElementById('favorites-list');

  // Chart DOM
  const toggleTempChartBtn = document.getElementById('toggle-temp-chart');
  const toggleRainChartBtn = document.getElementById('toggle-rain-chart');
  const hourlyCardsContainer = document.getElementById('hourly-cards-container');

  // Weekly DOM
  const weeklyForecastListEl = document.getElementById('weekly-forecast-list');

  // Highlights DOM
  const uvIndexValEl = document.getElementById('uv-index-val');
  const uvCategoryEl = document.getElementById('uv-category');
  const uvProgressPath = document.getElementById('uv-progress');
  const windSpeedEl = document.getElementById('wind-speed');
  const windUnitEl = document.getElementById('wind-unit');
  const windGustEl = document.getElementById('wind-gust');
  const compassPointer = document.getElementById('compass-pointer');
  const windDirectionTextEl = document.getElementById('wind-direction-text');
  const sunArcProgress = document.getElementById('sun-arc-progress');
  const sunNode = document.getElementById('sun-node');
  const sunriseTimeEl = document.getElementById('sunrise-time');
  const sunsetTimeEl = document.getElementById('sunset-time');
  const daylightRemainingLabel = document.getElementById('daylight-remaining-label');
  const aqiIndexEl = document.getElementById('aqi-index');
  const aqiStatusEl = document.getElementById('aqi-status');
  const aqiProgressBar = document.getElementById('aqi-progress-bar');
  const aqiPm25El = document.getElementById('aqi-pm25');
  const aqiPm10El = document.getElementById('aqi-pm10');
  const aqiNo2El = document.getElementById('aqi-no2');
  const aqiO3El = document.getElementById('aqi-o3');
  const humidityValEl = document.getElementById('humidity-val');
  const humidityProgressCircle = document.getElementById('humidity-progress');
  const dewPointEl = document.getElementById('dew-point');
  const pressureValEl = document.getElementById('pressure-val');
  const pressureTrendEl = document.getElementById('pressure-trend');
  const visibilityValEl = document.getElementById('visibility-val');
  const visibilityStatusEl = document.getElementById('visibility-status');

  // --- WMO WEATHER CODES MAPPING ---
  // Returns { desc, icon, themeClass }
  function getWeatherDetails(code, isDay = 1) {
    const defaultDetails = { desc: 'Unknown', icon: 'help-circle', themeClass: 'weather-clear-day' };
    
    const wmoCodes = {
      0: { desc: 'Clear Sky', icon: isDay ? 'sun' : 'moon', themeClass: isDay ? 'weather-clear-day' : 'weather-clear-night' },
      1: { desc: 'Mainly Clear', icon: isDay ? 'cloud-sun' : 'cloud-moon', themeClass: isDay ? 'weather-clear-day' : 'weather-clear-night' },
      2: { desc: 'Partly Cloudy', icon: isDay ? 'cloud-sun' : 'cloud-moon', themeClass: 'weather-cloudy' },
      3: { desc: 'Overcast', icon: 'cloud', themeClass: 'weather-cloudy' },
      45: { desc: 'Foggy', icon: 'cloud-fog', themeClass: 'weather-cloudy' },
      48: { desc: 'Depositing Rime Fog', icon: 'cloud-fog', themeClass: 'weather-cloudy' },
      51: { desc: 'Light Drizzle', icon: 'cloud-drizzle', themeClass: 'weather-rainy' },
      53: { desc: 'Moderate Drizzle', icon: 'cloud-drizzle', themeClass: 'weather-rainy' },
      55: { desc: 'Dense Drizzle', icon: 'cloud-drizzle', themeClass: 'weather-rainy' },
      56: { desc: 'Light Freezing Drizzle', icon: 'cloud-snowflake', themeClass: 'weather-snowy' },
      57: { desc: 'Dense Freezing Drizzle', icon: 'cloud-snowflake', themeClass: 'weather-snowy' },
      61: { desc: 'Slight Rain', icon: 'cloud-rain', themeClass: 'weather-rainy' },
      63: { desc: 'Moderate Rain', icon: 'cloud-rain', themeClass: 'weather-rainy' },
      65: { desc: 'Heavy Rain', icon: 'cloud-rain', themeClass: 'weather-rainy' },
      66: { desc: 'Light Freezing Rain', icon: 'cloud-snowflake', themeClass: 'weather-snowy' },
      67: { desc: 'Heavy Freezing Rain', icon: 'cloud-snowflake', themeClass: 'weather-snowy' },
      71: { desc: 'Slight Snow Fall', icon: 'snowflake', themeClass: 'weather-snowy' },
      73: { desc: 'Moderate Snow Fall', icon: 'snowflake', themeClass: 'weather-snowy' },
      75: { desc: 'Heavy Snow Fall', icon: 'snowflake', themeClass: 'weather-snowy' },
      77: { desc: 'Snow Grains', icon: 'snowflake', themeClass: 'weather-snowy' },
      80: { desc: 'Slight Rain Showers', icon: 'cloud-drizzle', themeClass: 'weather-rainy' },
      81: { desc: 'Moderate Rain Showers', icon: 'cloud-rain', themeClass: 'weather-rainy' },
      82: { desc: 'Violent Rain Showers', icon: 'cloud-lightning', themeClass: 'weather-stormy' },
      85: { desc: 'Slight Snow Showers', icon: 'cloud-snow', themeClass: 'weather-snowy' },
      86: { desc: 'Heavy Snow Showers', icon: 'cloud-snow', themeClass: 'weather-snowy' },
      95: { desc: 'Thunderstorm', icon: 'cloud-lightning', themeClass: 'weather-stormy' },
      96: { desc: 'Thunderstorm with Slight Hail', icon: 'cloud-lightning', themeClass: 'weather-stormy' },
      99: { desc: 'Thunderstorm with Heavy Hail', icon: 'cloud-lightning', themeClass: 'weather-stormy' }
    };

    return wmoCodes[code] || defaultDetails;
  }

  // --- UNIT CONVERSION HELPERS ---
  function formatTemp(celsius) {
    if (state.unit === 'F') {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return Math.round(celsius);
  }

  function convertWindSpeed(kmh) {
    if (state.unit === 'F') {
      return { val: Math.round(kmh * 0.621371), unit: 'mph' };
    }
    return { val: Math.round(kmh), unit: 'km/h' };
  }

  // --- ATMOSPHERIC PARTICLES EFFECT ---
  function startAtmosphericParticles(themeClass) {
    // Clear existing animation loop and elements
    if (state.activeParticleSystem) {
      clearInterval(state.activeParticleSystem);
    }
    const container = document.getElementById('ambient-particles');
    container.innerHTML = '';
    
    let particleCount = 0;
    let maxParticles = 0;
    let createParticle = null;

    // Determine particle logic based on weather theme
    if (themeClass.includes('weather-rainy')) {
      maxParticles = 55;
      createParticle = () => {
        const p = document.createElement('div');
        p.classList.add('particle');
        p.style.width = '1px';
        p.style.height = `${Math.random() * 20 + 10}px`;
        p.style.background = 'linear-gradient(transparent, rgba(6, 182, 212, 0.45))';
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = '-30px';
        p.style.transform = 'rotate(15deg)';
        
        const duration = Math.random() * 1 + 0.8;
        p.style.transition = `top ${duration}s linear, left ${duration}s linear`;
        
        container.appendChild(p);

        setTimeout(() => {
          p.style.top = '105vh';
          p.style.left = `${parseFloat(p.style.left) + 10}%`;
        }, 50);

        setTimeout(() => p.remove(), duration * 1000 + 100);
      };
    } else if (themeClass.includes('weather-snowy')) {
      maxParticles = 40;
      createParticle = () => {
        const p = document.createElement('div');
        p.classList.add('particle');
        const size = Math.random() * 6 + 3;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.background = 'rgba(255, 255, 255, 0.8)';
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = '-10px';
        p.style.boxShadow = '0 0 8px rgba(255,255,255,0.4)';
        
        const duration = Math.random() * 3.5 + 3.5;
        p.style.transition = `top ${duration}s linear, left ${duration}s ease-in-out`;
        
        container.appendChild(p);

        setTimeout(() => {
          p.style.top = '105vh';
          p.style.left = `${parseFloat(p.style.left) + (Math.random() * 15 - 7.5)}%`;
        }, 50);

        setTimeout(() => p.remove(), duration * 1000 + 100);
      };
    } else if (themeClass.includes('weather-stormy')) {
      maxParticles = 65;
      
      // Storm lightning pulse trigger
      const triggerLightning = () => {
        if (Math.random() > 0.88) {
          document.body.style.filter = 'brightness(2.2)';
          setTimeout(() => {
            document.body.style.filter = 'none';
            if (Math.random() > 0.5) {
              setTimeout(() => {
                document.body.style.filter = 'brightness(1.8)';
                setTimeout(() => document.body.style.filter = 'none', 60);
              }, 120);
            }
          }, 80);
        }
      };

      createParticle = () => {
        triggerLightning();
        const p = document.createElement('div');
        p.classList.add('particle');
        p.style.width = '1px';
        p.style.height = `${Math.random() * 25 + 15}px`;
        p.style.background = 'linear-gradient(transparent, rgba(168, 85, 247, 0.5))';
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = '-30px';
        p.style.transform = 'rotate(18deg)';
        
        const duration = Math.random() * 0.7 + 0.6;
        p.style.transition = `top ${duration}s linear, left ${duration}s linear`;
        
        container.appendChild(p);

        setTimeout(() => {
          p.style.top = '105vh';
          p.style.left = `${parseFloat(p.style.left) + 12}%`;
        }, 50);

        setTimeout(() => p.remove(), duration * 1000 + 100);
      };
    } else if (themeClass.includes('weather-clear-day')) {
      maxParticles = 12;
      createParticle = () => {
        const p = document.createElement('div');
        p.classList.add('particle');
        const size = Math.random() * 80 + 40;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.background = 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, rgba(245, 158, 11, 0) 70%)';
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = `${Math.random() * 90}%`;
        p.style.opacity = '0';
        p.style.transition = 'opacity 2s ease, transform 10s ease';
        p.style.transform = 'scale(0.8)';
        
        container.appendChild(p);
        
        setTimeout(() => {
          p.style.opacity = '1';
          p.style.transform = 'scale(1.2)';
        }, 50);

        setTimeout(() => {
          p.style.opacity = '0';
          setTimeout(() => p.remove(), 2000);
        }, 12000);
      };
    } else if (themeClass.includes('weather-clear-night')) {
      maxParticles = 35;
      createParticle = () => {
        const p = document.createElement('div');
        p.classList.add('particle');
        const size = Math.random() * 2 + 1;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.background = '#ffffff';
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = `${Math.random() * 65}%`;
        p.style.opacity = '0';
        p.style.boxShadow = '0 0 6px rgba(255,255,255,0.8)';
        
        const duration = Math.random() * 3 + 2;
        p.style.transition = `opacity ${duration / 2}s ease`;
        
        container.appendChild(p);
        
        // Twinkling logic
        setTimeout(() => p.style.opacity = Math.random() * 0.7 + 0.3, 50);

        setTimeout(() => {
          p.style.opacity = '0';
          setTimeout(() => p.remove(), duration * 500);
        }, duration * 1000);
      };
    }

    if (!createParticle) return;

    // Particle generator interval
    state.activeParticleSystem = setInterval(() => {
      // Check current visible count
      const activeCount = container.children.length;
      if (activeCount < maxParticles) {
        createParticle();
      }
    }, themeClass.includes('clear') ? 800 : 80);
  }

  // --- INITIALIZE REAL-TIME TIMEPIECE ---
  function startLocalClock(timezoneName) {
    if (state.clockInterval) {
      clearInterval(state.clockInterval);
    }

    const updateTime = () => {
      const now = new Date();
      // Format options to match the requested city timezone
      const timeOpts = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: timezoneName
      };
      
      const dateOpts = {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        timeZone: timezoneName
      };

      try {
        currentTimeEl.textContent = now.toLocaleTimeString('en-US', timeOpts);
        currentDateEl.textContent = now.toLocaleDateString('en-US', dateOpts);
      } catch (e) {
        // Fallback to local browser timezone if error
        currentTimeEl.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        currentDateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' });
      }
    };

    updateTime();
    state.clockInterval = setInterval(updateTime, 30000); // Update every 30s
  }

  // --- SIDEBAR & FAVORITES SYSTEM ---
  function renderFavoritesList() {
    favoritesListEl.innerHTML = '';
    
    if (state.favorites.length === 0) {
      favoritesListEl.innerHTML = `
        <div class="empty-favorites">
          <p>No pinned locations yet.</p>
          <span>Click the star icon to save your favorite cities.</span>
        </div>
      `;
      return;
    }

    // Render favorite item buttons
    state.favorites.forEach((fav, index) => {
      const item = document.createElement('div');
      item.className = 'fav-city-item';
      
      // Fetch temperature asynchronously for each favorite location on load
      item.innerHTML = `
        <div class="fav-city-info">
          <span class="fav-city-name">${fav.name}</span>
          <span class="fav-city-country">${fav.country}</span>
        </div>
        <div class="fav-city-right">
          <span class="fav-city-temp" id="fav-temp-${index}">--&deg;</span>
          <button class="fav-city-remove" data-index="${index}" title="Remove favorite">
            <i data-lucide="trash-2" style="width:14px; height:14px;"></i>
          </button>
        </div>
      `;

      // Click favorite item to navigate
      item.addEventListener('click', (e) => {
        // Ignore clicks on the remove button
        if (e.target.closest('.fav-city-remove')) return;
        
        state.currentLocation = fav;
        localStorage.setItem('aero_location', JSON.stringify(fav));
        fetchWeatherDashboardData();
      });

      favoritesListEl.appendChild(item);
      
      // Query Open-Meteo for temporary live temp
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${fav.latitude}&longitude=${fav.longitude}&current=temperature_2m&timezone=auto`)
        .then(res => res.json())
        .then(data => {
          const tempEl = document.getElementById(`fav-temp-${index}`);
          if (tempEl && data.current) {
            const tempVal = formatTemp(data.current.temperature_2m);
            tempEl.innerHTML = `${tempVal}&deg;`;
          }
        })
        .catch(() => {});
    });

    // Handle delete button click
    document.querySelectorAll('.fav-city-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.getAttribute('data-index'));
        const removed = state.favorites.splice(index, 1)[0];
        localStorage.setItem('aero_favorites', JSON.stringify(state.favorites));
        renderFavoritesList();
        
        // Sync star button if the removed location is the active one
        if (state.currentLocation.latitude === removed.latitude && state.currentLocation.longitude === removed.longitude) {
          favToggleBtn.querySelector('.fav-icon').classList.remove('active');
        }
      });
    });

    lucide.createIcons();
  }

  // Check if current active location is in favorites
  function checkFavoriteStatus() {
    const isFavorite = state.favorites.some(
      fav => fav.latitude.toFixed(4) === state.currentLocation.latitude.toFixed(4) && 
             fav.longitude.toFixed(4) === state.currentLocation.longitude.toFixed(4)
    );
    const star = favToggleBtn.querySelector('.fav-icon');
    if (isFavorite) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  }

  // Toggle favorite location
  favToggleBtn.addEventListener('click', () => {
    const active = state.currentLocation;
    const isFavoriteIndex = state.favorites.findIndex(
      fav => fav.latitude.toFixed(4) === active.latitude.toFixed(4) && 
             fav.longitude.toFixed(4) === active.longitude.toFixed(4)
    );

    if (isFavoriteIndex > -1) {
      // Remove
      state.favorites.splice(isFavoriteIndex, 1);
      favToggleBtn.querySelector('.fav-icon').classList.remove('active');
    } else {
      // Add
      state.favorites.push({
        name: active.name,
        country: active.country,
        latitude: active.latitude,
        longitude: active.longitude
      });
      favToggleBtn.querySelector('.fav-icon').classList.add('active');
    }

    localStorage.setItem('aero_favorites', JSON.stringify(state.favorites));
    renderFavoritesList();
  });

  // --- DYNAMIC RENDERING ENGINES ---

  // Renders current weather card, sets theme, updates animations
  function updateSpotlightDetails() {
    if (!state.weatherData) return;
    const current = state.weatherData.current;
    
    // Convert temperature
    const displayTemp = formatTemp(current.temperature_2m);
    currentTempEl.textContent = displayTemp;
    
    // Convert high/low for day
    const displayHi = formatTemp(state.weatherData.daily.temperature_2m_max[0]);
    const displayLo = formatTemp(state.weatherData.daily.temperature_2m_min[0]);
    tempMaxEl.textContent = `Hi: ${displayHi}°`;
    tempMinEl.textContent = `Lo: ${displayLo}°`;

    // Map code
    const details = getWeatherDetails(current.weather_code, current.is_day);
    weatherCondEl.textContent = details.desc;
    
    // Set matching atmospheric body themes
    document.body.className = details.themeClass;
    startAtmosphericParticles(details.themeClass);
    
    // Update main weather SVG icon
    weatherVisualIcon.innerHTML = `<i data-lucide="${details.icon}" class="main-weather-icon ${current.is_day ? 'sunny-glow' : 'night-glow'}"></i>`;
    
    // Update labels
    locationNameEl.textContent = state.currentLocation.name;
    locationCountryEl.textContent = state.currentLocation.country || 'Global Coordinate';

    // Start clock in matching local timezone
    startLocalClock(state.weatherData.timezone);
    
    // Update icons
    lucide.createIcons();
  }

  // Renders the hourly forecast scroll area and updates hourly SVG charts
  function updateHourlyForecastSection() {
    if (!state.weatherData) return;
    const hourly = state.weatherData.hourly;
    
    // Clear previous
    hourlyCardsContainer.innerHTML = '';
    
    // We want to list 24 hours of data starting from the nearest current hour index
    const nowLocalStr = state.weatherData.current.time; // Local date-time string of location, e.g. "2026-06-14T11:00"
    let startIndex = hourly.time.findIndex(t => t.startsWith(nowLocalStr.substring(0, 13)));
    if (startIndex === -1) startIndex = 0;

    const limit = Math.min(startIndex + 24, hourly.time.length);
    const hourlyPoints = [];

    for (let i = startIndex; i < limit; i++) {
      const timeStr = hourly.time[i];
      const tempVal = hourly.temperature_2m[i];
      const rainProb = hourly.precipitation_probability[i];
      const windKmh = hourly.wind_speed_10m[i];
      const weatherCode = hourly.weather_code[i];
      
      const date = new Date(timeStr);
      let hourStr = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
      if (i === startIndex) hourStr = 'Now';
      
      const details = getWeatherDetails(weatherCode, 1); // Mock as day icon in list for visibility
      
      // Create element card
      const card = document.createElement('div');
      card.className = `hourly-card ${i === startIndex ? 'active' : ''}`;
      
      const dispTemp = formatTemp(tempVal);
      const dispWind = convertWindSpeed(windKmh);
      
      card.innerHTML = `
        <span class="hourly-time">${hourStr}</span>
        <i data-lucide="${details.icon}" class="hourly-icon" style="color: ${details.themeClass.includes('clear') ? 'var(--accent-sunny)' : 'var(--text-secondary)'}"></i>
        <span class="hourly-temp">${dispTemp}&deg;</span>
        <span class="hourly-wind"><i data-lucide="wind" style="width:10px; height:10px;"></i> ${dispWind.val}</span>
      `;
      
      hourlyCardsContainer.appendChild(card);

      // Collect points for rendering charts
      const chartVal = state.chartType === 'temp' ? tempVal : rainProb;
      hourlyPoints.push({
        time: hourStr,
        value: chartVal
      });
    }

    // Render SVG chart
    const unitSymbol = state.chartType === 'temp' ? '°' : '%';
    const pointsFormatted = hourlyPoints.map(p => ({
      time: p.time,
      value: state.chartType === 'temp' ? (state.unit === 'F' ? (p.value * 9/5 + 32) : p.value) : p.value
    }));

    WeatherChart.render({
      svgId: 'hourly-chart-svg',
      data: pointsFormatted,
      type: state.chartType,
      unit: unitSymbol
    });

    lucide.createIcons();
  }

  // Renders the weekly forecast cards using relative scale alignment (iOS style)
  function updateWeeklyForecastSection() {
    if (!state.weatherData) return;
    const daily = state.weatherData.daily;
    
    weeklyForecastListEl.innerHTML = '';

    // Calculate global weekly min and max to coordinate alignment bars
    const globalMax = Math.max(...daily.temperature_2m_max);
    const globalMin = Math.min(...daily.temperature_2m_min);
    const globalRange = globalMax - globalMin || 1;

    for (let i = 0; i < daily.time.length; i++) {
      const timeStr = daily.time[i];
      const code = daily.weather_code[i];
      const maxTemp = daily.temperature_2m_max[i];
      const minTemp = daily.temperature_2m_min[i];
      
      // Determine day label
      const date = new Date(timeStr + 'T00:00'); // Prevent timezone shift
      let dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      if (i === 0) dayName = 'Today';

      const details = getWeatherDetails(code, 1);
      
      const dispMax = formatTemp(maxTemp);
      const dispMin = formatTemp(minTemp);
      
      // Calculate relative horizontal bar positions
      const startPct = ((minTemp - globalMin) / globalRange) * 100;
      const endPct = ((maxTemp - globalMin) / globalRange) * 100;
      const widthPct = Math.max(endPct - startPct, 3); // Guarantee minimum visibility width

      const item = document.createElement('div');
      item.className = 'weekly-item';
      
      // Fetch daily rain probability (mock or pull from open meteo if possible, here using default WMO index mapping)
      const isRainy = details.themeClass.includes('rainy') || details.themeClass.includes('stormy');
      const popText = isRainy ? '70%' : '';

      item.innerHTML = `
        <span class="weekly-day">${dayName}</span>
        <span class="weekly-pop">${popText}</span>
        <div class="weekly-icon-wrap">
          <i data-lucide="${details.icon}" class="weekly-icon" style="color: ${details.themeClass.includes('clear') ? 'var(--accent-sunny)' : 'var(--text-secondary)'}"></i>
        </div>
        <div class="weekly-temp-bar-container">
          <div class="weekly-temp-bar-progress" style="left: ${startPct}%; width: ${widthPct}%;"></div>
        </div>
        <div class="weekly-temp-val">
          <span class="min">${dispMin}&deg;</span>
          <span>${dispMax}&deg;</span>
        </div>
      `;
      
      weeklyForecastListEl.appendChild(item);
    }
    
    lucide.createIcons();
  }

  // Updates UV, AQI, Compass Wind, Sun Arc trajectory, Humidity and Visibility
  function updateDetailsHighlights() {
    if (!state.weatherData) return;
    
    const current = state.weatherData.current;
    const daily = state.weatherData.daily;
    const hourly = state.weatherData.hourly;
    
    // Locate nearest hour index to populate current highlights
    const nowStr = current.time;
    let idx = hourly.time.findIndex(t => t.startsWith(nowStr.substring(0, 13)));
    if (idx === -1) idx = 0;

    // 1. UV Index Details
    const uvVal = hourly.uv_index[idx];
    uvIndexValEl.textContent = uvVal.toFixed(1);
    
    // UV Classification
    let uvCat = 'Low';
    if (uvVal >= 3 && uvVal < 6) uvCat = 'Moderate';
    else if (uvVal >= 6 && uvVal < 8) uvCat = 'High';
    else if (uvVal >= 8 && uvVal < 11) uvCat = 'Very High';
    else if (uvVal >= 11) uvCat = 'Extreme';
    uvCategoryEl.textContent = uvCat;

    // UV Gauge arc progress. Max score on gauge scale is 12.
    // SVG stroke-dasharray is 126.
    const uvOffset = Math.max(126 - (126 * Math.min(uvVal, 12)) / 12, 0);
    uvProgressPath.style.strokeDashoffset = uvOffset;

    // 2. Wind Status
    const windSpeedKmh = current.wind_speed_10m;
    const windDirectionDeg = current.wind_direction_10m;
    const windGustsKmh = current.wind_gusts_10m;

    const windSpeedFormatted = convertWindSpeed(windSpeedKmh);
    const windGustFormatted = convertWindSpeed(windGustsKmh);
    
    windSpeedEl.textContent = windSpeedFormatted.val;
    windUnitEl.textContent = windSpeedFormatted.unit;
    windGustEl.textContent = windGustFormatted.val;
    
    // Compass rotation
    compassPointer.style.transform = `rotate(${windDirectionDeg}deg)`;
    
    // Compass direction label conversion
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const dirIdx = Math.round(windDirectionDeg / 22.5) % 16;
    windDirectionTextEl.textContent = `${directions[dirIdx]} (${windDirectionDeg}°)`;

    // 3. Sunrise & Sunset Trajectory
    const sunriseStr = daily.sunrise[0];
    const sunsetStr = daily.sunset[0];
    
    const sunriseDate = new Date(sunriseStr);
    const sunsetDate = new Date(sunsetStr);
    const currentDate = new Date(current.time);

    sunriseTimeEl.textContent = sunriseDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    sunsetTimeEl.textContent = sunsetDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const dayLengthMs = sunsetDate - sunriseDate;
    const elapsedMs = currentDate - sunriseDate;
    
    if (currentDate >= sunriseDate && currentDate <= sunsetDate) {
      // Daytime: Calculate progress along arc
      const pct = elapsedMs / dayLengthMs;
      
      // Arc length is ~251.2
      const arcOffset = 251.2 * (1 - pct);
      sunArcProgress.style.strokeDasharray = '251.2';
      sunArcProgress.style.strokeDashoffset = arcOffset;
      
      // Calculate CX, CY on semi-circle
      // Center is (100, 90), Radius is 80. Angle goes from PI (180deg) to 0 (0deg).
      const theta = Math.PI - pct * Math.PI;
      const cx = 100 + 80 * Math.cos(theta);
      const cy = 90 - 80 * Math.sin(theta);
      
      sunNode.setAttribute('cx', cx);
      sunNode.setAttribute('cy', cy);
      sunNode.style.display = 'block';

      // Daylight hours remaining
      const hoursLeft = ((sunsetDate - currentDate) / (1000 * 60 * 60)).toFixed(1);
      daylightRemainingLabel.textContent = `${hoursLeft} hours of daylight remaining`;
    } else {
      // Nighttime
      sunArcProgress.style.strokeDashoffset = '251.2';
      sunNode.style.display = 'none';
      
      if (currentDate < sunriseDate) {
        const hoursToSunrise = ((sunriseDate - currentDate) / (1000 * 60 * 60)).toFixed(1);
        daylightRemainingLabel.textContent = `Sunrise in ${hoursToSunrise} hours`;
      } else {
        // Next day's sunrise check
        const tomorrowSunriseDate = new Date(daily.sunrise[1] || sunriseStr);
        const hoursToSunrise = ((tomorrowSunriseDate - currentDate) / (1000 * 60 * 60)).toFixed(1);
        daylightRemainingLabel.textContent = `Sunrise in ${hoursToSunrise} hours`;
      }
    }

    // 4. AQI Details (using European AQI)
    if (state.aqiData && state.aqiData.current) {
      const aqiVal = state.aqiData.current.european_aqi;
      const pm25Val = state.aqiData.current.pm2_5;
      const pm10Val = state.aqiData.current.pm10;
      const no2Val = state.aqiData.current.nitrogen_dioxide;
      const o3Val = state.aqiData.current.ozone;

      aqiIndexEl.textContent = aqiVal;
      aqiPm25El.textContent = pm25Val.toFixed(1);
      aqiPm10El.textContent = pm10Val.toFixed(1);
      aqiNo2El.textContent = no2Val.toFixed(1);
      aqiO3El.textContent = o3Val.toFixed(1);

      // European AQI ratings (1: Good, 2: Fair, 3: Moderate, 4: Poor, 5: Very Poor)
      let aqiStatus = 'Excellent';
      let progressWidth = '20%';
      let aqiColor = 'var(--accent-success)';

      if (aqiVal === 1) {
        aqiStatus = 'Good';
        progressWidth = '20%';
        aqiColor = 'var(--accent-success)';
      } else if (aqiVal === 2) {
        aqiStatus = 'Fair';
        progressWidth = '40%';
        aqiColor = '#a855f7'; // Purple-ish
      } else if (aqiVal === 3) {
        aqiStatus = 'Moderate';
        progressWidth = '60%';
        aqiColor = '#f59e0b'; // Amber
      } else if (aqiVal === 4) {
        aqiStatus = 'Poor';
        progressWidth = '80%';
        aqiColor = '#ef4444'; // Red
      } else if (aqiVal >= 5) {
        aqiStatus = 'Very Poor';
        progressWidth = '100%';
        aqiColor = '#7f1d1d'; // Dark Maroon
      }

      aqiStatusEl.textContent = aqiStatus;
      aqiStatusEl.style.color = aqiColor;
      aqiProgressBar.style.width = progressWidth;
      aqiProgressBar.style.backgroundColor = aqiColor;
    }

    // 5. Humidity & Dew Point
    const humidity = current.relative_humidity_2m;
    const dewPointC = hourly.dew_point_2m[idx];
    
    humidityValEl.textContent = humidity;
    
    // Circle progress. Radius is 40. Circumference is 2 * PI * 40 = 251.2
    const humidityOffset = 251.2 * (1 - humidity / 100);
    humidityProgressCircle.style.strokeDashoffset = humidityOffset;

    const displayDew = formatTemp(dewPointC);
    dewPointEl.textContent = `${displayDew}°`;

    // 6. Pressure & Visibility
    const pressure = current.pressure_msl;
    const visibility = hourly.visibility[idx] / 1000; // convert to km

    pressureValEl.innerHTML = `${Math.round(pressure)} <span class="sub-unit">hPa</span>`;
    
    // Compute pressure trend (compare with pressure 3 hours ago)
    const prevIdx = Math.max(0, idx - 3);
    const prevPressure = hourly.temperature_2m[prevIdx] ? hourly.pressure_msl?.[prevIdx] : null; // open-meteo pressure array
    const actualPrevPressure = prevPressure || pressure; // fallback
    
    if (pressure > actualPrevPressure + 1) {
      pressureTrendEl.textContent = 'Rising';
      pressureTrendEl.style.color = 'var(--accent-success)';
    } else if (pressure < actualPrevPressure - 1) {
      pressureTrendEl.textContent = 'Falling';
      pressureTrendEl.style.color = '#ef4444';
    } else {
      pressureTrendEl.textContent = 'Stable';
      pressureTrendEl.style.color = 'var(--text-secondary)';
    }

    // Visibility mapping
    const visibilityMiles = visibility * 0.621371;
    if (state.unit === 'F') {
      visibilityValEl.innerHTML = `${visibilityMiles.toFixed(1)} <span class="sub-unit">mi</span>`;
    } else {
      visibilityValEl.innerHTML = `${visibility.toFixed(1)} <span class="sub-unit">km</span>`;
    }

    let visStatus = 'Clear View';
    if (visibility < 1) visStatus = 'Dense Fog';
    else if (visibility < 4) visStatus = 'Haze / Mist';
    else if (visibility < 10) visStatus = 'Moderate';
    visibilityStatusEl.textContent = visStatus;
  }

  // --- API INTEGRATION CORE ---
  async function fetchWeatherDashboardData() {
    const lat = state.currentLocation.latitude;
    const lng = state.currentLocation.longitude;
    
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,precipitation_probability,weather_code,wind_speed_10m,uv_index,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`;
    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=european_aqi,pm2_5,pm10,nitrogen_dioxide,ozone&timezone=auto`;

    try {
      // Fetch both APIs in parallel
      const [weatherRes, aqiRes] = await Promise.all([
        fetch(weatherUrl),
        fetch(aqiUrl)
      ]);

      if (!weatherRes.ok || !aqiRes.ok) throw new Error('API request failed');

      state.weatherData = await weatherRes.json();
      state.aqiData = await aqiRes.json();

      // Trigger updates
      updateSpotlightDetails();
      updateHourlyForecastSection();
      updateWeeklyForecastSection();
      updateDetailsHighlights();
      checkFavoriteStatus();

    } catch (err) {
      console.error('Error fetching dashboard weather data: ', err);
      weatherCondEl.textContent = 'Offline';
      locationNameEl.textContent = 'Connection Error';
      locationCountryEl.textContent = 'Please try again later';
    }
  }

  // --- GLOBAL CITY SEARCH ENGINE ---
  let debounceTimeout = null;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    clearTimeout(debounceTimeout);

    if (query.length < 2) {
      suggestionsBox.classList.add('hidden');
      clearSearchBtn.classList.add('hidden');
      return;
    }

    clearSearchBtn.classList.remove('hidden');

    // Debounce geocoding suggestions to avoid API hammering
    debounceTimeout = setTimeout(async () => {
      try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`);
        const data = await res.json();
        
        suggestionsBox.innerHTML = '';
        
        if (!data.results || data.results.length === 0) {
          suggestionsBox.innerHTML = '<div class="suggestion-no-results">No cities matching search</div>';
          suggestionsBox.classList.remove('hidden');
          return;
        }

        data.results.forEach(loc => {
          const item = document.createElement('button');
          item.className = 'suggestion-item';
          
          const region = loc.admin1 ? `, ${loc.admin1}` : '';
          const subInfo = `${loc.country}${region}`;
          
          item.innerHTML = `
            <i data-lucide="map-pin"></i>
            <div class="suggestion-info">
              <span class="suggestion-city">${loc.name}</span>
              <span class="suggestion-country">${subInfo}</span>
            </div>
          `;

          // Handle click on suggestions
          item.addEventListener('click', () => {
            state.currentLocation = {
              name: loc.name,
              country: subInfo,
              latitude: loc.latitude,
              longitude: loc.longitude
            };
            
            localStorage.setItem('aero_location', JSON.stringify(state.currentLocation));
            fetchWeatherDashboardData();
            
            // Clear and hide search
            searchInput.value = '';
            suggestionsBox.classList.add('hidden');
            clearSearchBtn.classList.add('hidden');
          });

          suggestionsBox.appendChild(item);
        });

        suggestionsBox.classList.remove('hidden');
        lucide.createIcons();

      } catch (err) {
        console.error('Geocoding search failed: ', err);
      }
    }, 350);
  });

  // Clear Search button trigger
  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    suggestionsBox.classList.add('hidden');
    clearSearchBtn.classList.add('hidden');
    searchInput.focus();
  });

  // Hide suggestions if clicking outside suggestions box
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      suggestionsBox.classList.add('hidden');
    }
  });

  // --- CURRENT GEOLOCATION RETRIEVAL ---
  geoBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    geoBtn.classList.add('loading');
    geoBtn.disabled = true;
    
    const geoIcon = geoBtn.querySelector('i');
    geoIcon.style.animation = 'pulse-slow 1s infinite';

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        // Try reverse-geocoding city name using open meteo search or coordinates display
        state.currentLocation = {
          name: 'My Location',
          country: `Coord: ${lat.toFixed(2)}°, ${lng.toFixed(2)}°`,
          latitude: lat,
          longitude: lng
        };

        // Try querying a coordinate search to get a clean name if possible
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          if (res.ok) {
            const data = await res.json();
            const cityName = data.address.city || data.address.town || data.address.village || 'My Location';
            const countryName = data.address.country || 'Global Coord';
            state.currentLocation.name = cityName;
            state.currentLocation.country = countryName;
          }
        } catch (e) {
          // Fallback is OK
        }

        localStorage.setItem('aero_location', JSON.stringify(state.currentLocation));
        await fetchWeatherDashboardData();
        
        geoBtn.classList.remove('loading');
        geoBtn.disabled = false;
        geoIcon.style.animation = '';
      },
      (err) => {
        alert(`Geolocation failed: ${err.message}. Showing default coordinates.`);
        geoBtn.classList.remove('loading');
        geoBtn.disabled = false;
        geoIcon.style.animation = '';
      },
      { timeout: 7000 }
    );
  });

  // --- UNIT SWITCHING SYSTEM ---
  unitCBtn.addEventListener('click', () => {
    if (state.unit === 'C') return;
    state.unit = 'C';
    localStorage.setItem('aero_unit', 'C');
    unitCBtn.classList.add('active');
    unitFBtn.classList.remove('active');
    
    // Refresh visual values
    updateSpotlightDetails();
    updateHourlyForecastSection();
    updateWeeklyForecastSection();
    updateDetailsHighlights();
    renderFavoritesList();
  });

  unitFBtn.addEventListener('click', () => {
    if (state.unit === 'F') return;
    state.unit = 'F';
    localStorage.setItem('aero_unit', 'F');
    unitFBtn.classList.add('active');
    unitCBtn.classList.remove('active');
    
    // Refresh visual values
    updateSpotlightDetails();
    updateHourlyForecastSection();
    updateWeeklyForecastSection();
    updateDetailsHighlights();
    renderFavoritesList();
  });

  // --- CHART TOGGLE SYSTEM ---
  toggleTempChartBtn.addEventListener('click', () => {
    if (state.chartType === 'temp') return;
    state.chartType = 'temp';
    toggleTempChartBtn.classList.add('active');
    toggleRainChartBtn.classList.remove('active');
    updateHourlyForecastSection();
  });

  toggleRainChartBtn.addEventListener('click', () => {
    if (state.chartType === 'rain') return;
    state.chartType = 'rain';
    toggleRainChartBtn.classList.add('active');
    toggleTempChartBtn.classList.remove('active');
    updateHourlyForecastSection();
  });

  // --- BOOTSTRAP INITIALIZATION ---
  // Sync buttons status
  if (state.unit === 'F') {
    unitFBtn.classList.add('active');
    unitCBtn.classList.remove('active');
  } else {
    unitCBtn.classList.add('active');
    unitFBtn.classList.remove('active');
  }

  // Fetch data, populate favorites lists
  fetchWeatherDashboardData();
  renderFavoritesList();
  
  // Set up resize listener to redraw hourly chart dynamically
  window.addEventListener('resize', () => {
    if (state.weatherData) {
      updateHourlyForecastSection();
    }
  });

});
