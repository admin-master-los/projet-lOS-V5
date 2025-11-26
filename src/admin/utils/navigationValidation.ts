import { z } from 'zod';

/**
 * Schéma de validation Zod pour les items de navigation
 * Utilisé avec React Hook Form
 */

export const navigationSchema = z.object({
  label: z
    .string()
    .min(1, 'Le libellé est requis')
    .max(50, 'Le libellé ne peut pas dépasser 50 caractères')
    .trim(),
  
  href: z
    .string()
    .min(1, 'Le lien est requis')
    .refine(
      (value) => {
        // Accepter les liens relatifs (/about, /contact)
        // Accepter les liens absolus (https://)
        // Accepter les ancres (#section, /#section)
        return value.startsWith('/') || 
               value.startsWith('http://') || 
               value.startsWith('https://') ||
               value.startsWith('#');
      },
      {
        message: 'Le lien doit commencer par "/", "#" (ancre) ou "http(s)://" (absolu)',
      }
    ),
  
  order: z
    .number()
    .int('L\'ordre doit être un nombre entier')
    .min(0, 'L\'ordre doit être positif')
    .optional(),
  
  is_external: z
    .boolean()
    .optional()
    .default(false),
});

export type NavigationFormData = z.infer<typeof navigationSchema>;
