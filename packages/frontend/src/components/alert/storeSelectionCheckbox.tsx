import React from 'react';
import { StoreLocationDto } from '@smartcart/shared';

interface StoreSelectionCheckboxProps {
    store: StoreLocationDto;
    isChecked: boolean;
    onCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    distance?: string; // מרחק בק"מ
    disabled?: boolean; // כדי לנטרל את הצ'קבוקס
}

const StoreSelectionCheckbox: React.FC<StoreSelectionCheckboxProps> = ({
    store,
    isChecked,
    onCheckboxChange,
    distance,
    disabled
}) => {
    return (
        <label style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
            backgroundColor: isChecked && !disabled ? '#e6f7ff' : 'transparent', // צבע רקע כשמסומן
            padding: '8px',
            borderRadius: '5px',
            transition: 'background-color 0.2s ease',
        }}>
            <input
                type="checkbox"
                value={store.storePK}
                checked={isChecked}
                onChange={onCheckboxChange}
                disabled={disabled}
                style={{ marginLeft: '10px', transform: 'scale(1.1)', accentColor: '#007bff' }}
            />
            <span style={{ flexGrow: 1, fontWeight: 'bold' }}>
                {store.chainName} - {store.storeName}
            </span>
            {distance && (
                <span style={{ fontSize: '0.9em', color: '#777' }}>
                    ({distance} ק"מ)
                </span>
            )}
        </label>
    );
};

export default StoreSelectionCheckbox;