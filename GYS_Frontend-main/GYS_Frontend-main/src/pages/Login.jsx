import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Swal ekledik daha profesyonel görünür

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const parseJwt = (token) => {
    try {
      if (!token) return null;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post('/Auth/login', { email, password });
      
      if (response.data && response.data.token) {
        const token = response.data.token;
        
        localStorage.setItem('token', token);

        const decodedToken = parseJwt(token);
        let userRole = 'Volunteer';

        if (decodedToken) {
            const roleKey = Object.keys(decodedToken).find(key => key.toLowerCase().includes('role'));
            if (roleKey) {
                userRole = decodedToken[roleKey];
                if (Array.isArray(userRole)) userRole = userRole[0];
            }
        }

        const userData = {
            email: email,
            role: userRole
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('userEmail', email);

        Swal.fire({
            icon: 'success',
            title: 'Giriş Başarılı',
            text: `Hoş geldiniz! Rolünüz: ${userRole}`,
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            navigate('/dashboard');
            window.location.reload(); 
        });
      }
    } catch (err) {
      console.error(err);
      setError("Giriş başarısız! E-posta veya şifre hatalı.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg border-0" style={{ width: '400px', borderRadius: '15px' }}>
        <h2 className="text-center mb-4 fw-bold text-primary">Gönüllü YS</h2>
        {error && <div className="alert alert-danger py-2 small">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">E-posta</label>
            <input 
                type="email" className="form-control" value={email} 
                onChange={(e) => setEmail(e.target.value)} required 
                placeholder="ornek@mail.com"
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Şifre</label>
            <input 
                type="password" className="form-control" value={password} 
                onChange={(e) => setPassword(e.target.value)} required 
                placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-bold py-2 mt-2">Giriş Yap</button>
        </form>
      </div>
    </div>
  );
};

export default Login;