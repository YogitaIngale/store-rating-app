import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // Sends name, email, address, password, AND role directly to NestJS
      await axios.post('http://localhost:3000/auth/register', data);
      alert('Registration complete! Please sign in.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Error executing request matrix setup values');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg space-y-5">
        <h2 className="text-2xl font-bold text-center text-blue-600">Register Account</h2>

        {/* Full Name Input Layer */}
        <div>
          <label className="block text-sm font-medium">Full Name (Min 6 characters for validation test)</label>
          <input 
            type="text" 
            {...register('name', { required: true, minLength: 3, maxLength: 60 })} 
            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-200" 
            placeholder="Type name or full name sequence..."
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">Name must be 20-60 characters long.</p>}
        </div>

        {/* Email Input Layer */}
        <div>
          <label className="block text-sm font-medium">Email Address</label>
          <input 
            type="email" 
            {...register('email', { required: true, pattern: /^\S+@\S+$/i })} 
            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-200" 
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">Enter a valid email address.</p>}
        </div>

        {/* Dynamic System Role Dropdown Matrix */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Account Type / Workspace Role</label>
          <select 
            {...register('role', { required: true })}
            className="w-full mt-1 p-2 border rounded-md bg-white focus:ring focus:ring-blue-200 text-sm"
          >
            <option value="User">Regular Customer (UserDashboard)</option>
            <option value="Owner">Business / Store Merchant (OwnerDashboard)</option>
            <option value="Admin">System Administrator (AdminDashboard)</option>
          </select>
          {errors.role && <p className="text-red-500 text-xs mt-1">Please select an account type mapping.</p>}
        </div>

        {/* Physical Address Text Area */}
        <div>
          <label className="block text-sm font-medium">Physical Address (Max 400 characters)</label>
          <textarea 
            {...register('address', { required: true, maxLength: 400 })} 
            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-200" 
          />
          {errors.address && <p className="text-red-500 text-xs mt-1">Address cannot exceed 400 characters.</p>}
        </div>

        {/* Secure Password Input */}
        <div>
          <label className="block text-sm font-medium">Password (8-16, 1 Upper, 1 Special)</label>
          <input 
            type="password" 
            {...register('password', { 
              required: true, 
              minLength: 6, 
              maxLength: 16,
              validate: v => /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/.test(v)
            })} 
            className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-200" 
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">Password must conform to specific guidelines.</p>}
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
          Sign Up
        </button>
      </form>
    </div>
  );
}