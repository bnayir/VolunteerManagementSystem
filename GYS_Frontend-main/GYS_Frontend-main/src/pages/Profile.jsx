import { useEffect, useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/Auth/profile');
      setUser(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire('Hata', 'Profil bilgileri yüklenemedi. Lütfen tekrar giriş yap.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-header bg-primary text-white text-center py-4 rounded-top-4">
              <h2 className="mb-0">👤 Profilim</h2>
            </div>
            <div className="card-body p-5">
              
              {user ? (
                <>
                  <div className="text-center mb-4">
                    <div className="display-1 bg-light rounded-circle d-inline-block p-3 border border-3 border-primary text-primary fw-bold" style={{width: '120px', height: '120px', fontSize: '3rem', lineHeight: '80px'}}>
                      {user.firstName?.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  <div className="mb-3 border-bottom pb-2">
                    <small className="text-muted d-block">Ad Soyad</small>
                    <h4 className="fw-bold text-dark">{user.firstName} {user.lastName}</h4>
                  </div>

                  <div className="mb-3 border-bottom pb-2">
                    <small className="text-muted d-block">E-posta</small>
                    <h5 className="text-dark">{user.email}</h5>
                  </div>

                  <div className="mb-3 border-bottom pb-2">
                    <small className="text-muted d-block">Telefon</small>
                    <h5 className="text-dark">{user.phoneNumber || '-'}</h5>
                  </div>

                  <div className="mb-4">
                    <small className="text-muted d-block">Rol / Yetki</small>
                    <div className="mt-3">
    {/* Admin veya SuperAdmin ise Kırmızı/Mavi yap */}
    {(user.role === 'Admin' || user.role === 'SuperAdmin') && (
        <span className="badge bg-danger fs-6 px-3 py-2">🛡️ Yönetici</span>
    )}

    {/* STK ise Turuncu yap */}
    {user.role === 'StkAdmin' && (
        <span className="badge bg-warning text-dark fs-6 px-3 py-2">🏢 Kurum Temsilcisi</span>
    )}

    {/* Gönüllü ise Yeşil yap */}
    {user.role === 'Gonullu' && (
        <span className="badge bg-success fs-6 px-3 py-2">👤 Gönüllü</span>
    )}
</div>
                  </div>

                  <div className="alert alert-info d-flex align-items-center" role="alert">
                    <i className="bi bi-info-circle-fill me-2 fs-4"></i>
                    <div>
                      Bilgilerini güncellemek istersen şimdilik yönetici ile iletişime geçmelisin.
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-danger">Kullanıcı bilgisi bulunamadı.</div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;