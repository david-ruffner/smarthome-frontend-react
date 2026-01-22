import {logErr} from "../../utils/Utils.js";

const WEATHER_ICON_BASE = "/src/assets/images/weather-icons/";

const shortForecastIconMapWhite = {
    // ☀️ Clear / Sun
    "Sunny": `${WEATHER_ICON_BASE}weather_icon_sunny_white.png`,
    "Mostly Sunny": `${WEATHER_ICON_BASE}weather_icon_mostly_sunny_white.png`,
    "Mostly Clear": `${WEATHER_ICON_BASE}weather_icon_mostly_sunny_white.png`,
    "Partly Sunny": `${WEATHER_ICON_BASE}weather_icon_partly_cloudy_white.png`,
    "Hot": `${WEATHER_ICON_BASE}weather_icon_sunny_white.png`,
    "Very Hot": `${WEATHER_ICON_BASE}weather_icon_sunny_white.png`,

    // ☁️ Clouds
    "Cloudy": `${WEATHER_ICON_BASE}weather_icon_cloudy_white.png`,
    "Mostly Cloudy": `${WEATHER_ICON_BASE}weather_icon_mostly_cloudy_white.png`,
    "Partly Cloudy": `${WEATHER_ICON_BASE}weather_icon_partly_cloudy_white.png`,
    "Overcast": `${WEATHER_ICON_BASE}weather_icon_cloudy_white.png`,
    "Increasing Clouds": `${WEATHER_ICON_BASE}weather_icon_cloudy_white.png`,
    "Decreasing Clouds": `${WEATHER_ICON_BASE}weather_icon_partly_cloudy_white.png`,
    "Clearing": `${WEATHER_ICON_BASE}weather_icon_partly_cloudy_white.png`,
    "Becoming Cloudy": `${WEATHER_ICON_BASE}weather_icon_cloudy_white.png`,

    // 🌧️ Rain
    "Rain": `${WEATHER_ICON_BASE}weather_icon_rainy_white.png`,
    "Light Rain": `${WEATHER_ICON_BASE}weather_icon_rainy_white.png`,
    "Heavy Rain": `${WEATHER_ICON_BASE}weather_icon_rainy_white.png`,
    "Rain Showers": `${WEATHER_ICON_BASE}weather_icon_rainy_white.png`,
    "Showers": `${WEATHER_ICON_BASE}weather_icon_rainy_white.png`,
    "Scattered Showers": `${WEATHER_ICON_BASE}weather_icon_rainy_white.png`,
    "Isolated Showers": `${WEATHER_ICON_BASE}weather_icon_rainy_white.png`,
    "Chance Rain": `${WEATHER_ICON_BASE}weather_icon_rainy_white.png`,
    "Rain Likely": `${WEATHER_ICON_BASE}weather_icon_rainy_white.png`,
    "Drizzle": `${WEATHER_ICON_BASE}weather_icon_rainy_white.png`,
    "Light Drizzle": `${WEATHER_ICON_BASE}weather_icon_rainy_white.png`,

    // ❄️ Snow / Cold
    "Snow": `${WEATHER_ICON_BASE}weather_icon_snow_white.png`,
    "Light Snow": `${WEATHER_ICON_BASE}weather_icon_snow_white.png`,
    "Heavy Snow": `${WEATHER_ICON_BASE}weather_icon_snow_white.png`,
    "Snow Showers": `${WEATHER_ICON_BASE}weather_icon_snow_white.png`,
    "Flurries": `${WEATHER_ICON_BASE}weather_icon_snow_white.png`,
    "Chance Snow": `${WEATHER_ICON_BASE}weather_icon_snow_white.png`,
    "Chance Flurries": `${WEATHER_ICON_BASE}weather_icon_snow_white.png`,
    "Cold": `${WEATHER_ICON_BASE}weather_icon_snow_white.png`,
    "Very Cold": `${WEATHER_ICON_BASE}weather_icon_snow_white.png`,
    "Frigid": `${WEATHER_ICON_BASE}weather_icon_snow_white.png`,

    // ⛈️ Thunderstorms
    "Thunderstorms": `${WEATHER_ICON_BASE}weather_icon_thunder_white.png`,
    "Scattered Thunderstorms": `${WEATHER_ICON_BASE}weather_icon_thunder_white.png`,
    "Isolated Thunderstorms": `${WEATHER_ICON_BASE}weather_icon_thunder_white.png`,
    "Chance Thunderstorms": `${WEATHER_ICON_BASE}weather_icon_thunder_white.png`,
    "Slight Chance Thunderstorms": `${WEATHER_ICON_BASE}weather_icon_thunder_white.png`,
    "Severe Thunderstorms": `${WEATHER_ICON_BASE}weather_icon_thunder_white.png`,

    // 🌫️ Fog / Haze
    "Fog": `${WEATHER_ICON_BASE}weather_icon_cloudy_white.png`,
    "Patchy Fog": `${WEATHER_ICON_BASE}weather_icon_cloudy_white.png`,
    "Dense Fog": `${WEATHER_ICON_BASE}weather_icon_cloudy_white.png`,
    "Haze": `${WEATHER_ICON_BASE}weather_icon_cloudy_white.png`,
    "Smoke": `${WEATHER_ICON_BASE}weather_icon_cloudy_white.png`,

    // 🌬️ Wind
    "Windy": `${WEATHER_ICON_BASE}weather_icon_cloudy_white.png`,
    "Breezy": `${WEATHER_ICON_BASE}weather_icon_partly_cloudy_white.png`,
    "Blustery": `${WEATHER_ICON_BASE}weather_icon_cloudy_white.png`,
    "Calm": `${WEATHER_ICON_BASE}weather_icon_sunny_white.png`,

    // 🧊 Ice / Wintry mix
    "Wintry Mix": `${WEATHER_ICON_BASE}weather_icon_snow_white.png`,
    "Freezing Rain": `${WEATHER_ICON_BASE}weather_icon_rainy_white.png`,
    "Sleet": `${WEATHER_ICON_BASE}weather_icon_snow_white.png`,
    "Ice Pellets": `${WEATHER_ICON_BASE}weather_icon_snow_white.png`,
    "Frost": `${WEATHER_ICON_BASE}weather_icon_snow_white.png`,
    "Black Ice": `${WEATHER_ICON_BASE}weather_icon_snow_white.png`
};

