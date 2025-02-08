"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const Home = () => {
  const [name, setName] = useState("");
  const { data: session } = useSession();
  const handleSignIn = async () => {
    signIn("google");
  };
  const handleSignOut = async () => {
    signOut();
  };
  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
      console.log(session);
    }
  }, [session]);

  return (
    <div>
      <p>{name}</p>
      <button onClick={handleSignIn}>Sign In</button>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};
export default Home;
