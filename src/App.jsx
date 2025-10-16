import React, { useState, useEffect } from 'react';
import { Star, Home, MapPin, Calendar, Eye } from 'lucide-react';
import * as Astronomy from 'astronomy-engine';

// Base de données des objets du ciel profond
const deepSkyObjects = {
  north: {
    winter: [
      { name: 'M42', fullName: 'Nébuleuse d\'Orion', type: 'Nébuleuse', constellation: 'Orion', magnitude: 4.0, difficulty: 'Facile', description: 'Spectaculaire nébuleuse visible à l\'œil nu' },
      { name: 'M45', fullName: 'Les Pléiades', type: 'Amas ouvert', constellation: 'Taureau', magnitude: 1.6, difficulty: 'Très facile', description: 'Magnifique amas d\'étoiles bleues' },
      { name: 'M1', fullName: 'Nébuleuse du Crabe', type: 'Nébuleuse', constellation: 'Taureau', magnitude: 8.4, difficulty: 'Moyen', description: 'Reste de supernova' },
      { name: 'M31', fullName: 'Galaxie d\'Andromède', type: 'Galaxie', constellation: 'Andromède', magnitude: 3.4, difficulty: 'Facile', description: 'Galaxie spirale la plus proche' }
    ],
    spring: [
      { name: 'M51', fullName: 'Galaxie du Tourbillon', type: 'Galaxie', constellation: 'Chiens de Chasse', magnitude: 8.4, difficulty: 'Moyen', description: 'Galaxie spirale spectaculaire' },
      { name: 'M104', fullName: 'Galaxie du Sombrero', type: 'Galaxie', constellation: 'Vierge', magnitude: 8.0, difficulty: 'Moyen', description: 'Galaxie en forme de chapeau' },
      { name: 'M3', fullName: 'Amas globulaire M3', type: 'Amas globulaire', constellation: 'Chiens de Chasse', magnitude: 6.2, difficulty: 'Facile', description: 'Bel amas globulaire' },
      { name: 'M81', fullName: 'Galaxie de Bode', type: 'Galaxie', constellation: 'Grande Ourse', magnitude: 6.9, difficulty: 'Moyen', description: 'Grande galaxie spirale' }
    ],
    summer: [
      { name: 'M13', fullName: 'Amas d\'Hercule', type: 'Amas globulaire', constellation: 'Hercule', magnitude: 5.8, difficulty: 'Facile', description: 'Le plus bel amas globulaire du nord' },
      { name: 'M57', fullName: 'Nébuleuse de l\'Anneau', type: 'Nébuleuse planétaire', constellation: 'Lyre', magnitude: 8.8, difficulty: 'Moyen', description: 'Célèbre nébuleuse planétaire' },
      { name: 'M27', fullName: 'Nébuleuse de l\'Haltère', type: 'Nébuleuse planétaire', constellation: 'Petit Renard', magnitude: 7.5, difficulty: 'Facile', description: 'Grande nébuleuse planétaire' },
      { name: 'M8', fullName: 'Nébuleuse de la Lagune', type: 'Nébuleuse', constellation: 'Sagittaire', magnitude: 6.0, difficulty: 'Facile', description: 'Belle nébuleuse diffuse' }
    ],
    fall: [
      { name: 'M31', fullName: 'Galaxie d\'Andromède', type: 'Galaxie', constellation: 'Andromède', magnitude: 3.4, difficulty: 'Très facile', description: 'Visible à l\'œil nu en ciel noir' },
      { name: 'M33', fullName: 'Galaxie du Triangle', type: 'Galaxie', constellation: 'Triangle', magnitude: 5.7, difficulty: 'Moyen', description: 'Grande galaxie spirale' },
      { name: 'M52', fullName: 'Amas ouvert M52', type: 'Amas ouvert', constellation: 'Cassiopée', magnitude: 5.0, difficulty: 'Facile', description: 'Riche amas d\'étoiles' },
      { name: 'NGC 869/884', fullName: 'Double Amas de Persée', type: 'Amas ouvert', constellation: 'Persée', magnitude: 4.3, difficulty: 'Très facile', description: 'Magnifique double amas' }
    ]
  },
  south: {
    summer: [
      { name: 'M7', fullName: 'Amas de Ptolémée', type: 'Amas ouvert', constellation: 'Scorpion', magnitude: 3.3, difficulty: 'Très facile', description: 'Grand amas visible à l\'œil nu' },
      { name: 'M8', fullName: 'Nébuleuse de la Lagune', type: 'Nébuleuse', constellation: 'Sagittaire', magnitude: 6.0, difficulty: 'Facile', description: 'Belle nébuleuse diffuse' },
      { name: 'Oméga du Centaure', fullName: 'Omega Centauri', type: 'Amas globulaire', constellation: 'Centaure', magnitude: 3.9, difficulty: 'Très facile', description: 'Plus gros amas globulaire visible' },
      { name: 'NGC 4755', fullName: 'Amas de la Boîte à Bijoux', type: 'Amas ouvert', constellation: 'Croix du Sud', magnitude: 4.2, difficulty: 'Très facile', description: 'Superbe amas coloré' }
    ],
    fall: [
      { name: 'M42', fullName: 'Nébuleuse d\'Orion', type: 'Nébuleuse', constellation: 'Orion', magnitude: 4.0, difficulty: 'Facile', description: 'Spectaculaire nébuleuse' },
      { name: 'Grand Nuage de Magellan', fullName: 'LMC', type: 'Galaxie', constellation: 'Dorade', magnitude: 0.9, difficulty: 'Très facile', description: 'Galaxie satellite visible à l\'œil nu' },
      { name: 'Petit Nuage de Magellan', fullName: 'SMC', type: 'Galaxie', constellation: 'Toucan', magnitude: 2.7, difficulty: 'Très facile', description: 'Galaxie satellite' },
      { name: '47 Toucanae', fullName: '47 Tuc', type: 'Amas globulaire', constellation: 'Toucan', magnitude: 4.0, difficulty: 'Très facile', description: 'Deuxième plus bel amas globulaire' }
    ],
    winter: [
      { name: 'NGC 253', fullName: 'Galaxie du Sculpteur', type: 'Galaxie', constellation: 'Sculpteur', magnitude: 7.6, difficulty: 'Moyen', description: 'Grande galaxie spirale' },
      { name: 'NGC 55', fullName: 'Galaxie NGC 55', type: 'Galaxie', constellation: 'Sculpteur', magnitude: 7.9, difficulty: 'Moyen', description: 'Galaxie irrégulière' },
      { name: 'M83', fullName: 'Galaxie du Moulinet Austral', type: 'Galaxie', constellation: 'Hydre', magnitude: 7.6, difficulty: 'Moyen', description: 'Belle galaxie spirale' },
      { name: 'NGC 4945', fullName: 'Galaxie NGC 4945', type: 'Galaxie', constellation: 'Centaure', magnitude: 8.4, difficulty: 'Moyen', description: 'Grande galaxie vue par la tranche' }
    ],
    spring: [
      { name: 'Oméga du Centaure', fullName: 'Omega Centauri', type: 'Amas globulaire', constellation: 'Centaure', magnitude: 3.9, difficulty: 'Très facile', description: 'Plus gros amas globulaire' },
      { name: 'NGC 5139', fullName: 'Amas globulaire NGC 5139', type: 'Amas globulaire', constellation: 'Centaure', magnitude: 3.9, difficulty: 'Très facile', description: 'Spectaculaire' },
      { name: 'NGC 3372', fullName: 'Nébuleuse de la Carène', type: 'Nébuleuse', constellation: 'Carène', magnitude: 3.0, difficulty: 'Très facile', description: 'Immense nébuleuse' },
      { name: 'NGC 2070', fullName: 'Nébuleuse de la Tarentule', type: 'Nébuleuse', constellation: 'Dorade', magnitude: 8.0, difficulty: 'Facile', description: 'Dans le Grand Nuage de Magellan' }
    ]
  }
};

