import { Logo } from "@/components/SplashLogo";
import Image from "next/image";

export default function Home() {
  return (
   <section className="w-full min-h-screen flex justify-center items-center flex-col">
   {/* <Logo/> */}
   <Image alt="logo" className="w-[400px] h-[250px] outline object-cover" width={2000} height={2000} src={"/images/WDS LOGO WHITE.png"}/>
   <button className="outline">
    Begin Your Journey
   </button>
   </section>
  );
}

