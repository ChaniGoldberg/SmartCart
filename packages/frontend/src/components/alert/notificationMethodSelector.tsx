// src/components/createAlertModal/notificationMethodSelector.tsx
import React from 'react';

// הגדרת הממשק שמתאים למערך סטרינגים
interface NotificationMethodSelectorProps {
    // השורה הזו היא המפתח - משנים לטיפוס מערך
    notificationMethods: ('whatsapp' | 'email' | 'sms')[];
    // REMOVE THIS LINE: setNotificationMethods: (methods: ('whatsapp' | 'email' | 'sms')[]) => void;
    isFormDisabled: boolean;
    // הפונקציה הזו צריכה להתאים גם היא לטיפוס החדש של ה-state
    handleNotificationMethodChange: (method: 'whatsapp' | 'email' | 'sms') => void;
}

const NotificationMethods: React.FC<NotificationMethodSelectorProps> = ({
    notificationMethods,
    // REMOVE setNotificationMethods from destructuring as it's no longer a prop
    isFormDisabled,
    handleNotificationMethodChange, // מקבלים את הפונקציה כ-prop
}) => {
    return (
        <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Notification Methods:</label>
            <div style={{ marginLeft: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', cursor: isFormDisabled ? 'not-allowed' : 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={notificationMethods.includes('whatsapp')}
                        // קוראים לפונקציה שהתקבלה מהאב
                        onChange={() => handleNotificationMethodChange('whatsapp')}
                        disabled={isFormDisabled}
                        style={{ marginRight: '8px', transform: 'scale(1.1)' }}
                    />
                    WhatsApp
                </label>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', cursor: isFormDisabled ? 'not-allowed' : 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={notificationMethods.includes('email')}
                        // קוראים לפונקציה שהתקבלה מהאב
                        onChange={() => handleNotificationMethodChange('email')}
                        disabled={isFormDisabled}
                        style={{ marginRight: '8px', transform: 'scale(1.1)' }}
                    />
                    Email
                </label>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', cursor: isFormDisabled ? 'not-allowed' : 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={notificationMethods.includes('sms')}
                        // קוראים לפונקציה שהתקבלה מהאב
                        onChange={() => handleNotificationMethodChange('sms')}
                        disabled={isFormDisabled}
                        style={{ marginRight: '8px', transform: 'scale(1.1)' }}
                    />
                    SMS
                </label>
            </div>
        </div>
    );
};

export default NotificationMethods;