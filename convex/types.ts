import { Id } from "./_generated/dataModel";

export type Users = {
  _id: Id<"users">;
  _creationTime: number;
  name?: string | undefined;
  image?: string | undefined;
  email?: string | undefined;
  emailVerificationTime?: number | undefined;
  displayName?: string | undefined;
  bio?: string | undefined;
  backgorundImage?: string | undefined;
};

export interface championshipWithUsers {
  image?: string;
  location: string;
  name: string;
  creator: Users;
  startDate: number;
  endDate: number;
  user: Id<"users">;
  _creationTime: number;
  _id: Id<"championship">;
}
