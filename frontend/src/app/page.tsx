import { AppBar } from "@/component/AppBar";
import { Hero } from "@/component/Hero";
import { HeroVideo } from "@/component/HeroVideo";

export default function Home() {
  return (
    <main className="someClass border mb-12">
      <AppBar/>
      <Hero/>
      <div className="pt-8 ">
        <HeroVideo />
      </div>
    </main>
  );
}
