/**
 * Palo da barbiere: cilindro di vetro con strisce rosse e bianche, calotte
 * cromate. Le strisce girano lentamente da sole e accelerano con lo
 * scorrimento (--sy). Elemento decorativo: nascosto alle tecnologie assistive.
 */
export function BarberPole({ className = "" }: { className?: string }) {
  return (
    <div className={`pole ${className}`} aria-hidden="true">
      <div className="pole-finial" />
      <div className="pole-cap" />
      <div className="pole-glass">
        <div className="pole-stripes" />
        <div className="pole-shade" />
      </div>
      <div className="pole-cap pole-cap-bottom" />
    </div>
  );
}

/** Fascia orizzontale a strisce da palo, usata come separatore tra le sezioni. */
export function PoleBand({ className = "" }: { className?: string }) {
  return <div className={`pole-band ${className}`} aria-hidden="true" />;
}
