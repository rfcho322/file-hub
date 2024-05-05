import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, mutation, query } from "./_generated/server";
import { getUser } from "./users";

export const generateUploadUrl = mutation(async (ctx) => {
    const isLoggedIn = await ctx.auth.getUserIdentity();

    if (!isLoggedIn) {
        throw new ConvexError('You must be logged in to upload a file')
    }
    return await ctx.storage.generateUploadUrl();
});

async function hasAccessToOrg (ctx: QueryCtx | MutationCtx, tokenIdentifier: string, orgId: string) {
    const user = await getUser(ctx, tokenIdentifier);

        const hasAccess = 
            user.orgIds.includes(orgId) ||
            user.tokenIdentifier.includes(orgId);

    return hasAccess;
}

export const createFile = mutation({
    args: {
        name: v.string(),
        fileId: v.id("_storage"),
        orgId: v.string(),
    },
    async handler(ctx, args) {
        // CHECKS IF USER IS LOGGED IN
        const isLoggedIn = await ctx.auth.getUserIdentity();
        console.log(isLoggedIn);

        if (!isLoggedIn) {
            throw new ConvexError('You must be logged in to upload a file')
        }

        const hasAccess = await hasAccessToOrg(ctx, isLoggedIn.tokenIdentifier, args.orgId);

        if (!hasAccess) {
            throw new ConvexError("You do not have access to this organization");
        }

        await ctx.db.insert("files", {
            name: args.name,
            orgId: args.orgId,
            fileId: args.fileId
        });
    },
});

export const getFiles = query({
    args: {
        orgId: v.string(),
    },
    async handler(ctx, args) {
        // CHECKS IF USER IS LOGGED IN
        const isLoggedIn = await ctx.auth.getUserIdentity();

        if (!isLoggedIn) {
            return [];
        }

        const hasAccess = await hasAccessToOrg(ctx, isLoggedIn.tokenIdentifier, args.orgId);

        if (!hasAccess) {
            return [];
        }

        return ctx.db
            .query('files')
            .withIndex('by_orgId', q => q.eq('orgId', args.orgId))
            .collect();
    },
});