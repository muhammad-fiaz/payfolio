"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const { data: session, status } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);
    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Wait for session to load before rendering (avoids flickering)
    if (status === "loading") return null;

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3/4 lg:w-1/2 bg-white shadow-lg rounded-4xl z-50"
        >
            <nav className="z-20 justify-center flex w-full px-6 py-2">
                <div className="mx-auto max-w-full w-full">
                    <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        {/* Logo */}
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link
                                href="/"
                                aria-label="Home"
                                className="flex items-center space-x-2 text-black dark:text-black"
                            >
                                <span className="font-bold text-lg">Muhammad Fiaz</span>
                            </Link>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={toggleMenu}
                                className="relative z-20 block p-2.5 lg:hidden"
                                aria-label="Toggle Menu"
                                aria-expanded={isOpen}
                            >
                                {isOpen ? (
                                    <X size={25} className="text-black" />
                                ) : (
                                    <Menu size={25} className="text-black" />
                                )}
                            </button>
                        </div>

                        {/* Desktop Navigation Menu */}
                        <div className="hidden lg:flex lg:items-center lg:space-x-6">
                            <ul className="flex gap-8 text-black">
                                <li>
                                    <Link
                                        href="https://muhammadfiaz.com/privacy-policy"
                                        className="hover:text-gray-600 hover:underline duration-150 transition-colors ease-in-out"
                                    >
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="https://muhammadfiaz.com/terms-of-service"
                                        className="hover:text-gray-600 hover:underline duration-150 transition-colors ease-in-out"
                                    >
                                        Terms of Use
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="https://muhammadfiaz.com/terms-of-service"
                                        className="hover:text-gray-600 hover:underline duration-150 transition-colors ease-in-out"
                                    >
                                        Refund Policy
                                    </Link>
                                </li>
                            </ul>

                            {/* Authentication: Show avatar if logged in, otherwise show Sign In button */}
                            {session?.user ? (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        className="w-10 h-10 rounded-full overflow-hidden border border-gray-300"
                                        onClick={toggleDropdown}
                                    >
                                        <img
                                            src={session.user.image || "/default-avatar.png"}
                                            alt="User Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                    <AnimatePresence>
                                        {isDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg"
                                            >
                                                <button
                                                    onClick={() => signOut()}
                                                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                                                >
                                                    Logout
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <button
                                    onClick={() => signIn("github")}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-100 text-black"
                                >
                                    Sign In
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        transition={{ duration: 0.3 }}
                        id="mobile-menu"
                        className="lg:hidden fixed top-[90px] left-1/2 transform -translate-x-1/2 w-11/12 max-w-sm bg-white border border-black/30 shadow-lg rounded-lg"
                    >
                        <ul className="flex flex-col p-6 space-y-4 text-black">
                            <li>
                                <Link
                                    href="https://muhammadfiaz.com/terms-of-service"
                                    onClick={closeMenu}
                                    className="block hover:text-gray-600 duration-150"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="https://muhammadfiaz.com/privacy-policy"
                                    onClick={closeMenu}
                                    className="block hover:text-gray-600 duration-150"
                                >
                                    Terms of Use
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="https://muhammadfiaz.com/terms-of-service"
                                    onClick={closeMenu}
                                    className="block hover:text-gray-600 duration-150"
                                >
                                    Refund Policy
                                </Link>
                            </li>
                            <li>
                                {session?.user ? (
                                    <button
                                        onClick={() => signOut()}
                                        className="block text-center px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 hover:bg-gray-200"
                                    >
                                        Logout
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => signIn("github")}
                                        className="block text-center px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 hover:bg-gray-200"
                                    >
                                        Sign In
                                    </button>
                                )}
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
