import { useForm, type SubmitHandler } from 'react-hook-form';
import { useUpdatePassword } from '../../hooks/useUserMutations';
import { AxiosError } from 'axios';
import type { ApiError } from '../../types';

type FormData = { oldPassword: string; newPassword: string; };

export default function PasswordForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const updatePasswordMutation = useUpdatePassword();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    updatePasswordMutation.mutate(data, {
        onSuccess: () => {
            alert('Password updated successfully!');
            reset();
        },
        onError: (error: AxiosError<ApiError>) => {
            alert(`Error: ${error.response?.data?.error || 'Could not update password.'}`);
        }
    });
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg font-tomorrow">
        <h2 className="text-2xl font-bold mb-4">Change Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input {...register('oldPassword', { required: true })} type="password" placeholder="Current password" className="w-full p-2 rounded bg-gray-700 border border-gray-600"/>
            <input {...register('newPassword', { required: 'New password is required', minLength: { value: 8, message: 'Must be at least 8 characters' }})} type="password" placeholder="New password" className="w-full p-2 rounded bg-gray-700 border border-gray-600"/>
            {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
            <button type="submit" disabled={updatePasswordMutation.isPending} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full disabled:bg-gray-500">
                {updatePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
            </button>
        </form>
    </div>
  );
}