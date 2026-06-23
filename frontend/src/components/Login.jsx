import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', data);
      
      alert('Login successful! Redirecting to workspace...');
      
      // Fire the login success handler passed from App.jsx to save the session
      onLogin(response.data);
      
      // Move the user to the dynamic routing /dashboard pathway
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Authentication failed. Check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-5">
        <h2 className="text-2xl font-bold text-center text-blue-600">Account Sign In</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input 
            type="email" 
            {...register('email', { required: true })} 
            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-200" 
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">Email is required to authenticate.</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input 
            type="password" 
            {...register('password', { required: true })} 
            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-200" 
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">Password entry required.</p>}
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
          Sign In
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          Need a profile setup?{' '}
          <span className="text-blue-600 cursor-pointer underline" onClick={() => navigate('/register')}>
            Register here
          </span>
        </p>
      </form>
    </div>
  );
}