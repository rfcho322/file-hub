"use client"

import { FilesDisplay } from "@/app/_components/FileDisplay";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export default function FavoritesPage () {

    return (
        <div>
            <FilesDisplay title="Your Favorites" MyFavorites/>
        </div>
    );
}