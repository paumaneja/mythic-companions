import { useAuthStore } from "../stores/authStore";
import AvatarForm from "../components/profile/AvatarForm";
import PasswordForm from "../components/profile/PasswordForm";
import ProfileBackgroundImage from '../assets/images/profile-background.png';

export default function ProfilePage() {
    const { user } = useAuthStore();

    if (!user) {
        return <div>Loading user profile...</div>;
    }

    return (
        <div className="relative h-full w-full flex flex-col">
        <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed" 
            style={{ backgroundImage: `url(${ProfileBackgroundImage})` }}
        ></div>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto p-4 sm:p-8 text-white z-10">
            <h1 className="text-4xl font-bold mb-8">Your Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Columna de l'Avatar */}
                <div className="md:col-span-1">
                    <AvatarForm user={user} />
                </div>

                {/* Columna de Formularis */}
                <div className="md:col-span-2 space-y-8">
                    <PasswordForm />
                </div>
            </div>
        </div>
        </div>
    );
}