const shortForecastIconMapBlack = {
    // ☀️ Clear / Sun
    "Sunny": `${WEATHER_ICON_BASE}weather_icon_sunny_black.png`,
    "Mostly Clear": `${WEATHER_ICON_BASE}weather_icon_mostly_sunny_black.png`,
    "Mostly Sunny": `${WEATHER_ICON_BASE}weather_icon_mostly_sunny_black.png`,
    "Partly Sunny": `${WEATHER_ICON_BASE}weather_icon_partly_cloudy_black.png`,
    "Hot": `${WEATHER_ICON_BASE}weather_icon_sunny_black.png`,
    "Very Hot": `${WEATHER_ICON_BASE}weather_icon_sunny_black.png`,

    // ☁️ Clouds
    "Cloudy": `${WEATHER_ICON_BASE}weather_icon_cloudy_black.png`,
    "Mostly Cloudy": `${WEATHER_ICON_BASE}weather_icon_mostly_cloudy_black.png`,
    "Partly Cloudy": `${WEATHER_ICON_BASE}weather_icon_partly_cloudy_black.png`,
    "Overcast": `${WEATHER_ICON_BASE}weather_icon_cloudy_black.png`,
    "Increasing Clouds": `${WEATHER_ICON_BASE}weather_icon_cloudy_black.png`,
    "Decreasing Clouds": `${WEATHER_ICON_BASE}weather_icon_partly_cloudy_black.png`,
    "Clearing": `${WEATHER_ICON_BASE}weather_icon_partly_cloudy_black.png`,
    "Becoming Cloudy": `${WEATHER_ICON_BASE}weather_icon_cloudy_black.png`,

    // 🌧️ Rain
    "Rain": `${WEATHER_ICON_BASE}weather_icon_rainy_black.png`,
    "Light Rain": `${WEATHER_ICON_BASE}weather_icon_rainy_black.png`,
    "Heavy Rain": `${WEATHER_ICON_BASE}weather_icon_rainy_black.png`,
    "Rain Showers": `${WEATHER_ICON_BASE}weather_icon_rainy_black.png`,
    "Showers": `${WEATHER_ICON_BASE}weather_icon_rainy_black.png`,
    "Scattered Showers": `${WEATHER_ICON_BASE}weather_icon_rainy_black.png`,
    "Isolated Showers": `${WEATHER_ICON_BASE}weather_icon_rainy_black.png`,
    "Chance Rain": `${WEATHER_ICON_BASE}weather_icon_rainy_black.png`,
    "Rain Likely": `${WEATHER_ICON_BASE}weather_icon_rainy_black.png`,
    "Drizzle": `${WEATHER_ICON_BASE}weather_icon_rainy_black.png`,
    "Light Drizzle": `${WEATHER_ICON_BASE}weather_icon_rainy_black.png`,

    // ❄️ Snow / Cold
    "Snow": `${WEATHER_ICON_BASE}weather_icon_snow_black.png`,
    "Light Snow": `${WEATHER_ICON_BASE}weather_icon_snow_black.png`,
    "Heavy Snow": `${WEATHER_ICON_BASE}weather_icon_snow_black.png`,
    "Snow Showers": `${WEATHER_ICON_BASE}weather_icon_snow_black.png`,
    "Flurries": `${WEATHER_ICON_BASE}weather_icon_snow_black.png`,
    "Chance Snow": `${WEATHER_ICON_BASE}weather_icon_snow_black.png`,
    "Chance Flurries": `${WEATHER_ICON_BASE}weather_icon_snow_black.png`,
    "Cold": `${WEATHER_ICON_BASE}weather_icon_snow_black.png`,
    "Very Cold": `${WEATHER_ICON_BASE}weather_icon_snow_black.png`,
    "Frigid": `${WEATHER_ICON_BASE}weather_icon_snow_black.png`,

    // ⛈️ Thunderstorms
    "Thunderstorms": `${WEATHER_ICON_BASE}weather_icon_thunder_black.png`,
    "Scattered Thunderstorms": `${WEATHER_ICON_BASE}weather_icon_thunder_black.png`,
    "Isolated Thunderstorms": `${WEATHER_ICON_BASE}weather_icon_thunder_black.png`,
    "Chance Thunderstorms": `${WEATHER_ICON_BASE}weather_icon_thunder_black.png`,
    "Slight Chance Thunderstorms": `${WEATHER_ICON_BASE}weather_icon_thunder_black.png`,
    "Severe Thunderstorms": `${WEATHER_ICON_BASE}weather_icon_thunder_black.png`,

    // 🌫️ Fog / Haze
    "Fog": `${WEATHER_ICON_BASE}weather_icon_cloudy_black.png`,
    "Patchy Fog": `${WEATHER_ICON_BASE}weather_icon_cloudy_black.png`,
    "Dense Fog": `${WEATHER_ICON_BASE}weather_icon_cloudy_black.png`,
    "Haze": `${WEATHER_ICON_BASE}weather_icon_cloudy_black.png`,
    "Smoke": `${WEATHER_ICON_BASE}weather_icon_cloudy_black.png`,

    // 🌬️ Wind
    "Windy": `${WEATHER_ICON_BASE}weather_icon_cloudy_black.png`,
    "Breezy": `${WEATHER_ICON_BASE}weather_icon_partly_cloudy_black.png`,
    "Blustery": `${WEATHER_ICON_BASE}weather_icon_cloudy_black.png`,
    "Calm": `${WEATHER_ICON_BASE}weather_icon_sunny_black.png`,

    // 🧊 Ice / Wintry mix
    "Wintry Mix": `${WEATHER_ICON_BASE}weather_icon_snow_black.png`,
    "Freezing Rain": `${WEATHER_ICON_BASE}weather_icon_rainy_black.png`,
    "Sleet": `${WEATHER_ICON_BASE}weather_icon_snow_black.png`,
    "Ice Pellets": `${WEATHER_ICON_BASE}weather_icon_snow_black.png`,
    "Frost": `${WEATHER_ICON_BASE}weather_icon_snow_black.png`,
    "Black Ice": `${WEATHER_ICON_BASE}weather_icon_snow_black.png`
};

