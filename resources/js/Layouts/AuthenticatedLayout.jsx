import Navbar from '@/Components/NonPrimitive/Navbar';
import { Link, usePage } from '@inertiajs/react';


export default function AuthenticatedLayout({lang,children,className}) {
    const user = usePage().props.auth.user;
    return (
        <div className={"min-h-screen bg-leaf-back "+className}>
            <Navbar user={user}
            lang={lang}/>
            <main>{children}</main>
        </div>
    );
}
