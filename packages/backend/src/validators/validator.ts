const validate = {
    checkEmail: (email: string): string | true => {
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email))
            return 'אימייל לא תקין'; // 🔄 בעברית
        return true;
    },

    checkPassword: (password: string): true | string => {
        if (!password)
            return 'יש להזין סיסמה'; // 🔄 בעברית
        if (password.trim().length === 0)
            return 'הסיסמה לא יכולה להכיל רווחים בלבד'; // 🔄 בעברית
        if (password.length < 8)
            return 'הסיסמה חייבת להכיל לפחות 8 תווים'; // 🔄 בעברית
        if (!/[0-9]/.test(password))
            return 'הסיסמה חייבת להכיל לפחות מספר אחד'; // 🔄 בעברית
        return true;
    }
};

export default validate;
