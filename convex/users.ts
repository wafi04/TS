import { ConvexError, v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { auth } from "./auth";
import { paginationOptsValidator } from "convex/server";
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await auth.getUserId(ctx);

    if (user === null) {
      return null;
    }
    const currentUser = await ctx.db.get(user);

    if (!currentUser) {
      return;
    }

    return currentUser;
  },
});

export const SearchUser = query({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await auth.getUserId(ctx);

    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const results = await ctx.db
      .query("users")
      .withSearchIndex("search_name", (q) => q.search("name", args.name))
      .collect();

    return results;
  },
});

export const getUserByname = query({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("name"), args.name))
      .unique();
    return user;
  },
});

export const updateUser = mutation({
  args: {
    updateData: v.object({
      image: v.optional(v.string()),
      displayName: v.optional(v.string()),
      bio: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const currentUserId = await auth.getUserId(ctx);

    if (!currentUserId) {
      throw new Error("Unauthorized");
    }

    const userToUpdate = await ctx.db.get(currentUserId);
    if (!userToUpdate) {
      throw new Error("User not found");
    }

    let profile;

    // Perform the partial update
    if (args.updateData.image) {
      profile = (await ctx.storage.getUrl(args.updateData.image)) as string;
    }
    const updatedUser = await ctx.db.patch(currentUserId, {
      displayName: args.updateData.displayName,
      image: profile,
      bio: args.updateData.bio,
    });

    return updatedUser;
  },
});
