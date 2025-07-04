import React, { useState } from 'react';
import ProfileTab from '../components/ProfileTab';
import NotificationsTab from '../components/NotificationsTab';
import BusinessProfileTab from '../components/BusinessProfileTab';
// import ChannelsTab from '../components/ChannelsTab'; // ❌ Commented and not used
import BillingTab from '../components/BillingTab';
import ReferAFriendTab from '../components/ReferAFriendTab';
import '../styles/AccountSettings.css';

export default function AccountSettings() {
  const [activeTab, setActiveTab] = useState('profile');

  const renderTab = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />;
      case 'notifications':
        return <NotificationsTab />;
      case 'business':
        return <BusinessProfileTab />;
      // case 'channels': return <ChannelsTab />; ❌ Removed
      case 'billing':
        return <BillingTab />;
      case 'refer':
        return <ReferAFriendTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div className="account-settings container py-5">
      <h2 className="text-center mb-4">Account Settings</h2>
      <div className="settings-tabs d-flex justify-content-center mb-4 flex-wrap gap-2">
        <button className={`btn ${activeTab === 'profile' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setActiveTab('profile')}>Profile</button>
        <button className={`btn ${activeTab === 'notifications' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setActiveTab('notifications')}>Notifications</button>
        <button className={`btn ${activeTab === 'business' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setActiveTab('business')}>Business Profile</button>
        {/* <button className={`btn ${activeTab === 'channels' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setActiveTab('channels')}>Channels</button> */}
        <button className={`btn ${activeTab === 'billing' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setActiveTab('billing')}>Billing</button>
        <button className={`btn ${activeTab === 'refer' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setActiveTab('refer')}>Refer a Friend</button>
      </div>

      <div className="tab-content">
        {renderTab()}
      </div>
    </div>
  );
}
