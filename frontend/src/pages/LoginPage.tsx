import { useForm, type SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../lib/apiClient';
import { isAxiosError, type AxiosError } from 'axios';
import type { LoginResponseDto } from '../types';
import { useAuthStore } from '../stores/authStore';

type FormData = {
  username: string;
  password: string;
};

type ApiError = {
  error: string;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const loginMutation = useMutation<LoginResponseDto, AxiosError<ApiError>, FormData>({
    mutationFn: (data: FormData) => apiClient.post('/auth/login', data).then(res => res.data),
    onSuccess: (data) => {
      setToken(data.token, data.user);
      navigate('/school'); 
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    loginMutation.mutate(data);
  };

  const getErrorMessage = () => {
    if (loginMutation.error) {
      if (isAxiosError<ApiError>(loginMutation.error) && loginMutation.error.response) {
        if(loginMutation.error.response.status === 403) {
             return 'Invalid username or password.';
        }
        return loginMutation.error.response.data.error;
      }
      return 'An unexpected error occurred.';
    }
    return null;
  };

  return (
    <div className="p-8 max-w-md w-full bg-white/80 backdrop-blur-md rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome Back!</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
          <input {...register('username', { required: 'Username is required' })} className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
          <input {...register('password', { required: 'Password is required' })} type="password" className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        {loginMutation.isError && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>{getErrorMessage()}</p>
          </div>
        )}

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline disabled:bg-gray-400" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? 'Logging in...' : 'Login'}
        </button>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}