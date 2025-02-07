"use client"

import { useTheme } from "next-themes"
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
    const {setTheme} = useTheme();

    const navs = [
        {title: "Pricing", link: "/pricing"},
        {title: "Features", link: "/features"},
        {title: "Enterprise", link: "/enterprise"},
        {title: "Blog", link: "/blog"},
        {title: "Forum", link: "/forum"},
        {title: "Careers", link: "/careers"},
    ]

    return (
        <div className="flex justify-between items-center p-7 px-10">
            <div className="text-2xl font-semibold flex gap-2">
                <Image src="/logo.svg" width={30} height={30} alt="logo" />
                Mail.io
            </div>
            <div className="flex gap-12 uppercase">
            {navs.map((nav, i) => (
                <div key={i}>
                    <Link href={nav.link}>
                        {nav.title}
                    </Link>
                </div>
            ))}
            </div>
            <div>
                {/* <button className="bg-secondary px-4 py-2 rounded-3xl" onClick={() => setTheme((prev) => prev == "light" ? "dark" : "light")}>Switch</button> */}
                <button className="bg-contrast text-anti-contrast px-4 py-2 rounded-xl font-semibold" onClick={() => setTheme((prev) => prev == "light" ? "dark" : "light")}>SIGN IN</button>
            </div>
        </div>
    )
}
export default Navbar