"use client"

import { FilesDisplay } from "@/app/_components/FileDisplay";

export default function FavoritesPage () {

    return (
        <div>
            <FilesDisplay title="Trash" deletedFiles/>
        </div>
    );
}