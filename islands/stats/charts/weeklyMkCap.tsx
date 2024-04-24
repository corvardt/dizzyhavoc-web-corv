import Chart from "../chart.tsx";
import { ChartOptions } from "$fresh_charts/stats/ChartOption/Liquidity-MkCap/chartOptions.tsx";
import { ChartOptions_M } from "$fresh_charts/stats/ChartOption/Liquidity-MkCap/chartOptions-M.tsx";
import { MkCap_Weekly } from "$fresh_charts/stats/Requests/MkCap.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { useSignal } from "@preact/signals";
import { useState } from "preact/hooks";

export function MarketCap() {
  if (!IS_BROWSER) return <></>;
  const fetchedData = useSignal([]);
  const isLoading = useSignal(true);
  const isMobile = globalThis.window.matchMedia("(pointer: coarse)").matches
  const getPrices = async () => {
    fetchedData.value = await MkCap_Weekly();
    isLoading.value = false;
  };
  useState(() => {
    getPrices();
  });

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
        data: fetchedData.value.map((item) => item.marketcap),
        backgroundColor: "#707070", // set the color of the line
        barThickness: 2,
        maxBarThickness: 2,
      },
    ],
  };


    return (
      <>
       <p class="font-[Poppins] text-[10px] unselectable text-center pl-1 absolute">Weekly Marketcap</p>
        <div class="unselectable vignets absolute bottom-0 sm:h-[65px] sm:w-[455px] h-[60px] w-[345px]">
          {fetchedData.value && fetchedData.value.length > 0 && (
            <Chart
              type="bar"
              options={isMobile ? chartOptions_M : chartOptions}
              data={chartData}
            />
          )}
        </div>
      </>
    );
  
}
