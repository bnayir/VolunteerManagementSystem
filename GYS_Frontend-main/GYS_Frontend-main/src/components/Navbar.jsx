import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const role = localStorage.getItem('userRole'); 

  const hideRoutes = ['/', '/login', '/register'];

  if (hideRoutes.includes(location.pathname)) {
    return null;
  }

  const handleLogout = () => {
    localStorage.clear(); // Tüm hafızayı temizle
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4 shadow">
      <Link className="navbar-brand fw-bold" to="/dashboard">🚀 Gönüllü YS</Link>
      
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          
          {/* ORTAK LİNK */}
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard">Ana Sayfa</Link>
          </li>

          {/* ROL KONTROLLERİ */}
          {role === 'StkAdmin' ? (
            // --- STK MENÜSÜ ---
            <>
              <li className="nav-item">
                <Link className="nav-link fw-bold text-warning" to="/stk-events">⚙️ Yönetim Paneli</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/create-event">➕ Etkinlik Ekle</Link>
              </li>
            </>
          ) : role === 'SuperAdmin' ? (
            // --- SUPER ADMIN MENÜSÜ ---
            <>
               <li className="nav-item">
                 <Link className="nav-link fw-bold text-danger bg-white rounded px-3 ms-2" style={{color: '#dc3545 !important'}} to="/admin">
                   🛡️ Admin Paneli
                 </Link>
               </li>
            </>
          ) : (
            // --- GÖNÜLLÜ MENÜSÜ ---
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/events">🌈 Etkinlikler</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/my-applications">📂 Başvurularım</Link>
              </li>
            </>
          )}

          <li className="nav-item">
            <Link className="nav-link" to="/profile">👤 Profilim</Link>
          </li>
        </ul>
        
        <div className="d-flex align-items-center">
            {role === 'StkAdmin' && <span className="badge bg-warning text-dark me-3">Kurum Hesabı</span>}
            {role === 'SuperAdmin' && <span className="badge bg-danger text-white me-3">Yönetici</span>}
            <button onClick={handleLogout} className="btn btn-outline-light btn-sm">Çıkış Yap</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;