"use strict";
// Example file to demonstrate the commit message generator
// This file shows the kind of changes the extension would analyze
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
// Original code (before changes):
// function oldFunction() {
//     return "old";
// }
// New code (after changes):
class UserService {
    constructor() {
        this.users = new Map();
        // Initialize with some default users
        this.users.set('admin', { id: 'admin', name: 'Administrator', role: 'admin' });
    }
    async addUser(user) {
        if (this.users.has(user.id)) {
            throw new Error('User already exists');
        }
        this.users.set(user.id, user);
    }
    async getUser(id) {
        return this.users.get(id);
    }
    async updateUser(id, updates) {
        const user = this.users.get(id);
        if (!user) {
            throw new Error('User not found');
        }
        Object.assign(user, updates);
    }
    async deleteUser(id) {
        if (!this.users.has(id)) {
            throw new Error('User not found');
        }
        this.users.delete(id);
    }
}
exports.UserService = UserService;
// The extension would analyze this file and detect:
// - New class: UserService
// - New interface: User
// - Multiple methods: addUser, getUser, updateUser, deleteUser
// - TypeScript language
// - Export statements
// 
// This would likely generate a commit message like:
// "feat(typescript): add UserService class with CRUD operations"
//# sourceMappingURL=example-changes.js.map