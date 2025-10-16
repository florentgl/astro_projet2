// Remplacez la fonction CelestialPage dans votre App.jsx par ce code :

import { MapPin, Calendar, Eye } from 'lucide-react';
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
      
      {/* Hero */}
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
            radial-gradient(1px 1px at 50% 50%, white, transparent),
            radial-gradient(1px 1px at 80% 10%, white, transparent),
            radial-gradient(1px 1px at 90% 60%, white, transparent)
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

      {/* Info localisation et saison */}
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

      {/* Planètes visibles */}
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

      {/* Objets du ciel profond */}
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