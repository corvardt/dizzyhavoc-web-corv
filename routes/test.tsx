import { Noise } from "../components/common/backgrounds/Noise.tsx";
import { Animation } from "../islands/index/LandingItems/Animation.tsx";
export default function Test() {
  return (
    <div class="h-screen relative justify-center items-center flex flex-col overflow-hidden">

       <div class="h-full w-full top-0 absolute">
        <Noise />
       </div>

       <Animation />

    </div>
  );
}
