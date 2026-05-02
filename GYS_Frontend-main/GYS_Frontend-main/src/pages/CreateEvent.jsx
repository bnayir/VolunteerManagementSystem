import { useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    quota: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    Swal.fire({ title: 'Oluşturuluyor...', didOpen: () => Swal.showLoading() });

    try {
      const payload = {
        ...formData,
        quota: Number(formData.quota), 
        date: new Date(formData.date).toISOString() 
      };

      await api.post('/Event', payload);       
      
      Swal.fire('Harika!', 'Etkinlik başarıyla oluşturuldu.', 'success');
      navigate('/events'); 
    } catch (err) {
      console.error("Detaylı Hata:", err.response?.data); 
      
      const errorMsg = err.response?.data?.message || 'Veriler geçersiz. Lütfen tüm alanları kontrol edin.';
      Swal.fire('Hata', errorMsg, 'error');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white text-center py-3">
              <h3 className="mb-0 fw-bold">✨ Yeni Etkinlik Oluştur</h3>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                
                <div className="mb-3">
                  <label className="form-label fw-bold">Etkinlik Adı</label>
                  <input type="text" name="name" className="form-control" placeholder="Etkinliğin başlığını girin" required onChange={handleChange} />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Açıklama</label>
                  <textarea name="description" className="form-control" rows="4" placeholder="Gönüllülere etkinlik hakkında detay verin..." required onChange={handleChange}></textarea>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Tarih & Saat</label>
                    <input type="datetime-local" name="date" className="form-control" required onChange={handleChange} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Kontenjan (Kişi Sayısı)</label>
                    <input type="number" name="quota" className="form-control" min="1" required onChange={handleChange} />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">Konum / Adres</label>
                  <input type="text" name="location" className="form-control" placeholder="Örn: İstanbul, Beşiktaş Sahil" required onChange={handleChange} />
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-success btn-lg">
                    ✅ Etkinliği Yayınla
                  </button>
                </div>
              
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;