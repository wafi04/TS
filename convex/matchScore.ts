import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { auth } from "./auth";

export const getData = query({
  args: { matchId: v.id("match") },
  handler: async (ctx, args) => {
    const { matchId } = args;
    const user = await auth.getUserId(ctx);

    if (!user) {
      throw new Error("Unauthorized");
    }

    // Fetch the match data
    const match = await ctx.db.get(args.matchId);
    if (!match) {
      throw new Error("Match not found");
    }

    // Fetch referee data for the current user
    const referee = await ctx.db
      .query("referee")
      .filter((q) => q.eq(q.field("user"), user))
      .filter((q) => q.eq(q.field("championship"), match.championship))
      .first();

    if (!referee) {
      throw new Error("Referee not found for this user and championship");
    }

    // Fetch the match score data
    const matchScore = await ctx.db
      .query("matchScore")
      .filter((q) => q.eq(q.field("match"), matchId))
      .first();

    if (!matchScore) {
      throw new Error("Match score not found");
    }
    // Fetch button data from the keyboard table

    // Filter keyboard data for the current referee
    const filteredRounds = matchScore.rounds.map((round) => ({
      ...round,
      keyboard: round.keyboard.filter((kb) => kb.referee === referee._id),
    }));

    // Fetch participant data
    const participants = await Promise.all(
      (match.participants || []).map((participantId) =>
        ctx.db.get(participantId)
      )
    );

    // Fetch all referee data for the match
    const referees = await Promise.all(
      (match.referee || []).map((refereeId) => ctx.db.get(refereeId))
    );
    if (!referees) {
      throw new Error("Referees not found");
    }

    const filteredReferees = referees.filter((ref) => ref && ref.user === user);
    const refereeNumber = filteredReferees[0]?.match?.[0]?.refereeNumber;

    if (!refereeNumber) {
      throw new Error("Referee number not found");
    }

    if (!filteredReferees) {
      throw new Error("Referees not found");
    }

    // Combine all data
    const matchData = {
      match,
      matchScore: { ...matchScore, rounds: filteredRounds },
      participants,
      referees: { filteredReferees, refereeNumber },
      currentReferee: referee,
    };

    return matchData;
  },
});

export const upsertTableMatch = mutation({
  args: {
    matchId: v.id("match"),
    round: v.union(
      v.literal("First Round"),
      v.literal("Second Round"),
      v.literal("Third Round")
    ),
    keyboardId: v.id("keyboard"),
    side: v.union(v.literal("Left"), v.literal("Right")),
    value: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await auth.getUserId(ctx);

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const referee = await ctx.db
      .query("referee")
      .filter((q) => q.eq(q.field("user"), identity))
      .first();

    if (!referee) {
      throw new ConvexError("Referee Not found");
    }

    const { matchId, round, keyboardId, side, value } = args;

    const existingMatchScore = await ctx.db
      .query("matchScore")
      .withIndex("by_match", (q) => q.eq("match", matchId))
      .unique();

    if (existingMatchScore) {
      const updatedRounds = [...existingMatchScore.rounds];
      const roundIndex = updatedRounds.findIndex((r) => r.round === round);

      if (roundIndex !== -1) {
        const updatedKeyboard = [...updatedRounds[roundIndex].keyboard];
        const keyboardIndex = updatedKeyboard.findIndex(
          (k) => k.referee === referee._id && k.button === keyboardId
        );

        if (keyboardIndex !== -1) {
          updatedKeyboard[keyboardIndex].value = value;
        } else {
          updatedKeyboard.push({
            referee: referee._id,
            button: keyboardId,
            side,
            value,
          });
        }

        const updatedScores = [...updatedRounds[roundIndex].scores];
        const scoreIndex = updatedScores.findIndex(
          (s) => s.refereeId === referee._id
        );

        const totalLeft = updatedKeyboard
          .filter((k) => k.referee === referee._id && k.side === "Left")
          .reduce((sum, k) => sum + k.value, 0);
        const totalRight = updatedKeyboard
          .filter((k) => k.referee === referee._id && k.side === "Right")
          .reduce((sum, k) => sum + k.value, 0);

        if (scoreIndex !== -1) {
          updatedScores[scoreIndex] = {
            refereeId: referee._id,
            scoreLeft: totalLeft,
            scoreRight: totalRight,
          };
        } else {
          updatedScores.push({
            refereeId: referee._id,
            scoreLeft: totalLeft,
            scoreRight: totalRight,
          });
        }

        updatedRounds[roundIndex] = {
          ...updatedRounds[roundIndex],
          keyboard: updatedKeyboard,
          scores: updatedScores,
        };
      } else {
        updatedRounds.push({
          round,
          keyboard: [
            {
              referee: referee._id,
              button: keyboardId,
              side,
              value,
            },
          ],
          scores: [
            {
              refereeId: referee._id,
              scoreLeft: side === "Left" ? value : 0,
              scoreRight: side === "Right" ? value : 0,
            },
          ],
        });
      }

      const updatedMatchScore = await ctx.db.patch(existingMatchScore._id, {
        rounds: updatedRounds,
      });

      return updatedMatchScore;
    } else {
      const newMatchScore = await ctx.db.insert("matchScore", {
        match: matchId,
        rounds: [
          {
            round,
            keyboard: [
              {
                referee: referee._id,
                button: keyboardId,
                side,
                value,
              },
            ],
            scores: [
              {
                refereeId: referee._id,
                scoreLeft: side === "Left" ? value : 0,
                scoreRight: side === "Right" ? value : 0,
              },
            ],
          },
        ],
      });

      return newMatchScore;
    }
  },
});
