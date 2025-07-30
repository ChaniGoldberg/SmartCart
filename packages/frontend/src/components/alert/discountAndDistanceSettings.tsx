import React from 'react';

interface DiscountAndDistanceSettingsProps {
    minDiscount: number;
    setMinDiscount: (discount: number) => void;
    maxDistance: number;
    setMaxDistance: (distance: number) => void;
    isFormDisabled: boolean;
}

const DiscountAndDistanceSettings: React.FC<DiscountAndDistanceSettingsProps> = ({
    minDiscount,
    setMinDiscount,
    maxDistance,
    setMaxDistance,
    isFormDisabled,
}) => {
    return (
        <div style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '15px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <h3 style={{ marginTop: '0', color: '#555' }}>Alert Settings</h3>
            <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Minimum Discount: <span style={{ color: '#007bff' }}>{minDiscount}%</span></label>
                <input
                    type="range" min="0" max="100" value={minDiscount}
                    onChange={(e) => setMinDiscount(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#28a745' }} disabled={isFormDisabled}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8em', color: '#666' }}><span>0%</span><span>100%</span></div>
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Maximum Distance: <span style={{ color: '#007bff' }}>{maxDistance} km</span></label>
                <input
                    type="range" min="0" max="50" value={maxDistance}
                    onChange={(e) => setMaxDistance(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#007bff' }} disabled={isFormDisabled}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8em', color: '#666' }}><span>0 km</span><span>50 km</span></div>
            </div>
        </div>
    );
};

export default DiscountAndDistanceSettings;