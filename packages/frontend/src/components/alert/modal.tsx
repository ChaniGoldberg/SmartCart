import React, { ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 50,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '50px' // ריווח קטן מהקצוות במובייל
        }}>
            <div style={{
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
                position: 'relative',
                maxHeight: '90vh', // הגבלה לגובה המסך
                overflowY: 'auto', // גלילה אם התוכן ארוך
                width: '100%',
                maxWidth: '600px', // הגבלת רוחב למסכים גדולים
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'none',
                        border: 'none',
                        fontSize: '1.5em',
                        cursor: 'pointer',
                        color: '#555',
                    }}
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;