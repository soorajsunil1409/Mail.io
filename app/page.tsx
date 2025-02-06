"use client";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const Home = () => {
  const [name, setName] = useState("");
  const { data: session } = useSession();
  const handleSignIn = async () => {
    signIn("google");
  };
  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  return (
    <div>
      <p>{name}</p>
      <button onClick={handleSignIn}>Sign In</button>
    </div>
  );
};
export default Home;
