import React, { useState, useEffect } from 'react';
import '../styles/ReferAFriendTab.css';

export default function ReferAFriendTab() {
  const [referralLink, setReferralLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user._id) {
      setReferralLink(`https://superbizai.com/register?ref=${user._id}`);
    }
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="refer-tab-container">
      <h3>Refer a Friend</h3>
      <p>Invite others and earn rewards! Share the link below with your friends:</p>
      <div className="referral-box">
        <input type="text" value={referralLink} readOnly />
        <button onClick={copyToClipboard}>{copied ? 'Copied!' : 'Copy'}</button>
      </div>
    </div>
  );
}
