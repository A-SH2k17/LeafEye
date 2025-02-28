import Navbar from '@/Components/NonPrimitive/Navbar';
import { Link, usePage } from '@inertiajs/react';


export default function AuthenticatedLayout({children }) {
    const user = usePage().props.auth.user;
    return (
        <div className="min-h-screen bg-leaf-back">
            <Navbar user={user}/>
            <main>{children}</main>
        </div>
    );
}
