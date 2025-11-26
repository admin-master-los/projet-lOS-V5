import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { navigationSchema, NavigationFormData } from '../../utils/navigationValidation';
import Input from '../common/Input';
import Button from '../common/Button';
import { Link, ExternalLink } from 'lucide-react';

/**
 * Composant formulaire pour créer/modifier un item de navigation
 * Utilise React Hook Form + Zod pour la validation
 */

interface NavigationFormProps {
  initialData?: NavigationFormData;
  onSubmit: (data: NavigationFormData) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

const NavigationForm: React.FC<NavigationFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = 'Enregistrer',
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NavigationFormData>({
    resolver: zodResolver(navigationSchema),
    defaultValues: initialData || {
      label: '',
      href: '',
      order: 0,
      is_external: false,
    },
  });

  const isExternal = watch('is_external');
  const href = watch('href');

  // Déterminer automatiquement si le lien est externe
  React.useEffect(() => {
    const isExternalLink = href?.startsWith('http://') || href?.startsWith('https://');
    // Note: on ne peut pas modifier directement avec setValue ici car ça causerait une boucle
    // L'utilisateur peut ajuster manuellement la checkbox si nécessaire
  }, [href]);

  const handleFormSubmit = async (data: NavigationFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Label */}
      <Input
        label="Libellé"
        placeholder="Accueil, À propos, Services..."
        icon={<Link size={20} />}
        error={errors.label?.message}
        {...register('label')}
        required
      />

      {/* Href */}
      <Input
        label="Lien (URL)"
        placeholder="/about, #contact, https://example.com"
        icon={<ExternalLink size={20} />}
        error={errors.href?.message}
        helperText="Lien relatif (/), ancre (#) ou absolu (http(s)://)"
        {...register('href')}
        required
      />

      {/* Order */}
      <Input
        label="Ordre d'affichage"
        type="number"
        placeholder="0"
        error={errors.order?.message}
        helperText="Plus le nombre est petit, plus l'élément apparaît en premier"
        {...register('order', { valueAsNumber: true })}
      />

      {/* Is External Checkbox */}
      <div className="flex items-start gap-3">
        <input
          id="is_external"
          type="checkbox"
          {...register('is_external')}
          className="mt-1 w-4 h-4 bg-white/5 border border-gray-600 rounded text-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-0"
        />
        <div className="flex-1">
          <label htmlFor="is_external" className="text-sm font-medium text-gray-300 cursor-pointer">
            Lien externe
          </label>
          <p className="text-xs text-gray-500 mt-0.5">
            Ouvre le lien dans un nouvel onglet (target="_blank")
          </p>
        </div>
      </div>

      {/* Preview */}
      {href && (
        <div className="bg-blue-500/10 border border-blue-500/50 rounded-xl p-4">
          <p className="text-sm text-blue-400 font-medium mb-2">Aperçu :</p>
          <div className="flex items-center gap-2 text-gray-300">
            {isExternal ? (
              <ExternalLink size={16} className="text-cyan-400" />
            ) : (
              <Link size={16} className="text-cyan-400" />
            )}
            <span className="font-mono text-sm">{href}</span>
            {isExternal && (
              <span className="text-xs text-gray-500">(nouvel onglet)</span>
            )}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading}
          fullWidth
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default NavigationForm;
