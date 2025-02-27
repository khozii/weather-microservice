const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

app.get('/api/weather', async (req, res) => {
	const city = req.query.city;
	const units = req.query.units;

	if (!city) {
		return res.status(400).json({ error: 'City parameter is required.' });
	}

	try {
		const weatherResponse = await axios.get('http://api.weatherapi.com/v1/current.json', {
			params: {
				key: WEATHER_API_KEY,
				q: city,
			}
		});

		const data = weatherResponse.data;

		// Change the units of temperature, precipitation, and wind speed based on chosen measurement system
		let temperature, precipitation, windSpeed ;
		if (units === 'imperial') {
			temperature = data.current.temp_f;
			windSpeed = data.current.wind_mph;
			precipitation = data.current.precip_in;
		} else {
			temperature = data.current.temp_c;
			windSpeed = data.current.wind_kph;
			precipitation = data.current.precip_mm;
		}

		const result = {
			city: data.location.name,
			temperature: temperature,
			units: units,
			precipitation: precipitation,
			windSpeed: windSpeed,
			humidity: data.current.humidity,
			cloud: data.current.cloud,
			description: data.current.condition.text,
			updatedAt: data.location.localtime,
		};

		res.json(result);
	} 
	catch (error) {
		console.error('Error fetching weather data:', error.message);
		res.status(500).json({ error: 'Failed to fetch weather data' });
	}
});

app.listen(PORT, () => {
	console.log(`Weather microservice is running on port ${PORT}`);
});