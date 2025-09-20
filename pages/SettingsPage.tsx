import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const SettingsCard: React.FC<{ title: string; children: React.ReactNode; footer?: React.ReactNode }> = ({ title, children, footer }) => (
    <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>
            {children}
        </div>
        {footer && (
            <div className="bg-gray-50 px-6 py-4 rounded-b-lg text-right">
                {footer}
            </div>
        )}
    </div>
);

const FormRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-4">
        <label className="text-gray-600 font-medium">{label}</label>
        <div className="md:col-span-2">
            {children}
        </div>
    </div>
);

const TextInput: React.FC<{ id: string; type: string; value: string; placeholder?: string; disabled?: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = (props) => (
    <input
        {...props}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-accent disabled:bg-gray-100"
    />
);

const Toggle: React.FC<{ label: string; enabled: boolean; onChange: () => void }> = ({ label, enabled, onChange }) => (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
        <span className="text-gray-700">{label}</span>
        <button
            onClick={onChange}
            className={`${enabled ? 'bg-brand-primary' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent`}
        >
            <span className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
        </button>
    </div>
);

const SettingsPage: React.FC = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState({
        name: user?.username || '',
        email: user?.email || '',
    });
    const [notifications, setNotifications] = useState({
        weeklySummary: true,
        expiryAlerts: true,
        newInsights: false,
    });
    
    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setProfile(prev => ({ ...prev, [id]: value }));
    };

    const toggleNotification = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="container mx-auto max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>
            <div className="space-y-8">
                <SettingsCard
                    title="User Profile"
                    footer={<button className="bg-brand-primary text-white font-bold py-2 px-4 rounded hover:bg-brand-secondary disabled:opacity-50" disabled>Save Changes</button>}
                >
                    <FormRow label="Full Name">
                        <TextInput id="name" type="text" value={profile.name} onChange={handleProfileChange} />
                    </FormRow>
                    <FormRow label="Email Address">
                        <TextInput id="email" type="email" value={profile.email} onChange={handleProfileChange} />
                    </FormRow>
                </SettingsCard>

                <SettingsCard
                    title="Change Password"
                    footer={<button className="bg-brand-primary text-white font-bold py-2 px-4 rounded hover:bg-brand-secondary disabled:opacity-50" disabled>Update Password</button>}
                >
                     <FormRow label="Current Password">
                        <TextInput id="currentPassword" type="password" value="" onChange={() => {}} placeholder="••••••••" />
                    </FormRow>
                     <FormRow label="New Password">
                        <TextInput id="newPassword" type="password" value="" onChange={() => {}} placeholder="••••••••" />
                    </FormRow>
                </SettingsCard>
                
                <SettingsCard title="Notification Preferences">
                    <Toggle label="Weekly Summary Email" enabled={notifications.weeklySummary} onChange={() => toggleNotification('weeklySummary')} />
                    <Toggle label="Contract Expiry Alerts" enabled={notifications.expiryAlerts} onChange={() => toggleNotification('expiryAlerts')} />
                    <Toggle label="New AI Insight Notifications" enabled={notifications.newInsights} onChange={() => toggleNotification('newInsights')} />
                </SettingsCard>
            </div>
        </div>
    );
};

export default SettingsPage;
