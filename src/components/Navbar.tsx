"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // ✅ Import icons from lucide-react

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    // Close menu when clicking outside
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (isOpen && !document.getElementById("mobile-menu")?.contains(event.target as Node)) {
                closeMenu();
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [isOpen]);

    return (
        <header className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3/4 lg:w-1/2 bg-white shadow-lg rounded-4xl z-50">
            <nav className="z-20 justify-center flex w-full px-6 py-2">
                <div className="mx-auto max-w-full w-full">
                    <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        {/* Logo */}
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link href="/" aria-label="Home" className="flex items-center space-x-2 text-black dark:text-black">
                                <span className="font-bold text-lg">Muhammad Fiaz</span>
                            </Link>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={toggleMenu}
                                className="relative z-20 block p-2.5 lg:hidden"
                                aria-label="Toggle Menu"
                                aria-expanded={isOpen}
                            >
                                {isOpen ? <X size={25} className="text-black" /> : <Menu size={25} className="text-black" />}
                            </button>
                        </div>

                        {/* Desktop Navigation Menu (UNCHANGED) */}
                        <div className="hidden lg:flex lg:items-center lg:space-x-6">
                            <ul className="flex gap-8 text-black">
                                <li>
                                    <Link href="#" className="hover:text-gray-600 duration-150">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-gray-600 duration-150">
                                        Terms of Use
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-gray-600 duration-150">
                                        Refund Policy
                                    </Link>
                                </li>
                            </ul>

                            <Link href="#" className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-100 text-black">
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation Menu */}
            <div
                id="mobile-menu"
                className={`lg:hidden fixed top-[90px] left-1/2 transform -translate-x-1/2 w-11/12 max-w-sm bg-white border border-black/30 shadow-lg rounded-lg transition-all duration-300 ease-in-out ${
                    isOpen ? "opacity-100 scale-100 visible mt-2" : "opacity-0 scale-95 invisible"
                }`}
            >
                <ul className="flex flex-col p-6 space-y-4 text-black">
                    <li>
                        <Link href="#" onClick={closeMenu} className="block hover:text-gray-600 duration-150">
                            Privacy Policy
                        </Link>
                    </li>
                    <li>
                        <Link href="#" onClick={closeMenu} className="block hover:text-gray-600 duration-150">
                            Terms of Use
                        </Link>
                    </li>
                    <li>
                        <Link href="#" onClick={closeMenu} className="block hover:text-gray-600 duration-150">
                            Refund Policy
                        </Link>
                    </li>
                    <li>
                        <Link href="#" onClick={closeMenu} className="block text-center px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 hover:bg-gray-200">
                            Login
                        </Link>
                    </li>
                </ul>
            </div>
        </header>
    );
}
