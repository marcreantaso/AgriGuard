import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

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
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
                fetchWeather(latitude, longitude);
            },
            (err) => {
                setError('Unable to retrieve your location');
                setLoading(false);
                // Fallback to Manila
                fetchWeather(14.5995, 120.9842);
            }
        );
    };

    const fetchWeather = async (lat, lon) => {
        // Mocking weather data since we don't have a real API key in this environment yet
        // In a real app, replace with fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`)

        // Simulate network delay
        setTimeout(() => {
            setWeather({
                temp: 28,
                condition: 'Partly Cloudy',
                humidity: 65,
                windSpeed: 12,
                locationName: 'San Jose, Nueva Ecija' // Example farming location
            });
            setLoading(false);
        }, 1000);
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
