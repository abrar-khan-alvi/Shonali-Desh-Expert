import React, { useState } from 'react';
import { User, CreditCard, Shield, Save } from 'lucide-react';
import { Card, Button, Input } from '../components/UI';
import { useExpert } from '../context/ExpertContext';
import { TabValue } from '../types';

const ProfilePage: React.FC = () => {
  const { expert, changePassword } = useExpert();
  const [activeTab, setActiveTab] = useState<TabValue>('profile');
  const [isSaving, setIsSaving] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      // alert("Saved!"); // Removed to avoid blocking interaction in demo
    }, 800);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    setIsSaving(true);
    const success = await changePassword(currentPassword, newPassword);
    setIsSaving(false);

    if (success) {
      alert("Password updated successfully!");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      alert("Failed to update password. Please check your current password.");
    }
  };

  const TabButton = ({ id, label, icon: Icon }: { id: TabValue; label: string; icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-6 py-4 text-base font-medium border-b-2 transition-colors ${activeTab === id
        ? 'border-primary-green text-primary-green'
        : 'border-transparent text-text-light hover:text-text-dark hover:border-gray-300'
        }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  if (!expert) {
    return <div className="p-10 text-center">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-text-dark mb-8">My Profile</h1>

      <div className="mb-8 border-b border-gray-200">
        <div className="flex space-x-6">
          <TabButton id="profile" label="Profile Details" icon={User} />
          <TabButton id="payment" label="Payment Settings" icon={CreditCard} />
          <TabButton id="security" label="Security" icon={Shield} />
        </div>
      </div>

      <div className="animate-fade-in">
        {activeTab === 'profile' && (
          <Card className="p-8 shadow-md">
            <div className="flex flex-col md:flex-row gap-10 mb-10">
              <div className="flex flex-col items-center">
                <img
                  src={expert.profilePhotoUrl || expert.metadata?.photo || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="w-40 h-40 rounded-full border-4 border-background-light mb-6 object-cover shadow-sm"
                />
                <Button variant="secondary" size="sm">Change Photo</Button>
              </div>
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Full Name" defaultValue={expert.metadata?.name || expert.name} />
                  <Input label="Email Address" defaultValue={expert.email} disabled className="bg-gray-50 text-text-light" />
                </div>
                <Input label="Job Title / Role" defaultValue={expert.credentials?.currentAffiliation || "Agricultural Expert"} />
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">Short Bio</label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary-green focus:border-primary-green outline-none h-32 text-text-dark placeholder-text-light"
                    defaultValue={expert.bio || "No bio available."}
                  />
                </div>
                <Input
                  label="Specializations"
                  defaultValue={
                    Array.isArray(expert.areasOfSpecialization)
                      ? expert.areasOfSpecialization.join(', ')
                      : (expert.areasOfSpecialization || "")
                  }
                />
              </div>
            </div>
            <div className="flex justify-end pt-6 border-t border-gray-100">
              <Button onClick={handleSave} disabled={isSaving} className="flex items-center">
                <Save className="w-5 h-5 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Card>
        )}

        {activeTab === 'payment' && (
          <Card className="p-8 max-w-3xl shadow-md">
            <h3 className="text-3xl font-semibold text-text-dark mb-4">Payout Methods</h3>
            <p className="text-lg text-text-light mb-8">
              Manage where your consultation earnings are sent. Payments are processed weekly.
            </p>

            <form className="space-y-8">
              <Input label="Bank Name" placeholder="e.g. Dutch-Bangla Bank" />
              <Input label="Account Holder Name" placeholder="e.g. Anika Rahman" />
              <div className="grid grid-cols-2 gap-6">
                <Input label="Account Number" type="password" placeholder="•••• •••• •••• 1234" />
                <Input label="Routing Number" placeholder="123456789" />
              </div>

              <div className="border-t border-gray-100 pt-8 mt-8">
                <h4 className="text-xl font-semibold text-text-dark mb-6">Mobile Financial Service (MFS)</h4>
                <div className="grid grid-cols-2 gap-6">
                  <Input label="Provider" placeholder="e.g. bKash / Nagad" />
                  <Input label="Wallet Number" placeholder="+880 1XXX XXXXXX" />
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button onClick={handleSave} disabled={isSaving} className="flex items-center">
                  <Save className="w-5 h-5 mr-2" />
                  {isSaving ? 'Saving...' : 'Update Payment Info'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {activeTab === 'security' && (
          <Card className="p-8 max-w-2xl shadow-md">
            <h3 className="text-3xl font-semibold text-text-dark mb-6">Change Password</h3>
            <form className="space-y-6" onSubmit={handlePasswordChange}>
              <Input
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <div className="flex justify-end pt-6">
                <Button variant="danger" disabled={isSaving} type="submit">
                  {isSaving ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;