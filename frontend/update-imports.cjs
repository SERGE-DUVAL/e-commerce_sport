const fs = require('fs');
const path = require('path');

const directoriesToProcess = [
  'src',
  'src/components',
  'src/pages',
  'src/context',
  'src/api'
];

directoriesToProcess.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (fs.existsSync(fullPath)) {
    const files = fs.readdirSync(fullPath);
    files.forEach(file => {
      if (file.endsWith('.js') || file.endsWith('.jsx')) {
        const filePath = path.join(fullPath, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Mettre à jour les imports pour les fichiers renommés
        const importsToUpdate = [
          { from: './components/Header', to: './components/Header.jsx' },
          { from: './components/Footer', to: './components/Footer.jsx' },
          { from: './components/Chatbot', to: './components/Chatbot.jsx' },
          { from: './components/ProductCard', to: './components/ProductCard.jsx' },
          { from: './components/StarRating', to: './components/StarRating.jsx' },
          { from: './pages/Home', to: './pages/Home.jsx' },
          { from: './pages/Catalogue', to: './pages/Catalogue.jsx' },
          { from: './pages/ProductDetail', to: './pages/ProductDetail.jsx' },
          { from: './pages/Cart', to: './pages/Cart.jsx' },
          { from: './pages/Login', to: './pages/Login.jsx' },
          { from: './pages/Register', to: './pages/Register.jsx' },
          { from: './pages/Profile', to: './pages/Profile.jsx' },
          { from: './pages/AdminDashboard', to: './pages/AdminDashboard.jsx' },
          { from: './context/AuthContext', to: './context/AuthContext.jsx' },
          { from: './context/CartContext', to: './context/CartContext.jsx' },
          { from: './App', to: './App.jsx' },
          { from: './index', to: './index.jsx' }
        ];
        
        let updated = false;
        importsToUpdate.forEach(({ from, to }) => {
          const regex = new RegExp(`from ['"]${from}['"]`, 'g');
          if (content.match(regex)) {
            content = content.replace(regex, `from '${to}'`);
            updated = true;
          }
        });
        
        if (updated) {
          fs.writeFileSync(filePath, content);
          console.log(`Updated imports in: ${file}`);
        }
      }
    });
  }
});

console.log('Import update complete!');
