/* eslint-disable no-unused-vars */
import { useState} from 'react';
import API from '../utils/axios';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from 'jwt-decode';
import Loader from '../utils/Loader';

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try {
      const response = await API.post('/auth/login', {
        email,
        password,
      });
      setLoading(false); 
      if (response.status === 200) {
        const token = response.data.token;
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.id.user.role
        const userId = decodedToken.id.user.id 
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', userRole)
        localStorage.setItem('userId', userId)
        toast.success(response.data.message);  
        if(userRole === 'Admin'){
          navigate('/admin/dashboard');
        }else{
          navigate('/buyerDash')
        }
      } 
    } catch (error) {
      setLoading(false); // Stop loading
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred while logging in");
      }
    }
  };  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 to-pink-500">
      <div className="max-w-md w-full p-6 bg-white rounded-md shadow-md">
        <h2 className="text-center text-2xl mb-4 font-bold text-gray-800">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200 focus:outline-none focus:ring focus:border-blue-500"
            disabled={loading} 
          >
            {loading ? <Loader /> : 'Login'} 
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
