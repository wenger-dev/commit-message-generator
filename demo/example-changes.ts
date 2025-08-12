// Example file to demonstrate the commit message generator
// This file shows the kind of changes the extension would analyze

// Original code (before changes):
// function oldFunction() {
//     return "old";
// }

// New code (after changes):
export class UserService {
    private users: Map<string, User> = new Map();

    constructor() {
        // Initialize with some default users
        this.users.set('admin', { id: 'admin', name: 'Administrator', role: 'admin' });
    }

    async addUser(user: User): Promise<void> {
        if (this.users.has(user.id)) {
            throw new Error('User already exists');
        }
        this.users.set(user.id, user);
    }

    async getUser(id: string): Promise<User | undefined> {
        return this.users.get(id);
    }

    async updateUser(id: string, updates: Partial<User>): Promise<void> {
        const user = this.users.get(id);
        if (!user) {
            throw new Error('User not found');
        }
        Object.assign(user, updates);
    }

    async deleteUser(id: string): Promise<void> {
        if (!this.users.has(id)) {
            throw new Error('User not found');
        }
        this.users.delete(id);
    }
}

export interface User {
    id: string;
    name: string;
    role: 'admin' | 'user' | 'guest';
    email?: string;
    createdAt?: Date;
}

// The extension would analyze this file and detect:
// - New class: UserService
// - New interface: User
// - Multiple methods: addUser, getUser, updateUser, deleteUser
// - TypeScript language
// - Export statements
// 
// This would likely generate a commit message like:
// "feat(typescript): add UserService class with CRUD operations"
