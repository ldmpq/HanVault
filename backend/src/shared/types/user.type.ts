import { users } from '../schema';

export type User = typeof users.$inferSelect;

export type NewUser = typeof users.$inferInsert;

export type UserResponse = Omit<User, 'passwordHash'>;