// ============= PAGE ACCUEIL =============
function HomePage({ theme }) {
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

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}>
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

// ============= PAGE OBJETS CELESTES =============
function CelestialPage({ theme }) {
  const [location, setLocation] = useState(null);
  const [hemisphere, setHemisphere] = useState('north');
  const [season, setSeason] = useState('winter');
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);

  const themes = {
    dark: {
      bg: '#000000',
      cardBg: '#0a0a0a',
      text: '#e5e5e5',
      textSecondary: '#a3a3a3',
      textTertiary: '#737373',
      textMuted: '#525252',
      border: '#1a1a1a'
    },
    light: {
      bg: '#ffffff',
      cardBg: '#f9fafb',
      text: '#0a0a0a',
      textSecondary: '#374151',
      textTertiary: '#6b7280',
      textMuted: '#9ca3af',
      border: '#e5e7eb'
    }
  };

  const currentTheme = themes[theme];

  useEffect(() => {
    const getUserLocation = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            setLocation({ latitude: lat, longitude: lon });
            setHemisphere(lat >= 0 ? 'north' : 'south');
            
            const month = new Date().getMonth();
            let currentSeason;
            
            if (lat >= 0) {
              if (month >= 11 || month <= 1) currentSeason = 'winter';
              else if (month >= 2 && month <= 4) currentSeason = 'spring';
              else if (month >= 5 && month <= 7) currentSeason = 'summer';
              else currentSeason = 'fall';
            } else {
              if (month >= 11 || month <= 1) currentSeason = 'summer';
              else if (month >= 2 && month <= 4) currentSeason = 'fall';
              else if (month >= 5 && month <= 7) currentSeason = 'winter';
              else currentSeason = 'spring';
            }
            
            setSeason(currentSeason);
            calculatePlanets(lat, lon);
          },
          () => {
            setHemisphere('north');
            setSeason('winter');
            calculatePlanets(45, 0);
          }
        );
      }
    };

    getUserLocation();
  }, []);

  const calculatePlanets = (lat, lon) => {
    setLoading(true);
    try {
      const observer = new Astronomy.Observer(lat, lon, 0);
      const now = new Date();
      
      const planetNames = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
      const planetsFrench = {
        'Mercury': 'Mercure',
        'Venus': 'Vénus',
        'Mars': 'Mars',
        'Jupiter': 'Jupiter',
        'Saturn': 'Saturne'
      };
      
      const visiblePlanets = [];
      
      planetNames.forEach(planetName => {
        const body = Astronomy.Body[planetName];
        const equator = Astronomy.Equator(body, now, observer, true, true);
        const horizon = Astronomy.Horizon(now, observer, equator.ra, equator.dec, 'normal');
        
        const isVisible = horizon.altitude > 0;
        
        if (isVisible) {
          let direction = '';
          if (horizon.azimuth >= 337.5 || horizon.azimuth < 22.5) direction = 'Nord';
          else if (horizon.azimuth >= 22.5 && horizon.azimuth < 67.5) direction = 'Nord-Est';
          else if (horizon.azimuth >= 67.5 && horizon.azimuth < 112.5) direction = 'Est';
          else if (horizon.azimuth >= 112.5 && horizon.azimuth < 157.5) direction = 'Sud-Est';
          else if (horizon.azimuth >= 157.5 && horizon.azimuth < 202.5) direction = 'Sud';
          else if (horizon.azimuth >= 202.5 && horizon.azimuth < 247.5) direction = 'Sud-Ouest';
          else if (horizon.azimuth >= 247.5 && horizon.azimuth < 292.5) direction = 'Ouest';
          else direction = 'Nord-Ouest';
          
          visiblePlanets.push({
            name: planetsFrench[planetName],
            altitude: Math.round(horizon.altitude),
            azimuth: Math.round(horizon.azimuth),
            direction: direction
          });
        }
      });
      
      setPlanets(visiblePlanets);
    } catch (error) {
      console.error('Erreur calcul planètes:', error);
    }
    setLoading(false);
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty === 'Très facile') return '#22c55e';
    if (difficulty === 'Facile') return '#84cc16';
    if (difficulty === 'Moyen') return '#eab308';
    return '#f97316';
  };

  const getSeasonName = (s) => {
    const names = {
      winter: 'Hiver',
      spring: 'Printemps',
      summer: 'Été',
      fall: 'Automne'
    };
    return names[s] || s;
  };

  const deepSkyList = deepSkyObjects[hemisphere]?.[season] || [];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px', paddingTop: '100px' }}>
      
      <div style={{
        position: 'relative',
        height: '300px',
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
          height: '100%',
          background: `
            radial-gradient(2px 2px at 20% 30%, white, transparent),
            radial-gradient(2px 2px at 60% 70%, white, transparent),
            radial-gradient(1px 1px at 50% 50%, white, transparent)
          `,
          opacity: 0.6,
          animation: 'twinkle 4s ease-in-out infinite alternate'
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
          <Star size={48} color="#ffffff" style={{ marginBottom: '16px' }} />
          <h1 style={{ 
            fontSize: '2.5rem', 
            marginBottom: '12px', 
            fontWeight: 600, 
            letterSpacing: '-0.02em', 
            color: '#ffffff',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}>
            Objets célestes visibles
          </h1>
          <p style={{ 
            color: '#e5e7eb', 
            fontSize: '1rem',
            textShadow: '0 1px 5px rgba(0,0,0,0.5)'
          }}>
            Ce soir depuis votre emplacement
          </p>
        </div>
      </div>

      <div style={{
        background: currentTheme.cardBg,
        border: `1px solid ${currentTheme.border}`,
        padding: '24px',
        borderRadius: '6px',
        marginBottom: '40px',
        display: 'flex',
        gap: '32px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <MapPin size={20} color={currentTheme.textTertiary} />
          <div>
            <div style={{ fontSize: '0.85rem', color: currentTheme.textTertiary }}>Hémisphère</div>
            <div style={{ fontSize: '1rem', fontWeight: 500 }}>
              {hemisphere === 'north' ? 'Nord' : 'Sud'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Calendar size={20} color={currentTheme.textTertiary} />
          <div>
            <div style={{ fontSize: '0.85rem', color: currentTheme.textTertiary }}>Saison</div>
            <div style={{ fontSize: '1rem', fontWeight: 500 }}>
              {getSeasonName(season)}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Eye size={20} color={currentTheme.textTertiary} />
          <div>
            <div style={{ fontSize: '0.85rem', color: currentTheme.textTertiary }}>Date</div>
            <div style={{ fontSize: '1rem', fontWeight: 500 }}>
              {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '48px' }}>
        <h2 style={{
          fontSize: '1.5rem',
          marginBottom: '24px',
          fontWeight: 600,
          letterSpacing: '-0.01em'
        }}>
          Planètes visibles en ce moment
        </h2>

        {loading ? (
          <div style={{
            background: currentTheme.cardBg,
            border: `1px solid ${currentTheme.border}`,
            padding: '40px',
            borderRadius: '6px',
            textAlign: 'center',
            color: currentTheme.textTertiary
          }}>
            Calcul des positions...
          </div>
        ) : planets.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {planets.map((planet, index) => (
              <div key={index} style={{
                background: currentTheme.cardBg,
                border: `1px solid ${currentTheme.border}`,
                padding: '24px',
                borderRadius: '6px'
              }}>
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  marginBottom: '12px',
                  color: '#eab308'
                }}>
                  {planet.name}
                </div>
                <div style={{ fontSize: '0.9rem', color: currentTheme.textSecondary }}>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ color: currentTheme.textTertiary }}>Direction : </span>
                    <span style={{ fontWeight: 500 }}>{planet.direction}</span>
                  </div>
                  <div>
                    <span style={{ color: currentTheme.textTertiary }}>Altitude : </span>
                    <span style={{ fontWeight: 500 }}>{planet.altitude}°</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background: currentTheme.cardBg,
            border: `1px solid ${currentTheme.border}`,
            padding: '40px',
            borderRadius: '6px',
            textAlign: 'center',
            color: currentTheme.textTertiary
          }}>
            Aucune planète visible pour le moment
          </div>
        )}
      </div>

      <div>
        <h2 style={{
          fontSize: '1.5rem',
          marginBottom: '24px',
          fontWeight: 600,
          letterSpacing: '-0.01em'
        }}>
          Ciel profond - {getSeasonName(season)}
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {deepSkyList.map((obj, index) => (
            <div key={index} style={{
              background: currentTheme.cardBg,
              border: `1px solid ${currentTheme.border}`,
              padding: '28px',
              borderRadius: '6px',
              transition: 'transform 0.2s ease, border-color 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = currentTheme.border === '#1a1a1a' ? '#262626' : '#d1d5db';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = currentTheme.border;
            }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px'
              }}>
                <div>
                  <div style={{
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    marginBottom: '4px'
                  }}>
                    {obj.name}
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: currentTheme.textTertiary
                  }}>
                    {obj.fullName}
                  </div>
                </div>
                <div style={{
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  background: theme === 'dark' ? '#1a1a1a' : '#e5e7eb',
                  color: getDifficultyColor(obj.difficulty)
                }}>
                  {obj.difficulty}
                </div>
              </div>

              <div style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: `1px solid ${currentTheme.border}`
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  fontSize: '0.85rem',
                  marginBottom: '12px'
                }}>
                  <div>
                    <span style={{ color: currentTheme.textTertiary }}>Type : </span>
                    <span style={{ color: currentTheme.textSecondary }}>{obj.type}</span>
                  </div>
                  <div>
                    <span style={{ color: currentTheme.textTertiary }}>Magnitude : </span>
                    <span style={{ color: currentTheme.textSecondary }}>{obj.magnitude}</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.85rem', marginBottom: '8px' }}>
                  <span style={{ color: currentTheme.textTertiary }}>Constellation : </span>
                  <span style={{ color: currentTheme.textSecondary }}>{obj.constellation}</span>
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  color: currentTheme.textTertiary,
                  marginTop: '12px',
                  lineHeight: 1.5
                }}>
                  {obj.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer style={{
        textAlign: 'center',
        marginTop: '80px',
        padding: '32px 0',
        color: currentTheme.textMuted,
        fontSize: '0.85rem',
        borderTop: `1px solid ${currentTheme.border}`
      }}>
        <p style={{ margin: '8px 0' }}>Calculs astronomiques via Astronomy Engine</p>
        <p style={{ margin: '8px 0' }}>Objets du ciel profond mis à jour selon la saison</p>
      </footer>
    </div>
  );
}

