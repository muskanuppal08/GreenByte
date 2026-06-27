import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </NavLink>
                                
                                {user?.role === 'admin' && (
                                    <>
                                        <NavLink
                                            href={route('admin.facilities.index')}
                                            active={route().current('admin.facilities.*')}
                                        >
                                            Manage Facilities
                                        </NavLink>
                                        <NavLink
                                            href={route('admin.reviews.index')}
                                            active={route().current('admin.reviews.index')}
                                        >
                                            Manage Reviews
                                        </NavLink>
                                        <NavLink
                                            href={route('admin.pickups.index')}
                                            active={route().current('admin.pickups.*')}
                                        >
                                            Manage Pickups
                                        </NavLink>
                                        <NavLink
                                            href={route('admin.users.index')}
                                            active={route().current('admin.users.*')}
                                        >
                                            Manage Users
                                        </NavLink>
                                        <NavLink
                                            href={route('admin.education.index')}
                                            active={route().current('admin.education.*')}
                                        >
                                            Manage Education
                                        </NavLink>
                                        <NavLink
                                            href={route('admin.reports.index')}
                                            active={route().current('admin.reports.*')}
                                        >
                                            System Reports
                                        </NavLink>
                                        <NavLink
                                            href={route('admin.analytics.index')}
                                            active={route().current('admin.analytics.*')}
                                        >
                                            Platform Analytics
                                        </NavLink>
                                    </>
                                )}

                                {user?.role === 'user' && (
                                    <>
                                        <NavLink
                                            href={route('calculator')}
                                            active={route().current('calculator')}
                                        >
                                            Reward Calculator
                                        </NavLink>
                                        <NavLink
                                            href={route('leaderboard')}
                                            active={route().current('leaderboard')}
                                        >
                                            Leaderboard & Badges
                                        </NavLink>
                                        <NavLink
                                            href={route('pickups.index')}
                                            active={route().current('pickups.*')}
                                        >
                                            Home Pickups
                                        </NavLink>
                                        <NavLink
                                            href={route('recommendations.index')}
                                            active={route().current('recommendations.*')}
                                        >
                                            AI Assistant
                                        </NavLink>
                                        <NavLink
                                            href={route('impact.index')}
                                            active={route().current('impact.*')}
                                        >
                                            Impact Dashboard
                                        </NavLink>
                                    </>
                                )}

                                <NavLink
                                    href={route('locator')}
                                    active={route().current('locator')}
                                >
                                    Facility Locator
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                {user ? (
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                                >
                                                    {user.name}

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
                                                Profile
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                            >
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                ) : (
                                    <div className="space-x-4">
                                        <Link
                                            href={route('login')}
                                            className="text-sm text-gray-700 dark:text-gray-500 underline"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="ml-4 text-sm text-gray-700 dark:text-gray-500 underline"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
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
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard
                        </ResponsiveNavLink>

                        {user?.role === 'admin' && (
                            <>
                                <ResponsiveNavLink
                                    href={route('admin.facilities.index')}
                                    active={route().current('admin.facilities.*')}
                                >
                                    Manage Facilities
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('admin.reviews.index')}
                                    active={route().current('admin.reviews.index')}
                                >
                                    Manage Reviews
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('admin.pickups.index')}
                                    active={route().current('admin.pickups.index')}
                                >
                                    Manage Pickups
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('admin.users.index')}
                                    active={route().current('admin.users.index')}
                                >
                                    Manage Users
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('admin.education.index')}
                                    active={route().current('admin.education.index')}
                                >
                                    Manage Education
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('admin.reports.index')}
                                    active={route().current('admin.reports.index')}
                                >
                                    System Reports
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('admin.analytics.index')}
                                    active={route().current('admin.analytics.index')}
                                >
                                    Platform Analytics
                                </ResponsiveNavLink>
                            </>
                        )}

                        {user?.role === 'user' && (
                             <>
                                 <ResponsiveNavLink
                                     href={route('calculator')}
                                     active={route().current('calculator')}
                                 >
                                     Reward Calculator
                                 </ResponsiveNavLink>
                                 <ResponsiveNavLink
                                     href={route('leaderboard')}
                                     active={route().current('leaderboard')}
                                 >
                                     Leaderboard & Badges
                                 </ResponsiveNavLink>
                                 <ResponsiveNavLink
                                     href={route('pickups.index')}
                                     active={route().current('pickups.index')}
                                 >
                                     Home Pickups
                                 </ResponsiveNavLink>
                                 <ResponsiveNavLink
                                     href={route('recommendations.index')}
                                     active={route().current('recommendations.index')}
                                 >
                                     AI Assistant
                                 </ResponsiveNavLink>
                                 <ResponsiveNavLink
                                     href={route('impact.index')}
                                     active={route().current('impact.index')}
                                 >
                                     Impact Dashboard
                                 </ResponsiveNavLink>
                             </>
                        )}

                        <ResponsiveNavLink
                            href={route('locator')}
                            active={route().current('locator')}
                        >
                            Facility Locator
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        {user ? (
                            <>
                                <div className="px-4">
                                    <div className="text-base font-medium text-gray-800">
                                        {user.name}
                                    </div>
                                    <div className="text-sm font-medium text-gray-500">
                                        {user.email}
                                    </div>
                                </div>

                                <div className="mt-3 space-y-1">
                                    <ResponsiveNavLink href={route('profile.edit')}>
                                        Profile
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        method="post"
                                        href={route('logout')}
                                        as="button"
                                    >
                                        Log Out
                                    </ResponsiveNavLink>
                                </div>
                            </>
                        ) : (
                            <div className="mt-3 space-y-1 px-4">
                                <Link
                                    href={route('login')}
                                    className="block text-base font-medium text-gray-500 hover:text-gray-800"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="block text-base font-medium text-gray-500 hover:text-gray-800"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
