import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ja from "./locales/ja.json";

const resources = {
  en: { translation: en },
  ja: { translation: ja },
} as const;

const fallbackLng = "en";

const storedLanguage =
  typeof window !== "undefined" ? localStorage.getItem("app-language") : null;

const initialLanguage = storedLanguage && resources[storedLanguage as keyof typeof resources]
  ? (storedLanguage as keyof typeof resources)
  : "ja";

void i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage,
    fallbackLng,
    interpolation: {
      escapeValue: false,
    },
  });

if (typeof window !== "undefined") {
  const updateDocumentLang = (lng: string) => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lng;
    }
  };

  updateDocumentLang(i18n.language);

  i18n.on("languageChanged", (lng) => {
    localStorage.setItem("app-language", lng);
    updateDocumentLang(lng);
  });
}

export default i18n;
