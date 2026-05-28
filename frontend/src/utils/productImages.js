const productImages = {
  'Maillot Football Pro': '/images/maillot_foot.jpg',
  'Crampons Mercurial': '/images/football_cleats.jpg',
  'Ballon Football Official': '/images/football_ball.jpg',
  'Gants Gardien Pro': '/images/gants_gardien.jpg',
  'Short Running Elite': '/images/shorts.jpg',
  'Chaussures Running Ultra': '/images/running_shoes.jpg',
  'T-shirt Technique Dry': '/images/tshirt.jpg',
  'Montre GPS Running': '/images/smartwatch.jpg',
  'Haltères Réglables 20kg': '/images/dumbbells.jpg',
  'Tapis de Yoga Premium': '/images/yoga_mat.jpg',
  'Elastique Résistance': '/images/resistance_bands.jpg',
  'Step Aerobic': '/images/step_platform.jpg',
  'Raquette Tennis Pro': '/images/tennis_racquet.jpg',
  'Balle Tennis 3-pack': '/images/tennis_balls.jpg',
  'Sac Tennis Tour': '/images/tennis_bag.jpg',
  'Chaussures Basketball Air': '/images/basketball_shoes.jpg',
  'Ballon Basketball Official': '/images/basketball_ball.jpg',
  'Maillot Basketball Jersey': '/images/basketball_jersey.jpg',
  'Protège-Tibia Pro': '/images/shin_guards.jpg',
  'Gourde Isotermique 1L': '/images/water_bottle.jpg'
};

const categoryFallbacks = {
  Football: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=900&q=80',
  Running: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80',
  Fitness: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80',
  Tennis: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=900&q=80',
  Basketball: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80',
  Cyclisme: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80',
  Natation: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=900&q=80',
  Boxe: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=900&q=80'
};

export const getProductImage = (product) => {
  if (!product) return categoryFallbacks.Fitness;
  return productImages[product.titre] || categoryFallbacks[product.categorie] || categoryFallbacks.Fitness;
};
