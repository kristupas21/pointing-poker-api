import User, { UserSchema } from '@controllers/user/userSchema';

class UserService {
    public async removeUser(sessionId: string, userId: string): Promise<UserSchema> {
        return User.findOneAndDelete(
            { id: userId, registeredSessionId: sessionId }
        ).lean();
    }

    public async setUserVoteValue(sessionId: string, userId: string, value: string): Promise<void> {
        await User.findOneAndUpdate({ id: userId, registeredSessionId: sessionId }, {
            voteValue: value,
        });
    }

    public async clearAllVoteValues(sessionId: string): Promise<void> {
        await User.updateMany({ registeredSessionId: sessionId }, { voteValue: null });
    }
}

export default UserService;
