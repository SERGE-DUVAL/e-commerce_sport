import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const languageNames = {
    fr: 'Français',
    en: 'English',
    de: 'Deutsch'
  };

  const languageFlags = {
    fr: '🇫🇷',
    en: '🇬🇧',
    de: '🇩🇪'
  };

  const availableLanguages = ['fr', 'en', 'de'];

  return (
    <div className="language-selector">
      <select
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="language-select"
        aria-label="Select language"
      >
        {availableLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {languageFlags[lang]} {languageNames[lang]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
