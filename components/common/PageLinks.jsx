import Link from 'next/link';
import React from 'react';

export default function PageLinks({ translatedLinks }) {
  // const { lang } = translatedLinks; // Extragem limba

  return (
    <section className="breadcrumbs">
      <div className="container">
        <div className="row">
          <div className="col-auto">
            <div className="breadcrumbs__content">
              {/* <div className="breadcrumbs__item">
                <Link href={`/${lang}/`}>
                  {translatedLinks.home}
                </Link>
              </div>
              <div className="breadcrumbs__item">
                <Link href={`/${lang}/`}>
                  {translatedLinks.realAmor}
                </Link>
              </div>
              <div className="breadcrumbs__item">
                <Link href={`/${lang}/pricing`}>
                  {translatedLinks.pricing}
                </Link>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
