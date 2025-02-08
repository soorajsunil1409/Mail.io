"use client"

import { useTheme } from "next-themes"
import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Borel } from "next/font/google";

const borel = Borel({ weight: "400", subsets: ["latin"] });

const Navbar = () => {
    const {setTheme} = useTheme();
    const [name, setName] = useState("");
    const session = useSession();

    const handleSignIn = async () => {
        signIn("google");
    };

    const handleSignOut = async () => {
        signOut();
    };

    useEffect(() => {
        if (session?.data?.user?.name) {
            setName(session.data.user.name);
        }
    }, [session]);

    const navs = [
        {title: "Dashboard", link: "/dashboard"},
        {title: "Inbox", link: "/inbox"},
        {title: "Enterprise", link: "/enterprise"},
    ]

    return (
        <div className="flex justify-between items-center p-7 px-10">
            <button className="text-2xl font-semibold flex">
                <Link href={"/"} className={`flex gap-2 ${borel.className} items-center font-bold`}>
                    <Image src="/logo.svg" width={30} height={30} alt="logo" />
                    <span className="translate-y-2">Mail.io</span>
                </Link>
            </button>
            <div className="flex gap-12 uppercase">
            {navs.map((nav, i) => (
                <div key={i}>
                    <Link href={nav.link}>
                        {nav.title}
                    </Link>
                </div>
            ))}
            </div>
            <div className="flex justify-center items-center gap-5">
                {/* <button className="bg-secondary px-4 py-2 rounded-3xl" onClick={() => setTheme((prev) => prev == "light" ? "dark" : "light")}>Switch</button> */}
                {
                    session?.status === "authenticated" && 
                    <button>
                        <Image src={`${session?.data?.user?.image}`} alt="profile" height={50} width={50} className="rounded-full size-[40px]" />
                    </button>
                }
                {
                    session?.status === "authenticated" ? 
                        <button className="bg-contrast text-anti-contrast px-4 py-2 rounded-xl font-semibold" onClick={handleSignOut}>SIGN OUT</button> :
                        <button className="bg-contrast text-anti-contrast px-4 py-2 rounded-xl font-semibold" onClick={handleSignIn}>SIGN IN</button>
                }
            </div>
        </div>
    )
}
export default Navbar