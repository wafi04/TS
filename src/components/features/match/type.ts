import { Id } from "../../../../convex/_generated/dataModel";

export type PesertaDetail = {
  agree: boolean;
  championship: Id<"championship">;
  contingent: string;
  matchCategory: string;
  name: string;
  status: "NOT YET COMPETING" | "WINNER" | "LOSER";
  user: Id<"users">;
  _creationTime: number;
  _id: Id<"participants">;
};
export type keyboard = {
  button: Id<"keyboard">;
  referee: Id<"referee">;
  side: "Left" | "Right";
  value: number;
};

export interface ButtonData {
  keyboard: {
    referee: Id<"referee">;
    button: Id<"keyboard">;
    side: "Left" | "Right";
    value: number;
  }[];
  round: "First Round" | "Second Round" | "Third Round";
  scores: {
    refereeId: Id<"referee">;
    scoreLeft: number;
    scoreRight: number;
  }[];
}

export type Event = {
  _creationTime: number;
  _id: string;
  championship: string;
  location: string;
  participants: string[];
  pesertaDetails: (PesertaDetail | null)[];
  time: number;
  referee?: string[]; // Allowing wasit to be undefined
};
