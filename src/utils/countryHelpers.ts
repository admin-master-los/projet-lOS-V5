/**
 * Utils: Country Helpers
 * Gestion codes pays et géolocalisation
 */

export interface CountryOption {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

export const COUNTRIES: CountryOption[] = [
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33' },
  { code: 'BE', name: 'Belgique', flag: '🇧🇪', dialCode: '+32' },
  { code: 'CH', name: 'Suisse', flag: '🇨🇭', dialCode: '+41' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1' },
  { code: 'US', name: 'États-Unis', flag: '🇺🇸', dialCode: '+1' },
  { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧', dialCode: '+44' },
  { code: 'DE', name: 'Allemagne', flag: '🇩🇪', dialCode: '+49' },
  { code: 'ES', name: 'Espagne', flag: '🇪🇸', dialCode: '+34' },
  { code: 'IT', name: 'Italie', flag: '🇮🇹', dialCode: '+39' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', dialCode: '+351' },
  { code: 'NL', name: 'Pays-Bas', flag: '🇳🇱', dialCode: '+31' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', dialCode: '+352' },
  { code: 'MA', name: 'Maroc', flag: '🇲🇦', dialCode: '+212' },
  { code: 'DZ', name: 'Algérie', flag: '🇩🇿', dialCode: '+213' },
  { code: 'TN', name: 'Tunisie', flag: '🇹🇳', dialCode: '+216' },
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳', dialCode: '+221' },
  { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮', dialCode: '+225' },
  { code: 'CM', name: 'Cameroun', flag: '🇨🇲', dialCode: '+237' },
  { code: 'CG', name: 'Congo', flag: '🇨🇬', dialCode: '+242' },
  { code: 'CD', name: 'RD Congo', flag: '🇨🇩', dialCode: '+243' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦', dialCode: '+241' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', dialCode: '+226' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱', dialCode: '+223' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪', dialCode: '+227' },
  { code: 'TD', name: 'Tchad', flag: '🇹🇩', dialCode: '+235' },
  { code: 'BJ', name: 'Bénin', flag: '🇧🇯', dialCode: '+229' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬', dialCode: '+228' },
  { code: 'GN', name: 'Guinée', flag: '🇬🇳', dialCode: '+224' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬', dialCode: '+261' },
  { code: 'RE', name: 'La Réunion', flag: '🇷🇪', dialCode: '+262' },
  { code: 'MU', name: 'Maurice', flag: '🇲🇺', dialCode: '+230' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨', dialCode: '+248' },
  { code: 'HT', name: 'Haïti', flag: '🇭🇹', dialCode: '+509' },
  { code: 'GF', name: 'Guyane', flag: '🇬🇫', dialCode: '+594' },
  { code: 'GP', name: 'Guadeloupe', flag: '🇬🇵', dialCode: '+590' },
  { code: 'MQ', name: 'Martinique', flag: '🇲🇶', dialCode: '+596' },
  { code: 'NC', name: 'Nouvelle-Calédonie', flag: '🇳🇨', dialCode: '+687' },
  { code: 'PF', name: 'Polynésie française', flag: '🇵🇫', dialCode: '+689' },
];

/**
 * Obtenir le pays par code ISO
 */
export const getCountryByCode = (code: string): CountryOption | undefined => {
  return COUNTRIES.find((c) => c.code === code);
};

/**
 * Obtenir le pays par dial code
 */
export const getCountryByDialCode = (dialCode: string): CountryOption | undefined => {
  return COUNTRIES.find((c) => c.dialCode === dialCode);
};

/**
 * Détecter le pays de l'utilisateur via géolocalisation IP
 */
export const detectUserCountry = async (): Promise<CountryOption> => {
  try {
    // API gratuite pour détecter le pays via IP
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    if (data.country_code) {
      const country = getCountryByCode(data.country_code);
      if (country) {
        return country;
      }
    }
  } catch (error) {
    console.warn('Impossible de détecter le pays:', error);
  }
  
  // Pays par défaut : France
  return COUNTRIES[0];
};

/**
 * Détecter via Geolocation API (moins précis, mais sans API externe)
 */
export const detectUserCountryByGeo = async (): Promise<CountryOption> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(COUNTRIES[0]); // France par défaut
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Utiliser une API de reverse geocoding
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=fr`
          );
          const data = await response.json();
          
          if (data.countryCode) {
            const country = getCountryByCode(data.countryCode);
            if (country) {
              resolve(country);
              return;
            }
          }
        } catch (error) {
          console.warn('Erreur géolocalisation:', error);
        }
        resolve(COUNTRIES[0]); // France par défaut
      },
      () => {
        resolve(COUNTRIES[0]); // France par défaut
      },
      { timeout: 5000 }
    );
  });
};

/**
 * Formater le numéro de téléphone
 */
export const formatPhoneNumber = (phone: string, countryCode: string): string => {
  // Retirer espaces, tirets, etc.
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Retirer le 0 initial si présent (France)
  if (cleaned.startsWith('0') && countryCode === '+33') {
    return cleaned.substring(1);
  }
  
  return cleaned;
};
