'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { Search, SlidersHorizontal, X, Plus } from 'lucide-react';
import PropertyDrawer from './PropertyDrawer';
import styles from './PropertyTable.module.css';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface PropertyTableProps {
  userRole: string;
}

export default function PropertyTable({ userRole }: PropertyTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // States for filters
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    kawasan: searchParams.get('kawasan') ? searchParams.get('kawasan')!.split(',') : [],
    lebar_min: searchParams.get('lebar_min') || '',
    hadap: searchParams.get('hadap') ? searchParams.get('hadap')!.split(',') : [],
    harga_max: searchParams.get('harga_max') || '',
    tipe: searchParams.get('tipe') || 'Semua',
    status: searchParams.get('status') || 'Semua',
    siap: searchParams.get('siap') ? searchParams.get('siap')!.split(',') : [],
    carport: searchParams.get('carport') || 'Semua',
    sort: searchParams.get('sort') || 'created_at',
    order: searchParams.get('order') || 'desc',
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '50'),
  });

  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  // Sync URL when debounced filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(debouncedFilters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        params.set(key, value.join(','));
      } else if (value && value !== 'Semua' && !Array.isArray(value)) {
        params.set(key, value.toString());
      }
    });
    router.push(`/agent/dashboard?${params.toString()}`, { scroll: false });
  }, [debouncedFilters, router]);

  // Build API URL
  const queryParams = new URLSearchParams();
  Object.entries(debouncedFilters).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      queryParams.set(key, value.join(','));
    } else if (value && value !== 'Semua' && !Array.isArray(value)) {
      queryParams.set(key, value.toString());
    }
  });

  const { data, error, isLoading } = useSWR(`/api/properties?${queryParams.toString()}`, fetcher);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleMultiSelect = (key: string, value: string) => {
    setFilters(prev => {
      const current = prev[key as keyof typeof prev] as string[];
      const updated = current.includes(value) ? current.filter(item => item !== value) : [...current, value];
      return { ...prev, [key]: updated, page: 1 };
    });
  };

  const resetFilters = () => {
    setFilters({
      search: '', kawasan: [], lebar_min: '', hadap: [], harga_max: '',
      tipe: 'Semua', status: 'Semua', siap: [], carport: 'Semua',
      sort: 'created_at', order: 'desc', page: 1, limit: 50
    });
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
  };

  const activeFiltersCount = Object.entries(debouncedFilters).filter(([k, v]) => {
    if (['sort', 'order', 'page', 'limit'].includes(k)) return false;
    if (Array.isArray(v)) return v.length > 0;
    return v !== '' && v !== 'Semua';
  }).length;

  return (
    <div className={styles.tableContainer}>
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Cari nama properti, kawasan, atau grup..."
            className={styles.searchInput}
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
        
        <div className={styles.toolbarActions}>
          <div className={styles.filterToggle}>
            <SlidersHorizontal size={18} />
            <span>Filter ({activeFiltersCount})</span>
          </div>
          
          {userRole === 'Superadmin' && (
            <button className="btn-primary" onClick={() => { setSelectedPropertyId('new'); setIsDrawerOpen(true); }}>
              <Plus size={18} /> Tambah Properti
            </button>
          )}
        </div>
      </div>

      {/* Expanded Filters Section (Simplified for brevity, could be a toggle) */}
      <div className={styles.filtersPanel}>
        <div className={styles.filterGrid}>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-input" value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
              <option value="Semua">Semua</option>
              <option value="In Stock">In Stock</option>
              <option value="Sold Out">Sold Out</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Tipe</label>
            <select className="form-input" value={filters.tipe} onChange={(e) => handleFilterChange('tipe', e.target.value)}>
              <option value="Semua">Semua</option>
              <option value="Ruko">Ruko</option>
              <option value="Villa">Villa</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Harga Maks (Rp)</label>
            <input type="number" className="form-input" value={filters.harga_max} onChange={(e) => handleFilterChange('harga_max', e.target.value)} placeholder="Misal: 5000000000" />
          </div>
          <div className="form-group">
            <label className="form-label">Lebar Min (m)</label>
            <input type="number" className="form-input" value={filters.lebar_min} onChange={(e) => handleFilterChange('lebar_min', e.target.value)} placeholder="Misal: 6" />
          </div>
        </div>
        
        {activeFiltersCount > 0 && (
          <div className={styles.activeChips}>
            <button className={styles.resetButton} onClick={resetFilters}>
              Reset Filter <X size={14} />
            </button>
          </div>
        )}
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nama Properti</th>
              <th>Kawasan</th>
              <th>Tipe</th>
              <th>L x P</th>
              <th>Harga</th>
              <th>Status</th>
              <th>Kesiapan</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} className={styles.centerText}>Memuat data...</td></tr>
            ) : error ? (
              <tr><td colSpan={7} className={styles.errorText}>Gagal memuat data.</td></tr>
            ) : data?.data?.length === 0 ? (
              <tr><td colSpan={7} className={styles.centerText}>Tidak ada properti ditemukan.</td></tr>
            ) : (
              data?.data?.map((prop: any) => (
                <tr key={prop.id} onClick={() => { setSelectedPropertyId(prop.id); setIsDrawerOpen(true); }} className={styles.tableRow}>
                  <td>
                    <div className={styles.propName}>{prop.nama_property}</div>
                    <div className={styles.propGroup}>{prop.group || '-'}</div>
                  </td>
                  <td>{prop.kawasan}</td>
                  <td>{prop.tipe}</td>
                  <td>{prop.lebar} x {prop.panjang}</td>
                  <td className={styles.priceCol}>{formatRupiah(prop.price)}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[prop.status.replace(' ', '')]}`}>
                      {prop.status}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.siapBadge} ${
                      prop.siap.toLowerCase().replace(/_/g, '').includes('siap')
                        ? styles.SiapHuni
                        : prop.siap.toLowerCase().replace(/_/g, '').includes('indent')
                        ? styles.Indent
                        : styles.DefaultSiap
                    }`}>
                      {prop.siap.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {data?.meta && (
        <div className={styles.pagination}>
          <span className={styles.pageInfo}>
            Menampilkan {data.data.length} dari {data.meta.total} properti
          </span>
          <div className={styles.pageControls}>
            <select className="form-input" style={{ width: 'auto', padding: '4px 8px' }} value={filters.limit} onChange={(e) => handleFilterChange('limit', e.target.value)}>
              <option value="25">25 per halaman</option>
              <option value="50">50 per halaman</option>
              <option value="100">100 per halaman</option>
            </select>
            <button 
              className={styles.pageButton} 
              disabled={filters.page === 1}
              onClick={() => handleFilterChange('page', filters.page - 1)}
            >
              Sebelumnnya
            </button>
            <span className={styles.pageText}>Halaman {filters.page} / {data.meta.totalPages || 1}</span>
            <button 
              className={styles.pageButton} 
              disabled={filters.page >= data.meta.totalPages}
              onClick={() => handleFilterChange('page', filters.page + 1)}
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}

      {/* Drawer Placeholder */}
      {isDrawerOpen && (
        <div className={styles.drawerOverlay} onClick={() => setIsDrawerOpen(false)}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <h2>{selectedPropertyId === 'new' ? 'Tambah Properti' : 'Detail Properti'}</h2>
              <button onClick={() => setIsDrawerOpen(false)} className={styles.closeBtn}><X size={24} /></button>
            </div>
            <div className={styles.drawerContent}>
              <PropertyDrawer 
                propertyId={selectedPropertyId!} 
                userRole={userRole} 
                onClose={() => setIsDrawerOpen(false)} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
