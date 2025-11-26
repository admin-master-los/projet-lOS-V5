import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceSchema, ServiceFormData } from '../../utils/serviceValidation';
import { availableIcons } from '../../utils/availableIcons';
import Input from '../common/Input';
import Button from '../common/Button';
import { Briefcase, Plus, Trash2, Search } from 'lucide-react';
import * as Icons from 'lucide-react';

/**
 * Composant formulaire pour créer/modifier un service
 */

interface ServiceFormProps {
  initialData?: Partial<ServiceFormData>;
  onSubmit: (data: ServiceFormData) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = 'Enregistrer',
}) => {
  const [iconSearch, setIconSearch] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: initialData || {
      icon: '',
      title: '',
      description: '',
      features: [''],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'features',
  });

  const selectedIcon = watch('icon');

  const filteredIcons = availableIcons.filter((icon) =>
    icon.label.toLowerCase().includes(iconSearch.toLowerCase()) ||
    icon.value.toLowerCase().includes(iconSearch.toLowerCase())
  );

  const getIconComponent = (iconName: string) => {
    const iconKey = iconName
      .split('-')
      .map((word, index) =>
        index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join('');
    
    return (Icons as any)[iconKey];
  };

  const SelectedIconComponent = selectedIcon ? getIconComponent(selectedIcon) : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Sélecteur d'icône */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Icône <span className="text-red-400">*</span>
        </label>
        
        {selectedIcon && SelectedIconComponent && (
          <div className="mb-3 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg flex items-center gap-3">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <SelectedIconComponent size={24} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-white font-medium">
                {availableIcons.find((i) => i.value === selectedIcon)?.label}
              </p>
              <p className="text-sm text-gray-500">{selectedIcon}</p>
            </div>
          </div>
        )}

        <div className="mb-3">
          <Input
            type="text"
            placeholder="Rechercher une icône..."
            icon={<Search size={20} />}
            value={iconSearch}
            onChange={(e) => setIconSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-64 overflow-y-auto p-2 bg-white/5 rounded-lg border border-gray-700/50">
          {filteredIcons.map((icon) => {
            const IconComponent = getIconComponent(icon.value);
            if (!IconComponent) return null;

            return (
              <button
                key={icon.value}
                type="button"
                onClick={() => setValue('icon', icon.value)}
                className={`p-3 rounded-lg border transition-all ${
                  selectedIcon === icon.value
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                    : 'bg-white/5 border-gray-700/50 text-gray-400 hover:bg-white/10'
                }`}
                title={icon.label}
              >
                <IconComponent size={24} className="mx-auto" />
              </button>
            );
          })}
        </div>

        {errors.icon && (
          <p className="text-red-400 text-sm mt-2">{errors.icon.message}</p>
        )}
      </div>

      {/* Titre */}
      <Input
        label="Titre"
        placeholder="Développement Web"
        icon={<Briefcase size={20} />}
        error={errors.title?.message}
        {...register('title')}
        required
      />

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          {...register('description')}
          rows={4}
          className="w-full px-4 py-3 bg-white/5 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          placeholder="Description détaillée du service..."
        />
        {errors.description && (
          <p className="text-red-400 text-sm mt-2">{errors.description.message}</p>
        )}
      </div>

      {/* Features */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Fonctionnalités <span className="text-red-400">*</span>
        </label>
        
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <input
                {...register(`features.${index}` as const)}
                placeholder={`Fonctionnalité ${index + 1}`}
                className="flex-1 px-4 py-3 bg-white/5 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
              />
              
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => remove(index)}
                  icon={<Trash2 size={16} />}
                />
              )}
            </div>
          ))}
        </div>

        {fields.length < 10 && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => append('')}
            icon={<Plus size={16} />}
            className="mt-3"
          >
            Ajouter
          </Button>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        isLoading={isLoading}
        disabled={isLoading}
        fullWidth
      >
        {submitLabel}
      </Button>
    </form>
  );
};

export default ServiceForm;
