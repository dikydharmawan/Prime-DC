'use client';

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { UserPlus, Power, Key, Shield, ShieldAlert, Check, X } from 'lucide-react';
import styles from './UserManagement.module.css';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function UserManagement() {
  const { data, error, isLoading } = useSWR('/api/users', fetcher);
  
  // States for creating a user
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');

  // States for resetting password
  const [resettingUserId, setResettingUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreateSuccess('');
    setIsCreating(true);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setCreateSuccess('Akun berhasil dibuat!');
        setEmail('');
        setPassword('');
        setRole('Admin');
        mutate('/api/users');
      } else {
        setCreateError(result.error || 'Gagal membuat akun.');
      }
    } catch (err) {
      setCreateError('Gagal menghubungi server.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        mutate('/api/users');
      } else {
        alert(result.error || 'Gagal mengubah status.');
      }
    } catch (err) {
      alert('Gagal menghubungi server.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingUserId) return;
    setResetError('');
    setResetSuccess('');

    try {
      const res = await fetch(`/api/users/${resettingUserId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setResetSuccess('Password berhasil direset!');
        setNewPassword('');
        setTimeout(() => {
          setResettingUserId(null);
          setResetSuccess('');
        }, 2000);
      } else {
        setResetError(result.error || 'Gagal mereset password.');
      }
    } catch (err) {
      setResetError('Gagal menghubungi server.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {/* Create Account Box */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <UserPlus size={20} className={styles.goldText} />
            <h2 className={styles.cardTitle}>Tambah Akun Baru</h2>
          </div>
          
          <form onSubmit={handleCreateUser} className={styles.form}>
            {createError && <div className={styles.errorAlert}>{createError}</div>}
            {createSuccess && <div className={styles.successAlert}>{createSuccess}</div>}

            <div className="form-group">
              <label className="form-label">Email Agent</label>
              <input
                type="email"
                required
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@primeproperty.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                className="form-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Admin">Admin (Read-Only)</option>
                <option value="Superadmin">Superadmin (Full Access)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isCreating}
              className="btn-primary"
              style={{ width: '100%', marginTop: '16px' }}
            >
              {isCreating ? 'Membuat Akun...' : 'Buat Akun'}
            </button>
          </form>
        </div>

        {/* Users Table */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Shield size={20} className={styles.goldText} />
            <h2 className={styles.cardTitle}>Daftar Akun Agent</h2>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={4} className={styles.centerText}>Memuat data akun...</td></tr>
                ) : error ? (
                  <tr><td colSpan={4} className={styles.errorText}>Gagal memuat akun.</td></tr>
                ) : data?.data?.length === 0 ? (
                  <tr><td colSpan={4} className={styles.centerText}>Tidak ada akun agent.</td></tr>
                ) : (
                  data?.data?.map((user: any) => (
                    <tr key={user.id} className={styles.tableRow}>
                      <td>
                        <span className={styles.userEmail}>{user.email}</span>
                      </td>
                      <td>
                        <span className={`${styles.roleBadge} ${styles[user.role]}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${user.is_active ? styles.active : styles.inactive}`}>
                          {user.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className={styles.actionsCell}>
                        <button
                          onClick={() => handleToggleStatus(user.id, user.is_active)}
                          className={`${styles.actionBtn} ${user.is_active ? styles.deactivateBtn : styles.activateBtn}`}
                          title={user.is_active ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                        >
                          <Power size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setResettingUserId(user.id);
                            setResetError('');
                            setResetSuccess('');
                            setNewPassword('');
                          }}
                          className={`${styles.actionBtn} ${styles.resetBtn}`}
                          title="Reset Password"
                        >
                          <Key size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reset Password Modal/Overlay */}
      {resettingUserId && (
        <div className={styles.modalOverlay} onClick={() => setResettingUserId(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Reset Password Akun</h3>
              <button onClick={() => setResettingUserId(null)} className={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleResetPassword} className={styles.modalContent}>
              {resetError && <div className={styles.errorAlert}>{resetError}</div>}
              {resetSuccess && <div className={styles.successAlert}>{resetSuccess}</div>}

              <p className={styles.modalText}>
                Masukkan password baru untuk akun <strong>{data?.data?.find((u: any) => u.id === resettingUserId)?.email}</strong>.
              </p>

              <div className="form-group">
                <label className="form-label">Password Baru</label>
                <input
                  type="password"
                  required
                  className="form-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', marginTop: '16px' }}
              >
                Reset Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
