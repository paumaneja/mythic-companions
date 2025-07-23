import { useRef } from 'react';
import { useUpdateAvatar } from '../../hooks/useUserMutations';
import type { UserDto } from '../../types';

interface Props {
  user: UserDto;
}

export default function AvatarForm({ user }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateAvatarMutation = useUpdateAvatar();

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      updateAvatarMutation.mutate(formData);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-lg shadow-lg text-center font-tomorrow">
      <h2 className="text-2xl font-bold mb-4">Avatar</h2>
      <div className="relative w-48 h-48 mx-auto group">
        <img 
          src={user.avatarUrl || '/assets/images/default-avatar.png'} 
          className="w-full h-full rounded-full object-cover"
        />
        <div 
          onClick={handleAvatarClick}
          className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <span className="text-white font-bold">Change</span>
        </div>
      </div>
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg"
      />
      {updateAvatarMutation.isPending && <p className="mt-4">Uploading...</p>}
      {updateAvatarMutation.isError && <p className="mt-4 text-red-500">Upload failed.</p>}

      <p className="mt-6">Username: <span className="font-bold">{user.username}</span></p>
      <p className="text-sm text-gray-400">(cannot be changed)</p>
    </div>
  );
}