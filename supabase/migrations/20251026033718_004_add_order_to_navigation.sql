/*
  # Ajouter un ordre aux éléments de navigation

  1. Modifications
    - Ajoute une colonne `order` à la table `navigation` pour contrôler l'ordre d'affichage
    - Met à jour les enregistrements existants avec le bon ordre
    
  2. Ordre souhaité
    - 1. Accueil
    - 2. À propos
    - 3. Services
    - 4. Secteurs
    - 5. Projets
    - 6. Blog
    - 7. Contact
*/

-- Ajouter la colonne order
ALTER TABLE navigation ADD COLUMN IF NOT EXISTS "order" INTEGER DEFAULT 0;

-- Mettre à jour l'ordre des éléments existants
UPDATE navigation SET "order" = 1 WHERE id = 'home';
UPDATE navigation SET "order" = 2 WHERE id = 'about';
UPDATE navigation SET "order" = 3 WHERE id = 'services';
UPDATE navigation SET "order" = 4 WHERE id = 'sectors';
UPDATE navigation SET "order" = 5 WHERE id = 'portfolio';
UPDATE navigation SET "order" = 6 WHERE id = 'blog';
UPDATE navigation SET "order" = 7 WHERE id = 'contact';
