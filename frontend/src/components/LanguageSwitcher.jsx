import { useLanguage } from "../contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { language, changeLanguage } = useLanguage();

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "sw", name: "Swahili", flag: "🇰🇪" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "zh", name: "中文", flag: "🇨🇳" }
  ];

  return (
    <div className="language-switcher">
      <select
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="language-select"
        aria-label="Select language"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
