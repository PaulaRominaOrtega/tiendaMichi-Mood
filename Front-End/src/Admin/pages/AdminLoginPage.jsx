import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const PASTEL_COLORS = {
    background: 'bg-pink-50', 
    card: 'bg-white',
    title: 'text-purple-600',
    inputFocus: 'focus:ring-indigo-300 focus:border-indigo-300',
    submitButton: 'bg-indigo-300 hover:bg-indigo-400', 
    errorText: 'text-red-500',
    eyeIcon: 'text-gray-500 hover:text-purple-600',
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email: formData.email,
        password: formData.password,
        tipo: 'administrador',
      });


      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.accessToken);
        navigate('/admin');
      }
    } catch (err) {
      console.error('Error de autenticación:', err);
      setError('Credenciales incorrectas. Inténtalo de nuevo.');
    }
  };

  return (
    <div className={`flex justify-center items-center min-h-screen ${PASTEL_COLORS.background}`}>
      <div className={`w-full max-w-sm p-8 space-y-7 ${PASTEL_COLORS.card} rounded-xl shadow-2xl border border-purple-100 transform transition duration-300 hover:scale-[1.01]`}>
        <h2 className={`text-center text-3xl font-extrabold ${PASTEL_COLORS.title}`}>
            Admin Access
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="sr-only" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email del Administrador"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 ${PASTEL_COLORS.inputFocus} transition duration-150`}
            />
          </div>
          <div className="relative"> 
            <label className="sr-only" htmlFor="password">Contraseña</label>
            <input
              type={showPassword ? 'text' : 'password'} 
              id="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleInputChange}
              required
              className={`w-full pr-12 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 ${PASTEL_COLORS.inputFocus} transition duration-150`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute inset-y-0 right-0 pr-4 flex items-center ${PASTEL_COLORS.eyeIcon} focus:outline-none transition duration-150`}
            >
              {showPassword ? (
                <FaEyeSlash className="h-5 w-5" />
              ) : (
                <FaEye className="h-5 w-5" />
              )}
            </button>
          </div>
          <button
            type="submit"
            className={`w-full px-4 py-3 text-white font-bold ${PASTEL_COLORS.submitButton} rounded-lg transition duration-300 ease-in-out shadow-md hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300`}
          >
            Iniciar Sesión
          </button>
        </form>
        {error && <p className={`text-center text-sm mt-4 font-semibold ${PASTEL_COLORS.errorText}`}>{error}</p>}
      </div>
    </div>
  );
};

export default AdminLoginPage;