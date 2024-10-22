// /app/[lang]/pricing/page.jsx

import React from 'react';
import Preloader from '@/components/common/Preloader';
import Header from '@/components/layout/headers/Header';
import PageLinks from '@/components/common/PageLinks';
import Pricing from '@/components/common/Pricing';

// Funcție pentru a obține traducerile de pe server
async function fetchTranslation(text, targetLanguage) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_TRANSLATE_ENDPOINT}/api/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      targetLanguage,
    }),
  });

  const data = await res.json();
  return data;
}

// Funcția care generează paginile statice pentru toate limbile
export async function generateStaticParams() {
  const locales = ['en', 'ro', 'fr']; // Limbile suportate

  return locales.map((locale) => ({
    lang: locale,
  }));
}

// Componenta pentru pagina de pricing
export default async function Page({ params: { lang } }) {
  // Extragem limba din URL folosind params
  const targetLanguage = lang || 'en'; 

console.log("targe lagn..", targetL)

  return (
    <div className="main-content">
    <Preloader />
    <Header />
    <div className="content-wrapper js-content-wrapper overflow-hidden">
      {/* Transmitem datele traduse și limba către componenta PageLinks */}
      {/* <PageLinks translatedLinks={translatedLinks} /> */}
      {/* <Pricing /> */}
              {/* <Brands/> */}
      {/* <FooterOne/> */}
    </div>
  </div>
  );
}
