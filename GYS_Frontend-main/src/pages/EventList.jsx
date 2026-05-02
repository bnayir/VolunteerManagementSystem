import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/Event');
        setEvents(response.data);
      } catch {
        Swal.fire("Hata", "Etkinlikler sunucudan çekilemedi.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleJoin = async (eventId) => {
    try {
      await api.post(`/Event/${eventId}/join`); 
      
      Swal.fire({
        title: 'Başarılı!',
        text: 'Etkinliğe başvurunuz alındı.',
        icon: 'success',
        confirmButtonText: 'Başvurularıma Git'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/my-applications'); 
        }
      });
    } catch (err) {
      console.error(err);
      Swal.fire('Bilgi', 'Başvuru yapılamadı. Zaten başvurmuş olabilirsiniz.', 'info');
    }
  };

  const handleShowReviews = async (eventId, eventName) => {
    try {
      Swal.fire({ title: 'Yorumlar Yükleniyor...', didOpen: () => Swal.showLoading() });
      const res = await api.get(`/Review/get-by-event/${eventId}`);
      const reviews = res.data;

      if (reviews.length === 0) {
        Swal.fire('Henüz Yorum Yok', 'Bu etkinlik için henüz kimse değerlendirme yapmamış.', 'info');
        return;
      }

      let reviewsHtml = '<div style="max-height: 400px; overflow-y: auto; text-align: left;">';
      reviews.forEach(review => {
        const stars = '⭐'.repeat(review.rating);
        reviewsHtml += `
          <div class="card mb-3 border-0 shadow-sm bg-light">
            <div class="card-body p-3">
              <div class="d-flex justify-content-between align-items-center mb-2">
                 <strong class="text-primary">${review.volunteerName}</strong>
                 <small class="text-muted">${new Date(review.createdDate).toLocaleDateString()}</small>
              </div>
              <div class="mb-2 text-warning">${stars}</div>
              <p class="mb-2 text-dark">${review.comment}</p>
            </div>
          </div>
        `;
      });
      reviewsHtml += '</div>';

      Swal.fire({
        title: `${eventName} - Değerlendirmeler`,
        html: reviewsHtml,
        width: 600,
        confirmButtonText: 'Tamam',
      });
    } catch {
      Swal.fire('Hata', 'Yorumlar alınırken bir sorun oluştu.', 'error');
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary">Aktif Etkinlikler</h1>
        <p className="lead text-muted">Senin yardımını bekleyen onlarca proje var.</p>
      </div>

      {events.length === 0 ? (
        <div className="alert alert-warning text-center p-5 shadow-sm">
            <h3>📭 Henüz Aktif Etkinlik Yok</h3>
            <p>Daha sonra tekrar kontrol et.</p>
        </div>
      ) : (
        <div className="row">
            {events.map((event) => (
            <div key={event.id} className="col-md-4 mb-4">
                <div className="card h-100 shadow border-0">
                <img 
                    src={`https://placehold.co/600x400/EEE/31343C?text=${encodeURIComponent(event.name)}`} 
                    className="card-img-top" 
                    alt="etkinlik" 
                />
                
                <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title fw-bold text-dark">{event.name}</h5>
                        <span className="badge bg-info text-dark">
                          {event.date ? new Date(event.date).toLocaleDateString() : 'Tarih Yok'}
                        </span>
                    </div>
                    
                    <p className="card-text text-muted flex-grow-1">
                    {event.description?.substring(0, 100)}...
                    </p>
                    
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <small className="text-muted">📍 {event.location || 'Konum Belirtilmedi'}</small>
                        <small className="fw-bold text-primary">Kontenjan: {event.quota}</small>
                    </div>

                    <hr />

                    <div className="d-grid gap-2">
                    <button 
                        onClick={() => handleJoin(event.id)} 
                        className="btn btn-primary fw-bold"
                    >
                        ✋ Hemen Başvur
                    </button>
                    
                    <button 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleShowReviews(event.id, event.name)}
                    >
                        💬 Yorumları Gör
                    </button>
                    </div>
                </div>
                </div>
            </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default EventList;