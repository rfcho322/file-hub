import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, mutation, query } from "./_generated/server";
import { getUser } from "./users";
import { fileTypes } from "./schema";
import { Id } from "./_generated/dataModel";

export const generateUploadUrl = mutation(async (ctx) => {
    // CHECKS IF USER IS LOGGED IN
    const isLoggedIn = await ctx.auth.getUserIdentity();

    if (!isLoggedIn) {
        throw new ConvexError('You must be logged in to upload a file')
    }
    return await ctx.storage.generateUploadUrl();
});

async function hasAccessToOrg (ctx: QueryCtx | MutationCtx, orgId: string) {
    //CHECKS IF USER IS LOGGED IN
    const isLoggedIn = await ctx.auth.getUserIdentity();
        console.log(isLoggedIn);

    if (!isLoggedIn) {
        return null;
    }

    const user = await ctx.db.query("users")
        .withIndex("by_tokenIdentifier", (q) => 
        q.eq("tokenIdentifier", isLoggedIn.tokenIdentifier)
    )
    .first();

    if (!user) {
        return null;
    }

    const hasAccess = 
            user.orgIds.includes(orgId) ||
            user.tokenIdentifier.includes(orgId);

    if (!hasAccess) {
        return null;
    }

    return { user };
}

export const createFile = mutation({
    args: {
        name: v.string(),
        fileId: v.id("_storage"),
        orgId: v.string(),
        type: fileTypes,
    },
    async handler(ctx, args) {

        const hasAccess = await hasAccessToOrg(ctx, args.orgId);

        if (!hasAccess) {
            throw new ConvexError("You do not have access to this organization");
        }

        await ctx.db.insert("files", {
            name: args.name,
            orgId: args.orgId,
            fileId: args.fileId,
            type: args.type,
        });
    },
});

export const getFiles = query({
    args: {
        orgId: v.string(),
        query: v.optional(v.string()),
        favorites: v.optional(v.boolean()),
    },
    async handler(ctx, args) {

        const hasAccess = await hasAccessToOrg(ctx, args.orgId);

        if (!hasAccess) {
            return [];
        }

        let files = await ctx.db
            .query('files')
            .withIndex('by_orgId', q => q.eq('orgId', args.orgId))
            .collect();

        const query = args.query;

        if(!query) {
            files = files;
        } else {
            files = files.filter((file) => file.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
        }
        

        if (args.favorites) {

            const favorites = await ctx.db.query("favorites").withIndex("by_userId_orgId_fileId", q => 
                q.eq("userId", hasAccess.user._id).eq("orgId", args.orgId)
            ).collect();

            files = files.filter(file => favorites.some((favorite) => favorite.fileId === file._id))

            
        }
        
        const filesWithUrl = await Promise.all(
            files.map(async (file) => ({
                ...file,
                url: await ctx.storage.getUrl(file.fileId),
            }))
        );

        // console.log(filesWithUrl);

        return filesWithUrl;
    },
});

export const deleteFile = mutation({
    args: { fileId: v.id("files") },
    async handler (ctx, args) {
        const access = await hasAccessToFile(ctx, args.fileId);

        if (!access) {
            throw new ConvexError('You do not have access to delete this file!');
        }

        await ctx.db.delete(args.fileId);
    }
});

export const toggleFavorite = mutation({
    args: { fileId: v.id("files") },
    async handler (ctx, args) {
        const access = await hasAccessToFile(ctx, args.fileId);
        const file = await ctx.db.get(args.fileId);

        if (!access) {
            throw new ConvexError('No Access to file!');
        }

        const favorite = await ctx.db.query("favorites")
            .withIndex("by_userId_orgId_fileId", (q) => 
            q.eq("userId", access.user._id).eq("orgId", access.file.orgId).eq("fileId", access.file._id)
        )
        .first();

        if (!favorite) {
            await ctx.db.insert("favorites", {
                fileId: access.file._id,
                userId: access.user._id,
                orgId: access.file.orgId,
            });
        } else {
            await ctx.db.delete(favorite._id)
        }
    }
});

export const getAllFavorites = query({
    args: { orgId: v.string() },
    async handler (ctx, args) {

        const hasAccess = await hasAccessToOrg(ctx, args.orgId);

        if (!hasAccess) {
            return [];
        }

        const favorite = await ctx.db.query("favorites")
            .withIndex("by_userId_orgId_fileId", (q) => 
            q.eq("userId", hasAccess.user._id).eq("orgId", args.orgId)
        ).collect();

        return favorite;
    }
});

// CHECKS IF A USER HAS ACCESS
async function hasAccessToFile (ctx: QueryCtx | MutationCtx, fileId: Id<"files">) {

    const file = await ctx.db.get(fileId);

    if (!file) {
        return null;
    }

    const hasAccess = await hasAccessToOrg(ctx, file.orgId);

    if (!hasAccess) {
        return null;
    }

    return { user: hasAccess.user, file };
}