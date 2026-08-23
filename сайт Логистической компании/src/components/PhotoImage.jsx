import { useState, useRef, useEffect } from 'react';
import './PhotoImage.scss';

export default function PhotoImage({
  src,
  alt = '',
  className = '',
  loading = 'lazy',
  onClick,
  objectPosition = 'center',
  priority = false,
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (priority && imgRef.current?.complete) {
      setLoaded(true);
    }
  }, [priority]);

  return (
    <div
      className={`photo-image ${loaded ? 'photo-image--loaded' : ''} ${error ? 'photo-image--error' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <div className="photo-image__placeholder" aria-hidden="true" />
      {!error && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={priority ? 'eager' : loading}
          decoding="async"
          className="photo-image__img"
          style={{ objectPosition }}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}
