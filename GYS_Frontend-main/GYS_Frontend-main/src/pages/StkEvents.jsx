import { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom'; 
import Swal from 'sweetalert2';

const StkEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Kendi etkinliklerimizi çekiyoruz
  const fetchMyEvents = async () => {
    try {
      const response = await api.get('/Event/my-events');
      // Güvenli veri kontrolü
      if (Array.isArray(response.data)) {
          setEvents(response.data);
      } else {
          setEvents([]); 
      }
    } catch (err) {
      console.error("Veri çekme hatası:", err);
      Swal.fire('Hata', 'Etkinlikler yüklenirken sorun oluştu.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  // Etkinlik Silme Fonksiyonu
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Emin misiniz?',
      text: "Bu etkinliği silerseniz geri alamazsınız!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Evet, Sil!',
      cancelButtonText: 'Vazgeç'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/Event/${id}`);
        Swal.fire('Silindi!', 'Etkinlik başarıyla silindi.', 'success');
        fetchMyEvents(); // Listeyi yenile
      } catch (err) {
        console.error("Silme hatası:", err);
        Swal.fire('Hata', 'Silme işlemi başarısız.', 'error');
      }
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">🏢 Kurum Etkinlik Yönetimi</h2>
        <Link to="/create-event" className="btn btn-success">
           ➕ Yeni Etkinlik Ekle
        </Link>
      </div>

      {!events || events.length === 0 ? (
        <div className="alert alert-info text-center">
          Henüz hiç etkinlik oluşturmadınız.
        </div>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-hover align-middle">
            <thead className="bg-light">
              <tr>
                <th>Etkinlik Adı</th>
                <th>Tarih</th>
                <th>Konum</th>
                <th>Kontenjan</th>
                <th className="text-end">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {events.map((evt) => (
                <tr key={evt.id}>
                  <td className="fw-bold">{evt.name}</td>
                  <td>{evt.date ? new Date(evt.date).toLocaleDateString() : "-"}</td>
                  <td>{evt.location}</td>
                  <td>{evt.quota} Kişi</td>
                  
                  {/* ------ */}
                  <td className="text-end">
                    
                    {/* 1. Başvurular Butonu */}
                    <Link 
                        to={`/applications/${evt.id}`} 
                        className="btn btn-sm btn-info me-2 text-white"
                    >
                        👥 Başvurular
                    </Link>

                    {/* 2. Sil Butonu */}
                    <button 
                        onClick={() => handleDelete(evt.id)} 
                        className="btn btn-sm btn-outline-danger"
                    >
                        🗑️ Sil
                    </button>
                  </td>
                  {/* ---------------------------------- */}

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StkEvents;