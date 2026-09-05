import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext<any>(null);

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState(null);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLocation = () => {
        setLoading(true);
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });

                try {
                    // Fetch location name (Reverse Geocoding)
                    const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`);
                    const geoData = await geoResponse.json();

                    const locationName = geoData.address.city ||
                        geoData.address.town ||
                        geoData.address.village ||
                        geoData.address.municipality ||
                        geoData.address.county ||
                        'Unknown Location';

                    // Fetch Weather (Open-Meteo - Free, No API Key)
                    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`);
                    const weatherData = await weatherResponse.json();

                    // Map WMO weather codes to conditions
                    const interpretWeatherCode = (code) => {
                        if (code === 0) return 'Clear Sky';
                        if (code < 40) return 'Partly Cloudy';
                        if (code < 70) return 'Rainy';
                        return 'Stormy';
                    };

                    setWeather({
                        temp: Math.round(weatherData.current.temperature_2m),
                        condition: interpretWeatherCode(weatherData.current.weather_code),
                        humidity: weatherData.current.relative_humidity_2m,
                        windSpeed: Math.round(weatherData.current.wind_speed_10m),
                        locationName: locationName
                    });
                    setLoading(false);
                } catch (err) {
                    console.error('API Error:', err);
                    setError('Failed to fetch realtime data');
                    // Fallback to defaults
                    setWeather({
                        temp: 28,
                        condition: 'Sunny',
                        humidity: 60,
                        windSpeed: 10,
                        locationName: 'Detected Location'
                    });
                    setLoading(false);
                }
            },
            (err) => {
                setError('Location access denied');
                setLoading(false);
                // Fallback to Manila (Manila coords)
                fetchWeatherFallback(14.5995, 120.9842);
            },
            { enableHighAccuracy: true }
        );
    };

    const fetchWeatherFallback = async (lat, lon) => {
        try {
            const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`);
            const weatherData = await weatherResponse.json();
            setWeather({
                temp: Math.round(weatherData.current.temperature_2m),
                condition: 'Clear Sky',
                humidity: weatherData.current.relative_humidity_2m,
                windSpeed: Math.round(weatherData.current.wind_speed_10m),
                locationName: 'Manila, PH'
            });
        } catch (e) {
            setWeather({ temp: 30, condition: 'Sunny', humidity: 55, windSpeed: 8, locationName: 'Manila' });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLocation();
    }, []);

    return (
        <LocationContext.Provider value={{ location, weather, loading, error, refresh: fetchLocation }}>
            {children}
        </LocationContext.Provider>
    );
};
