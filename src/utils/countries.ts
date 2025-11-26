/**
 * Utils: Countries
 * Liste des pays et codes téléphoniques
 */

export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

export const COUNTRIES: Country[] = [
  // Europe
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'BE', name: 'Belgique', dialCode: '+32', flag: '🇧🇪' },
  { code: 'CH', name: 'Suisse', dialCode: '+41', flag: '🇨🇭' },
  { code: 'LU', name: 'Luxembourg', dialCode: '+352', flag: '🇱🇺' },
  { code: 'DE', name: 'Allemagne', dialCode: '+49', flag: '🇩🇪' },
  { code: 'ES', name: 'Espagne', dialCode: '+34', flag: '🇪🇸' },
  { code: 'IT', name: 'Italie', dialCode: '+39', flag: '🇮🇹' },
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹' },
  { code: 'GB', name: 'Royaume-Uni', dialCode: '+44', flag: '🇬🇧' },
  { code: 'IE', name: 'Irlande', dialCode: '+353', flag: '🇮🇪' },
  { code: 'NL', name: 'Pays-Bas', dialCode: '+31', flag: '🇳🇱' },
  { code: 'AT', name: 'Autriche', dialCode: '+43', flag: '🇦🇹' },
  { code: 'SE', name: 'Suède', dialCode: '+46', flag: '🇸🇪' },
  { code: 'NO', name: 'Norvège', dialCode: '+47', flag: '🇳🇴' },
  { code: 'DK', name: 'Danemark', dialCode: '+45', flag: '🇩🇰' },
  { code: 'FI', name: 'Finlande', dialCode: '+358', flag: '🇫🇮' },
  { code: 'PL', name: 'Pologne', dialCode: '+48', flag: '🇵🇱' },
  { code: 'CZ', name: 'République tchèque', dialCode: '+420', flag: '🇨🇿' },
  { code: 'GR', name: 'Grèce', dialCode: '+30', flag: '🇬🇷' },
  
  // Amérique du Nord
  { code: 'US', name: 'États-Unis', dialCode: '+1', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'MX', name: 'Mexique', dialCode: '+52', flag: '🇲🇽' },
  
  // Afrique francophone
  { code: 'CI', name: 'Côte d\'Ivoire', dialCode: '+225', flag: '🇨🇮' },
  { code: 'SN', name: 'Sénégal', dialCode: '+221', flag: '🇸🇳' },
  { code: 'CM', name: 'Cameroun', dialCode: '+237', flag: '🇨🇲' },
  { code: 'MA', name: 'Maroc', dialCode: '+212', flag: '🇲🇦' },
  { code: 'TN', name: 'Tunisie', dialCode: '+216', flag: '🇹🇳' },
  { code: 'DZ', name: 'Algérie', dialCode: '+213', flag: '🇩🇿' },
  { code: 'BJ', name: 'Bénin', dialCode: '+229', flag: '🇧🇯' },
  { code: 'BF', name: 'Burkina Faso', dialCode: '+226', flag: '🇧🇫' },
  { code: 'ML', name: 'Mali', dialCode: '+223', flag: '🇲🇱' },
  { code: 'NE', name: 'Niger', dialCode: '+227', flag: '🇳🇪' },
  { code: 'TG', name: 'Togo', dialCode: '+228', flag: '🇹🇬' },
  { code: 'GA', name: 'Gabon', dialCode: '+241', flag: '🇬🇦' },
  { code: 'CG', name: 'Congo-Brazzaville', dialCode: '+242', flag: '🇨🇬' },
  { code: 'CD', name: 'Congo-Kinshasa (RDC)', dialCode: '+243', flag: '🇨🇩' },
  { code: 'MG', name: 'Madagascar', dialCode: '+261', flag: '🇲🇬' },
  
  // Asie
  { code: 'CN', name: 'Chine', dialCode: '+86', flag: '🇨🇳' },
  { code: 'JP', name: 'Japon', dialCode: '+81', flag: '🇯🇵' },
  { code: 'IN', name: 'Inde', dialCode: '+91', flag: '🇮🇳' },
  { code: 'KR', name: 'Corée du Sud', dialCode: '+82', flag: '🇰🇷' },
  { code: 'SG', name: 'Singapour', dialCode: '+65', flag: '🇸🇬' },
  { code: 'TH', name: 'Thaïlande', dialCode: '+66', flag: '🇹🇭' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳' },
  { code: 'AE', name: 'Émirats Arabes Unis', dialCode: '+971', flag: '🇦🇪' },
  
  // Amérique du Sud
  { code: 'BR', name: 'Brésil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'AR', name: 'Argentine', dialCode: '+54', flag: '🇦🇷' },
  { code: 'CL', name: 'Chili', dialCode: '+56', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombie', dialCode: '+57', flag: '🇨🇴' },
  
  // Océanie
  { code: 'AU', name: 'Australie', dialCode: '+61', flag: '🇦🇺' },
  { code: 'NZ', name: 'Nouvelle-Zélande', dialCode: '+64', flag: '🇳🇿' },
];

/**
 * Détecter le pays de l'utilisateur via géolocalisation IP
 */
export const detectUserCountry = async (): Promise<string> => {
  try {
    // Utiliser une API de géolocalisation gratuite
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    if (data && data.country_code) {
      return data.country_code;
    }
  } catch (error) {
    console.log('Détection pays échouée, utilisation pays par défaut');
  }
  
  // Par défaut : France
  return 'FR';
};

/**
 * Obtenir le code téléphonique depuis le code pays
 */
export const getDialCodeFromCountryCode = (countryCode: string): string => {
  const country = COUNTRIES.find(c => c.code === countryCode);
  return country?.dialCode || '+33';
};

/**
 * Rechercher pays par nom ou code
 */
export const searchCountries = (query: string): Country[] => {
  const lowerQuery = query.toLowerCase();
  return COUNTRIES.filter(
    country =>
      country.name.toLowerCase().includes(lowerQuery) ||
      country.code.toLowerCase().includes(lowerQuery) ||
      country.dialCode.includes(query)
  );
};
