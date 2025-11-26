import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import {
  navigation,
  services,
  sectors,
  projects,
  blogPosts,
  chatbotKnowledgeBase,
  skills,
} from '../src/data/index';

config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement manquantes !');
  console.error('Assurez-vous que VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont définis dans .env');
  process.exit(1);
}

// ✨ Afficher les variables pour debug (masquer partiellement la clé)
console.log('🔍 Configuration Supabase:');
console.log(`   URL: ${supabaseUrl}`);
console.log(`   Key: ${supabaseKey.substring(0, 20)}...${supabaseKey.substring(supabaseKey.length - 4)}\n`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedData() {
  console.log('🚀 Démarrage du seed de la base de données...\n');

  try {
    console.log('📊 Insertion de navigation...');
    const { error: navError } = await supabase
      .from('navigation')
      .upsert(navigation, { onConflict: 'id' });

    if (navError) throw navError;
    console.log(`✅ ${navigation.length} éléments de navigation insérés\n`);

    console.log('🛠️ Insertion des services...');
    const { error: servicesError } = await supabase
      .from('services')
      .upsert(services, { onConflict: 'id' });

    if (servicesError) throw servicesError;
    console.log(`✅ ${services.length} services insérés\n`);

    console.log('🏢 Insertion des secteurs...');
    const sectorsData = sectors.map(sector => ({
      id: sector.id,
      title: sector.title,
      description: sector.description,
      services: sector.services,
      icon: sector.icon,
    }));

    const { error: sectorsError } = await supabase
      .from('sectors')
      .upsert(sectorsData, { onConflict: 'id' });

    if (sectorsError) throw sectorsError;
    console.log(`✅ ${sectorsData.length} secteurs insérés\n`);

    console.log('💼 Insertion des projets...');
    const projectsData = projects.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      image: project.image,
      tech: project.tech,
      results: project.results,
      link: project.link,
      content_project_modal: (project as any).content_project_modal || null,
    }));

    const { error: projectsError } = await supabase
      .from('projects')
      .upsert(projectsData, { onConflict: 'id' });

    if (projectsError) throw projectsError;
    console.log(`✅ ${projectsData.length} projets insérés\n`);

    console.log('📝 Insertion des articles de blog...');
    const blogPostsData = blogPosts.map(post => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      date: post.date,
      read_time: post.readTime,
      image: post.image,
      content_blog: (post as any).content_blog || '',
    }));

    const { error: blogError } = await supabase
      .from('blog_posts')
      .upsert(blogPostsData, { onConflict: 'id' });

    if (blogError) throw blogError;
    console.log(`✅ ${blogPostsData.length} articles de blog insérés\n`);

    console.log('🤖 Insertion de la base de connaissance chatbot...');
    const { error: chatbotError } = await supabase
      .from('chatbot_knowledge')
      .upsert(chatbotKnowledgeBase, { onConflict: 'id' });

    if (chatbotError) throw chatbotError;
    console.log(`✅ ${chatbotKnowledgeBase.length} éléments de connaissance insérés\n`);

    console.log('🎯 Insertion des compétences...');
    const skillsData = skills.map(skill => ({ name: skill }));

    const { error: skillsError } = await supabase
      .from('skills')
      .upsert(skillsData, { onConflict: 'name', ignoreDuplicates: true });

    if (skillsError) throw skillsError;
    console.log(`✅ ${skillsData.length} compétences insérées\n`);

    // ✨ NOUVEAU : Vérification de la table contact
    console.log('📧 Vérification de la table contact...');
    const { count: contactCount, error: contactCheckError } = await supabase
      .from('contact')
      .select('*', { count: 'exact', head: true });

    if (contactCheckError) {
      console.warn('⚠️  La table contact n\'existe pas encore ou n\'est pas accessible.');
      console.warn('   Exécutez le script SQL de création de la table contact avant de continuer.');
      console.warn('   Les données de test pour la table contact seront ignorées.\n');
    } else {
      console.log(`✅ Table contact vérifiée (${contactCount || 0} entrées existantes)\n`);
      
      // ✨ OPTIONNEL : Insérer une demande de contact de test
      console.log('📧 Insertion d\'une demande de contact de test (optionnel)...');
      const testContact = {
        name: 'Jean Dupont',
        email: 'jean.dupont@example.com',
        company: 'ACME Corporation',
        budget: '15K€ - 30K€',
        project: 'Nous souhaitons développer une plateforme e-commerce B2B avec gestion des stocks, multi-devises et intégration ERP. Le projet doit être livré dans un délai de 6 mois.',
        rgpd_consent: true,
        status: 'pending',
      };

      const { error: testContactError } = await supabase
        .from('contact')
        .upsert([testContact], { onConflict: 'email' });

      if (testContactError) {
        console.warn('⚠️  Impossible d\'insérer la demande de contact de test:', testContactError.message);
      } else {
        console.log('✅ Demande de contact de test insérée\n');
      }
    }

    console.log('🎉 Seed terminé avec succès !');
    console.log('\n📊 Résumé :');
    console.log(`   - Navigation: ${navigation.length} éléments`);
    console.log(`   - Services: ${services.length} éléments`);
    console.log(`   - Secteurs: ${sectorsData.length} éléments`);
    console.log(`   - Projets: ${projectsData.length} éléments`);
    console.log(`   - Articles: ${blogPostsData.length} éléments`);
    console.log(`   - Chatbot KB: ${chatbotKnowledgeBase.length} éléments`);
    console.log(`   - Compétences: ${skillsData.length} éléments`);
    console.log(`   - Contact: Table vérifiée ${contactCheckError ? '(non disponible)' : '✓'}`);

  } catch (error) {
    console.error('❌ Erreur lors du seed :', error);
    process.exit(1);
  }
}

