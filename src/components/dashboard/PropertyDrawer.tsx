'use client';

import { useState, useEffect } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { MapPin, Printer, Copy, Edit, Trash2, Save, XCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import styles from './PropertyDrawer.module.css';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface PropertyDrawerProps {
  propertyId: string;
  userRole: string;
  onClose: () => void;
}

export default function PropertyDrawer({ propertyId, userRole, onClose }: PropertyDrawerProps) {
  const isNew = propertyId === 'new';
  const [isEditing, setIsEditing] = useState(isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { mutate } = useSWRConfig();
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const { data, error, isLoading } = useSWR(
    !isNew ? `/api/properties/${propertyId}` : null,
    fetcher
  );

  const [formData, setFormData] = useState({
    nama_property: '',
    group: '',
    lebar: '',
    panjang: '',
    hadap: [] as string[],
    tipe: 'Ruko',
    tingkat: '1',
    price: '',
    carport: false,
    status: 'In Stock',
    siap: 'Siap Huni',
    maps_link: '',
    kawasan: '',
    unit: '',
    image_url: ''
  });

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (data?.data && !isNew) {
      const prop = data.data;
      setFormData({
        nama_property: prop.nama_property,
        group: prop.group || '',
        lebar: prop.lebar.toString(),
        panjang: prop.panjang.toString(),
        hadap: prop.hadap.split(', '),
        tipe: prop.tipe,
        tingkat: prop.tingkat.toString(),
        price: prop.price.toString(),
        carport: prop.carport,
        status: prop.status,
        siap: prop.siap,
        maps_link: prop.maps_link || '',
        kawasan: prop.kawasan,
        unit: prop.unit || '',
        image_url: prop.image_url || ''
      });
    }
  }, [data, isNew]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setIsDirty(true);
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleHadapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true);
    const { value, checked } = e.target;
    setFormData(prev => {
      const current = prev.hadap;
      if (checked) {
        return { ...prev, hadap: [...current, value] };
      } else {
        return { ...prev, hadap: current.filter(h => h !== value) };
      }
    });
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setToast(null);

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setFormData(prev => ({ ...prev, image_url: result.imageUrl }));
        setIsDirty(true);
        setToast({ type: 'success', message: 'Gambar berhasil diunggah!' });
      } else {
        setToast({ type: 'error', message: result.error || 'Gagal mengunggah gambar.' });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Gagal menghubungi server untuk unggah gambar.' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (addAnother = false) => {
    setIsSaving(true);
    setToast(null);
    try {
      const url = isNew ? '/api/properties' : `/api/properties/${propertyId}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      
      if (result.success) {
        setToast({ type: 'success', message: 'Properti berhasil disimpan!' });
        mutate((key: any) => typeof key === 'string' && key.startsWith('/api/properties')); // Revalidate table
        setIsDirty(false);
        
        if (addAnother && isNew) {
          // Reset form
          setFormData({
            nama_property: '', group: '', lebar: '', panjang: '', hadap: [],
            tipe: 'Ruko', tingkat: '1', price: '', carport: false, status: 'In Stock',
            siap: 'Siap Huni', maps_link: '', kawasan: '', unit: '', image_url: ''
          });
        } else if (isNew) {
          setTimeout(onClose, 1000);
        } else {
          setIsEditing(false);
        }
      } else {
        setToast({ type: 'error', message: result.error || 'Gagal menyimpan.' });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Gagal menghubungi server.' });
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    setShowDeleteConfirm(false);
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/properties/${propertyId}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        mutate((key: string) => typeof key === 'string' && key.startsWith('/api/properties'));
        onClose();
      } else {
        setToast({ type: 'error', message: result.error || 'Gagal menghapus.' });
        setIsDeleting(false);
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Gagal menghubungi server.' });
      setIsDeleting(false);
    }
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
  };

  const handleCopyWA = () => {
    const p = data?.data;
    if (!p) return;
    const text = `*${p.nama_property}*\nLokasi: ${p.kawasan}\nTipe: ${p.tipe}\nDimensi: ${p.lebar}x${p.panjang}m (${p.tingkat} Lantai)\nHadap: ${p.hadap}\nHarga: ${formatRupiah(p.price)}\nStatus: ${p.status} - ${p.siap.replace(/_/g, ' ')}\n${p.maps_link ? `\nMaps: ${p.maps_link.startsWith('http') ? p.maps_link : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.maps_link)}`}` : ''}`;
    navigator.clipboard.writeText(text);
    setToast({ type: 'success', message: 'Disalin ke clipboard!' });
    setTimeout(() => setToast(null), 3000);
  };

  if (isLoading) return <div className={styles.loading}>Memuat detail...</div>;
  if (error) return <div className={styles.errorAlert}>Gagal memuat detail properti.</div>;

  return (
    <div className={styles.container}>
      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]} no-print`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {showDeleteConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalIcon}>
              <AlertCircle size={32} color="var(--accent-red)" />
            </div>
            <h3 className={styles.modalTitle}>Konfirmasi Hapus</h3>
            <p className={styles.modalText}>
              Yakin hapus properti <strong>{data?.data?.nama_property}</strong>?<br/>Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className={styles.modalActions}>
              <button onClick={() => setShowDeleteConfirm(false)} className="btn-outline">
                Batal
              </button>
              <button onClick={confirmDelete} className="btn-danger">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {!isEditing ? (
        // DETAIL VIEW
        <div className={styles.detailView}>
          <div className={`no-print ${styles.detailHeader}`}>
            <div className={styles.detailActions}>
              <button onClick={handleCopyWA} className="btn-outline">
                <Copy size={16} /> Salin Teks WA
              </button>
              <button onClick={() => window.print()} className="btn-outline">
                <Printer size={16} /> Cetak / PDF
              </button>
            </div>
            {userRole === 'Superadmin' && (
              <div className={styles.adminActions}>
                <button onClick={() => setIsEditing(true)} className="btn-primary">
                  <Edit size={16} /> Edit
                </button>
                <button onClick={() => setShowDeleteConfirm(true)} disabled={isDeleting} className="btn-danger">
                  <Trash2 size={16} /> {isDeleting ? 'Menghapus...' : 'Hapus'}
                </button>
              </div>
            )}
          </div>

          <div className={styles.printArea}>
            
            {data?.data?.image_url && (
              <div className={styles.detailImageContainer}>
                <img src={data.data.image_url} alt={data.data.nama_property} className={styles.detailImage} />
              </div>
            )}

            <h1 className={styles.title}>{data?.data?.nama_property}</h1>
            <div className={styles.meta}>
              <span className={styles.badge}>{data?.data?.status}</span>
              <span className={styles.badge}>{data?.data?.tipe}</span>
              <span className={styles.badge}>{data?.data?.siap.replace(/_/g, ' ')}</span>
            </div>

            <h2 className={styles.price}>{formatRupiah(data?.data?.price)}</h2>
            
            <div className={styles.grid}>
              <div className={styles.dataItem}>
                <label>Kawasan</label>
                <p>{data?.data?.kawasan}</p>
              </div>
              <div className={styles.dataItem}>
                <label>Group</label>
                <p>{data?.data?.group || '-'}</p>
              </div>
              <div className={styles.dataItem}>
                <label>Dimensi (L x P)</label>
                <p>{data?.data?.lebar} x {data?.data?.panjang} m</p>
              </div>
              <div className={styles.dataItem}>
                <label>Tingkat</label>
                <p>{data?.data?.tingkat} Lantai</p>
              </div>
              <div className={styles.dataItem}>
                <label>Hadap</label>
                <p>{data?.data?.hadap}</p>
              </div>
              <div className={styles.dataItem}>
                <label>Carport</label>
                <p>{data?.data?.carport ? 'Ya' : 'Tidak'}</p>
              </div>
              <div className={styles.dataItem}>
                <label>Unit</label>
                <p>{data?.data?.unit || '-'}</p>
              </div>
            </div>

            {data?.data?.maps_link && (
              <div className={`no-print ${styles.mapsSection}`}>
                <a href={data.data.maps_link.startsWith('http') ? data.data.maps_link : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.data.maps_link)}`} target="_blank" rel="noreferrer" className="btn-primary" style={{ display: 'inline-flex' }}>
                  <MapPin size={16} /> Buka di Google Maps
                </a>
              </div>
            )}
          </div>
        </div>
      ) : (
        // FORM VIEW
        <div className={styles.formView}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>
              {isNew ? 'Tambah Properti Baru' : 'Edit Properti'}
              {isDirty && <span className={styles.dirtyDot} title="Belum disimpan"></span>}
            </h2>
          </div>

          <div className={styles.formGrid}>
            <div className="form-group">
              <label className="form-label">Nama Properti *</label>
              <input type="text" name="nama_property" value={formData.nama_property} onChange={handleChange} className="form-input" required minLength={3} maxLength={100} />
            </div>
            
            <div className="form-group">
              <label className="form-label">Kawasan *</label>
              <input type="text" name="kawasan" value={formData.kawasan} onChange={handleChange} className="form-input" required />
            </div>

            <div className="form-group">
              <label className="form-label">Grup</label>
              <input type="text" name="group" value={formData.group} onChange={handleChange} className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Tipe *</label>
              <select name="tipe" value={formData.tipe} onChange={handleChange} className="form-input" required>
                <option value="Ruko">Ruko</option>
                <option value="Villa">Villa</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Harga (Rp) *</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="form-input" required min="1" step="1" />
              <small style={{ color: 'var(--accent-gold)' }}>Preview: {formData.price ? formatRupiah(Number(formData.price)) : '-'}</small>
            </div>

            <div className={styles.twoCols}>
              <div className="form-group">
                <label className="form-label">Lebar (m) *</label>
                <input type="number" name="lebar" value={formData.lebar} onChange={handleChange} className="form-input" required step="0.01" min="0.1" />
              </div>
              <div className="form-group">
                <label className="form-label">Panjang (m) *</label>
                <input type="number" name="panjang" value={formData.panjang} onChange={handleChange} className="form-input" required step="0.01" min="0.1" />
              </div>
            </div>

            <div className={styles.twoCols}>
              <div className="form-group">
                <label className="form-label">Tingkat *</label>
                <input type="number" name="tingkat" value={formData.tingkat} onChange={handleChange} className="form-input" required step="0.1" min="1" max="10" />
              </div>
              <div className="form-group">
                <label className="form-label">Carport *</label>
                <select name="carport" value={formData.carport ? 'true' : 'false'} onChange={(e) => { setIsDirty(true); setFormData(p => ({...p, carport: e.target.value === 'true'})) }} className="form-input">
                  <option value="true">Ya</option>
                  <option value="false">Tidak</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Status *</label>
              <select name="status" value={formData.status} onChange={handleChange} className="form-input" required>
                <option value="In Stock">In Stock</option>
                <option value="Sold Out">Sold Out</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Kesiapan *</label>
              <select name="siap" value={formData.siap} onChange={handleChange} className="form-input" required>
                <option value="Siap Huni">Siap Huni</option>
                <option value="Siap Kosong">Siap Kosong</option>
                <option value="Siap Huni Renovasi">Siap Huni Renovasi</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Hadap *</label>
              <div className={styles.checkboxGroup}>
                {['Utara', 'Selatan', 'Timur', 'Barat'].map(h => (
                  <label key={h} className={styles.checkboxLabel}>
                    <input type="checkbox" value={h} checked={formData.hadap.includes(h)} onChange={handleHadapChange} />
                    {h}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Link Maps</label>
              <input type="url" name="maps_link" value={formData.maps_link} onChange={handleChange} className="form-input" placeholder="https://google.com/maps/..." />
            </div>
            
            <div className="form-group">
              <label className="form-label">Unit</label>
              <input type="text" name="unit" value={formData.unit} onChange={handleChange} className="form-input" />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Gambar Properti</label>
              {formData.image_url ? (
                <div className={styles.imagePreviewContainer}>
                  <img src={formData.image_url} alt="Preview" className={styles.imagePreview} />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, image_url: '' }));
                      setIsDirty(true);
                    }}
                    className={styles.removeImageBtn}
                  >
                    Hapus Gambar
                  </button>
                </div>
              ) : (
                <div className={styles.uploadBox}>
                  <input
                    type="file"
                    accept="image/*"
                    id="image-upload"
                    onChange={handleUpload}
                    className={styles.fileInput}
                    disabled={isUploading}
                  />
                  <label htmlFor="image-upload" className={styles.uploadLabel}>
                    {isUploading ? 'Mengunggah...' : 'Pilih Gambar (JPG, PNG, WEBP - Maks 5MB)'}
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className={styles.formActions}>
            {!isNew && (
              <button type="button" onClick={() => setIsEditing(false)} className="btn-outline">
                <XCircle size={16} /> Batal
              </button>
            )}
            
            <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
              {isNew && (
                <button type="button" onClick={() => handleSave(true)} disabled={isSaving || !isDirty} className="btn-outline">
                  Simpan & Tambah Lagi
                </button>
              )}
              <button type="button" onClick={() => handleSave(false)} disabled={isSaving || !isDirty} className="btn-primary">
                <Save size={16} /> {isSaving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
