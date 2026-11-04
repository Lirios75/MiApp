'use client';

// Carga el píxel de Meta una sola vez (en el layout raíz) y dispara "PageView" en cada
// cambio de pantalla dentro de la app (Next.js navega sin recargar la página completa, así
// que sin esto Meta solo vería la primera pantalla que alguien visita, no el resto del
// camino hasta el pago — ver docs/sistema/34-ADQUISICION-Y-TRAFICO.md).

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { META_PIXEL_ID, pixelPageview } from '@/lib/pixel';

export function MetaPixel() {
  const pathname = usePathname();
  // El script base de abajo ya dispara el PageView de la primera carga — este efecto solo
  // cubre los cambios de pantalla DESPUÉS, por eso se salta la primera vez que corre.
  const esPrimeraCarga = useRef(true);

  useEffect(() => {
    if (esPrimeraCarga.current) {
      esPrimeraCarga.current = false;
      return;
    }
    pixelPageview();
  }, [pathname]);

  return (
    <>
      <Script id="meta-pixel-base" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
