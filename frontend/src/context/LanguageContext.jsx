import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  fr: {
    // Navigation
    nav_home: 'Accueil',
    nav_catalog: 'Catalogue',
    nav_admin: 'Admin',
    nav_cart: 'Panier',
    nav_profile: 'Mon Profil',
    nav_logout: 'Déconnexion',
    nav_login: 'Connexion',
    nav_register: 'Inscription',
    
    // Chatbot
    chatbot_title: 'Assistant Sport-Equip',
    chatbot_online: 'En ligne',
    chatbot_placeholder: 'Écrivez votre message...',
    chatbot_welcome: 'Bonjour ! 👋 Je suis l\'assistant Sport-Equip. Comment puis-je vous aider aujourd\'hui ?',
    chatbot_error: 'Désolé, une erreur est survenue. Veuillez réessayer.',
    chatbot_network_error: 'Désolé, je n\'ai pas accès à internet pour communiquer avec l\'IA. Veuillez vérifier votre connexion et réessayer.',
    
    // Home
    hero_title: 'Bienvenue sur Sport-Equip',
    hero_subtitle: 'Votre destination pour les équipements sportifs de qualité',
    hero_cta: 'Découvrir nos produits',
    
    // Products
    product_add_to_cart: 'Ajouter au panier',
    product_out_of_stock: 'Rupture de stock',
    product_price: 'Prix',
    product_category: 'Catégorie',
    
    // Auth
    login_title: 'Connexion',
    register_title: 'Inscription',
    email: 'Email',
    password: 'Mot de passe',
    name: 'Nom',
    confirm_password: 'Confirmer le mot de passe',
    forgot_password: 'Mot de passe oublié ?',
    
    // Common
    search: 'Rechercher',
    filter: 'Filtrer',
    sort: 'Trier',
    submit: 'Soumettre',
    cancel: 'Annuler',
    save: 'Enregistrer',
    delete: 'Supprimer',
    edit: 'Modifier',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès'
  },
  en: {
    // Navigation
    nav_home: 'Home',
    nav_catalog: 'Catalog',
    nav_admin: 'Admin',
    nav_cart: 'Cart',
    nav_profile: 'My Profile',
    nav_logout: 'Logout',
    nav_login: 'Login',
    nav_register: 'Register',
    
    // Chatbot
    chatbot_title: 'Sport-Equip Assistant',
    chatbot_online: 'Online',
    chatbot_placeholder: 'Type your message...',
    chatbot_welcome: 'Hello! 👋 I am the Sport-Equip assistant. How can I help you today?',
    chatbot_error: 'Sorry, an error occurred. Please try again.',
    chatbot_network_error: 'Sorry, I don\'t have internet access to communicate with the AI. Please check your connection and try again.',
    
    // Home
    hero_title: 'Welcome to Sport-Equip',
    hero_subtitle: 'Your destination for quality sports equipment',
    hero_cta: 'Discover our products',
    
    // Products
    product_add_to_cart: 'Add to cart',
    product_out_of_stock: 'Out of stock',
    product_price: 'Price',
    product_category: 'Category',
    
    // Auth
    login_title: 'Login',
    register_title: 'Register',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    confirm_password: 'Confirm password',
    forgot_password: 'Forgot password?',
    
    // Common
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success'
  },
  de: {
    // Navigation
    nav_home: 'Startseite',
    nav_catalog: 'Katalog',
    nav_admin: 'Admin',
    nav_cart: 'Warenkorb',
    nav_profile: 'Mein Profil',
    nav_logout: 'Abmelden',
    nav_login: 'Anmelden',
    nav_register: 'Registrieren',
    
    // Chatbot
    chatbot_title: 'Sport-Equip Assistent',
    chatbot_online: 'Online',
    chatbot_placeholder: 'Schreiben Sie Ihre Nachricht...',
    chatbot_welcome: 'Hallo! 👋 Ich bin der Sport-Equip Assistent. Wie kann ich Ihnen heute helfen?',
    chatbot_error: 'Entschuldigung, ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    chatbot_network_error: 'Entschuldigung, ich habe keinen Internetzugang zur Kommunikation mit der KI. Bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut.',
    
    // Home
    hero_title: 'Willkommen bei Sport-Equip',
    hero_subtitle: 'Ihr Ziel für hochwertige Sportausrüstung',
    hero_cta: 'Entdecken Sie unsere Produkte',
    
    // Products
    product_add_to_cart: 'In den Warenkorb',
    product_out_of_stock: 'Nicht vorrätig',
    product_price: 'Preis',
    product_category: 'Kategorie',
    
    // Auth
    login_title: 'Anmelden',
    register_title: 'Registrieren',
    email: 'E-Mail',
    password: 'Passwort',
    name: 'Name',
    confirm_password: 'Passwort bestätigen',
    forgot_password: 'Passwort vergessen?',
    
    // Common
    search: 'Suchen',
    filter: 'Filtern',
    sort: 'Sortieren',
    submit: 'Absenden',
    cancel: 'Abbrechen',
    save: 'Speichern',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    loading: 'Laden...',
    error: 'Fehler',
    success: 'Erfolg'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const savedLang = localStorage.getItem('language');
    return savedLang || 'fr';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage, availableLanguages: Object.keys(translations) }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
