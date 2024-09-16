import { Id } from "../../../../../convex/_generated/dataModel";

export type Peserta = {
  _id: Id<"participants">;
  _creationTime: number;
  championship: Id<"championship">;
  name: string;
  user: Id<"users">;
  matchCategory: string;
  contingent: string;
  agree: boolean;
  status: "NOT YET COMPETING" | "WINNER" | "LOSER";
};
