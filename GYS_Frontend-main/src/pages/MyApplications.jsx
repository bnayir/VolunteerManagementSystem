import { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    try {
      const response = await api.get('/Application/my-applications');
      setApplications(response.data);
    } catch (err) {
      console.error("Hata:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (eventId, eventName) => {
    const { value: formValues } = await Swal.fire({
      title: `<h3 class="text-primary">${eventName}</h3>`,
      html: `
        <p>Etkinliği nasıl buldun?</p>
        <div class="mb-3">
            <select id="swal-rating" class="form-select border-primary text-center fw-bold">
                <option value="5">⭐⭐⭐⭐⭐ (Harika)</option>
                <option value="4">⭐⭐⭐⭐ (İyi)</option>
                <option value="3">⭐⭐⭐ (Orta)</option>
                <option value="2">⭐⭐ (Kötü)</option>
                <option value="1">⭐ (Berbat)</option>
            </select>
        </div>
        <textarea id="swal-comment" class="form-control mb-2" placeholder="Yorumunu buraya yaz..." rows="3"></textarea>
        <input id="swal-image" class="form-control" placeholder="Fotoğraf Linki (İsteğe bağlı)" />
      `,
      showCancelButton: true,
      confirmButtonText: 'Gönder 🚀',
      cancelButtonText: 'Vazgeç',
      preConfirm: () => {
        return {
          rating: document.getElementById('swal-rating').value,
          comment: document.getElementById('swal-comment').value,
          imageUrl: document.getElementById('swal-image').value
        }
      }
    });

    if (formValues) {
      try {
        await api.post('/Review/add', {
            eventId: eventId,
            rating: parseInt(formValues.rating),
            comment: formValues.comment,
            imageUrl: formValues.imageUrl
        });
        Swal.fire('Süper!', 'Yorumun başarıyla kaydedildi.', 'success');
      } catch (error) {
        Swal.fire('Hata', error.response?.data || 'Bir sorun oluştu.', 'error');
      }
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-primary fw-bold">📂 Başvurularım</h2>
      
      {applications.length === 0 ? (
        <div className="alert alert-info text-center p-5">
            <h4>Henüz başvurun yok.</h4>
            <Link to="/events" className="btn btn-primary mt-3">Etkinliklere Git</Link>
        </div>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="ps-4">Etkinlik Adı</th>
                <th>Tarih</th>
                <th>Durum</th>
                <th className="text-end pe-4">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td className="ps-4 fw-bold">{app.eventName}</td>
                  <td>{new Date(app.eventDate).toLocaleDateString()}</td>
                  <td>
                    {app.status === 'Pending' && <span className="badge bg-warning text-dark">Beklemede</span>}
                    {(app.status === 'Accepted' || app.status === 'Approved') && <span className="badge bg-success">Onaylandı</span>}
                    {app.status === 'Rejected' && <span className="badge bg-danger">Reddedildi</span>}
                  </td>
                  <td className="text-end pe-4">
                    {(app.status === 'Accepted' || app.status === 'Approved') ? (
                        <button 
                            className="btn btn-sm btn-outline-warning fw-bold"
                            onClick={() => handleReview(app.eventId, app.eventName)}
                        >
                            ⭐ Değerlendir
                        </button>
                    ) : (
                        <small className="text-muted">-</small>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyApplications;