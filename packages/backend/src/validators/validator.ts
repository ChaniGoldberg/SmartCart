const validate = {
    checkEmail: (email: string): string | true => {
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/.test(email))
            return 'no valid email';
        return true;
    },
    checkPassword: (password: string): true | string => {
       if (password === undefined || password === null)
            return 'Password is required';
         if (password.trim().length === 0)
            return 'Password cannot be only spaces';
          if (password.length < 8)
            return 'Password must be at least 8 characters long';
         if (!/[0-9]/.test(password))
            return 'Password must contain at least one number';
         return true
    }

}
export default validate;
