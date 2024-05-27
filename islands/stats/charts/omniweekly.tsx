import Chart from "../chart.tsx";
import { ChartOptions } from "$fresh_charts/stats/ChartOption/Average-Liquidity-MkCap/chartOptions.tsx";
import { ChartOptions_M } from "$fresh_charts/stats/ChartOption/Average-Liquidity-MkCap/chartOptions-M.tsx";
import { Weekly } from "$fresh_charts/stats/Requests/Weekly.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { useSignal, Signal } from "@preact/signals";
import { useState } from "preact/hooks";
import { cachedData, cache } from '$fresh_charts/stats/Requests/caches/weeklyCache.tsx';
import { DexcachedData } from "../../../lib/stats/Requests/caches/dexCache.tsx"
import { getTotals } from "../../../lib/stats/getTotals.tsx"
export function Omniweekly(props: { name: Signal<any>; type: Signal<any> }) {
  if (!IS_BROWSER) return <></>;
  const { name, type } = props;
  const fetchedData = useSignal([]);
  const isLoading = useSignal(true);
  const isMobile = globalThis.window.matchMedia("(pointer: coarse)").matches;
  const firstdate = useSignal<string>("");
  const lastdate = useSignal<string>("");
  const getPrices = async () => {
    if (cachedData[type]) {
        fetchedData.value = cachedData[type];
        firstdate.value = new Date(cachedData[type][0].timestamp).toLocaleDateString();
        lastdate.value = new Date(cachedData[type][51].timestamp).toLocaleDateString();
        isLoading.value = false;
    } else {
      const data = await Weekly(type);
      const current = getTotals(DexcachedData)
      const currentresult = await current
      const weeklyData = [
        ...data.map((item) => ({
          timestamp: item.timestamp,
          [type]: item[type],
        })),
        ...(data.length < 52
          ? [{
              timestamp: currentresult[0].timestamp,
              [type]: currentresult[0][type],
            }]
          : []),
        ...Array.from({ length: 52 - data.length - (data.length < 52 ? 1 : 0) }, (_, i) => ({
          timestamp: data[data.length - 1].timestamp + (i + 1) * 604800000,
          [type]: 0,
        })),
      ];
      fetchedData.value = weeklyData;
      cache(type, weeklyData); 
      const timedate = new Date(
      fetchedData.value[0].timestamp
      ).toLocaleDateString();
      const timedate2 = new Date(
      fetchedData.value[fetchedData.value.length - 1].timestamp
      ).toLocaleDateString();
      firstdate.value = timedate;
      lastdate.value = timedate2;
      isLoading.value = false;
    }
  };
  
  useState(() => {getPrices()});

  const chartOptions = ChartOptions();
  const chartOptions_M = ChartOptions_M();
  const timestamps = fetchedData.value.map((item) =>
    new Date(item.timestamp).toLocaleTimeString([], {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  const chartData = {
    labels: timestamps,
    datasets: [
      {
        data: fetchedData.value.map((item) => {
          const prop = `${type}`;
          return item[prop];
        }),
        backgroundColor: "#707070", // set the color of the line
        barThickness: 2,
        maxBarThickness: 2,
      },
    ],
  };

  return (
    <>
      <p class="font-[Poppins] text-[12px] dark:text-[#d0d0d0] text-[#3d3d3d] unselectable text-center italic pl-1 absolute">
        Weekly {name}
      </p>
      {!isLoading.value ? (
      <p class="font-[Poppins] text-[8px] dark:text-[#d0d0d0] text-[#3d3d3d] vignets unselectable text-center absolute top-[2px] right-1">
        {firstdate + " > " + lastdate}
      </p> ) : null}
      <div class="unselectable vignets absolute -bottom-1 left-0 sm:h-[110px] sm:w-[455px] h-[85px] w-[345px]">
        {!isLoading.value ? (
          <Chart
            type="bar"
            options={isMobile ? chartOptions_M : chartOptions}
            data={chartData}
          />
        ) : <div class="h-full w-full"><img class="absolute left-[51.5%] translate-x-[-50%] translate-y-[-50%] top-[50%] size-[30px] contrast-0 invert-0 dark:invert" src="./svgs/tail-spin.svg"></img></div>}
      </div>
    </>
  );
}
