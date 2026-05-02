import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-primary text-white text-center px-3">
      <div className="mb-4">
        <h1 className="display-1 fw-bold">🚀 Gönüllü YS</h1>
        <p className="lead fs-3">Dünyayı değiştirmek için küçük bir adım at.</p>
      </div>
      
      <div className="bg-white p-5 rounded-4 shadow-lg text-dark" style={{ maxWidth: '600px' }}>
        <h3 className="fw-bold mb-3">Aramıza Hoş Geldin!</h3>
        <p className="text-muted mb-4">
          Gönüllü olarak etkinliklere katılabilir veya Kurum olarak kendi topluluğunu oluşturabilirsin.
        </p>
        
        <div className="d-grid gap-3 d-sm-flex justify-content-center">
          <Link to="/login" className="btn btn-primary btn-lg px-5 fw-bold">
            Giriş Yap
          </Link>
          <Link to="/register" className="btn btn-outline-primary btn-lg px-5 fw-bold">
            Kayıt Ol
          </Link>
        </div>
      </div>

      <footer className="mt-5 text-white-50">
        <small>&copy; 2024 Gönüllü Yönetim Sistemi</small>
      </footer>
    </div>
  );
};

export default Home;