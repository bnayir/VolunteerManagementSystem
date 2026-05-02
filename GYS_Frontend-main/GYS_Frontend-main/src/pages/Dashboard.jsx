import { useEffect, useState } from 'react';
import api from '../services/api';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Link } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [role, setRole] = useState(localStorage.getItem('userRole')); 
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  const [myApps, setMyApps] = useState([]);
  const [myEvents, setMyEvents] = useState([]);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    setName(userEmail ? userEmail.split('@')[0] : 'Kullanıcı');

    const currentRole = localStorage.getItem('userRole');
    setRole(currentRole);

    if (currentRole === 'StkAdmin') {
        fetchStkData();
    } 
    else if (currentRole === 'Volunteer' || currentRole === 'Gonullu' || !currentRole) {
        fetchVolunteerData();
    } 
    else {
        setLoading(false);
    }
  }, []);

  const fetchStkData = async () => {
    try {
        const res = await api.get('/Event/my-events');
        setMyEvents(res.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchVolunteerData = async () => {
    try {
        const res = await api.get('/Application/my-applications');
        // Gelen veriyi konsola da yazalım
        console.log("Çekilen Başvurular:", res.data);
        setMyApps(res.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  // --- SÜPER FİLTRE ---
  const checkStatus = (item, type) => {
    const statusValue = item.status || item.Status || item.approvalStatus || "";
    const cleanStatus = statusValue.toString().toLowerCase().trim();

    if (type === 'approved') return cleanStatus.includes('accept') || cleanStatus.includes('approv') || cleanStatus.includes('onay');
    if (type === 'rejected') return cleanStatus.includes('reject') || cleanStatus.includes('red');
    if (type === 'pending') return cleanStatus.includes('pend') || cleanStatus.includes('bekle');
    return false;
  };

  // --- GRAFİKLER ---
  const stkChartData = {
    labels: myEvents.map(e => e.name),
    datasets: [{
        label: 'Kontenjan',
        data: myEvents.map(e => e.quota),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
    }],
  };

  const volunteerChartData = {
    labels: ['Onaylanan', 'Reddedilen', 'Bekleyen'],
    datasets: [{
        label: 'Başvuru Durumu',
        data: [
            myApps.filter(a => checkStatus(a, 'approved')).length,
            myApps.filter(a => checkStatus(a, 'rejected')).length,
            myApps.filter(a => checkStatus(a, 'pending')).length
        ],
        backgroundColor: ['#198754', '#dc3545', '#ffc107'],
        borderWidth: 1,
    }],
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  if (role === 'SuperAdmin') {
    return (
        <div className="container mt-5">
            <div className="bg-dark text-white p-5 rounded-3 shadow text-center">
                <h1 className="display-4 fw-bold">🛡️ Sistem Yönetim Merkezi</h1>
                <Link to="/admin" className="btn btn-danger btn-lg px-5 fw-bold mt-2">Yönetim Paneline Git →</Link>
            </div>
        </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="bg-primary text-white p-5 rounded-3 shadow-sm mb-4 position-relative overflow-hidden">
        <div className="position-relative z-1">
            <h1 className="fw-bold">Hoşgeldin, {name}! 👋</h1>
            <p className="lead opacity-75">
                {role === 'StkAdmin' ? 'Kurum istatistiklerin aşağıdadır.' : 'Gönüllülük durumun aşağıdadır.'}
            </p>
        </div>
        <div className="position-absolute top-50 end-0 translate-middle-y me-5 text-end z-1">
            <h1 className="display-1 fw-bold mb-0">
                {role === 'StkAdmin' ? myEvents.length : myApps.length}
            </h1>
            <span className="fs-5 opacity-75">
                {role === 'StkAdmin' ? 'Toplam Etkinlik' : 'Toplam Başvuru'}
            </span>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-white py-3">
                    <h5 className="mb-0 fw-bold">
                        {role === 'StkAdmin' ? '📊 Etkinlik Kontenjan Analizi' : '📊 Başvuru Durum Analizi'}
                    </h5>
                </div>
                <div className="card-body">
                    {/* Eğer veri yoksa uyarı göster */}
                    {role !== 'StkAdmin' && myApps.length === 0 ? (
                        <div className="text-center py-5">
                            <h4 className="text-muted">Henüz başvuru verisi yok.</h4>
                            <p>Grafiğin oluşması için bir etkinliğe başvurmalısın.</p>
                            <Link to="/events" className="btn btn-primary">Etkinliklere Git</Link>
                        </div>
                    ) : (
                        role === 'StkAdmin' ? <Bar data={stkChartData} /> : <Bar data={volunteerChartData} />
                    )}
                </div>
            </div>
        </div>

        <div className="col-md-4">
             <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-white py-3">
                    <h6 className="mb-0 fw-bold">🎨 Dağılım</h6>
                </div>
                <div className="card-body d-flex justify-content-center">
                    <div style={{ width: '200px' }}>
                         {role === 'StkAdmin' ? (
                             myEvents.length > 0 ? <Doughnut data={stkChartData} /> : <small>Veri yok</small>
                        ) : (
                             myApps.length > 0 ? <Doughnut data={volunteerChartData} /> : <small>Veri yok</small>
                        )}
                    </div>
                </div>
            </div>
             <div className="card p-4 text-center">
                <h5>Hızlı İşlem</h5>
                {role === 'StkAdmin' ? (
                    <Link to="/create-event" className="btn btn-warning w-100">Etkinlik Oluştur</Link>
                ) : (
                    <Link to="/events" className="btn btn-outline-primary w-100">Etkinliklere Git</Link>
                )}
             </div>
        </div> 
      </div>
    </div>
  );
};

export default Dashboard;