import { useEffect, useState } from 'react';
import api from '../services/api'; 
import Swal from 'sweetalert2';    

const AdminPanel = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bekleyenleri Çek
  const fetchPendingOrgs = async () => {
    try {
      const response = await api.get('/Admin/pending-organizations');
      setOrganizations(response.data);
    } catch (err) {
      console.error("Veri çekme hatası:", err);
      Swal.fire('Hata', 'Veriler yüklenirken bir sorun oluştu veya yetkiniz yok.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingOrgs();
  }, []);

  // Karar Butonları (Onayla / Reddet)
  const handleDecision = async (orgId, decision) => {
    try {
      await api.post('/Admin/update-status', {
        organizationId: orgId,
        newStatus: decision
      });

      Swal.fire(
        'İşlem Tamam',
        `Kurum ${decision === 'Approved' ? 'Onaylandı' : 'Reddedildi'}.`,
        'success'
      );
      
      // Listeyi yenile
      fetchPendingOrgs(); 
    } catch (err) {
      console.error(err);
      Swal.fire('Hata', 'İşlem başarısız oldu.', 'error');
    }
  };

  if (loading) {
    return (
        <div className="d-flex justify-content-center mt-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Yükleniyor...</span>
            </div>
        </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-danger fw-bold mb-4">🛡️ Süper Admin Paneli</h2>
      <p className="text-muted">Aşağıdaki kurumlar onayınızı bekliyor.</p>
      
      {organizations.length === 0 ? (
        <div className="alert alert-success text-center">
            Harika! Bekleyen başvuru yok. Her şey güncel. ✨
        </div>
      ) : (
        <div className="card shadow-lg border-0">
            <div className="card-header bg-dark text-white">
                <h5 className="mb-0">Onay Bekleyen STK'lar</h5>
            </div>
            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                        <tr>
                            <th className="ps-4">Kurum Adı</th>
                            <th>Açıklama</th>
                            <th>İletişim</th>
                            <th className="text-end pe-4">Karar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {organizations.map(org => (
                            <tr key={org.id}>
                                <td className="ps-4 fw-bold">{org.name}</td>
                                <td>
                                    <small>
                                        {org.description 
                                            ? (org.description.length > 50 ? org.description.substring(0, 50) + '...' : org.description) 
                                            : '-'}
                                    </small>
                                </td>
                                <td>{org.contactEmail}</td>
                                <td className="text-end pe-4">
                                    <button 
                                        onClick={() => handleDecision(org.id, 'Approved')} 
                                        className="btn btn-sm btn-success me-2"
                                    >
                                        ✅ Onayla
                                    </button>
                                    <button 
                                        onClick={() => handleDecision(org.id, 'Rejected')} 
                                        className="btn btn-sm btn-outline-danger"
                                    >
                                        ❌ Reddet
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;