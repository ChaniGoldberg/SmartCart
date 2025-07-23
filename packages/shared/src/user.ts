export interface User {
    userId: string; 
    email: string;
    password: string; 
    userName: string;
    preferred_store: string; // חובה - המשתמש חייב לבחור חנות מועדפת.
}