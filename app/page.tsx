"use client"

import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const page = () => {

  const features = [
    {title: "Something 1", subtitle: "asdjhfkgaskd fashjdfg aksjdhfg askdjfhgaskjdhfg askjdhfgas kdjf"},
    {title: "Something 2", subtitle: "asdjhfkgaskd fashjdfg aksjdhfg askdjfhgaskjdhfg askjdhfgas kdjf"},
    {title: "Something 3", subtitle: "asdjhfkgaskd fashjdfg aksjdhfg askdjfhgaskjdhfg askjdhfgas kdjf"},
  ]

  const cards = [
    {title: "Test1", subtitle: "SDfsjhdfgsdjfgsdf sjdfhg"},
    {title: "Test2", subtitle: "SDfsjhdfgsdjfgsdf sjdfhg"},
    {title: "Test3", subtitle: "SDfsjhdfgsdjfgsdf sjdfhg"},
  ]
  
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
    <div className="px-8 w-[100vw] h-fit flex flex-col gap-10 items-center pb-10">
      
      <div>
        <p>{name}</p>
        <button onClick={handleSignIn}>Sign In</button>
      </div>
      <div className="w-full h-[87vh] rounded-3xl overflow-hidden relative">
        <Image src="/gradient.png" className="inset-0 absolute -z-10 w-full h-full blur-2xl" alt="Sdf" width={100} height={100}/>
        <Image src="/logo.svg" className="inset-0 absolute -z-9 w-full h-full blur-xl opacity-60" alt="Sdf" width={100} height={100}/>
        <div className="flex flex-col justify-center -translate-y-10 h-full items-center text-center gap-5">
          <div className="text-[125px] font-semibold mt-14">The AI Code Editor</div>
          <div className="text-2xl">Built to make you extraordinarily productive, <br /> Cursor is the best way to code with AI.</div>
          <button className="bg-contrast text-anti-contrast px-5 py-3 rounded-lg">Get Started</button>
        </div>
      </div>
      <div className="flex flex-col gap-10 w-full h-fit">
      {
        features.map((feature, i) => (
          <div className="w-full h-fit p-10 mt-10 flex flex-col gap-10">
            <div className="flex flex-col justify-start items-center text-center gap-5">
              <div className="text-[40px]">{feature.title}</div>
              <div>{feature.subtitle}</div>
            </div>
            <div className="relative overflow-hidden w-full h-[90vh] rounded-[30px]">
              <Image src="/gradient.png" className="inset-0 absolute -z-10 w-full h-full blur-2xl" alt="Sdf" width={100} height={100}/>
            </div>
          </div>
        ))
      }
      </div>

      <div className="flex flex-col text-left w-full gap-10">
        <div className="flex flex-col w-full h-full text-left ml-10">
              <div className="text-[40px]">title</div>
              <div>as,jhdgakjdfh gasdkfhj </div>
        </div>
        <div className="flex w-full h-full gap-10">
          {cards.map((card, i) => (<div className="h-[60vh] w-full border-[1px] border-secondary rounded-2xl bg-anti-contrast p-10">
              <div className="text-[40px]">{card.title}</div>
              <div>{card.subtitle}</div>
          </div>
          ))
          }
        </div>

        <div className="flex text-left w-full gap-10 h-[60vh] mt-20">
          <div className="flex flex-col h-full w-full items-start gap-4">
            <div className="text-[120px] font-semibold">Try Mail.io Now</div>
            <button className="bg-contrast text-anti-contrast px-10 py-3 text-2xl rounded-xl">Get Started</button>
          </div>
          <div className="">
            <Image src="/logo.svg" className="inset-0 -z-10 w-full h-full -translate-y-20" alt="Sdf" width={100} height={100}/>
          </div>
        </div>
      </div>
     );
};
export default Home;
