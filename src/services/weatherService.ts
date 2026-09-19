import { WeatherInfo } from '@/types';

// Open-Meteo API — Free, no key required
// Pescara coordinates: 42.4618°N, 14.2161°E
const PESCARA_LAT = 42.4618;
const PESCARA_LON = 14.2161;

const WMO_DESCRIPTIONS: Record<number, { description: string; icon: string }> = {
  0: { description: 'Sereno', icon: 'sun' },
  1: { description: 'Prevalentemente sereno', icon: 'sun' },
  2: { description: 'Parzialmente nuvoloso', icon: 'cloud' },
  3: { description: 'Coperto', icon: 'cloud' },
  45: { description: 'Nebbia', icon: 'fog' },
  48: { description: 'Nebbia con brina', icon: 'fog' },
  51: { description: 'Pioggerella leggera', icon: 'rain' },
  53: { description: 'Pioggerella moderata', icon: 'rain' },
  55: { description: 'Pioggerella intensa', icon: 'rain' },
  61: { description: 'Pioggia leggera', icon: 'rain' },
  63: { description: 'Pioggia moderata', icon: 'rain' },
  65: { description: 'Pioggia intensa', icon: 'rain' },
  71: { description: 'Neve leggera', icon: 'snow' },
  73: { description: 'Neve moderata', icon: 'snow' },
  75: { description: 'Neve intensa', icon: 'snow' },
  80: { description: 'Rovesci leggeri', icon: 'rain' },
  81: { description: 'Rovesci moderati', icon: 'rain' },
  82: { description: 'Rovesci violenti', icon: 'storm' },
  85: { description: 'Rovesci di neve', icon: 'snow' },
  95: { description: 'Temporale', icon: 'storm' },
  96: { description: 'Temporale con grandine', icon: 'storm' },
  99: { description: 'Temporale con grandine forte', icon: 'storm' },
};

function getWeatherDescription(code: number): { description: string; icon: string } {
  return WMO_DESCRIPTIONS[code] || { description: 'Variabile', icon: 'cloud' };
}

function isWeatherFavorable(weatherCode: number, windSpeed: number): boolean {
  // Unfavorable: rain (51-67, 80-82), thunderstorm (95-99), heavy snow (75), strong wind > 40 km/h
  const badCodes = [51, 53, 55, 61, 63, 65, 80, 81, 82, 85, 95, 96, 99, 75];
  if (badCodes.includes(weatherCode)) return false;
  if (windSpeed > 40) return false;
  return true;
}

export async function fetchPescaraWeather(): Promise<WeatherInfo> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${PESCARA_LAT}&longitude=${PESCARA_LON}&current=temperature_2m,weather_code,wind_speed_10m&timezone=Europe%2FRome`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather API error');
    
    const data = await response.json();
    const current = data.current;
    
    const temperature = current.temperature_2m;
    const weatherCode = current.weather_code;
    const windSpeed = current.wind_speed_10m;
    const { description, icon } = getWeatherDescription(weatherCode);
    const isFavorable = isWeatherFavorable(weatherCode, windSpeed);

    return {
      temperature,
      weatherCode,
      windSpeed,
      description,
      isFavorable,
      icon,
    };
  } catch (error) {
    console.error('Failed to fetch weather:', error);
    // Fallback: assume favorable
    return {
      temperature: 28,
      weatherCode: 0,
      windSpeed: 10,
      description: 'Sereno',
      isFavorable: true,
      icon: 'sun',
    };
  }
}

// Check if action type is outdoor (eligible for weather clause)
export function isOutdoorActivity(actionType: string): boolean {
  return ['beach_booking', 'sport_booking', 'mobility_rental', 'boat_charter'].includes(actionType);
}
