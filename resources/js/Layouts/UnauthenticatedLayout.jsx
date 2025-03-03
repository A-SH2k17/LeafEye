import React from "react";
import Navbar from "@/Components/NonPrimitive/Navbar";
import { Link, usePage } from '@inertiajs/react';

export default function UnauthenticatedLayout({lang,children}){
    const user = usePage().props.auth.user;
    return (
            <div className="min-h-screen bg-leaf-back">
                <Navbar user={user}
                        lang = {lang}/>
                <main>{children}</main>
            </div>
    );
}