import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { auth } from "./auth";

export const getBracket = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const identity = await auth.getUserId(ctx);

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const championship = await ctx.db
      .query("championship")
      .filter((q) => q.eq(q.field("name"), args.name))
      .first();

    const bracket = await ctx.db
      .query("bracket")
      .filter((q) => q.eq(q.field("championship"), championship?._id))
      .first();

    if (!bracket) {
      throw new Error("Bracket not found");
    }

    const enrichedBracket = {
      ...bracket,
      rounds: await Promise.all(
        bracket.rounds.map(async (round) => ({
          ...round,
          matches: await Promise.all(
            round.matches.map(async (match) => ({
              ...match,
              matchDetails: await ctx.db.get(match.matchId),
            }))
          ),
        }))
      ),
    };

    return enrichedBracket;
  },
});

export const getBrackets = query({
  args: { kejuaraanName: v.string(), kelasTanding: v.string() },
  handler: async (ctx, args) => {
    const championship = await ctx.db
      .query("championship")
      .filter((q) => q.eq(q.field("name"), args.kejuaraanName))
      .first();

    if (!championship) {
      return null;
    }

    const brackets = await ctx.db
      .query("bracket")
      .filter((q) => q.eq(q.field("championship"), championship?._id))
      .collect();

    console.log("brackets", brackets);
    return brackets;
  },
});

export const getMatchDetails = query({
  args: { matchId: v.id("match") },
  handler: async (ctx, args) => {
    const match = await ctx.db.get(args.matchId);
    if (!match) throw new Error("Match not found");

    const peserta = await Promise.all(
      match.participants.map((id) => ctx.db.get(id))
    );

    const tableMatches = await ctx.db
      .query("matchScore")
      .filter((q) => q.eq(q.field("match"), args.matchId))
      .collect();

    return { ...match, peserta, tableMatches };
  },
});
