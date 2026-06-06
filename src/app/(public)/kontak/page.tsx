'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';
import { MapPin, Phone, Mail, MessageSquare } from 'lucide-react';
import { submitContactForm } from './actions';

function ContactForm() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    phone: '',
    pesan: '',
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const properti = searchParams.get('properti');
    if (properti) {
      setFormData(prev => ({
        ...prev,
        pesan: `Halo, saya ingin menanyakan lebih detail mengenai properti "${properti}" yang terdaftar di platform Anda.`
      }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    // Client validation
    if (formData.phone.length < 10) {
      setStatus({ type: 'error', message: 'Nomor HP minimal 10 digit.' });
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await submitContactForm(formData);
      if (result.success) {
        setStatus({ type: 'success', message: 'Pesan terkirim, tim kami akan menghubungi Anda.' });
        setFormData({ nama: '', email: '', phone: '', pesan: '' });
      } else {
        setStatus({ type: 'error', message: result.error || 'Terjadi kesalahan.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Gagal mengirim pesan.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={`container ${styles.heroContainer}`}>
          <h1 className={styles.title}>Hubungi Kami</h1>
          <p className={styles.subtitle}>
            Kami siap membantu Anda menemukan properti impian. Jangan ragu untuk menghubungi tim ahli kami.
          </p>
        </div>
      </div>

      <div className={`container ${styles.contentContainer}`}>
        <div className={styles.grid}>
          {/* Contact Information */}
          <div className={styles.infoSection}>
            <h2 className={styles.sectionTitle}>Informasi Kontak</h2>
            
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <MapPin className={styles.icon} />
                <div>
                  <h3>Alamat Kantor</h3>
                  <p>Jl. Jendral Sudirman Kav. 52-53, <br />SCBD, Jakarta Selatan 12190</p>
                </div>
              </div>
              
              <div className={styles.infoItem}>
                <Phone className={styles.icon} />
                <div>
                  <h3>Telepon / WhatsApp</h3>
                  <p>+62 811 234 5678</p>
                  <a href="https://wa.me/628112345678" target="_blank" rel="noreferrer" className={styles.link}>
                    Chat via WhatsApp &rarr;
                  </a>
                </div>
              </div>
              
              <div className={styles.infoItem}>
                <Mail className={styles.icon} />
                <div>
                  <h3>Email</h3>
                  <p>info@primeproperty.com</p>
                </div>
              </div>
            </div>

            <div className={styles.mapContainer}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.272186831154!2d106.80587131536965!3d-6.227798695491689!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f14371bf9e21%3A0x6b45a6c3f68d9047!2sSCBD%20Jakarta!5e0!3m2!1sen!2sid!4v1684305012345!5m2!1sen!2sid" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Kirim Pesan</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className="form-group">
                <label className="form-label" htmlFor="nama">Nama Lengkap</label>
                <input 
                  type="text" 
                  id="nama" 
                  required 
                  className="form-input" 
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="email">Alamat Email</label>
                <input 
                  type="email" 
                  id="email" 
                  required 
                  className="form-input" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="phone">Nomor HP</label>
                <input 
                  type="tel" 
                  id="phone" 
                  required 
                  minLength={10}
                  className="form-input" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="pesan">Pesan</label>
                <textarea 
                  id="pesan" 
                  required 
                  rows={5}
                  className="form-input" 
                  style={{ resize: 'vertical' }}
                  value={formData.pesan}
                  onChange={(e) => setFormData({...formData, pesan: e.target.value})}
                ></textarea>
              </div>

              {status.message && (
                <div className={`${styles.toast} ${styles[status.type]}`}>
                  {status.type === 'success' ? <MessageSquare size={20} /> : null}
                  {status.message}
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ width: '100%' }}>
                {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '80px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>Memuat Halaman Kontak...</div>}>
      <ContactForm />
    </Suspense>
  );
}
