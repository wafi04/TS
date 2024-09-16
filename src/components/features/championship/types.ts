import { Id } from "../../../../convex/_generated/dataModel";
import { Users } from "../../../../convex/types";

export type Championship = {
  image?: string;
  location: string;
  name: string;
  startDate: number;
  endDate: number;
  creator: Users;
  user: string;
  _creationTime: number;
  _id: Id<"championship">;
};
