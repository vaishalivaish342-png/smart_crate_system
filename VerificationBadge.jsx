import React, { useState } from 'react';

/**
 * A sample Verification Badge component for the Smart Crate Dashboard.
 * 
 * Usage:
 * <VerificationBadge crateId="CRATE-001" timestamp={1714210000} />
 */
const VerificationBadge = ({ crateId, timestamp }) => {
    const [status, setStatus] = useState('UNCHECKED'); // UNCHECKED, LOADING, VERIFIED, FAILED, NO_RECORD
    const [reason, setReason] = useState('');

    const verifyIntegrity = async () => {
        setStatus('LOADING');
        try {
            // Adjust the URL to match your Express API endpoint
            const response = await fetch(`http://localhost:3001/api/verify/${crateId}/${timestamp}`);
            const data = await response.json();

            if (data.verified) {
                setStatus('VERIFIED');
                setReason('Hash matches blockchain record. Data is pristine.');
            } else if (data.reason && data.reason.includes('not logged')) {
                setStatus('NO_RECORD');
                setReason('Standard event: Blockchain logging not required.');
            } else {
                setStatus('FAILED');
                setReason(data.reason || 'Verification failed due to hash mismatch.');
            }
        } catch (error) {
            console.error('Error verifying integrity:', error);
            setStatus('FAILED');
            setReason('Server error during verification.');
        }
    };

    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: 'Inter, sans-serif' }}>
            <button 
                onClick={verifyIntegrity}
                style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    border: '1px solid #4ade80',
                    backgroundColor: '#14532d',
                    color: '#4ade80',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    transition: 'all 0.2s'
                }}
            >
                {status === 'LOADING' ? 'Verifying...' : 'Verify Integrity'}
            </button>

            {status === 'VERIFIED' && (
                <span style={{ color: '#4ade80', fontSize: '14px', fontWeight: '500' }}>
                    ✅ Verified
                </span>
            )}
            {status === 'FAILED' && (
                <span style={{ color: '#ef4444', fontSize: '14px', fontWeight: '500' }}>
                    ❌ Tampered
                </span>
            )}
            {status === 'NO_RECORD' && (
                <span style={{ color: '#9ca3af', fontSize: '14px' }}>
                    - Not Required
                </span>
            )}
            
            {status !== 'UNCHECKED' && status !== 'LOADING' && (
                <div style={{ fontSize: '12px', color: '#9ca3af', marginLeft: '8px' }}>
                    ({reason})
                </div>
            )}
        </div>
    );
};

export default VerificationBadge;
