const productImages = {
  // Football
  'Maillot PSG Domicile 2024': '/images/Maillot_PSG_Domicile_2024.jfif',
  'Crampons Mercurial Vapor': '/images/Crampons_Mercurial_Vapor.jfif',
  'Ballon UEFA Champions League': '/images/Ballon_UEFA_Champions_League.jfif',
  'Gants de gardien Nike': '/images/Gants_de_gardien_Nike.jfif',
  'Short de football Adidas': '/images/Short_de_football_Adidas.jfif',

  // Running
  'Chaussures Running Ultraboost': '/images/Chaussures_Running_Ultraboost.jfif',
  'Montre GPS Running': '/images/Montre_GPS_Running.jfif',
  'T-shirt technique respirant': '/images/T-shirt_technique_respirant.jfif',
  'Legging de running': '/images/Legging_de_running.jfif',
  'Sac à dos running': '/images/sac_a_dos_running.jfif',

  // Fitness
  'Haltères réglables 20kg': '/images/Halteres_reglables_20kg.jfif',
  'Tapis de yoga premium': '/images/Tapis_de_yoga_premium.jfif',
  'Élastiques de résistance': '/images/Elastiques_de_resistance.jfif',
  'Kettlebell 16kg': '/images/Kettlebell_16kg.jfif',
  'Banc de fitness réglable': '/images/Banc_reglable.jfif',

  // Tennis
  'Raquette Wilson Pro': '/images/Raquette_Wilson_Pro.jfif',
  'Balles de tennis (x3)': '/images/Balles_de_tennis_(x3).jfif',
  'Sac de tennis Wilson': '/images/Sac_de_tennis_Wilson.jfif',
  'Chaussures Tennis Court': '/images/Chaussures_Tennis_Court.jfif',
  'Manchettes de tennis': '/images/Manchettes_de_tennis.jfif',

  // Basketball
  'Chaussures Jordan Air': '/images/Chaussures_Jordan_Air.jfif',
  'Ballon NBA officiel': '/images/Ballon_NBA_officiel.jfif',
  'Maillot NBA Lakers': '/images/Maillot_NBA_Lakers.jfif',
  'Panier de basket mural': '/images/Panier_de_basket_mural.jfif',
  'Protège-dents basketball': '/images/Protege-dents_basketball.jfif',

  // Cyclisme
  'Casque cyclisme Pro': '/images/Casque_cyclisme_Pro.jfif',
  'Gants cyclisme': '/images/Gants_cyclisme.jfif',
  'Gourde 750ml': '/images/Gourde_750ml.jfif',
  'Maillot cyclisme équipe': '/images/Maillot_cyclisme_equipe.jfif',
  'Short cyclisme avec cuissard': '/images/Short_cyclisme_avec_cuissard.jfif',

  // Natation
  'Maillot de bain homme': '/images/maillot_de_bain_homme.jfif',
  'Maillot de bain femme': '/images/maillot_de_bain_femme.jfif',
  'Lunettes de natation': '/images/Lunettes_de_natation.jfif',
  'Bonne de natation silicone': '/images/Bonne_de_natation_silicone.jfif',
  'Planches de natation': '/images/Planches_de_natation.jfif',

  // Boxe
  'Gants de boxe 16oz': '/images/Gants_de_boxe_16oz.jfif',
  'Sac de frappe 40kg': '/images/Sac_de_frappe_40kg.jfif',
  'Bandages de boxe': '/images/Bandages_de_boxe.jfif',
  'Protège-dents boxe': '/images/Protege-dents_boxe.jfif',
  'Ceinture de boxe': '/images/Ceinture_de_boxe.jfif'
};

const categoryFallbacks = {
  Football: '/images/Ballon_UEFA_Champions_League.jfif',
  Running: '/images/Chaussures_Running_Ultraboost.jfif',
  Fitness: '/images/Tapis_de_yoga_premium.jfif',
  Tennis: '/images/Raquette_Wilson_Pro.jfif',
  Basketball: '/images/Ballon_NBA_officiel.jfif',
  Cyclisme: '/images/Casque_cyclisme_Pro.jfif',
  Natation: '/images/maillot_de_bain_homme.jfif',
  Boxe: '/images/Gants_de_boxe_16oz.jfif'
};

export const getProductImage = (product) => {
  if (!product) return categoryFallbacks.Fitness;
  return productImages[product.titre] || categoryFallbacks[product.categorie] || categoryFallbacks.Fitness;
};
