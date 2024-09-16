import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { auth } from "./auth";

export const createButton = mutation({
  args: {
    title: v.string(),
    value: v.number(),
    championship: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await auth.getUserId(ctx);

    if (!identity) {
      throw new ConvexError("Unautorized");
    }

    const existingKejuaraan = await ctx.db
      .query("championship")
      .filter((q) => q.eq(q.field("name"), args.championship))
      .first();

    if (!existingKejuaraan) {
      return new ConvexError("Something Went Wrong");
    }

    await ctx.db.insert("keyboard", {
      name: args.title,
      value: args.value,
      side: "Right",
      championship: existingKejuaraan?._id,
    });

    await ctx.db.insert("keyboard", {
      name: args.title,
      value: args.value,
      side: "Left",
      championship: existingKejuaraan?._id,
    });

    return "Succces";
  },
});

export const updateSumRight = mutation({
  args: {
    sum: v.number(),
    id: v.id("keyboard"),
    matchId: v.id("match"),
  },
  handler: async (ctx, args) => {
    const identity = await auth.getUserId(ctx);

    if (!identity) {
      return new ConvexError("Unauthorized");
    }
  },
});

export const getHasilAkhir = query({
  handler: async (ctx, args) => {
    return await ctx.db.query("match").first();
  },
});

export const getKeyboardRight = query({
  args: {
    championship: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await auth.getUserId(ctx);

    if (!identity) {
      throw new ConvexError("Unautorized");
    }
    const existingKejuaraan = await ctx.db
      .query("championship")
      .filter((q) => q.eq(q.field("name"), args.championship))
      .first();

    const data = await ctx.db
      .query("keyboard")
      .filter((q) => q.eq(q.field("championship"), existingKejuaraan?._id))
      .filter((q) => q.eq(q.field("side"), "Right"))
      .collect();

    return data;
  },
});
export const getKeyboardLeft = query({
  args: {
    championship: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await auth.getUserId(ctx);

    if (!identity) {
      throw new ConvexError("Unautorized");
    }
    const existingKejuaraan = await ctx.db
      .query("championship")
      .filter((q) => q.eq(q.field("name"), args.championship))
      .first();

    const data = await ctx.db
      .query("keyboard")
      .filter((q) => q.eq(q.field("championship"), existingKejuaraan?._id))
      .filter((q) => q.eq(q.field("side"), "Left"))
      .collect();

    return data;
  },
});

export const getKeyboardById = query({
  args: {
    button: v.id("keyboard"),
  },
  handler: async (ctx, args) => {
    const identity = await auth.getUserId(ctx);

    if (!identity) {
      throw new ConvexError("Unautorized");
    }
    const keyboard = await ctx.db.get(args.button);

    return keyboard;
  },
});

export const getKeyboardsByIds = query({
  args: { buttons: v.array(v.id("keyboard")) },
  handler: async (ctx, args) => {
    const keyboards = await Promise.all(
      args.buttons.map((id) => ctx.db.get(id))
    );
    return keyboards.filter((k) => k !== null);
  },
});
