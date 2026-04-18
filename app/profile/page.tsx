import { ProfileForm } from '@/components/forms/profile-form';

export default function ProfilePage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Student Profile</h1>
        <p className="text-sm text-zinc-300">Form-based profile optimized for opportunity fit scoring.</p>
      </div>
      <ProfileForm />
    </div>
  );
}
