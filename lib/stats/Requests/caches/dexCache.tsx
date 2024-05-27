import { Dex } from "$fresh_charts/stats/Requests/Dex.tsx";
export let DexcachedData: [] = [];
export let state: string = "idle";
export function cafe() {
        state = "fetching & caching...";
        let data:[] = [];
        DexcachedData = data = Dex();
        state = "cached";
        return data
}