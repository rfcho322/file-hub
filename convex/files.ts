import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx, internalMutation, mutation, query } from "./_generated/server";
import { getUser } from "./users";
import { fileTypes } from "./schema";
import { Doc, Id } from "./_generated/dataModel";

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
            user.orgIds.some(item => item.orgId === orgId) ||
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
            userId: hasAccess.user._id,
        });
    },
});

export const getFiles = query({
    args: {
        orgId: v.string(),
        query: v.optional(v.string()),
        favorites: v.optional(v.boolean()),
        deletedFiles: v.optional(v.boolean()),
        type: v.optional(fileTypes),
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

        if (args.deletedFiles) {
            files = files.filter((files) => files.toBeDeleted);
        } else {
            files = files.filter((files) => !files.toBeDeleted);
        }

        if (args.type) {
            files = files.filter((file) => file.type === args.type);
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

export const deleteAllFiles = internalMutation({
    args: {},
    async handler (ctx) {
        const files = await ctx.db
            .query("files")
            .withIndex("by_toBeDeleted", (q) => q.eq("toBeDeleted", true))
            .collect();

        await Promise.all(files.map(async file => {
            await ctx.storage.delete(file.fileId);
            return await ctx.db.delete(file._id);
        }));
    }
});

function canDeleteFile (user: Doc<"users">, file: Doc<"files">) {
    const canDelete = file.userId === user._id ||
        user.orgIds.find(org => org.orgId === file.orgId)
        ?.role === "admin";
    
    if (!canDelete) {
        throw new ConvexError('You have no access to delete this file!');
    }
}

export const deleteFile = mutation({
    args: { fileId: v.id("files") },
    async handler (ctx, args) {
        const access = await hasAccessToFile(ctx, args.fileId);

        if (!access) {
            throw new ConvexError('You do not have access to delete this file!');
        }

        canDeleteFile(access.user, access.file);

        // await ctx.db.delete(args.fileId);
        await ctx.db.patch(args.fileId, {
            toBeDeleted: true,
        });
    }
});

export const restoreFile = mutation({
    args: { fileId: v.id("files") },
    async handler (ctx, args) {
        const access = await hasAccessToFile(ctx, args.fileId);

        if (!access) {
            throw new ConvexError('You do not have access to delete this file!');
        }

        canDeleteFile(access.user, access.file);

        // await ctx.db.delete(args.fileId);
        await ctx.db.patch(args.fileId, {
            toBeDeleted: false,
        });
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