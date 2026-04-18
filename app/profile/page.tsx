import { ProfileForm } from '@/components/forms/profile-form';

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Student Profile</h1>
        <p className="text-foreground">Form-based profile optimized for opportunity fit scoring.</p>
      </div>
      <ProfileForm />
    </div>
  );
}