const shortForecastIconMapBlue = {
    // ☀️ Clear / Sun
    "Sunny": `${WEATHER_ICON_BASE}weather_icon_sunny_blue.png`,
    "Mostly Sunny": `${WEATHER_ICON_BASE}weather_icon_mostly_sunny_blue.png`,
    "Mostly Clear": `${WEATHER_ICON_BASE}weather_icon_mostly_sunny_blue.png`,
    "Partly Sunny": `${WEATHER_ICON_BASE}weather_icon_partly_cloudy_blue.png`,
    "Hot": `${WEATHER_ICON_BASE}weather_icon_sunny_blue.png`,
    "Very Hot": `${WEATHER_ICON_BASE}weather_icon_sunny_blue.png`,

    // ☁️ Clouds
    "Cloudy": `${WEATHER_ICON_BASE}weather_icon_cloudy_blue.png`,
    "Mostly Cloudy": `${WEATHER_ICON_BASE}weather_icon_mostly_cloudy_blue.png`,
    "Partly Cloudy": `${WEATHER_ICON_BASE}weather_icon_partly_cloudy_blue.png`,
    "Overcast": `${WEATHER_ICON_BASE}weather_icon_cloudy_blue.png`,
    "Increasing Clouds": `${WEATHER_ICON_BASE}weather_icon_cloudy_blue.png`,
    "Decreasing Clouds": `${WEATHER_ICON_BASE}weather_icon_partly_cloudy_blue.png`,
    "Clearing": `${WEATHER_ICON_BASE}weather_icon_partly_cloudy_blue.png`,
    "Becoming Cloudy": `${WEATHER_ICON_BASE}weather_icon_cloudy_blue.png`,

    // 🌧️ Rain
    "Rain": `${WEATHER_ICON_BASE}weather_icon_rainy_blue.png`,
    "Light Rain": `${WEATHER_ICON_BASE}weather_icon_rainy_blue.png`,
    "Heavy Rain": `${WEATHER_ICON_BASE}weather_icon_rainy_blue.png`,
    "Rain Showers": `${WEATHER_ICON_BASE}weather_icon_rainy_blue.png`,
    "Showers": `${WEATHER_ICON_BASE}weather_icon_rainy_blue.png`,
    "Scattered Showers": `${WEATHER_ICON_BASE}weather_icon_rainy_blue.png`,
    "Isolated Showers": `${WEATHER_ICON_BASE}weather_icon_rainy_blue.png`,
    "Chance Rain": `${WEATHER_ICON_BASE}weather_icon_rainy_blue.png`,
    "Rain Likely": `${WEATHER_ICON_BASE}weather_icon_rainy_blue.png`,
    "Drizzle": `${WEATHER_ICON_BASE}weather_icon_rainy_blue.png`,
    "Light Drizzle": `${WEATHER_ICON_BASE}weather_icon_rainy_blue.png`,

    // ❄️ Snow / Cold
    "Snow": `${WEATHER_ICON_BASE}weather_icon_snow_blue.png`,
    "Light Snow": `${WEATHER_ICON_BASE}weather_icon_snow_blue.png`,
    "Heavy Snow": `${WEATHER_ICON_BASE}weather_icon_snow_blue.png`,
    "Snow Showers": `${WEATHER_ICON_BASE}weather_icon_snow_blue.png`,
    "Flurries": `${WEATHER_ICON_BASE}weather_icon_snow_blue.png`,
    "Chance Snow": `${WEATHER_ICON_BASE}weather_icon_snow_blue.png`,
    "Chance Flurries": `${WEATHER_ICON_BASE}weather_icon_snow_blue.png`,
    "Cold": `${WEATHER_ICON_BASE}weather_icon_snow_blue.png`,
    "Very Cold": `${WEATHER_ICON_BASE}weather_icon_snow_blue.png`,
    "Frigid": `${WEATHER_ICON_BASE}weather_icon_snow_blue.png`,

    // ⛈️ Thunderstorms
    "Thunderstorms": `${WEATHER_ICON_BASE}weather_icon_thunder_blue.png`,
    "Scattered Thunderstorms": `${WEATHER_ICON_BASE}weather_icon_thunder_blue.png`,
    "Isolated Thunderstorms": `${WEATHER_ICON_BASE}weather_icon_thunder_blue.png`,
    "Chance Thunderstorms": `${WEATHER_ICON_BASE}weather_icon_thunder_blue.png`,
    "Slight Chance Thunderstorms": `${WEATHER_ICON_BASE}weather_icon_thunder_blue.png`,
    "Severe Thunderstorms": `${WEATHER_ICON_BASE}weather_icon_thunder_blue.png`,

    // 🌫️ Fog / Haze
    "Fog": `${WEATHER_ICON_BASE}weather_icon_cloudy_blue.png`,
    "Patchy Fog": `${WEATHER_ICON_BASE}weather_icon_cloudy_blue.png`,
    "Dense Fog": `${WEATHER_ICON_BASE}weather_icon_cloudy_blue.png`,
    "Haze": `${WEATHER_ICON_BASE}weather_icon_cloudy_blue.png`,
    "Smoke": `${WEATHER_ICON_BASE}weather_icon_cloudy_blue.png`,

    // 🌬️ Wind
    "Windy": `${WEATHER_ICON_BASE}weather_icon_cloudy_blue.png`,
    "Breezy": `${WEATHER_ICON_BASE}weather_icon_partly_cloudy_blue.png`,
    "Blustery": `${WEATHER_ICON_BASE}weather_icon_cloudy_blue.png`,
    "Calm": `${WEATHER_ICON_BASE}weather_icon_sunny_blue.png`,

    // 🧊 Ice / Wintry mix
    "Wintry Mix": `${WEATHER_ICON_BASE}weather_icon_snow_blue.png`,
    "Freezing Rain": `${WEATHER_ICON_BASE}weather_icon_rainy_blue.png`,
    "Sleet": `${WEATHER_ICON_BASE}weather_icon_snow_blue.png`,
    "Ice Pellets": `${WEATHER_ICON_BASE}weather_icon_snow_blue.png`,
    "Frost": `${WEATHER_ICON_BASE}weather_icon_snow_blue.png`,
    "Black Ice": `${WEATHER_ICON_BASE}weather_icon_snow_blue.png`
};

