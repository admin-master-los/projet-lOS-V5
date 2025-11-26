import React from 'react';

const BackgroundAnimation: React.FC = () => {
  // Langages et technologies complètes
  const technologies = [
    // Frontend
    'HTML5',
    'CSS3',
    'JavaScript',
    'TypeScript',
    'React',
    'Vue.js',
    'Angular',
    'Svelte',
    'Next.js',
    'Nuxt.js',
    'Gatsby',
    'Vite',
    'Webpack',
    'Tailwind',
    'SASS',
    'Bootstrap',

    // Backend
    'Node.js',
    'Express',
    'Python',
    'Django',
    'Flask',
    'PHP',
    'Laravel',
    'Symfony',
    'Java',
    'Spring',
    'C#',
    '.NET',
    'Ruby',
    'Rails',
    'Go',
    'Rust',

    // Bases de données
    'MySQL',
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'Firebase',
    'Supabase',
    'GraphQL',
    'Prisma',
    'Sequelize',
    'TypeORM',
    'SQLite',
    'MariaDB',

    // Cloud & DevOps
    'AWS',
    'Azure',
    'GCP',
    'Docker',
    'Kubernetes',
    'Jenkins',
    'GitLab',
    'GitHub',
    'Vercel',
    'Netlify',
    'Heroku',
    'DigitalOcean',
    'Terraform',
    'Ansible',

    // Mobile & Desktop
    'React Native',
    'Flutter',
    'Ionic',
    'Electron',
    'Tauri',
    'Swift',
    'Kotlin',

    // Outils & Autres
    'Git',
    'VSCode',
    'Figma',
    'Postman',
    'Jest',
    'Cypress',
    'Storybook',
    'ESLint',
  ];

  // Générer des étoiles aléatoirement
  const generateStars = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      animationDelay: Math.random() * 4,
      animationDuration: Math.random() * 3 + 2,
    }));
  };

  const stars = generateStars(150);
  const nebulaClouds = generateStars(8);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient espace profond */}
      <div className="absolute inset-0 bg-gradient-radial from-gray-900 via-[#0A0A0B] to-black">
        {/* Nébuleuses colorées animées */}
        <div className="absolute inset-0">
          {nebulaClouds.map((cloud) => (
            <div
              key={`nebula-${cloud.id}`}
              className="absolute rounded-full blur-3xl animate-pulse"
              style={{
                left: `${cloud.x}%`,
                top: `${cloud.y}%`,
                width: `${200 + cloud.size * 100}px`,
                height: `${200 + cloud.size * 100}px`,
                background:
                  cloud.id % 2 === 0
                    ? 'radial-gradient(circle, rgba(0, 245, 255, 0.1) 0%, rgba(0, 245, 255, 0.05) 50%, transparent 100%)'
                    : 'radial-gradient(circle, rgba(157, 78, 221, 0.1) 0%, rgba(157, 78, 221, 0.05) 50%, transparent 100%)',
                animationDelay: `${cloud.animationDelay}s`,
                animationDuration: `${cloud.animationDuration + 8}s`,
              }}
            />
          ))}
        </div>

        {/* Gradient overlay dynamique */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent via-transparent to-purple-500/5 animate-pulse"
          style={{ animationDuration: '8s' }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-tl from-purple-500/3 via-transparent to-cyan-500/3 animate-pulse"
          style={{ animationDuration: '12s', animationDelay: '4s' }}
        />
      </div>

      {/* Champ d'étoiles multicouches */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <div
            key={`star-${star.id}`}
            className="absolute rounded-full animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor:
                star.size > 2
                  ? star.id % 3 === 0
                    ? '#00F5FF'
                    : star.id % 3 === 1
                    ? '#9D4EDD'
                    : '#FFFFFF'
                  : '#FFFFFF',
              opacity: star.opacity,
              animationDelay: `${star.animationDelay}s`,
              animationDuration: `${star.animationDuration}s`,
              boxShadow:
                star.size > 2 ? `0 0 ${star.size * 2}px currentColor` : 'none',
            }}
          />
        ))}
      </div>

      {/* Technologies flottantes avec trajectoires complexes */}
      <div className="absolute inset-0">
        {technologies.map((tech, index) => {
          const isSpecial = [
            'React',
            'TypeScript',
            'Node.js',
            'Python',
            'AWS',
            'Docker',
          ].includes(tech);
          const layer = index % 3; // 3 couches de profondeur

          return (
            <div
              key={tech}
              className={`absolute select-none font-mono font-medium transition-all duration-300 hover:scale-110 hover:text-cyan-300 ${
                isSpecial ? 'text-cyan-400 text-sm' : 'text-gray-500 text-xs'
              }`}
              style={{
                left: `${(index * 7) % 100}%`,
                top: `${(index * 11) % 100}%`,
                opacity: layer === 0 ? 0.6 : layer === 1 ? 0.4 : 0.2,
                zIndex: 3 - layer,
                animationDelay: `${index * 0.3}s`,
                animation: `
                  floatTech${layer} ${15 + (index % 10)}s infinite ease-in-out,
                  fadeInOut ${8 + (index % 5)}s infinite ease-in-out ${
                  index * 0.5
                }s
                `,
                transform: `scale(${1 + layer * 0.2})`,
                filter: layer > 0 ? `blur(${layer * 0.5}px)` : 'none',
              }}
            >
              {tech}
            </div>
          );
        })}
      </div>

      {/* Particules d'énergie flottantes */}
      {[...Array(20)].map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full animate-ping"
          style={{
            left: `${(i * 13) % 100}%`,
            top: `${(i * 17) % 100}%`,
            backgroundColor: i % 2 === 0 ? '#00F5FF' : '#9D4EDD',
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${3 + (i % 4)}s`,
          }}
        />
      ))}

      {/* Formes géométriques orbitales */}
      {[...Array(6)].map((_, i) => (
        <div
          key={`geo-${i}`}
          className="absolute border opacity-10 hover:opacity-20 transition-opacity duration-500"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + i * 12}%`,
            width: `${80 + i * 20}px`,
            height: `${80 + i * 20}px`,
            borderColor: i % 2 === 0 ? '#00F5FF' : '#9D4EDD',
            borderWidth: '1px',
            borderRadius: i % 3 === 0 ? '50%' : '0%',
            transform: 'rotate(45deg)',
            animation: `
              ${i % 2 === 0 ? 'spin' : 'reverse-spin'} ${
              20 + i * 5
            }s linear infinite,
              pulse ${4 + i}s ease-in-out infinite
            `,
            animationDelay: `${i * 2}s`,
          }}
        />
      ))}

      {/* Rayons lumineux traversants */}
      {[...Array(4)].map((_, i) => (
        <div
          key={`ray-${i}`}
          className="absolute opacity-20"
          style={{
            left: `${i * 25}%`,
            top: '-10%',
            width: '2px',
            height: '120%',
            background: `linear-gradient(to bottom, 
              transparent 0%, 
              ${i % 2 === 0 ? '#00F5FF' : '#9D4EDD'} 30%, 
              ${i % 2 === 0 ? '#00F5FF' : '#9D4EDD'} 70%, 
              transparent 100%
            )`,
            transform: `rotate(${15 + i * 10}deg)`,
            animation: `slideRay ${8 + i * 2}s ease-in-out infinite`,
            animationDelay: `${i * 3}s`,
          }}
        />
      ))}

      {/* Constellation connectée */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        style={{ zIndex: 1 }}
      >
        <defs>
          <linearGradient
            id="constellation"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#9D4EDD" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00F5FF" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Lignes de constellation */}
        <path
          d="M 100 200 Q 300 100 500 200 T 900 200"
          stroke="url(#constellation)"
          strokeWidth="1"
          fill="none"
          className="animate-pulse"
          style={{ animationDuration: '4s' }}
        />
        <path
          d="M 200 400 Q 400 300 600 400 T 1000 400"
          stroke="url(#constellation)"
          strokeWidth="1"
          fill="none"
          className="animate-pulse"
          style={{ animationDuration: '6s', animationDelay: '2s' }}
        />
        <path
          d="M 150 600 Q 350 500 550 600 T 950 600"
          stroke="url(#constellation)"
          strokeWidth="1"
          fill="none"
          className="animate-pulse"
          style={{ animationDuration: '5s', animationDelay: '1s' }}
        />
      </svg>
    </div>
  );
};

export default BackgroundAnimation;
