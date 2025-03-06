import React , { useState } from "react";
import ApplicationLogo from '@/Components/Primitive/ApplicationLogo';
import Dropdown from '@/Components/Primitive/Dropdown';
import NavLink from '@/Components/Primitive/NavLink';
import ResponsiveNavLink from '@/Components/Primitive/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import PrimaryButton from "../Primitive/PrimaryButton";
import Register from "@/Pages/Auth/Register";
import { useTranslation } from "react-i18next";
import "../../i18n.js"

export default function Navbar({lang,user}){
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const { t } = useTranslation();

    return(
        <nav className="border-b border-gray-100 bg-leaf-nav-back md:p-0 sm:pb-3">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center bg-zinc-50  p-2">
                                <Link href={`/?lng=${lang}`}>
                                    <ApplicationLogo className="block h-full w-auto fill-current" />
                                </Link>
                            </div>
                        </div>
                        <div>
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex sm:mt-3 ">
                                    <NavLink
                                        className="navText"
                                        href={route('users_home',{lng:lang})}
                                        active={route().current('users_home') || route().current('welcome')}
                                    >
                                        {t("home_link")}
                                    </NavLink>
                                    {
                                        user && (<NavLink
                                            className="navText"
                                            href={route('users_home')}
                                            active={route().current('d')}
                                        >
                                        {t("social_media")}
                                        </NavLink>)
                                    }
                                    <NavLink
                                        className="navText"
                                        href={route('users_home')}
                                        active={route().current('d')}
                                    >
                                        {t("market")}
                                    </NavLink>
                            </div>
                        </div>
                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            {
                                user &&(
                                <>
                                <div >
                                    <NavLink
                                            className="navText"
                                            href={route('users_home')}
                                            active={route().current('d')}
                                        >
                                            {t("chatbot")}
                                    </NavLink>
                                </div>
                                <div className="relative ms-3">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                                >
                                                    {user.username}

                                                    <svg
                                                        className="-me-0.5 ms-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link
                                                href={route('profile.edit')}
                                            >
                                                {t("profile")}
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                            >
                                                {t("logout")}
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                                </>
                                )
                            }
                            {
                                user==null && (
                                    <>
                                    <div className="p-3">
                                        <Link href={route('register')}>
                                            <PrimaryButton className="mr-4">{t("register")}</PrimaryButton>
                                        </Link>
                                        <Link href={route('login')}>
                                            <PrimaryButton>{t("login")}</PrimaryButton>
                                        </Link>
                                    </div>
                                    </>
                                )
                            }
                        </div>


                        {/**Starting from here is the responsive link for small screens */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        `transform transition-all duration-300 ease-in-out ${
                        showingNavigationDropdown ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    } sm:hidden overflow-hidden`
                    }
                >
                                        
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('users_home')}
                            active={route().current('users_home') || route().current('welcome')}
                        >
                            {t("home_link")}
                        </ResponsiveNavLink>
                        {
                            user && 
                            <ResponsiveNavLink
                            href={route('users_home')}
                            active={route().current('a')}>
                                {t("social_media")}
                            </ResponsiveNavLink>
                        }
                        <ResponsiveNavLink
                            href={route('users_home')}
                            active={route().current('a')}
                        >
                            {t("market")}
                        </ResponsiveNavLink>
                    </div>

                    {
                        user &&(
                            <div className="border-t border-gray-200 pb-1 pt-4">
                                <div className="text-base font-medium text-gray-800 ml-4">
                                        {user.username}
                                </div>
                                <div className="mt-3 space-y-1">
                                    <ResponsiveNavLink href={route('profile.edit')}>
                                        {t("profile")}
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        method="post"
                                        href={route('logout')}
                                        as="button"
                                    >
                                        {t("logout")}
                                    </ResponsiveNavLink>
                                </div>
                            </div>
                        )
                    }

                    {
                        user == null &&(
                            <div className="border-t border-gray-200 pb-1 pt-4">
                                <div className="mt-3 space-y-1">
                                    <ResponsiveNavLink href={route('login')}>
                                        {t("login")}
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        href={route('register')}
                                    >
                                        {t("register")}
                                    </ResponsiveNavLink>
                                </div>
                            </div>
                        )
                    }
                    
                </div>
            </nav>
    )
}