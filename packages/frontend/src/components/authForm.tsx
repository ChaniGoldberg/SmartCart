import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/redux/authSlice';

interface AuthFormProps {
  onClose: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string; userName?: string }>({});
  const [generalError, setGeneralError] = useState('');

  const baseUrl = 'http://localhost:3001/api/users';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isLogin ? '/login' : '/register';
    const body = isLogin ? { email, password } : { userName, email, password };

    setGeneralError('');
    setFieldErrors({});

    try {
      const res = await fetch(`${baseUrl}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        // DEBUG בלבד — בדקי בקונסול ולא תציגי למשתמש
        console.log("🔥 error message from server:", data);

        // תאחסני תמיד את ההודעה בצורה נשלטת
        let errorMessage = '';

        if (typeof data.error === 'string') {
          errorMessage = data.error;
        } else if (data?.error?.message) {
          errorMessage = data.error.message;
        } else if (data?.message) {
          errorMessage = data.message;
        } else {
          errorMessage = 'שגיאה לא ידועה';
        }

        const lowerError = errorMessage.toLowerCase();

        if (isLogin && (lowerError.includes('user not found') || lowerError.includes('invalid password'))) {
          setFieldErrors({ password: 'דוא"ל או סיסמה שגויים' });
          return;
        }

        if (
          lowerError.includes('email') ||
          lowerError.includes('אימייל') ||
          lowerError.includes('דוא') ||
          lowerError.includes('@') ||
          lowerError.includes('must include') ||
          lowerError.includes('אחרי')
        ) {
          setFieldErrors(prev => ({ ...prev, email: 'אימייל לא תקין' }));
          return;
        }

        if (lowerError.includes('password') || lowerError.includes('סיסמה')) {
          setFieldErrors(prev => ({ ...prev, password: 'הסיסמה לא תקינה' }));
          return;
        }

        if (lowerError.includes('username') || lowerError.includes('משתמש')) {
          setFieldErrors(prev => ({ ...prev, userName: 'יש להזין שם משתמש' }));
          return;
        }

        if (lowerError.includes('already exists') || lowerError.includes('כבר קיים')) {
          setGeneralError('משתמש עם כתובת הדוא"ל הזאת כבר קיים');
          return;
        }

        // כל שגיאה שלא זוהתה
        setGeneralError('אירעה שגיאה. נסו שוב');
        return;
      }


      dispatch(loginSuccess(data.token));
      onClose();
    } catch (error) {
      setGeneralError('שגיאה בחיבור לשרת');
    }
  };


  return (
    <div style={{
      maxWidth: '400px',
      margin: '40px auto',
      backgroundColor: '#f9fbfc',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: '20px',
        color: '#333',
        fontWeight: '600',
        fontSize: '24px'
      }}>
        {isLogin ? 'התחברות' : 'הרשמה'}
      </h2>

      {/* שגיאה כללית כמו "משתמש כבר קיים" */}
      {generalError && (
        <div className="text-red-600 text-center font-medium mb-4">
          {generalError}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="שם משתמש"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="p-3 rounded-md border border-gray-300 text-base"
              required
            />
            {fieldErrors.userName && (
              <div className="text-red-500 text-sm transition-all duration-300 animate-pulse">
                {fieldErrors.userName}
              </div>
            )}
          </>
        )}

        <input
          type="email"
          placeholder="אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 rounded-md border border-gray-300 text-base"
          required
        />
        {fieldErrors.email && (
          <div className="text-red-500 text-sm transition-all duration-300 animate-pulse">
            {fieldErrors.email}
          </div>
        )}

        <input
          type="password"
          placeholder="סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 rounded-md border border-gray-300 text-base"
          required
        />
        {fieldErrors.password && (
          <div className="text-red-500 text-sm">
            {fieldErrors.password}
          </div>
        )}

        <button
          type="submit"
          style={{
            backgroundColor: '#0ea5e9',
            color: 'white',
            fontWeight: '600',
            padding: '14px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(14, 165, 233, 0.4)',
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = '#0284c7')}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = '#0ea5e9')}
        >
          {isLogin ? 'התחברות' : 'הרשמה'}
        </button>
      </form>

      <div
        dir="rtl"
        style={{
          textAlign: 'center',
          marginTop: '20px',
          fontSize: '16px',
          color: '#555'
        }}>
        {isLogin ? (
          <>
            <span>אין לך חשבון? </span>
            <button
              onClick={() => {
                setIsLogin(false);
                setUserName('');
                setPassword('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#0ea5e9',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '16px',
                padding: 0
              }}
            >
              להרשמה
            </button>
          </>
        ) : (
          <>
            <span>כבר יש לך חשבון? </span>
            <button
              onClick={() => {
                setIsLogin(true);
                setUserName('');
                setPassword('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#0ea5e9',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '16px',
                padding: 0
              }}
            >
              להתחברות
            </button>
          </>
        )}
      </div>

    </div>
  );
};

export default AuthForm;
