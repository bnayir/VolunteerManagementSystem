import { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'Volunteer' 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/Auth/register', formData);
      
      Swal.fire({
        title: 'Kayıt Başarılı! 🎉',
        text: 'Hesabınız oluşturuldu. Şimdi giriş yapabilirsiniz.',
        icon: 'success',
        confirmButtonText: 'Giriş Yap'
      }).then(() => {
        navigate('/login');
      });

    } catch (err) {
      console.error(err);
      Swal.fire('Hata', 'Kayıt işlemi başarısız. Bilgileri kontrol edin.', 'error');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg border-0" style={{ width: '450px' }}>
        <h2 className="text-center mb-4 text-primary fw-bold">🚀 Aramıza Katıl</h2>
        
        <form onSubmit={handleSubmit}>
          
          {/* --- YENİ EKLENEN ROL SEÇİMİ --- */}
          <div className="mb-3">
            <label className="form-label fw-bold">Hesap Türü</label>
            <select 
                name="role" 
                className="form-select border-primary" 
                value={formData.role} 
                onChange={handleChange}
            >
                <option value="Volunteer">👤 Gönüllü Olmak İstiyorum</option>
                <option value="StkAdmin">🏢 Kurum (STK) Hesabı Açmak İstiyorum</option>
            </select>
            <div className="form-text text-muted small">
                {formData.role === 'StkAdmin' 
                    ? 'Kurum hesabınız Admin onayı sonrası aktif olacaktır.' 
                    : 'Gönüllü olarak hemen etkinliklere başvurabilirsiniz.'}
            </div>
          </div>
          {/* ------------------------------- */}

          <div className="row">
            <div className="col-6 mb-3">
              <label className="form-label">Ad</label>
              <input type="text" name="firstName" className="form-control" required onChange={handleChange} />
            </div>
            <div className="col-6 mb-3">
              <label className="form-label">Soyad</label>
              <input type="text" name="lastName" className="form-control" required onChange={handleChange} />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">E-posta</label>
            <input type="email" name="email" className="form-control" required onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">Telefon</label>
            <input type="text" name="phoneNumber" className="form-control" placeholder="555 123 45 67" required onChange={handleChange} />
          </div>

          <div className="mb-4">
            <label className="form-label">Şifre</label>
            <input type="password" name="password" className="form-control" required onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-primary w-100 btn-lg fw-bold">
            {formData.role === 'StkAdmin' ? 'Kurum Kaydını Tamamla' : 'Gönüllü Ol'}
          </button>
        </form>

        <div className="text-center mt-3">
          <small>Zaten hesabın var mı? <Link to="/login" className="text-decoration-none fw-bold">Giriş Yap</Link></small>
        </div>
      </div>
    </div>
  );
};

export default Register;