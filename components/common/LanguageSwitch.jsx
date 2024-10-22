import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from 'next/navigation'; // Folosim useRouter din next/navigation
import PropTypes from "prop-types";
import { useAuth } from "@/context/AuthContext"; // Folosim contextul Auth pentru limbă

const LanguageSwitch = ({ closePopup }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname(); // Preia calea curentă a paginii
  const router = useRouter(); // Folosește router pentru navigare
  const { changeLanguage } = useAuth(); // Funcția pentru schimbarea limbii din context
  const dropdownRef = useRef(null);

  const flagImages = {
    en: "/assets/img/flags/english.png",
    ro: "/assets/img/flags/romania.png",
    fr: "/assets/img/flags/france.png",
    de: "/assets/img/flags/germany.png",
  };

  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") || "en";
    changeLanguage(savedLocale); // Setăm limba curentă
  }, []);

  const toggleDropdown = () => setOpen(!open);

  const changeLang = (newLocale) => {
    localStorage.setItem("locale", newLocale); // Salvăm limba în localStorage
    changeLanguage(newLocale); // Schimbăm limba în context

    // Obținem calea curentă fără prefixul de limbă
    const currentPath = pathname.replace(/^\/(en|ro|fr|de)(\/|$)/, '/');
    // Navigăm către noul URL cu limba selectată
    router.push(`/${newLocale}${currentPath}`);
    setOpen(false); // Închidem dropdown-ul
  };

  // Închidem dropdown-ul dacă facem clic în afara componentului
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="language-switch" ref={dropdownRef}>
      <div className="language-switch-btn" onClick={toggleDropdown}>
        <img src={flagImages[pathname.split('/')[1] || 'en']} alt="Language" width={30} height={30} />
        <span>{(pathname.split('/')[1] || 'en').toUpperCase()}</span>
      </div>

      {open && (
        <ul className="dropdown-menu">
          {Object.keys(flagImages).map((lang) => (
            <li
              key={lang}
              className={`dropdown-item ${lang === (pathname.split('/')[1] || 'en') ? "active" : ""}`}
              onClick={() => changeLang(lang)}
            >
              <img src={flagImages[lang]} alt={lang} width={20} height={20} />
              <span>{lang.toUpperCase()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

LanguageSwitch.propTypes = {
  closePopup: PropTypes.func,
};

export default LanguageSwitch;
