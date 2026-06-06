'use client';

import useSWR from 'swr';
import { History, Calendar, User, Eye } from 'lucide-react';
import styles from './AuditLogs.module.css';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AuditLogs() {
  const { data, error, isLoading } = useSWR('/api/audit-logs', fetcher);
  const [selectedDetails, setSelectedDetails] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getActionBadgeClass = (action: string) => {
    switch (action) {
      case 'CREATE':
        return styles.create;
      case 'UPDATE':
        return styles.update;
      case 'DELETE':
        return styles.delete;
      default:
        return '';
    }
  };

  const parseDetails = (detailsStr: string) => {
    try {
      const obj = JSON.parse(detailsStr);
      return JSON.stringify(obj, null, 2);
    } catch {
      return detailsStr;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <History size={20} className={styles.goldText} />
          <h2 className={styles.cardTitle}>Log Aktivitas (100 Mutasi Terakhir)</h2>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Waktu</th>
                <th>Agent</th>
                <th>Aksi</th>
                <th>Entitas</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className={styles.centerText}>Memuat log aktivitas...</td></tr>
              ) : error ? (
                <tr><td colSpan={5} className={styles.errorText}>Gagal memuat log aktivitas.</td></tr>
              ) : data?.data?.length === 0 ? (
                <tr><td colSpan={5} className={styles.centerText}>Belum ada aktivitas mutasi tercatat.</td></tr>
              ) : (
                data?.data?.map((log: any) => (
                  <tr key={log.id} className={styles.tableRow}>
                    <td className={styles.timeCell}>
                      <Calendar size={12} className={styles.icon} />
                      {formatDate(log.timestamp)}
                    </td>
                    <td className={styles.agentCell}>
                      <User size={12} className={styles.icon} />
                      {log.userEmail}
                    </td>
                    <td>
                      <span className={`${styles.actionBadge} ${getActionBadgeClass(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td>
                      <span className={styles.entityName}>
                        {log.entity}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedDetails(log.details)}
                        className={styles.viewBtn}
                      >
                        <Eye size={14} /> Lihat Data
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details View Modal */}
      {selectedDetails && (
        <div className={styles.modalOverlay} onClick={() => setSelectedDetails(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Detail Payload Mutasi</h3>
              <button onClick={() => setSelectedDetails(null)} className={styles.closeBtn}>
                Tutup
              </button>
            </div>
            <div className={styles.modalContent}>
              <pre className={styles.codeBlock}>
                {parseDetails(selectedDetails)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
