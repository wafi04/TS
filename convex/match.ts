import { ConvexError, v } from "convex/values";
import { mutation, MutationCtx, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { auth } from "./auth";

export type Peserta = {
  _creationTime: number;
  _id: Id<"participants">;
  championship: Id<"championship">;
  matchCategory: string;
  contingent: string;
  status: "NOT YET COMPETING" | "WINNER" | "LOSER";
  name: string;
};

type PesertaByKelas = {
  [kelas: string]: Peserta[];
};

export const createBracket = mutation({
  args: {
    championshipName: v.string(),
    location: v.string(),
    time: v.number(),
    refereeIds: v.array(v.id("referee")),
  },
  handler: async (ctx, args) => {
    const { championshipName, location, time, refereeIds } = args;

    const identity = await auth.getUserId(ctx);
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const championship = await ctx.db
      .query("championship")
      .filter((q) => q.eq(q.field("name"), championshipName))
      .first();

    if (!championship) {
      throw new ConvexError("Championship Doesn't Exist");
    }

    const participants = await ctx.db
      .query("participants")
      .filter((q) => q.eq(q.field("championship"), championship._id))
      .collect();

    if (!participants) {
      throw new Error("Participants not found");
    }

    const pesertaByKelas = participants.reduce<PesertaByKelas>((acc, p) => {
      if (!acc[p.matchCategory]) acc[p.matchCategory] = [];
      acc[p.matchCategory].push(p);
      return acc;
    }, {});

    const keyboard = await ctx.db
      .query("keyboard")
      .filter((q) => q.eq(q.field("championship"), championship._id))
      .collect();

    const rounds: Array<"First Round" | "Second Round" | "Third Round"> = [
      "First Round",
      "Second Round",
      "Third Round",
    ];
    const brackets: Record<string, Id<"bracket">> = {};

    for (const [kelas, pesertaKelas] of Object.entries(pesertaByKelas)) {
      let shuffledPeserta = pesertaKelas.sort(() => Math.random() - 0.5);
      const numRounds = Math.ceil(Math.log2(shuffledPeserta.length));

      let matchesByRound: Id<"match">[][] = Array(numRounds)
        .fill([])
        .map(() => []);

      // Create first round matches
      for (let i = 0; i < shuffledPeserta.length; i += 2) {
        const matchId = await ctx.db.insert("match", {
          championship: championship._id,
          location,
          time,
          round: 1,
          aggree: false,
          matchNumber: Math.floor(i / 2) + 1,
          participants: [
            shuffledPeserta[i]?._id,
            shuffledPeserta[i + 1]?._id,
          ].filter(Boolean),
          referee: refereeIds,
        });

        matchesByRound[0].push(matchId);

        await ctx.db.insert("matchScore", {
          match: matchId,
          rounds: rounds.map((round) => ({
            round,
            keyboard: refereeIds.flatMap((refereeId) =>
              keyboard.map((k) => ({
                referee: refereeId,
                side: k.side,
                button: k._id,
                value: 0,
              }))
            ),
            scores: refereeIds.map((refereeId) => ({
              refereeId,
              scoreLeft: 0,
              scoreRight: 0,
            })),
          })),
        });

        for (const refereeId of refereeIds) {
          await ctx.db.patch(refereeId, {
            match: [
              {
                matchId,
                refereeNumber: refereeIds.indexOf(refereeId) + 1,
              },
            ],
          });
        }
      }

      // Create subsequent rounds without participants
      for (let round = 2; round <= numRounds; round++) {
        const numMatchesInRound = Math.ceil(
          matchesByRound[round - 2].length / 2
        );
        for (let i = 0; i < numMatchesInRound; i++) {
          const matchId = await ctx.db.insert("match", {
            championship: championship._id,
            location,
            time,
            aggree: false,
            round,
            matchNumber: i + 1,
            participants: [],
            referee: refereeIds,
          });

          matchesByRound[round - 1].push(matchId);

          await ctx.db.insert("matchScore", {
            match: matchId,
            rounds: rounds.map((round) => ({
              round,
              keyboard: refereeIds.flatMap((refereeId) =>
                keyboard.map((k) => ({
                  referee: refereeId,
                  button: k._id,
                  side: k.side,
                  value: 0,
                }))
              ),
              scores: refereeIds.map((refereeId) => ({
                refereeId,
                scoreLeft: 0,
                scoreRight: 0,
              })),
            })),
          });
        }
      }

      // Update nextMatchId for each match
      for (let round = 0; round < numRounds - 1; round++) {
        for (let i = 0; i < matchesByRound[round].length; i += 2) {
          const nextMatchId = matchesByRound[round + 1][Math.floor(i / 2)];

          await ctx.db.patch(matchesByRound[round][i], {
            nextMatchId,
            nextMatchPosition: "TOP",
          });

          if (matchesByRound[round][i + 1]) {
            await ctx.db.patch(matchesByRound[round][i + 1], {
              nextMatchId,
              nextMatchPosition: "BOTTOM",
            });
          }
        }
      }

      const bracketRounds = matchesByRound.map((matches, index) => ({
        roundNumber: index + 1,
        matches: matches.map((matchId) => ({
          matchId,
          nextMatchId: matchId, // This will be filled in the next step
        })),
      }));

      // Fill in the nextMatchId for each match in the bracket
      for (let round = 0; round < numRounds - 1; round++) {
        for (let i = 0; i < bracketRounds[round].matches.length; i++) {
          const nextMatchId =
            bracketRounds[round + 1].matches[Math.floor(i / 2)].matchId;
          bracketRounds[round].matches[i].nextMatchId = nextMatchId;
        }
      }

      const bracketId = await ctx.db.insert("bracket", {
        championship: championship._id,
        class: kelas,
        rounds: bracketRounds,
      });

      brackets[kelas] = bracketId;
    }

    return brackets;
  },
});

export const getPertandingan = query({
  args: {
    championshipname: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await auth.getUserId(ctx);

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const championship = await ctx.db
      .query("championship")
      .filter((q) => q.eq(q.field("name"), args.championshipname))
      .first();

    if (!championship) {
      throw new ConvexError("Championship Doesn't Exist");
    }
    const results = await ctx.db
      .query("match")
      .filter((q) => q.eq(q.field("championship"), championship._id))
      .filter((q) => q.eq(q.field("aggree"), true))
      .collect();

    let winner: {
      _id: Id<"participants">;
      _creationTime: number;
      name: string;
      championship: Id<"championship">;
      matchCategory: string;
      contingent: string;
      status: "NOT YET COMPETING" | "WINNER" | "LOSER";
    } | null = null;
    const dataWinner = Promise.all(
      results.map(async (user) => {
        winner = await ctx.db
          .query("participants")
          .withIndex("by_id", (q) =>
            q.eq("_id", user.winner as Id<"participants">)
          )
          .first();

        return {
          ...winner,
        };
      })
    );

    const dataWithPeserta = await Promise.all(
      results.map(async (match) => {
        const pesertaDetails = await Promise.all(
          match.participants.map(async (userId) => {
            return await ctx.db
              .query("participants")
              .withIndex("by_id", (q) => q.eq("_id", userId))
              .first();
          })
        );
        return {
          ...match,
          peserta: pesertaDetails,
          winner: winner,
        };
      })
    );

    return dataWithPeserta;
  },
});
export const getMatchNotAggree = query({
  args: {
    championshipname: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await auth.getUserId(ctx);

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const championship = await ctx.db
      .query("championship")
      .filter((q) => q.eq(q.field("name"), args.championshipname))
      .first();

    if (!championship) {
      throw new ConvexError("Championship Doesn't Exist");
    }
    const results = await ctx.db
      .query("match")
      .filter((q) => q.eq(q.field("championship"), championship._id))
      .filter((q) => q.eq(q.field("aggree"), true))
      .collect();

    const dataWithPeserta = await Promise.all(
      results.map(async (match) => {
        const pesertaDetails = await Promise.all(
          match.participants.map(async (userId) => {
            return await ctx.db
              .query("participants")
              .withIndex("by_id", (q) => q.eq("_id", userId))
              .first();
          })
        );
        return {
          ...match,
          participants: pesertaDetails,
        };
      })
    );

    return dataWithPeserta;
  },
});
export const getMatchAggree = query({
  args: {
    championshipname: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await auth.getUserId(ctx);

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const championship = await ctx.db
      .query("championship")
      .filter((q) => q.eq(q.field("name"), args.championshipname))
      .first();

    if (!championship) {
      throw new ConvexError("Championship Doesn't Exist");
    }
    const results = await ctx.db
      .query("match")
      .filter((q) => q.eq(q.field("championship"), championship._id))
      .collect();

    const dataWithPeserta = await Promise.all(
      results.map(async (match) => {
        const pesertaDetails = await Promise.all(
          match.participants.map(async (userId) => {
            return await ctx.db
              .query("participants")
              .withIndex("by_id", (q) => q.eq("_id", userId))
              .first();
          })
        );
        return {
          ...match,
          participants: pesertaDetails,
        };
      })
    );

    return dataWithPeserta;
  },
});

export const updatePeserta = mutation({
  args: {
    matchId: v.id("match"),
    participants: v.array(v.id("participants")),
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
      ...args.participants,
    ];

    // Menggunakan filter untuk menghilangkan duplikat
    const uniquePeserta = updatedPeserta.filter(
      (peserta, index, self) => index === self.findIndex((t) => t === peserta)
    );

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
export const updateMatches = mutation({
  args: { match: v.id("match"), isActive: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.match, {
      aggree: args.isActive,
    });

    return "Succes";
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

export const addVoteByWasit = mutation({
  args: {
    matchId: v.id("match"),
    pesertaId: v.id("participants"),
  },
  handler: async (ctx, args) => {
    const user = await auth.getUserId(ctx);
    if (!user) {
      throw new ConvexError("User Not found");
    }

    const wasit = await ctx.db
      .query("referee")
      .filter((q) => q.eq(q.field("user"), user))
      .first();

    if (!wasit) {
      throw new ConvexError("Something Went Wrong");
    }

    const { matchId, pesertaId } = args;
    const match = await ctx.db.get(matchId);

    if (!match) throw new ConvexError("Pertandingan tidak ditemukan");
    if (!match.votes) match.votes = [];
    if (!match.participants.includes(pesertaId))
      throw new ConvexError("Peserta tidak valid");
    if (!match.referee || !match.referee.includes(wasit._id))
      throw new ConvexError("Wasit tidak valid");

    // Check if wasit has already voted
    const existingVote = match.votes.find((vote) => vote.wasitId === wasit._id);
    if (existingVote) {
      throw new ConvexError("Wasit sudah memberikan vote");
    }

    // Add new vote
    const newVote = {
      pesertaId,
      wasitId: wasit._id,
      voteCount: 1,
    };

    const newVotes = [...match.votes, newVote];

    // Count votes
    const voteCounts: { [key: Id<"participants">]: number } = {};
    for (const vote of newVotes) {
      voteCounts[vote.pesertaId] =
        (voteCounts[vote.pesertaId] || 0) + vote.voteCount;
    }

    // Determine winner
    let winner: Id<"participants"> | null = null;
    let maxVotes = 0;
    Object.entries(voteCounts).forEach(([pesertaId, voteCount]) => {
      if (voteCount > maxVotes) {
        maxVotes = voteCount;
        winner = pesertaId as Id<"participants">;
      }
    });

    // Check if all wasits have voted
    const allWasitsVoted = newVotes.length === match.referee.length;

    if (allWasitsVoted && winner) {
      const pesertaData = await ctx.db
        .query("participants")
        .filter((q) => q.eq(q.field("_id"), winner))
        .first();

      await ctx.db.patch(matchId, {
        votes: newVotes,
        winner,
        results: `The Winner Is ${pesertaData?.name}`,
      });

      await ctx.db.patch(winner, { status: "WINNER" });

      const loserIds = match.participants.filter((id) => id !== winner);
      for (const loserId of loserIds) {
        await ctx.db.patch(loserId, { status: "LOSER" });
      }

      const nextMatchId = match.nextMatchId;
      if (nextMatchId) {
        const nextMatch = await ctx.db.get(nextMatchId);
        if (nextMatch) {
          const updatedPeserta = [
            ...(nextMatch.participants || []),
            winner,
          ].filter((id): id is Id<"participants"> => id !== undefined);

          await ctx.db.patch(nextMatchId, {
            participants: updatedPeserta,
          });
        }
      }
    } else {
      await ctx.db.patch(matchId, { votes: newVotes });
    }

    return { success: true, message: "Vote berhasil ditambahkan" };
  },
});
