'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import styles from './PropertyCarousel.module.css';

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

interface Property {
  id: string;
  nama_property: string;
  image_url: string | null;
  kawasan: string;
  status: string;
  price: number;
  tipe: string;
  lebar: number;
  panjang: number;
  tingkat: number;
}

interface PropertyCarouselProps {
  properties: Property[];
}

export default function PropertyCarousel({ properties }: PropertyCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = scrollRef.current;
    if (!track) return;

    let scrollAmount = 0;
    
    const interval = setInterval(() => {
      if (track) {
        // Scroll right by approximately one item width plus gap (e.g. ~404px)
        // If reached the end, reset to 0
        const itemWidth = 404; // 380px + 24px gap
        const maxScroll = track.scrollWidth - track.clientWidth;
        
        scrollAmount += itemWidth;
        
        if (scrollAmount > maxScroll + 100) {
          scrollAmount = 0;
          track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          track.scrollBy({ left: itemWidth, behavior: 'smooth' });
        }
      }
    }, 3000); // Scroll every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselTrack} ref={scrollRef}>
        {properties.map(property => (
          <div key={property.id} className={styles.carouselItem}>
            <Link href={`/properti/${property.id}`} className={styles.propertyCard}>
              {property.image_url ? (
                <div className={styles.propertyImageContainer}>
                  <img src={property.image_url} alt={property.nama_property} className={styles.propertyImage} />
                </div>
              ) : (
                <div className={styles.propertyImagePlaceholder}>
                  <MapPin size={32} color="var(--accent-gold)" />
                  <span>{property.kawasan}</span>
                </div>
              )}
              <div className={styles.propertyContent}>
                <div className={styles.propertyHeader}>
                  <h3 className={styles.propertyTitle}>{property.nama_property}</h3>
                  <span className={styles.propertyBadge}>{property.status}</span>
                </div>
                <p className={styles.propertyPrice}>{formatRupiah(property.price)}</p>
                <div className={styles.propertyDetails}>
                  <span>{property.tipe}</span> • 
                  <span>{property.lebar} x {property.panjang} m</span> • 
                  <span>{property.tingkat} Lantai</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
