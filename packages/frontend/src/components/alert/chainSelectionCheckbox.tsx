import React from 'react';

interface ChainSelectionCheckboxProps {
    chainName: string;
    isChecked: boolean;
    onCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean; // כדי לנטרל את הצ'קבוקס
}

const ChainSelectionCheckbox: React.FC<ChainSelectionCheckboxProps> = ({
    chainName,
    isChecked,
    onCheckboxChange,
    disabled
}) => {
    return (
        <label style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '8px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
            backgroundColor: isChecked && !disabled ? '#e6f7ff' : 'transparent', // צבע רקע כשמסומן
            padding: '6px',
            borderRadius: '4px',
            transition: 'background-color 0.2s ease',
        }}>
            <input
                type="checkbox"
                value={chainName}
                checked={isChecked}
                onChange={onCheckboxChange}
                disabled={disabled}
                style={{ marginLeft: '10px', transform: 'scale(1.1)', accentColor: '#28a745' }}
            />
            <span style={{ fontWeight: 'bold' }}>{chainName}</span>
        </label>
    );
};

export default ChainSelectionCheckbox;