import { useForm, type SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../lib/apiClient';
import { isAxiosError, type AxiosError } from 'axios';
import type { UserDto } from '../types';

type FormData = {
  username: string;
  email: string;
  password: string;
};

type ApiError = {
  error: string;
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const registerMutation = useMutation<UserDto, AxiosError<ApiError>, FormData>({
    mutationFn: (data: FormData) => apiClient.post('/auth/register', data).then(res => res.data),
    onSuccess: () => {
      console.log('Registration successful!');
      navigate('/login');
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    registerMutation.mutate(data);
  };

  const getErrorMessage = () => {
    if (registerMutation.error) {
      if (isAxiosError<ApiError>(registerMutation.error) && registerMutation.error.response) {
        return registerMutation.error.response.data.error;
      }
      return "An unexpected error occurred.";
    }
    return null;
  };

  return (
    <div className="p-8 max-w-md w-full bg-gray-800/80 backdrop-blur-md rounded-lg shadow-xl">
      <h2 className="font-tomorrow text-4xl font-bold mb-6 text-center text-white">Create Your Account</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-4">
          <label className="block font-tomorrow text-white text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input 
            {...register('username', { required: 'Username is required' })} 
            className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block font-tomorrow text-white text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input 
            {...register('email', { 
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } 
            })} 
            type="email"
            className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div className="mb-6">
          <label className="block font-tomorrow text-white text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input 
            {...register('password', { 
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' }
            })} 
            type="password"
            className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        {registerMutation.isError && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>{getErrorMessage()}</p>
          </div>
        )}

        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 font-tomorrow text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline disabled:bg-gray-400"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? 'Registering...' : 'Create Account'}
        </button>
        <p className="font-tomorrow text-center text-sm text-white mt-4">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-blue-600 hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}