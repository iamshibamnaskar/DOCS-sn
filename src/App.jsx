import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import MainPage from './pages/main';
import EditorPage from './pages/editor';
import LoginPage from './pages/login';
import Navbar from './components/navbar';
import { Toaster } from 'react-hot-toast';

function Layout() {
  const location = useLocation();
  
  const showNavbar = location.pathname.startsWith("/main") || location.pathname.startsWith("/editor");


  return (
    <div className='bg-gray-50'>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/main' element={<MainPage />} />
        <Route path='/editor/:id?' element={<EditorPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </Router>
  );
}

export default App;
