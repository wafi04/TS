import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

export const createPeserta = mutation({
  args: {
    championshipname: v.string(),
    matchCategory: v.string(),
    contingent: v.string(),
    name: v.string(),
    document: v.optional(v.array(v.id("_storage"))),
  },
  handler: async (ctx, args) => {
    const identity = await auth.getUserId(ctx);
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const kejuaraan = await ctx.db
      .query("championship")
      .filter((q) => q.eq(q.field("name"), args.championshipname))
      .first();

    if (!kejuaraan) {
      throw new ConvexError("Kejuaraan Doesn't Exist");
    }

    const participantId = await ctx.db.insert("participants", {
      championship: kejuaraan?._id,
      matchCategory: args.matchCategory,
      contingent: args.contingent,
      user: identity,
      name: args.name,
      status: "NOT YET COMPETING",
      agree: false,
    });

    if (args.document && args.document.length > 0) {
      await Promise.all(
        args.document.map(async (documentId) => {
          const url = await ctx.storage.getUrl(documentId);
          if (url) {
            await ctx.db.insert("media", {
              participants: participantId,
              mediaId: documentId,
              url: url,
            });
          }
        })
      );
    }

    return "Success";
  },
});

export const getPeserta = query({
  args: {
    kejuaraanName: v.string(),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const championship = await ctx.db
      .query("championship")
      .filter((q) => q.eq(q.field("name"), args.kejuaraanName))
      .first();

    if (!championship) {
      throw new ConvexError("Kejuaraan Doesn't Exist");
    }

    let pesertaQuery = ctx.db
      .query("participants")
      .withIndex("by_championship", (q) =>
        q.eq("championship", championship._id)
      )
      .order("desc");
    // Jika ada input pencarian, gunakan searchIndex
    if (args.search && args.search.trim() !== "") {
      pesertaQuery = ctx.db
        .query("participants")
        .withSearchIndex("search_name", (q) =>
          q.search("name", args.search as string)
        )
        .filter((q) => q.eq(q.field("championship"), championship._id));
    }

    const peserta = await pesertaQuery.collect();
    return peserta;
  },
});
export const getPesertaNotaGree = query({
  args: {
    kejuaraanName: v.string(),
    search: v.optional(v.string()),
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
      throw new ConvexError("Kejuaraan Doesn't Exist");
    }

    let pesertaQuery = ctx.db
      .query("participants")
      .withIndex("by_championship", (q) =>
        q.eq("championship", championship._id)
      )
      .order("desc")
      .filter((q) => q.eq(q.field("agree"), true));

    // Jika ada input pencarian, gunakan searchIndex
    if (args.search && args.search.trim() !== "") {
      pesertaQuery = ctx.db
        .query("participants")
        .withSearchIndex("search_name", (q) =>
          q.search("name", args.search as string)
        )
        .filter((q) => q.eq(q.field("championship"), championship._id))
        .filter((q) => q.eq(q.field("agree"), true));
    }

    const peserta = await pesertaQuery.collect();
    return peserta;
  },
});
export const updatePeserta = mutation({
  args: {
    peserta: v.id("participants"),
    name: v.string(),
    matchCategory: v.string(),
    contingent: v.string(),
  },
  handler: async (ctx, args) => {
    const { matchCategory, contingent, name } = args;

    const identity = await auth.getUserId(ctx);

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    await ctx.db.patch(args.peserta, {
      matchCategory,
      contingent,
      name,
    });
  },
});

export const getPesertaByID = query({
  args: {
    peserta: v.id("participants"),
  },
  handler: async (ctx, args) => {
    const { peserta } = args;

    const identity = await auth.getUserId(ctx);

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const pesertas = await ctx.db.get(peserta);
    if (!pesertas) {
      return;
    }

    return pesertas;
  },
});

export const deletePeserta = mutation({
  args: { peserta: v.id("participants") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.peserta);

    return "Success";
  },
});

export const updateAggre = mutation({
  args: { peserta: v.id("participants") },
  handler: async (ctx, args) => {
    const identity = await auth.getUserId(ctx);

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    await ctx.db.patch(args.peserta, {
      agree: true,
    });
  },
});
export const getPesertaBySearch = query({
  args: { kejuaraanName: v.string(), name: v.string() },
  handler: async (ctx, args) => {
    const indentity = await ctx.auth.getUserIdentity();

    if (!indentity) {
      throw new ConvexError("Unautorized");
    }

    const championship = await ctx.db
      .query("championship")
      .filter((q) => q.eq(q.field("name"), args.kejuaraanName))
      .first();

    if (!championship) {
      return null;
    }

    const peserta = await ctx.db
      .query("participants")
      .filter((q) => q.eq(q.field("name"), args.name))
      .filter((q) => q.eq(q.field("championship"), championship._id))
      .collect();

    if (!peserta) {
      return null;
    }
    return peserta;
  },
});

export const getParticipantsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const participants = await ctx.db
      .query("participants")
      .filter((q) => q.eq(q.field("user"), args.userId))
      .collect();

    return participants;
  },
});