// ✨ NOUVEAU : Fonction pour vérifier la structure de la table contact
async function verifyContactTable() {
  console.log('\n🔍 Vérification de la structure de la table contact...\n');

  try {
    const { data, error } = await supabase
      .from('contact')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ La table contact n\'existe pas ou n\'est pas accessible.');
      console.error('   Exécutez d\'abord le script SQL de création :');
      console.error('   psql -h <host> -U <user> -d <database> -f create_contact_table.sql\n');
      return false;
    }

    console.log('✅ Structure de la table contact vérifiée avec succès !');
    console.log('   Colonnes attendues :');
    console.log('   - id (UUID)');
    console.log('   - name (VARCHAR)');
    console.log('   - email (VARCHAR)');
    console.log('   - company (VARCHAR)');
    console.log('   - budget (VARCHAR)');
    console.log('   - project (TEXT)');
    console.log('   - rgpd_consent (BOOLEAN)');
    console.log('   - created_at (TIMESTAMP)');
    console.log('   - updated_at (TIMESTAMP)');
    console.log('   - status (VARCHAR)');
    console.log('   - admin_notes (TEXT)');
    console.log('   - ip_address (INET)');
    console.log('   - user_agent (TEXT)\n');

    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la vérification :', error);
    return false;
  }
}

// ✨ NOUVEAU : Fonction pour nettoyer les données de test de la table contact
async function cleanTestContacts() {
  console.log('\n🧹 Nettoyage des données de test de la table contact...\n');

  try {
    // Test de connexion d'abord
    const { data: testConnection, error: connectionError } = await supabase
      .from('contact')
      .select('count', { count: 'exact', head: true });

    if (connectionError) {
      console.error('❌ Erreur de connexion à Supabase:', connectionError.message);
      console.error('   Détails:', connectionError);
      console.error('\n💡 Vérifiez que:');
      console.error('   1. Votre fichier .env contient les bonnes variables');
      console.error('   2. La table "contact" existe dans votre base Supabase');
      console.error('   3. Vous avez une connexion internet active');
      console.error('   4. L\'URL et la clé Supabase sont valides');
      console.error('\n⚠️  Note: Si vous êtes sur StackBlitz, cette erreur est normale.');
      console.error('   Les appels réseau externes peuvent être bloqués.\n');
      return;
    }

    console.log('✅ Connexion à Supabase réussie\n');

    const { error } = await supabase
      .from('contact')
      .delete()
      .eq('email', 'jean.dupont@example.com');

    if (error) {
      console.warn('⚠️  Impossible de nettoyer les données de test:', error.message);
      console.warn('   Détails:', error);
    } else {
      console.log('✅ Données de test nettoyées avec succès\n');
    }
  } catch (error) {
    console.error('❌ Erreur inattendue lors du nettoyage :', error);
    console.error('\n💡 Solutions possibles:');
    console.error('   1. Vérifiez votre connexion internet');
    console.error('   2. Vérifiez que Supabase est accessible');
    console.error('   3. Exécutez: npm install @supabase/supabase-js');
    console.error('   4. Créez d\'abord la table avec le script SQL');
    console.error('   5. Si sur StackBlitz: clonez le projet en local pour tester\n');
  }
}

// ✨ Exécution du script avec options
const args = process.argv.slice(2);

if (args.includes('--verify-contact')) {
  // Vérifier uniquement la structure de la table contact
  verifyContactTable().then(() => process.exit(0));
} else if (args.includes('--clean-test')) {
  // Nettoyer les données de test
  cleanTestContacts().then(() => process.exit(0));
} else {
  // Exécution normale du seed
  seedData();
}

// ✨ Exemples d'utilisation :
// npm run seed                    # Seed normal de toutes les tables
// npm run seed -- --verify-contact # Vérifier la structure de la table contact
// npm run seed -- --clean-test     # Nettoyer les données de test