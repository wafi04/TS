import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v, VLiteral } from "convex/values";

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.union(v.literal("KETUA"), v.literal("ANGGOTA"), v.literal("WASIT")),
    emailVerificationTime: v.optional(v.number()),
    displayName: v.optional(v.string()),
    bio: v.optional(v.string()),
  })
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["name"],
    })
    .index("by_email_name", ["email", "name"]),
  championship: defineTable({
    user: v.id("users"),
    name: v.string(),
    location: v.string(),
    image: v.optional(v.string()),
    startDate: v.number(),
    endDate: v.number(),
  }).index("by_user", ["user"]),
  participants: defineTable({
    name: v.string(),
    matchCategory: v.string(),
    user: v.id("users"),
    contingent: v.string(),
    agree: v.boolean(),
    championship: v.id("championship"),
    status: v.union(
      v.literal("NOT YET COMPETING"),
      v.literal("WINNER"),
      v.literal("LOSER")
    ),
  })
    .index("by_championship", ["championship"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["name"],
    }),
  media: defineTable({
    participants: v.id("participants"),
    mediaId: v.id("_storage"),
    url: v.string(),
  }).index("by_participants", ["participants"]),
  referee: defineTable({
    championship: v.id("championship"),
    user: v.string(),
    match: v.optional(
      v.array(
        v.object({
          matchId: v.id("match"),
          refereeNumber: v.number(),
        })
      )
    ),
  }),
  match: defineTable({
    time: v.number(),
    championship: v.id("championship"),
    location: v.string(),
    aggree: v.boolean(),
    votes: v.optional(
      v.array(
        v.object({
          pesertaId: v.id("participants"),
          wasitId: v.id("referee"),
          voteCount: v.number(),
        })
      )
    ),
    round: v.number(),
    matchNumber: v.number(),
    nextMatchId: v.optional(v.id("match")),
    nextMatchPosition: v.optional(
      v.union(v.literal("TOP"), v.literal("BOTTOM"))
    ),
    participants: v.array(v.id("participants")),
    winner: v.optional(v.id("participants")),
    referee: v.optional(v.array(v.id("referee"))),
    results: v.optional(v.string()),
  }).index("by_championship", ["championship"]),
  matchScore: defineTable({
    match: v.id("match"),
    rounds: v.array(
      v.object({
        round: v.union(
          v.literal("First Round"),
          v.literal("Second Round"),
          v.literal("Third Round")
        ),
        keyboard: v.array(
          v.object({
            referee: v.id("referee"),
            button: v.id("keyboard"),
            side: v.union(v.literal("Left"), v.literal("Right")),
            value: v.number(),
          })
        ),
        scores: v.array(
          v.object({
            refereeId: v.id("referee"),
            scoreLeft: v.number(),
            scoreRight: v.number(),
          })
        ),
      })
    ),
  }).index("by_match", ["match"]),
  bracket: defineTable({
    championship: v.id("championship"),
    class: v.string(),
    rounds: v.array(
      v.object({
        roundNumber: v.number(),
        matches: v.array(
          v.object({
            matchId: v.id("match"),
            nextMatchId: v.optional(v.id("match")),
          })
        ),
      })
    ),
  })
    .index("by_championships", ["championship"])
    .index("by_championship_and_class", ["championship", "class"]),
  keyboard: defineTable({
    championship: v.id("championship"),
    name: v.string(),
    value: v.number(),
    side: v.union(v.literal("Right"), v.literal("Left")),
  }).index("by_championship", ["championship"]),
});
