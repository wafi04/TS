import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { auth } from "./auth";
import { championshipWithUsers } from "./types";
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});
export const createKejuaraan = mutation({
  args: {
    name: v.string(),
    lokasi: v.string(),
    image: v.optional(v.id("_storage")),
    tanggalDimulai: v.number(),
    tanggalSelesai: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await auth.getUserId(ctx);
    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    console.log(args.image);

    const existingKejuaraan = await ctx.db
      .query("championship")
      .filter((q) => q.eq(q.field("name"), args.name))
      .first();

    if (existingKejuaraan) {
      throw new Error("Kejuaraan with this name already exists");
    }
    let image;

    if (args.image) {
      image = (await ctx.storage.getUrl(args.image)) as string;
    }

    await ctx.db.insert("championship", {
      location: args.lokasi,
      name: args.name,
      image,
      startDate: args.tanggalDimulai,
      endDate: args.tanggalSelesai,
      user,
    });

    return "Success";
  },
});
export interface PaginationResult<T> {
  page: T[];
  continueCursor: string | undefined; // Changed from string | null to string | undefined
  isDone: boolean;
}

export const getKejuaraan = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const { page, continueCursor, isDone } = await ctx.db
      .query("championship")
      .order("desc")
      .paginate(args.paginationOpts);

    const championshipWithUsers = await Promise.all(
      page.map(async (item) => {
        const user = await ctx.db.get(item.user);
        return {
          ...item,
          creator: user,
        } as championshipWithUsers;
      })
    );

    return {
      page: championshipWithUsers,
      continueCursor,
      isDone,
    };
  },
});

export const getKejuaraanByName = query({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await auth.getUserId(ctx);

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const kejuaraan = await ctx.db
      .query("championship")
      .filter((q) => q.eq(q.field("name"), args.name))
      .first();

    return kejuaraan;
  },
});
export const getChampionshipsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const championships = await ctx.db
      .query("championship")
      .filter((q) => q.eq(q.field("user"), args.userId))
      .collect();

    return championships.map((championship) => ({
      _id: championship._id,
      name: championship.name,
      location: championship.location,
      image: championship.image,
      startDate: championship.startDate,
      endDate: championship.endDate,
    }));
  },
});
