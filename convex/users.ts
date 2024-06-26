import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, internalMutation, query } from "./_generated/server";
import { roles } from "./schema";

export async function getUser(ctx: QueryCtx | MutationCtx, tokenIdentifier: string) {
    const user =  await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", tokenIdentifier)
        )
        .first();
    
    if (!user) {
        throw new ConvexError("Expected users to be defined");
    }

    return user;
}

//CREATE USER
export const createUser = internalMutation({
  args: { tokenIdentifier: v.string(), name: v.string(), image: v.string() },
  async handler(ctx, args) {
    await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      orgIds: [],
      name: args.name,
      image: args.image,
    });
  },
});

//UPDATE USER
export const updateUser = internalMutation({
  args: { tokenIdentifier: v.string(), name: v.string(), image: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db.query("users").withIndex("by_tokenIdentifier", (q) =>
      q.eq("tokenIdentifier", args.tokenIdentifier)
    ).first();

    if (!user) {
      throw new ConvexError("Unable to find a user with this token");
    }

    await ctx.db.patch(user._id, {
      name: args.name,
      image: args.image,
    });
  },
});

//ADD ORG TO PARTICULAR USER
export const addOrgIdToUser = internalMutation({
  args: { tokenIdentifier: v.string(), orgId: v.string(), role: roles },
  async handler(ctx, args) {
    //BASICALLY IT FINDS THE USERS TOKEN IDENTIFIER AND MATCHES IT
    //THE FUNCTION IS UP TOP
    const user = await getUser(ctx, args.tokenIdentifier);
    //IF THERE IS. THEN ADD ORG TO USER
    await ctx.db.patch(user._id, {
      orgIds: [...user.orgIds, { orgId: args.orgId, role: args.role }],
    });
  },
});

//ABILITY TO CHANGE USER ROLES
export const updateRoleInOrgForUser = internalMutation({
  args: { tokenIdentifier: v.string(), orgId: v.string(), role: roles },
  async handler(ctx, args) {
    //BASICALLY IT FINDS THE USERS TOKEN IDENTIFIER AND MATCHES IT
    //THE FUNCTION IS UP TOP
    const user = await getUser(ctx, args.tokenIdentifier);
    const org = user.orgIds.find((org) => org.orgId === args.orgId);

    if (!org) {
      throw new ConvexError("During the update, an expected organization linked to the user was not found.");
    }

    org.role = args.role;

    await ctx.db.patch(user._id, {
      orgIds: user.orgIds,
    });
  },
});

export const getUserProfile = query({
  args: { userId: v.id("users")},
  async handler(ctx, args) {
    const user = await ctx.db.get(args.userId);

    return {
      name: user?.name,
      image: user?.image,
    };
  },
});

// GETTING CURRENTLY AUTHENTICATED USER
export const getAuthUser = query({
  args: {},
  async handler(ctx, args) {
    const isLoggedIn = await ctx.auth.getUserIdentity();

    if (!isLoggedIn) {
        return null;
    }

    const user = await getUser(ctx, isLoggedIn.tokenIdentifier);

    if (!user) {
      return null;
    }

    return user;
  }
});
