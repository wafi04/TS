import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { auth } from "./auth";

export const createWasitForChampionship = mutation({
  args: {
    name: v.string(),
    wasitId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await auth.getUserId(ctx);

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const championship = await ctx.db
      .query("championship")
      .filter((q) => q.eq(q.field("name"), args.name))
      .first();

    if (!championship) {
      throw new ConvexError("Kejuaraan Not Available");
    }
    const create = await ctx.db.insert("referee", {
      championship: championship?._id,
      user: args.wasitId,
    });

    await ctx.db.patch(args.wasitId as Id<"users">, {
      role: "WASIT",
    });

    return "Succes";
  },
});

export const getWasitForChampionship = query({
  args: {
    kejuaraanName: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await auth.getUserId(ctx);
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }
    const championship = await ctx.db
      .query("championship")
      .filter((q) => q.eq(q.field("name"), args.kejuaraanName))
      .first();

    if (!championship) {
      throw new Error("Kejuaraan tidak ditemukan");
    }

    const wasitList = await ctx.db
      .query("referee")
      .filter((q) => q.eq(q.field("championship"), championship._id))
      .collect();

    const wasitWithDetails = await Promise.all(
      wasitList.map(async (referee) => {
        const userDetails = await ctx.db.get(referee.user as Id<"users">);
        return { ...referee, userDetails };
      })
    );

    return wasitWithDetails;
  },
});

export const getWasitAndMatches = query({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await auth.getUserId(ctx);
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const user = await ctx.db.get(identity);

    if (!user) {
      throw new Error("User not found");
    }

    const wasitEntries = await ctx.db
      .query("referee")
      .filter((q) => q.eq(q.field("user"), identity))
      .collect();

    if (wasitEntries.length === 0) {
      return {
        referee: null,
        matches: [],
      };
    }

    const championship = await ctx.db
      .query("championship")
      .filter((q) => q.eq(q.field("name"), args.name))
      .first();

    if (!championship) {
      return null;
    }

    const matches = await ctx.db
      .query("match")
      .filter((q) => q.eq(q.field("championship"), championship._id))
      // .filter((q) => q.eq(q.field("aggree"), true))
      .collect();

    const filteredMatches = matches.filter((match) =>
      wasitEntries.some((referee) => match.referee?.includes(referee._id))
    );

    const matchesWithDetails = await Promise.all(
      filteredMatches.map(async (match) => {
        const pesertaDetails = await Promise.all(
          match.participants.map((pesertaId) => ctx.db.get(pesertaId))
        );

        const matchKejuaraan = await ctx.db.get(match.championship);

        const tableMatches = await ctx.db
          .query("matchScore")
          .filter((q) => q.eq(q.field("match"), match._id))
          .collect();

        return {
          ...match,
          pesertaDetails: pesertaDetails.filter(Boolean),
          kejuaraanDetails: matchKejuaraan,
          tableMatches: tableMatches,
        };
      })
    );

    return {
      referee: {
        _id: wasitEntries[0]._id,
        name: user.name,
        email: user.email,
      },
      matches: matchesWithDetails,
    };
  },
});

export const getMatchDataWithWasitAndTableMatch = query({
  args: { matchId: v.id("match") },
  handler: async (ctx, args) => {
    const match = await ctx.db.get(args.matchId);
    if (!match) {
      return null;
    }

    const tableMatches = await ctx.db
      .query("matchScore")
      .filter((q) => q.eq(q.field("match"), args.matchId))
      .collect();

    const wasitData = await Promise.all(
      (match.referee || []).map(async (wasitId) => {
        const referee = await ctx.db.get(wasitId);

        const wasitScores = tableMatches.flatMap((tm) =>
          tm.rounds.map((round) => ({
            babak: round.round,
            score: round.scores.find((s) => s.refereeId === wasitId) || {
              scoreLeft: 0,
              scoreRight: 0,
            },
          }))
        );

        return {
          ...referee,
          scores: wasitScores,
        };
      })
    );

    const pesertaData = await Promise.all(
      (match.participants || []).map(async (pesertaId) => {
        const peserta = await ctx.db.get(pesertaId);
        return peserta;
      })
    );

    const groupedTableMatches = {
      First_Round: tableMatches.find((tm) =>
        tm.rounds.some((round) => round.round === "First Round")
      ),
      Second_Round: tableMatches.find((tm) =>
        tm.rounds.some((round) => round.round === "Second Round")
      ),
      Third_Round: tableMatches.find((tm) =>
        tm.rounds.some((round) => round.round === "Third Round")
      ),
    };

    const validWasitData = wasitData.filter(
      (w): w is NonNullable<typeof w> => w !== null
    );

    const totalScores = validWasitData.map((referee) => {
      const totalScore = referee.scores.reduce(
        (acc, babak) => {
          acc.totalLeft += babak.score.scoreLeft;
          acc.totalRight += babak.score.scoreRight;
          return acc;
        },
        { totalLeft: 0, totalRight: 0 }
      );
      return { wasitId: referee._id, ...totalScore };
    });

    return {
      match,
      referee: validWasitData,
      peserta: pesertaData,
      tableMatches: groupedTableMatches,
      totalScores,
    };
  },
});
export const CheckWasit = query({
  args: {
    pertandinganId: v.id("match"),
  },
  handler: async (ctx, args) => {
    const identity = await auth.getUserId(ctx);
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const user = await ctx.db.get(identity);
    if (!user) {
      throw new ConvexError("User Not found");
    }

    const referee = await ctx.db
      .query("referee")
      .filter((q) => q.eq(q.field("user"), user._id))
      .first();

    if (!referee) {
      return false; // User is not a referee
    }

    const match = await ctx.db.get(args.pertandinganId);

    if (!match) {
      throw new ConvexError("Match not found");
    }

    const isAssigned = match.referee?.some((w) => w === referee._id);

    if (!isAssigned) {
      throw new ConvexError("Wasit is not assigned to this match");
    }

    return { user, referee, match };
  },
});

export const getById = query({
  args: { id: v.id("participants") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateMatch = mutation({
  args: {
    matchId: v.id("match"),
    location: v.string(),
    time: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    await ctx.db.patch(args.matchId, {
      location: args.location,
      time: args.time,
    });

    return "Success";
  },
});
export const updateWasit = mutation({
  args: {
    matchId: v.id("match"),
    wasitId: v.array(v.id("referee")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    await ctx.db.patch(args.matchId, {
      referee: args.wasitId,
    });

    return "Success";
  },
});
export const updatePeserta = mutation({
  args: {
    matchId: v.id("match"),
    peserta: v.array(v.id("participants")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }
    const existingMatch = await ctx.db.get(args.matchId);
    if (!existingMatch) {
      throw new ConvexError("Match not found");
    }

    const updatedPeserta = [
      ...(existingMatch.participants || []),
      ...args.peserta,
    ];
    const uniquePeserta = [...new Set(updatedPeserta)];
    await ctx.db.patch(args.matchId, {
      participants: uniquePeserta,
    });

    return "Success";
  },
});

export const deleteMatch = mutation({
  args: { match: v.id("match") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.match);

    return "Succes";
  },
});
