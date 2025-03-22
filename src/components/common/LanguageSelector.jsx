import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../../store/slices/uiSlice";

const LanguageSelector = () => {
  const dispatch = useDispatch();
  const { language } = useSelector((state) => state.ui);

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    // Add more languages as needed
  ];

  return (
    <select
      value={language}
      onChange={(e) => dispatch(setLanguage(e.target.value))}
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
};
export default LanguageSelector;