const DEFAULT_BLUE_ICON = "/src/assets/images/weather-icons/weather_icon_default_blue.png";
const DEFAULT_WHITE_ICON = "/src/assets/images/weather-icons/weather_icon_default_white.png";
const DEFAULT_BLACK_ICON = "/src/assets/images/weather-icons/weather_icon_default_black.png"

function getWeatherIcon({
                            shortForecast,
                            mapType = "black"
                        } = {}) {
    if (mapType === 'black') {
        if (Object.prototype.hasOwnProperty.call(shortForecastIconMapBlack, shortForecast.shortForecastKey)) {
            return shortForecastIconMapBlack[shortForecast.shortForecastKey];
        } else {
            logErr({errMsg: `Couldn't find black weather icon for key '${shortForecast.shortForecastKey}'`})
            return DEFAULT_BLACK_ICON;
        }
    } else if (mapType === 'blue') {
        if (Object.prototype.hasOwnProperty.call(shortForecastIconMapBlue, shortForecast.shortForecastKey)) {
            return shortForecastIconMapBlue[shortForecast.shortForecastKey];
        } else {
            logErr({errMsg: `Couldn't find blue weather icon for key '${shortForecast.shortForecastKey}'`})
            return DEFAULT_BLUE_ICON;
        }
    } else if (mapType === 'white') {
        if (Object.prototype.hasOwnProperty.call(shortForecastIconMapWhite, shortForecast.shortForecastKey)) {
            return shortForecastIconMapWhite[shortForecast.shortForecastKey];
        } else {
            logErr({errMsg: `Couldn't find white weather icon for key '${shortForecast.shortForecastKey}'`})
            return DEFAULT_WHITE_ICON;
        }
    }
}

function normalizeForecastKey(str) {
    // NWS shortForecast strings sometimes include conjunctions or extra spaces.
    // For icon mapping we only want the first condition (e.g., "Rain And Snow" -> "Rain").
    if (!str) return '';

    let shortForecastKey = str
        .split(/\s+And\s+/i)[0]
        .split(/\s+Likely(?:\s+|$)/i)[0]
        .replace(/Chance\s/i, "")
        .replace(/Slight\s/i, "")
        .trim();
    let hasChance = /\bChance\b/i.test(str);
    let newShortForecast = null;

    if (hasChance) {
        newShortForecast = `${str.split(/Chance/i)[0].trim()} Chance Of ${str.split(/Chance/i)[1].trim()}`
    }

    return {
        shortForecastKey,
        hasChance,
        newShortForecast
    }
}

function WeatherIconWidget({ shortForecast, mapType="black" }) {
    return <>
        <img className="dashboard-weather-icon" src={getWeatherIcon({
            shortForecast: normalizeForecastKey(shortForecast),
            mapType: mapType
        })} alt="Weather Icon"/>
    </>
}

export default WeatherIconWidget;