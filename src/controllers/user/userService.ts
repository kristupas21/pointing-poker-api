import User, { UserSchema } from '@controllers/user/userSchema';

class UserService {
    public async removeUser(user: UserSchema, sessionId: string): Promise<UserSchema> {
        return User.findOneAndDelete(
            { id: user.id, registeredSessionId: sessionId }
        ).lean();
    }
}

export default UserService;
