document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('search').addEventListener('click', getWeather);
});

async function getWeather() {
  const apiKey = 'd9cd83f31213458197b135224253107';
  const city = document.getElementById('city').value.trim();
  if (!city) return alert('Please enter a city');

  const currentURL = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`;
  const forecastURL = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=1&aqi=no&alerts=no`;

  try {
    const resNow = await fetch(currentURL);
    const now = await resNow.json();
    displayCurrent(now);

    const resFc = await fetch(forecastURL);
    const fc = await resFc.json();
    displayHourly(fc.forecast.forecastday[0].hour);
  } catch (err) {
    console.error(err);
    alert('Error fetching weather. Please try again.');
  }
}

function displayCurrent(data) {
  const iconEl = document.getElementById('weather-icon');
  document.getElementById('temp-div').textContent = `${Math.round(data.current.temp_c)}°C`;
  document.getElementById('weather-info').innerHTML =
    `<p><strong>${data.location.name}, ${data.location.country}</strong></p>
     <p>${data.current.condition.text}</p>`;
  iconEl.src = `https:${data.current.condition.icon}`;
  iconEl.alt = data.current.condition.text;
  iconEl.style.display = 'block';
}

function displayHourly(hours) {
  const container = document.getElementById('hourly-forecast');
  container.innerHTML = '';
  hours.slice(0, 8).forEach(h => {
    const item = document.createElement('div');
    item.className = 'hourly-item';
    const hour = new Date(h.time).getHours().toString().padStart(2, '0');
    item.innerHTML = `
      <div>${hour}:00</div>
      <img src="https:${h.condition.icon}" alt="${h.condition.text}" width="40">
      <div>${Math.round(h.temp_c)}°C</div>`;
    container.appendChild(item);
  });
}
