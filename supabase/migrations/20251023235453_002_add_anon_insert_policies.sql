/*
  # Migration temporaire - Politiques d'insertion pour seed

  ## Description
  Cette migration ajoute temporairement des politiques permettant aux utilisateurs
  anonymes d'insérer des données. Cela est nécessaire pour le seed initial de la base.
  
  ## Note de sécurité
  Ces politiques devront être révoquées après le seed initial en production.
  Pour le développement et le portfolio public, ces politiques peuvent rester actives.
  
  ## Politiques ajoutées
  - Insertion anonyme sur toutes les tables pour permettre le seed
*/

-- Politiques d'insertion pour anon (nécessaires pour le seed)
CREATE POLICY "Anon can insert navigation for seeding"
  ON navigation FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can insert services for seeding"
  ON services FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can insert sectors for seeding"
  ON sectors FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can insert projects for seeding"
  ON projects FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can insert blog_posts for seeding"
  ON blog_posts FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can insert chatbot_knowledge for seeding"
  ON chatbot_knowledge FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can insert skills for seeding"
  ON skills FOR INSERT
  TO anon
  WITH CHECK (true);

-- Politiques de mise à jour pour anon (pour upsert)
CREATE POLICY "Anon can update navigation for seeding"
  ON navigation FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon can update services for seeding"
  ON services FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon can update sectors for seeding"
  ON sectors FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon can update projects for seeding"
  ON projects FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon can update blog_posts for seeding"
  ON blog_posts FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon can update chatbot_knowledge for seeding"
  ON chatbot_knowledge FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon can update skills for seeding"
  ON skills FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
