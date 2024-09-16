import { v } from "convex/values";
import { query } from "./_generated/server";
import { auth } from "./auth";

export const getMedia = query({
  args: {
    participantId: v.id("participants"),
  },
  handler: async (ctx, args) => {
    const user = await auth.getUserId(ctx);

    if (!user) {
      throw new Error("Unauthorized");
    }

    const dataMedia = await ctx.db
      .query("media")
      .withIndex("by_participants", (q) =>
        q.eq("participants", args.participantId)
      )
      .collect();

    return dataMedia;
  },
});
