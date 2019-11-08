import http from './http';
import { User } from '../model';

class Auth {

    isAuthenticated: boolean = false;
    currentUser: User = null;

    async login({ name, bio }): Promise<boolean> {
        try {
            const resp = await http.post('/login', { name, bio }, User);
            this.isAuthenticated = resp.status === 200;
            this.currentUser = resp.data as User;
        } catch (e) {
            console.error('fail to login');
        }
        return this.isAuthenticated;
    }

    async logout(): Promise<boolean> {
        this.isAuthenticated = false;
        this.currentUser = null;
        return !this.isAuthenticated;
    }
}

const auth = new Auth();

export default auth;