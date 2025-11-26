import { z } from 'zod';

/**
 * Schéma de validation Zod pour les services
 * Utilisé avec React Hook Form
 */

export const serviceSchema = z.object({
  icon: z
    .string()
    .min(1, 'L\'icône est requise')
    .refine(
      (value) => {
        // Vérifier que c'est un nom d'icône valide (Lucide React)
        // Format attendu: minuscules, chiffres, tirets
        return /^[a-z0-9-]+$/.test(value);
      },
      {
        message: 'L\'icône doit être un nom valide (minuscules, chiffres, tirets)',
      }
    ),
  
  title: z
    .string()
    .min(1, 'Le titre est requis')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères')
    .trim(),
  
  description: z
    .string()
    .min(1, 'La description est requise')
    .max(500, 'La description ne peut pas dépasser 500 caractères')
    .trim(),
  
  features: z
    .array(z.string().min(1, 'La fonctionnalité ne peut pas être vide'))
    .min(1, 'Au moins une fonctionnalité est requise')
    .max(10, 'Maximum 10 fonctionnalités'),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;
