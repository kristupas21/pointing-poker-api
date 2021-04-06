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

  public async updateAllUserPermissions(sessionId: string, hasPermission: boolean): Promise<void> {
    await User.updateMany({ registeredSessionId: sessionId }, { hasPermission });
  }

  public async findUserById(sessionId: string, id: string): Promise<UserSchema> {
    return User.findOne({ registeredSessionId: sessionId, id });
  }

  public async userNameExists(sessionId: string, name: string): Promise<boolean> {
    const user = await User.findOne({ registeredSessionId: sessionId, name });
    return !!user;
  }

  public async registerUser(sessionId: string, user: UserSchema, hasPermission: boolean): Promise<UserSchema> {
    const filter = { id: user.id, registeredSessionId: sessionId };
    const userParams = { ...user, registeredSessionId: sessionId, hasPermission };

    return User.updateOne(filter, userParams, { upsert: true, new: true }).lean();
  }

  public async findAllSessionUsers(sessionId: string): Promise<UserSchema[]> {
    return User.find({ registeredSessionId: sessionId }).lean();
  }
}

export default UserService;