// ============= APP PRINCIPAL =============
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [theme, setTheme] = useState('dark');

  const themes = {
    dark: {
      bg: '#000000',
      text: '#e5e5e5',
      headerBg: 'rgba(10, 10, 10, 0.95)',
      border: '#1a1a1a'
    },
    light: {
      bg: '#ffffff',
      text: '#0a0a0a',
      headerBg: 'rgba(255, 255, 255, 0.95)',
      border: '#e5e7eb'
    }
  };

  const currentTheme = themes[theme];

  return (
    <div style={{
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: currentTheme.bg,
      color: currentTheme.text,
      minHeight: '100vh',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      <style>
        {`
          @keyframes twinkle {
            0% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>

      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: currentTheme.headerBg,
        borderBottom: `1px solid ${currentTheme.border}`,
        backdropFilter: 'blur(10px)',
        zIndex: 1000
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 600, letterSpacing: '-0.02em' }}>
              AstroSpot
            </div>
            <nav style={{ display: 'flex', gap: '24px' }}>
              <button
                onClick={() => setCurrentPage('home')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: currentPage === 'home' ? currentTheme.text : '#737373',
                  fontSize: '0.95rem',
                  fontWeight: currentPage === 'home' ? 500 : 400,
                  cursor: 'pointer',
                  padding: '8px 0',
                  borderBottom: currentPage === 'home' ? `2px solid ${currentTheme.text}` : '2px solid transparent',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Home size={16} />
                Accueil
              </button>
              <button
                onClick={() => setCurrentPage('celestial')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: currentPage === 'celestial' ? currentTheme.text : '#737373',
                  fontSize: '0.95rem',
                  fontWeight: currentPage === 'celestial' ? 500 : 400,
                  cursor: 'pointer',
                  padding: '8px 0',
                  borderBottom: currentPage === 'celestial' ? `2px solid ${currentTheme.text}` : '2px solid transparent',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Star size={16} />
                Objets célestes
              </button>
            </nav>
          </div>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{
              position: 'relative',
              width: '56px',
              height: '28px',
              background: theme === 'dark' ? '#374151' : '#d1d5db',
              borderRadius: '14px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.3s ease',
              padding: 0
            }}
            aria-label="Toggle theme"
          >
            <div style={{
              position: 'absolute',
              top: '3px',
              left: theme === 'dark' ? '3px' : '31px',
              width: '22px',
              height: '22px',
              background: '#ffffff',
              borderRadius: '50%',
              transition: 'left 0.3s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }} />
          </button>
        </div>
      </header>

      {currentPage === 'home' && <HomePage theme={theme} />}
      {currentPage === 'celestial' && <CelestialPage theme={theme} />}
    </div>
  );
}