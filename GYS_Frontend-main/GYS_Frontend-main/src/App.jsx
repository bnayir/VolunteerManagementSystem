import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import EventList from './pages/EventList';
import Profile from './pages/Profile';
import StkEvents from './pages/StkEvents';
import EventApplications from './pages/EventApplications';
import AdminPanel from './pages/AdminPanel';
import MyApplications from './pages/MyApplications'; 

function App() {
  return (
    <>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Etkinlik Listesi ve Detaylar */}
        <Route path="/events" element={<EventList />} />
        
        {/* STK'ya Özel Rotalar */}
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/stk-events" element={<StkEvents />} />
        {/*  */}
// App.jsx içinde ilgili satırı bul ve tam olarak şununla değiştir:
<Route path="/applications/:eventId" element={<EventApplications />} />        
        {/* Gönüllüye Özel Rotalar */}
        <Route path="/my-applications" element={<MyApplications />} />
        
        {/* Genel Rotalar */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </>
  );
}

export default App;