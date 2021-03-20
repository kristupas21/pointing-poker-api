import User, { UserSchema } from '@schemas/userSchema';

class UserService {
  public async removeUser(sessionId: string, userId: string): Promise<UserSchema> {
    return User.findOneAndDelete(
      { id: userId, registeredSessionId: sessionId },
      { useFindAndModify: true }
    ).lean();
  }

  public async setUserVoteValue(
    sessionId: string,
    userId: string,
    voteValue: string
  ): Promise<void> {
    await User.findOneAndUpdate(
      { id: userId, registeredSessionId: sessionId },
      { voteValue },
      { useFindAndModify: true }
    );
  }

  public async modifyUser(sessionId: string, userId: string, params: Partial<UserSchema>): Promise<UserSchema> {
    return User.findOneAndUpdate(
      { id: userId, registeredSessionId: sessionId },
      { ...params },
      { useFindAndModify: true, new: true }
    ).lean();
  }

  public async clearAllVoteValues(sessionId: string): Promise<void> {
    await User.updateMany({ registeredSessionId: sessionId }, { voteValue: null });
  }

  public async findUserById(sessionId: string, userId: string): Promise<UserSchema> {
    return User.findOne({ registeredSessionId: sessionId, id: userId });
  }
}

export default UserService;
