import React, { useState, useEffect } from 'react';
import { Star, Cloud, Home } from 'lucide-react';

// ============= PAGE ACCUEIL =============
function HomePage({ theme, setTheme, onNavigate }) {
  const [location, setLocation] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [weather, setWeather] = useState(null);
  const [moonData, setMoonData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);
  const [bortleData, setBortleData] = useState(null);
  const [loadingBortle, setLoadingBortle] = useState(false);

  const themes = {
    dark: {
      bg: '#000000',
      cardBg: '#0a0a0a',
      text: '#e5e5e5',
      textSecondary: '#a3a3a3',
      textTertiary: '#737373',
      textMuted: '#525252',
      border: '#1a1a1a',
      input: '#0a0a0a',
      inputBorder: '#262626',
      buttonBg: '#ffffff',
      buttonText: '#000000'
    },
    light: {
      bg: '#ffffff',
      cardBg: '#f9fafb',
      text: '#0a0a0a',
      textSecondary: '#374151',
      textTertiary: '#6b7280',
      textMuted: '#9ca3af',
      border: '#e5e7eb',
      input: '#ffffff',
      inputBorder: '#d1d5db',
      buttonBg: '#0a0a0a',
      buttonText: '#ffffff'
    }
  };

  const currentTheme = themes[theme];

  // Calcul phase lunaire
  function getMoonPhase(date = new Date()) {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    const day = date.getDate();
    
    let c, e, jd, b;
    let yearCopy = year;
    
    if (month < 3) {
      yearCopy--;
      month += 12;
    }
    
    ++month;
    c = 365.25 * yearCopy;
    e = 30.6 * month;
    jd = c + e + day - 694039.09;
    jd /= 29.5305882;
    b = parseInt(jd);
    jd -= b;
    b = Math.round(jd * 8);
    
    if (b >= 8) b = 0;
    
    const phases = ['Nouvelle Lune', 'Premier Croissant', 'Premier Quartier', 'Gibbeuse Croissante', 
                    'Pleine Lune', 'Gibbeuse Décroissante', 'Dernier Quartier', 'Dernier Croissant'];
    
    const illumination = Math.abs(((jd * 2) - 1)) * 100;
    
    return {
      phase: phases[b],
      illumination: illumination.toFixed(0),
      phaseIndex: b
    };
  }

  function convertToBortle(skyBrightness) {
    if (skyBrightness >= 21.99) return { value: 1, label: 'Ciel excellent - Noir' };
    if (skyBrightness >= 21.89) return { value: 2, label: 'Ciel vraiment noir' };
    if (skyBrightness >= 21.69) return { value: 3, label: 'Ciel rural' };
    if (skyBrightness >= 20.49) return { value: 4, label: 'Rural/Transition' };
    if (skyBrightness >= 19.50) return { value: 5, label: 'Suburbain' };
    if (skyBrightness >= 18.94) return { value: 6, label: 'Suburbain lumineux' };
    if (skyBrightness >= 18.38) return { value: 7, label: 'Transition urbain' };
    if (skyBrightness >= 17.00) return { value: 8, label: 'Urbain' };
    return { value: 9, label: 'Urbain dense' };
  }

  function getObservingConditions(bortleValue) {
    const conditions = {
      1: { milkyWay: 'Extrêmement visible', nebulae: 'Excellentes', galaxies: 'Excellentes', color: '#22c55e' },
      2: { milkyWay: 'Très visible', nebulae: 'Excellentes', galaxies: 'Excellentes', color: '#22c55e' },
      3: { milkyWay: 'Visible', nebulae: 'Très bonnes', galaxies: 'Très bonnes', color: '#22c55e' },
      4: { milkyWay: 'Visible', nebulae: 'Bonnes', galaxies: 'Très bonnes', color: '#84cc16' },
      5: { milkyWay: 'Faiblement visible', nebulae: 'Bonnes', galaxies: 'Bonnes', color: '#84cc16' },
      6: { milkyWay: 'À peine visible', nebulae: 'Moyennes', galaxies: 'Moyennes', color: '#eab308' },
      7: { milkyWay: 'Invisible', nebulae: 'Difficiles', galaxies: 'Difficiles', color: '#f97316' },
      8: { milkyWay: 'Invisible', nebulae: 'Très difficiles', galaxies: 'Très difficiles', color: '#ef4444' },
      9: { milkyWay: 'Invisible', nebulae: 'Quasi impossibles', galaxies: 'Quasi impossibles', color: '#ef4444' }
    };
    return conditions[bortleValue] || conditions[5];
  }

  const Metric = ({ label, value, color }) => (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      margin: '14px 0',
      alignItems: 'center'
    }}>
      <span style={{ color: currentTheme.textTertiary }}>{label}</span>
      <span style={{ fontWeight: 500, color: color || currentTheme.text }}>{value}</span>
    </div>
  );

  useEffect(() => {
    const moon = getMoonPhase();
    setMoonData(moon);
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setCoordinates(coords);
          getLocationName(coords.latitude, coords.longitude);
          fetchWeatherData(coords.latitude, coords.longitude);
        },
        (err) => {
          setError('Géolocalisation refusée. Recherchez manuellement.');
          setLoading(false);
        }
      );
    }
  };

  const estimateBortleFromLocation = (locationData) => {
    setLoadingBortle(true);
    
    let bortleValue = 5;
    let skyBrightness = 19.5;
    
    const address = locationData.address || {};
    
    if (address.city) {
      const cityName = address.city.toLowerCase();
      
      const metropolises = ['montréal', 'montreal', 'toronto', 'vancouver', 'paris', 'lyon', 
                           'new york', 'los angeles', 'london', 'berlin', 'tokyo'];
      const largeCities = ['québec', 'quebec', 'ottawa', 'calgary', 'edmonton', 'winnipeg',
                          'marseille', 'bordeaux', 'lille', 'toulouse'];
      
      if (metropolises.some(metro => cityName.includes(metro))) {
        bortleValue = 9;
        skyBrightness = 17.5;
      } else if (largeCities.some(city => cityName.includes(city))) {
        bortleValue = 8;
        skyBrightness = 18.0;
      } else {
        bortleValue = 7;
        skyBrightness = 18.5;
      }
    } else if (address.town) {
      bortleValue = 6;
      skyBrightness = 19.0;
    } else if (address.village) {
      bortleValue = 4;
      skyBrightness = 20.5;
    } else if (address.hamlet || address.isolated_dwelling) {
      bortleValue = 3;
      skyBrightness = 21.5;
    } else {
      bortleValue = 4;
      skyBrightness = 20.5;
    }
    
    if (address.suburb && !address.city) {
      bortleValue = Math.min(bortleValue + 1, 9);
      skyBrightness = Math.max(skyBrightness - 0.5, 17.0);
    }
    
    const bortle = convertToBortle(skyBrightness);
    const conditions = getObservingConditions(bortleValue);
    
    setBortleData({
      value: bortleValue,
      label: bortle.label,
      skyBrightness: skyBrightness.toFixed(2),
      conditions: conditions
    });
    
    setLoadingBortle(false);
  };

  const getLocationName = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`
      );
      const data = await response.json();
      const city = data.address.city || data.address.town || data.address.village || 'Lieu inconnu';
      const region = data.address.state || data.address.region || '';
      const country = data.address.country || '';
      setLocation(`${city}, ${region}, ${country}`);
      
      estimateBortleFromLocation(data);
    } catch (err) {
      setLocation(`${lat.toFixed(2)}, ${lon.toFixed(2)}`);
      setBortleData({
        value: 5,
        label: 'Suburbain',
        skyBrightness: '~19.5',
        conditions: getObservingConditions(5)
      });
    }
  };

  const searchLocation = async () => {
    if (!searchInput.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput)}&limit=1&addressdetails=1`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        const coords = {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon)
        };
        setCoordinates(coords);
        setLocation(data[0].display_name);
        fetchWeatherData(coords.latitude, coords.longitude);
        
        estimateBortleFromLocation(data[0]);
      } else {
        setError('Lieu introuvable');
        setLoading(false);
      }
    } catch (err) {
      setError('Erreur de recherche');
      setLoading(false);
    }
  };

  const fetchWeatherData = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,cloud_cover_mean&timezone=auto&forecast_days=7`
      );
      const data = await response.json();
      
      setWeather({
        temperature: Math.round(data.current.temperature_2m),
        humidity: data.current.relative_humidity_2m,
        cloudCover: data.current.cloud_cover,
        windSpeed: Math.round(data.current.wind_speed_10m),
        windDirection: getWindDirection(data.current.wind_direction_10m),
        weatherCode: data.current.weather_code,
        sunrise: data.daily.sunrise[0],
        sunset: data.daily.sunset[0]
      });

      const forecastData = data.daily.time.map((date, index) => ({
        date: new Date(date).toLocaleDateString('fr-FR', { weekday: 'short' }),
        temp: Math.round(data.daily.temperature_2m_max[index]),
        cloudCover: Math.round(data.daily.cloud_cover_mean[index]),
        weatherCode: data.daily.weather_code[index]
      }));
      
      setForecast(forecastData);
      setLoading(false);
    } catch (err) {
      setError('Erreur de chargement météo');
      setLoading(false);
    }
  };

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const getWeatherDescription = (code) => {
    const descriptions = {
      0: 'Ciel dégagé',
      1: 'Principalement dégagé',
      2: 'Partiellement nuageux',
      3: 'Couvert',
      45: 'Brouillard',
      48: 'Brouillard givrant',
      51: 'Bruine légère',
      61: 'Pluie légère',
      80: 'Averses',
      95: 'Orage'
    };
    return descriptions[code] || 'Variable';
  };

  const getAstroScore = (cloudCover, moonIllumination, bortleValue) => {
    if (cloudCover === null || cloudCover === undefined) return 0;
    let score = 10;
    
    if (cloudCover > 80) score -= 5;
    else if (cloudCover > 60) score -= 3.5;
    else if (cloudCover > 40) score -= 2;
    else if (cloudCover > 20) score -= 1;
    
    const moonImpact = (moonIllumination / 100) * 3;
    score -= moonImpact;
    
    if (bortleValue) {
      if (bortleValue >= 8) score -= 2;
      else if (bortleValue >= 7) score -= 1.5;
      else if (bortleValue >= 6) score -= 1;
      else if (bortleValue >= 5) score -= 0.5;
    }
    
    return Math.max(0.5, score).toFixed(1);
  };

  const getScoreColor = (score) => {
    if (score >= 8) return '#22c55e';
    if (score >= 6) return '#84cc16';
    if (score >= 4) return '#eab308';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 8) return 'Excellente nuit pour l\'observation';
    if (score >= 6) return 'Bonne nuit pour l\'observation';
    if (score >= 4) return 'Conditions moyennes';
    return 'Conditions médiocres';
  };

  const overallScore = weather && moonData && bortleData ? 
    getAstroScore(weather.cloudCover, parseFloat(moonData.illumination), bortleData.value) : 0;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px', paddingTop: '100px' }}>
      {/* Hero */}
      <div style={{
        position: 'relative',
        height: '400px',
        marginBottom: '60px',
        overflow: 'hidden',
        border: `1px solid ${currentTheme.border}`,
        borderRadius: '6px',
        background: theme === 'dark'
          ? 'linear-gradient(to bottom, #0a0a1a 0%, #1a1a2e 40%, #16213e 70%, #1a2332 100%)'
          : 'linear-gradient(to bottom, #1a2332 0%, #2d3e50 40%, #34495e 70%, #3d5a80 100%)'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '60%',
          background: `
            radial-gradient(1px 1px at 10% 10%, white, transparent),
            radial-gradient(2px 2px at 60% 15%, white, transparent),
            radial-gradient(1px 1px at 80% 5%, white, transparent)
          `,
          opacity: 0.8,
          animation: 'twinkle 3s ease-in-out infinite alternate'
        }} />

        <div style={{
          position: 'relative',
          zIndex: 10,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '40px'
        }}>
          <h1 style={{ 
            fontSize: '3rem', 
            marginBottom: '16px', 
            fontWeight: 600, 
            color: '#ffffff',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}>
            AstroSpot
          </h1>
          <p style={{ 
            color: '#e5e7eb', 
            fontSize: '1.1rem',
            textShadow: '0 1px 5px rgba(0,0,0,0.5)'
          }}>
            Conditions d'observation pour l'astrophotographie
          </p>
        </div>
      </div>

      {/* Barre de recherche */}
      <div style={{ margin: '40px 0' }}>
        <div style={{
          background: currentTheme.input,
          border: `1px solid ${currentTheme.inputBorder}`,
          borderRadius: '6px',
          maxWidth: '600px',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden'
        }}>
          <input
            type="text"
            placeholder="Rechercher un lieu"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: currentTheme.text,
              fontSize: '0.95rem',
              outline: 'none',
              padding: '14px 16px',
              fontFamily: 'inherit'
            }}
          />
          <button
            onClick={searchLocation}
            disabled={loading}
            style={{
              background: currentTheme.buttonBg,
              border: 'none',
              color: currentTheme.buttonText,
              padding: '14px 24px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 500,
              fontSize: '0.9rem',
              fontFamily: 'inherit',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Chargement...' : 'Rechercher'}
          </button>
        </div>
      </div>

      {error && <div style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '20px' }}>{error}</div>}
      {location && <div style={{ fontSize: '0.9rem', marginBottom: '40px', color: currentTheme.textTertiary }}>{location}</div>}

      {weather && moonData && (
        <>
          {/* Score global */}
          <div style={{
            background: currentTheme.cardBg,
            border: `1px solid ${currentTheme.border}`,
            padding: '40px',
            borderRadius: '6px',
            marginBottom: '40px'
          }}>
            <div style={{
              fontSize: '4rem',
              fontWeight: 700,
              marginBottom: '8px',
              color: getScoreColor(overallScore)
            }}>
              {overallScore}<span style={{ color: currentTheme.textMuted, fontSize: '0.5em' }}>/10</span>
            </div>
            <div style={{ fontSize: '1.1rem', color: currentTheme.textSecondary, marginBottom: '16px' }}>
              {getScoreLabel(overallScore)}
            </div>
            <div style={{ fontSize: '0.9rem', color: currentTheme.textMuted }}>
              {getWeatherDescription(weather.weatherCode)} · {moonData.phase} · Nuages {weather.cloudCover}%
              {bortleData && ` · Bortle ${bortleData.value}`}
            </div>
          </div>

          {/* Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}>
            {/* Météo */}
            <div style={{
              background: currentTheme.cardBg,
              border: `1px solid ${currentTheme.border}`,
              borderRadius: '6px',
              padding: '28px'
            }}>
              <div style={{
                marginBottom: '24px',
                paddingBottom: '20px',
                borderBottom: `1px solid ${currentTheme.border}`,
                fontSize: '1rem',
                fontWeight: 600
              }}>
                Météo actuelle
              </div>
              <Metric label="Température" value={`${weather.temperature}°C`} />
              <Metric label="Conditions" value={getWeatherDescription(weather.weatherCode)} />
              <Metric 
                label="Couverture nuageuse" 
                value={`${weather.cloudCover}%`}
                color={weather.cloudCover < 20 ? '#22c55e' : weather.cloudCover < 60 ? '#eab308' : '#ef4444'}
              />
              <Metric label="Humidité" value={`${weather.humidity}%`} />
              <Metric label="Vent" value={`${weather.windSpeed} km/h ${weather.windDirection}`} />
            </div>

            {/* Lune */}
            <div style={{
              background: currentTheme.cardBg,
              border: `1px solid ${currentTheme.border}`,
              borderRadius: '6px',
              padding: '28px'
            }}>
              <div style={{
                marginBottom: '24px',
                paddingBottom: '20px',
                borderBottom: `1px solid ${currentTheme.border}`,
                fontSize: '1rem',
                fontWeight: 600
              }}>
                Phase lunaire
              </div>
              <div style={{ textAlign: 'center', margin: '24px 0' }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  margin: '0 auto 20px',
                  background: theme === 'dark' ? '#1a1a1a' : '#e5e7eb',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  color: currentTheme.textMuted,
                  border: `1px solid ${currentTheme.border}`
                }}>
                  {moonData.phase}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '8px' }}>
                  {moonData.phase}
                </div>
                <div style={{ color: currentTheme.textTertiary, fontSize: '0.9rem' }}>
                  Illumination : {moonData.illumination}%
                </div>
              </div>
            </div>

            {/* Bortle */}
            <div style={{
              background: currentTheme.cardBg,
              border: `1px solid ${currentTheme.border}`,
              borderRadius: '6px',
              padding: '28px'
            }}>
              <div style={{
                marginBottom: '24px',
                paddingBottom: '20px',
                borderBottom: `1px solid ${currentTheme.border}`,
                fontSize: '1rem',
                fontWeight: 600
              }}>
                Pollution lumineuse
              </div>
              {bortleData && (
                <>
                  <div style={{ textAlign: 'center', padding: '24px 0' }}>
                    <div style={{
                      display: 'inline-block',
                      padding: '6px 16px',
                      borderRadius: '4px',
                      background: theme === 'dark' ? '#1a1a1a' : '#e5e7eb',
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      border: `1px solid ${currentTheme.border}`,
                      marginBottom: '12px'
                    }}>
                      Bortle {bortleData.value}
                    </div>
                    <div style={{ fontSize: '0.95rem', color: bortleData.conditions.color, marginTop: '8px' }}>
                      {bortleData.label}
                    </div>
                  </div>
                  <Metric label="Voie lactée" value={bortleData.conditions.milkyWay} />
                  <Metric label="Nébuleuses" value={bortleData.conditions.nebulae} />
                  <Metric label="Galaxies" value={bortleData.conditions.galaxies} />
                </>
              )}
            </div>

            {/* Horaires solaires */}
            <div style={{
              background: currentTheme.cardBg,
              border: `1px solid ${currentTheme.border}`,
              borderRadius: '6px',
              padding: '28px'
            }}>
              <div style={{
                marginBottom: '24px',
                paddingBottom: '20px',
                borderBottom: `1px solid ${currentTheme.border}`,
                fontSize: '1rem',
                fontWeight: 600
              }}>
                Horaires solaires
              </div>
              <Metric label="Lever du soleil" value={new Date(weather.sunrise).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} />
              <Metric label="Coucher du soleil" value={new Date(weather.sunset).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} />
            </div>
          </div>

          {/* Prévisions */}
          {forecast.length > 0 && (
            <div style={{
              background: currentTheme.cardBg,
              border: `1px solid ${currentTheme.border}`,
              borderRadius: '6px',
              padding: '32px'
            }}>
              <h2 style={{
                fontSize: '1.2rem',
                marginBottom: '28px',
                fontWeight: 600
              }}>
                Prévisions 7 jours
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '16px'
              }}>
                {forecast.map((day, index) => {
                  const dayScore = getAstroScore(
                    day.cloudCover, 
                    parseFloat(moonData.illumination),
                    bortleData ? bortleData.value : null
                  );
                  return (
                    <div key={index} style={{
                      background: theme === 'dark' ? '#000000' : '#ffffff',
                      border: `1px solid ${currentTheme.border}`,
                      padding: '20px 16px',
                      borderRadius: '6px',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontWeight: 500, marginBottom: '12px', color: currentTheme.textSecondary, fontSize: '0.85rem' }}>
                        {index === 0 ? 'Aujourd\'hui' : day.date}
                      </div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 600, margin: '12px 0' }}>
                        {day.temp}°
                      </div>
                      <div style={{ marginTop: '12px', fontSize: '0.85rem', color: currentTheme.textTertiary }}>
                        Nuages : {day.cloudCover}%
                      </div>
                      <div style={{
                        marginTop: '12px',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        color: getScoreColor(dayScore)
                      }}>
                        {dayScore}/10
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      <footer style={{
        textAlign: 'center',
        marginTop: '80px',
        padding: '32px 0',
        color: currentTheme.textMuted,
        fontSize: '0.85rem',
        borderTop: `1px solid ${currentTheme.border}`
      }}>
        <p style={{ margin: '8px 0' }}>Données fournies par Open-Meteo & OpenStreetMap</p>
        <p style={{ margin: '8px 0' }}>Fait pour les astronomes amateurs</p>
      </footer>
    </div>
  );
}