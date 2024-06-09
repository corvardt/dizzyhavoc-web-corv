import { Noise } from "../components/common/backgrounds/Noise.tsx";
import { Animation } from "../islands/index/LandingItems/Animation.tsx";
export default function Test() {
  return (
    <div class="h-screen w-full">
       <div class="h-full top-0"><Noise /></div>

        <div class="absolute top-0"><Animation /></div>

      </div>
  );
}
