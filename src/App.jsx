import React, { useState, useEffect } from 'react';

// Calcul de la phase lunaire
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

// Conversion de la brillance du ciel en échelle Bortle
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

// Obtenir les conditions d'observation selon Bortle
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

function Metric({ label, value, color, theme = 'dark' }) {
  const labelColor = theme === 'dark' ? '#737373' : '#6b7280';
  const valueColor = color || (theme === 'dark' ? '#ffffff' : '#0a0a0a');
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      margin: '14px 0',
      alignItems: 'center'
    }}>
      <span style={{ color: labelColor }}>{label}</span>
      <span style={{ fontWeight: 500, color: valueColor }}>{value}</span>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState('dark');
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

  // Thèmes
  const themes = {
    dark: {
      bg: '#000000',
      cardBg: '#0a0a0a',
      text: '#e5e5e5',
      textSecondary: '#a3a3a3',
      textTertiary: '#737373',
      textMuted: '#525252',
      border: '#1a1a1a',
      borderHover: '#262626',
      input: '#0a0a0a',
      inputBorder: '#262626',
      buttonBg: '#ffffff',
      buttonText: '#000000',
      canvasBg: '#000000'
    },
    light: {
      bg: '#ffffff',
      cardBg: '#f9fafb',
      text: '#0a0a0a',
      textSecondary: '#374151',
      textTertiary: '#6b7280',
      textMuted: '#9ca3af',
      border: '#e5e7eb',
      borderHover: '#d1d5db',
      input: '#ffffff',
      inputBorder: '#d1d5db',
      buttonBg: '#0a0a0a',
      buttonText: '#ffffff',
      canvasBg: '#1a2332' // Plus clair en mode jour
    }
  };

  const currentTheme = themes[theme];

  // Calculer la phase lunaire
  useEffect(() => {
    const moon = getMoonPhase();
    setMoonData(moon);
  }, []);

  // Géolocalisation automatique au chargement
  useEffect(() => {
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
    
    let bortleValue = 5; // Défaut : Suburbain
    let skyBrightness = 19.5;
    
    const address = locationData.address || {};
    const type = locationData.type || '';
    const placeType = locationData.addresstype || '';
    
    // Grandes villes et métropoles
    const majorCities = ['city', 'town'];
    const urbanTypes = ['residential', 'commercial', 'retail', 'industrial'];
    
    // Déterminer le type de zone
    if (address.city) {
      // C'est une ville - on estime selon la taille
      const cityName = address.city.toLowerCase();
      
      // Grandes métropoles connues
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
        // Ville moyenne
        bortleValue = 7;
        skyBrightness = 18.5;
      }
    } else if (address.town) {
      // Petite ville
      bortleValue = 6;
      skyBrightness = 19.0;
    } else if (address.village) {
      // Village
      bortleValue = 4;
      skyBrightness = 20.5;
    } else if (address.hamlet || address.isolated_dwelling) {
      // Hameau ou zone isolée
      bortleValue = 3;
      skyBrightness = 21.5;
    } else if (type === 'natural' || placeType === 'natural') {
      // Zone naturelle, parc
      bortleValue = 2;
      skyBrightness = 21.9;
    } else {
      // Rural par défaut
      bortleValue = 4;
      skyBrightness = 20.5;
    }
    
    // Ajustement pour banlieues
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
      
      // Estimer le Bortle basé sur le type de lieu
      estimateBortleFromLocation(data);
    } catch (err) {
      setLocation(`${lat.toFixed(2)}, ${lon.toFixed(2)}`);
      // Fallback basique
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
        
        // Estimer le Bortle depuis les données de Nominatim
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
    
    // Impact des nuages (50% du score)
    if (cloudCover > 80) score -= 5;
    else if (cloudCover > 60) score -= 3.5;
    else if (cloudCover > 40) score -= 2;
    else if (cloudCover > 20) score -= 1;
    
    // Impact de la lune (30% du score)
    const moonImpact = (moonIllumination / 100) * 3;
    score -= moonImpact;
    
    // Impact de la pollution lumineuse (20% du score)
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
    <div style={{
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: currentTheme.bg,
      color: currentTheme.text,
      minHeight: '100vh',
      padding: 0,
      lineHeight: 1.6,
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      {/* Theme Toggle */}
      <div style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span style={{ 
          fontSize: '0.9rem', 
          color: currentTheme.textTertiary,
          fontWeight: 500
        }}>
          {theme === 'dark' ? '🌙' : '☀️'}
        </span>
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

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px' }}>
        
        {/* Hero avec montagnes parallaxe et ciel étoilé */}
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
          {/* Étoiles en arrière-plan */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '60%',
            background: `
              radial-gradient(1px 1px at 10% 10%, white, transparent),
              radial-gradient(1px 1px at 20% 30%, white, transparent),
              radial-gradient(2px 2px at 60% 15%, white, transparent),
              radial-gradient(1px 1px at 50% 25%, white, transparent),
              radial-gradient(1px 1px at 80% 5%, white, transparent),
              radial-gradient(2px 2px at 90% 20%, white, transparent),
              radial-gradient(1px 1px at 15% 35%, white, transparent),
              radial-gradient(1px 1px at 70% 30%, white, transparent),
              radial-gradient(1px 1px at 30% 8%, white, transparent),
              radial-gradient(1px 1px at 85% 35%, white, transparent),
              radial-gradient(2px 2px at 40% 18%, white, transparent),
              radial-gradient(1px 1px at 95% 12%, white, transparent),
              radial-gradient(1px 1px at 25% 22%, white, transparent),
              radial-gradient(1px 1px at 55% 8%, white, transparent)
            `,
            opacity: 0.8,
            animation: 'twinkleStars 3s ease-in-out infinite alternate'
          }} />

          {/* Étoiles filantes */}
          <div className="shooting-star" style={{
            position: 'absolute',
            width: '2px',
            height: '2px',
            background: 'white',
            borderRadius: '50%',
            boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.8)',
            animation: 'shootingStar1 3s linear infinite',
            top: '10%',
            left: '-10%'
          }} />
          <div className="shooting-star" style={{
            position: 'absolute',
            width: '2px',
            height: '2px',
            background: 'white',
            borderRadius: '50%',
            boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.8)',
            animation: 'shootingStar2 4s linear infinite',
            animationDelay: '1.5s',
            top: '20%',
            left: '-10%'
          }} />
          <div className="shooting-star" style={{
            position: 'absolute',
            width: '2px',
            height: '2px',
            background: 'white',
            borderRadius: '50%',
            boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.8)',
            animation: 'shootingStar3 3.5s linear infinite',
            animationDelay: '3s',
            top: '15%',
            left: '-10%'
          }} />

          {/* Montagnes - Couche arrière (la plus lointaine) */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '200px',
            background: theme === 'dark'
              ? 'linear-gradient(to bottom, transparent 0%, #1a2332 50%, #16213e 100%)'
              : 'linear-gradient(to bottom, transparent 0%, #2d3e50 50%, #34495e 100%)',
            clipPath: 'polygon(0 100%, 0 60%, 15% 45%, 30% 55%, 45% 40%, 60% 50%, 75% 35%, 90% 45%, 100% 40%, 100% 100%)',
            opacity: 0.3,
            transform: 'translateY(0)',
            transition: 'transform 0.3s ease-out'
          }} className="mountain-far" />

          {/* Montagnes - Couche milieu */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '250px',
            background: theme === 'dark'
              ? 'linear-gradient(to bottom, transparent 0%, #16213e 40%, #0f1624 100%)'
              : 'linear-gradient(to bottom, transparent 0%, #34495e 40%, #2c3e50 100%)',
            clipPath: 'polygon(0 100%, 0 70%, 10% 55%, 25% 65%, 40% 50%, 55% 60%, 70% 45%, 85% 55%, 95% 50%, 100% 55%, 100% 100%)',
            opacity: 0.5,
            transform: 'translateY(0)',
            transition: 'transform 0.3s ease-out'
          }} className="mountain-mid" />

          {/* Montagnes - Couche avant (la plus proche) */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '180px',
            background: theme === 'dark'
              ? 'linear-gradient(to bottom, transparent 0%, #0f1624 30%, #0a0a1a 100%)'
              : 'linear-gradient(to bottom, transparent 0%, #2c3e50 30%, #1a2332 100%)',
            clipPath: 'polygon(0 100%, 0 75%, 12% 65%, 28% 70%, 42% 60%, 58% 65%, 72% 55%, 88% 60%, 100% 65%, 100% 100%)',
            opacity: 0.8,
            transform: 'translateY(0)',
            transition: 'transform 0.3s ease-out'
          }} className="mountain-close" />

          {/* Brume au sol */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '100px',
            background: theme === 'dark'
              ? 'linear-gradient(to top, rgba(10, 10, 26, 0.6), transparent)'
              : 'linear-gradient(to top, rgba(26, 35, 50, 0.6), transparent)',
            opacity: 0.6
          }} />

          {/* Contenu du hero */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '40px',
            paddingBottom: '120px'
          }}>
            <h1 style={{ 
              fontSize: '3rem', 
              marginBottom: '16px', 
              fontWeight: 600, 
              letterSpacing: '-0.02em', 
              color: '#ffffff',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}>
              AstroSpot
            </h1>
            <p style={{ 
              color: '#e5e7eb', 
              fontSize: '1.1rem', 
              marginBottom: '8px',
              textShadow: '0 1px 5px rgba(0,0,0,0.5)'
            }}>
              Conditions d'observation pour l'astrophotographie
            </p>
            <p style={{ 
              color: '#9ca3af', 
              fontSize: '0.85rem',
              textShadow: '0 1px 5px rgba(0,0,0,0.5)'
            }}>
              Trouvez les meilleurs spots d'observation
            </p>
          </div>
        </div>
        
        <style>
          {`
            @keyframes twinkleStars {
              0% { opacity: 0.5; }
              100% { opacity: 1; }
            }
            
            @keyframes shootingStar1 {
              0% {
                transform: translate(0, 0);
                opacity: 1;
              }
              70% {
                opacity: 1;
              }
              100% {
                transform: translate(300px, 200px);
                opacity: 0;
              }
            }
            
            @keyframes shootingStar2 {
              0% {
                transform: translate(0, 0);
                opacity: 1;
              }
              70% {
                opacity: 1;
              }
              100% {
                transform: translate(400px, 250px);
                opacity: 0;
              }
            }
            
            @keyframes shootingStar3 {
              0% {
                transform: translate(0, 0);
                opacity: 1;
              }
              70% {
                opacity: 1;
              }
              100% {
                transform: translate(350px, 220px);
                opacity: 0;
              }
            }
            
            .mountain-far:hover { transform: translateY(2px); }
            .mountain-mid:hover { transform: translateY(5px); }
            .mountain-close:hover { transform: translateY(8px); }
          `}
        </style>

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
              placeholder="Rechercher un lieu ou entrer des coordonnées GPS"
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

        {error && (
          <div style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {location && (
          <div style={{ fontSize: '0.9rem', marginBottom: '40px', color: currentTheme.textTertiary }}>
            {location}
          </div>
        )}

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
                letterSpacing: '-0.04em',
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

            {/* Cartes d'information */}
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
                  borderBottom: `1px solid ${currentTheme.border}`
                }}>
                  <div style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
                    Météo actuelle
                  </div>
                </div>
                <div style={{ fontSize: '0.95rem' }}>
                  <Metric label="Température" value={`${weather.temperature}°C`} theme={theme} />
                  <Metric label="Conditions" value={getWeatherDescription(weather.weatherCode)} theme={theme} />
                  <Metric 
                    label="Couverture nuageuse" 
                    value={`${weather.cloudCover}%`}
                    color={weather.cloudCover < 20 ? '#22c55e' : weather.cloudCover < 60 ? '#eab308' : '#ef4444'}
                    theme={theme}
                  />
                  <Metric label="Humidité" value={`${weather.humidity}%`} theme={theme} />
                  <Metric label="Vent" value={`${weather.windSpeed} km/h ${weather.windDirection}`} theme={theme} />
                  <Metric 
                    label="Seeing" 
                    value={weather.cloudCover < 30 ? 'Excellent' : 'Moyen'}
                    color={weather.cloudCover < 30 ? '#22c55e' : '#eab308'}
                    theme={theme}
                  />
                </div>
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
                  borderBottom: `1px solid ${currentTheme.border}`
                }}>
                  <div style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
                    Phase lunaire
                  </div>
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
                <div style={{ fontSize: '0.95rem', marginTop: '24px' }}>
                  <Metric 
                    label="Impact observation" 
                    value={moonData.illumination < 30 ? 'Minimal' : moonData.illumination < 70 ? 'Modéré' : 'Important'}
                    color={moonData.illumination < 30 ? '#22c55e' : moonData.illumination < 70 ? '#eab308' : '#ef4444'}
                    theme={theme}
                  />
                </div>
              </div>

              {/* Bortle - avec données API */}
              <div style={{
                background: currentTheme.cardBg,
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '6px',
                padding: '28px'
              }}>
                <div style={{
                  marginBottom: '24px',
                  paddingBottom: '20px',
                  borderBottom: `1px solid ${currentTheme.border}`
                }}>
                  <div style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
                    Pollution lumineuse
                  </div>
                </div>
                {loadingBortle ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: currentTheme.textTertiary }}>
                    Chargement...
                  </div>
                ) : bortleData ? (
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
                      <div style={{ fontSize: '0.8rem', color: currentTheme.textMuted, marginTop: '8px' }}>
                        {bortleData.skyBrightness} mag/arcsec²
                      </div>
                    </div>
                    <div style={{ fontSize: '0.95rem', marginTop: '24px' }}>
                      <Metric label="Voie lactée" value={bortleData.conditions.milkyWay} theme={theme} />
                      <Metric label="Nébuleuses" value={bortleData.conditions.nebulae} theme={theme} />
                      <Metric label="Galaxies" value={bortleData.conditions.galaxies} theme={theme} />
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: currentTheme.textTertiary }}>
                    Données non disponibles
                  </div>
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
                  borderBottom: `1px solid ${currentTheme.border}`
                }}>
                  <div style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
                    Horaires solaires
                  </div>
                </div>
                <div style={{ fontSize: '0.95rem' }}>
                  <Metric label="Lever du soleil" value={new Date(weather.sunrise).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} theme={theme} />
                  <Metric label="Coucher du soleil" value={new Date(weather.sunset).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} theme={theme} />
                </div>
              </div>
            </div>

            {/* Prévisions */}
            {forecast.length > 0 && (
              <div style={{
                background: currentTheme.cardBg,
                border: `1px solid ${currentTheme.border}`,
                borderRadius: '6px',
                padding: '32px',
                marginTop: '40px'
              }}>
                <h2 style={{
                  fontSize: '1.2rem',
                  marginBottom: '28px',
                  fontWeight: 600,
                  letterSpacing: '-0.01em'
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
                        <div style={{ fontSize: '1.8rem', fontWeight: 600, margin: '12px 0', letterSpacing: '-0.02em' }}>
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
          <p style={{ margin: '8px 0' }}>Données fournies par Open-Meteo, OpenStreetMap & Light Pollution Map</p>
          <p style={{ margin: '8px 0' }}>Fait pour les astronomes amateurs</p>
        </footer>
      </div>
    </div>
  );
}