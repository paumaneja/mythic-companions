import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
    mutationFn: (data: FormData) => apiClient.post('/auth/register', data),
    onSuccess: () => {
      navigate('/login');
    },
  });

  const onSubmit = (data: FormData) => {
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
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block mb-1">Username</label>
          <input 
            {...register('username', { required: 'Username is required' })} 
            className="w-full p-2 border rounded"
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input 
            {...register('email', { required: 'Email is required' })} 
            type="email"
            className="w-full p-2 border rounded"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input 
            {...register('password', { required: 'Password is required' })} 
            type="password"
            className="w-full p-2 border rounded"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        {/* Display API errors */}
        {registerMutation.isError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{getErrorMessage()}</span>
          </div>
        )}

        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white p-2 rounded"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}