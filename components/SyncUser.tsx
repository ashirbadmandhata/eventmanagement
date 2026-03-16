"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useEffect } from "react";
import { Id } from "../convex/_generated/dataModel";

export default function SyncUser() {
    const { user, isLoaded } = useUser();
    const storeUser = useMutation(api.users.store);
    const currentUser = useQuery(api.users.current);

    useEffect(() => {
        if (isLoaded && user && !currentUser) {
            storeUser({});
        }
    }, [isLoaded, user, currentUser, storeUser]);

    return null;
}
