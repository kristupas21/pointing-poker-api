export enum AvatarId {
    EmojiHappy = 'emoji-happy',
    EmojiSad = 'emoji-sad',
}

export interface PointValue {
    id: string;
    pos: number;
    value: string;
}

export interface UserRole {
    id: string;
    name: string;
}
