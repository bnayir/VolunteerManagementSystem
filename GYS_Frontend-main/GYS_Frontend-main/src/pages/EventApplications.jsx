import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';

const EventApplications = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    console.log("Giriş yapan kullanıcı rolü:", user?.role);

    if (!user) {
      navigate('/login');
      return;
    }

    const authorizedRoles = ['Admin', 'SuperAdmin', 'StkAdmin', 'STK'];
    
    if (!authorizedRoles.includes(user.role)) {
      console.warn("Yetkisiz rol erişimi engellendi:", user.role);
      Swal.fire({
        title: 'Yetkisiz Erişim',
        text: `Bu listeyi görmeye yetkiniz yok. Mevcut rolünüz: ${user.role}`,
        icon: 'warning',
        confirmButtonText: 'Tamam'
      });
      navigate('/');
    }
  }, [navigate]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/Application/event/${eventId}`);
      setApplications(response.data);
    } catch (err) {
      console.error("Başvurular çekilirken hata oluştu:", err);
      if (err.response?.status === 403) {
        Swal.fire('Erişim Engellendi', 'Backend bu veriyi görmenize izin vermedi.', 'error');
        navigate('/');
      } else {
        Swal.fire('Hata', 'Başvurular yüklenemedi.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchApplications();
    }
  }, [eventId]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await api.post(`/Application/update-status/${appId}`, JSON.stringify(newStatus), {
        headers: { 'Content-Type': 'application/json' }
      });
      
      Swal.fire('Başarılı', `Başvuru ${newStatus === 'Accepted' ? 'onaylandı' : 'reddedildi'}.`, 'success');
      fetchApplications(); 
    } catch (err) {
      console.error(err);
      Swal.fire('Hata', 'İşlem sırasında bir hata oluştu.', 'error');
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
           <h2 className="text-primary fw-bold mb-0">📋 Başvuru Yönetimi</h2>
           <small className="text-muted">Etkinlik ID: #{eventId}</small>
        </div>
        <button onClick={() => navigate(-1)} className="btn btn-outline-secondary">
           ← Geri Dön
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="alert alert-info text-center shadow-sm py-4">
          <i className="bi bi-info-circle fs-3 d-block mb-2"></i>
          Bu etkinliğe henüz bir başvuru yapılmamış.
        </div>
      ) : (
        <div className="card shadow-sm border-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Gönüllü Bilgileri</th>
                  <th>Başvuru Tarihi</th>
                  <th>Durum</th>
                  <th className="text-end pe-4">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td className="ps-4">
                      <div className="fw-bold text-dark">
                        {app.volunteer?.firstName} {app.volunteer?.lastName}
                      </div>
                      <small className="text-muted">{app.volunteer?.email}</small>
                    </td>
                    <td>{new Date(app.appliedDate).toLocaleDateString('tr-TR')}</td>
                    <td>
                      <span className={`badge rounded-pill ${
                        app.status === 'Accepted' ? 'bg-success' : 
                        app.status === 'Rejected' ? 'bg-danger' : 
                        'bg-warning text-dark'
                      }`}>
                        {app.status === 'Accepted' ? 'Onaylandı' : 
                         app.status === 'Rejected' ? 'Reddedildi' : 'Bekliyor'}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      {app.status === 'Pending' ? (
                        <div className="btn-group shadow-sm">
                          <button 
                            onClick={() => handleStatusChange(app.id, 'Accepted')} 
                            className="btn btn-sm btn-success"
                          >
                            Onayla
                          </button>
                          <button 
                            onClick={() => handleStatusChange(app.id, 'Rejected')} 
                            className="btn btn-sm btn-outline-danger"
                          >
                            Reddet
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted small">İşlem Tamamlandı</span>
                      )}
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

export default EventApplications;