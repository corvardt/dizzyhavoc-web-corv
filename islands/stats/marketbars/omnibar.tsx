import { Signal } from "@preact/signals";
import { Values } from "./values.tsx";
import { formatNumber } from "../../../lib/common/formatNumber.tsx";

export function Omnibar(props: {
  chain: Signal<string>;
  link: string;
  ico: string;
  initialloading: Signal<boolean>;
  order: Signal<number> | null;
  tooltip: Signal<boolean> | null;
  token: Signal<number> | null;
  h24: Signal<number> | null;
  liq: Signal<number> | null;
  vol24: Signal<number> | null;
  tx: Signal<number> | null;
  holders: Signal<number> | null;
  transfers: Signal<number> | null;
  contract: string;
  trade: string;
}) {
  const {
    chain,
    link,
    ico,
    initialloading,
    order,
    tooltip,
    token,
    h24,
    liq,
    vol24,
    tx,
    holders,
    transfers,
    contract,
    trade,
  } = props;
  async function HandleTooltips() {
    tooltip.value = !tooltip.value;
  }
  return (
    <>
      <div
        style={{ order: order != null ? -order : 0 }}
        class={`w-full relative shadow-lg flex h-[7rem] sm:h-[9rem] gap-3 bg-blur3 
        ${initialloading.value ? "shimmer" : ""
        }
        ${!tooltip.value ? "rounded-lg" : "rounded-t-lg"}
        `}
      >
        {initialloading.value ? (
          <></>
        ) : (
          <>
            <div
              onClick={() => {
                HandleTooltips();
              }}
              class="z-[2] absolute bottom-[2px] cursor-pointer unselectable sm:left-[0.5%] left-[93.5%] dark:text-[#d0d0d0] text-[#3d3d3d] sm:text-sm text-[11px] font-[Poppins]"
            >
              {tooltip.value ? (
                             <img
                class="size-[1.2rem] active:scale-[85%] cursor-pointer vignets contrast-0"
                src="/misc/caretup.svg"
              ></img>
            ) : (
              <img
                class="size-[1.2rem] active:scale-[85%] cursor-pointer vignets contrast-0"
                src="/misc/caretdown.svg"
              ></img>
              )}
            </div>
            <a
              draggable={false}
              class="z-20 sm:size-[50px] hover:scale-[105%] ml-3 mt-3 sm:mt-11 justify-start size-9"
              title="open in dexscreener"
              target="_blank"
              href={link}
            >
              <img
                draggable={false}
                src={ico}
                title="open in dexscreener"
                alt={chain}
              />
            </a>
            <Values
              chain={chain}
              token={token}
              h24={h24}
              liq={liq}
              vol24={vol24}
              tx={tx}
            />
          </>
        )}
      </div>
      {/* Tooltip */}
      {tooltip.value && (
        <div
          style={{ order: order != null ? -order : 0 }}
          class="sm:h-[1.1rem] h-[0.9rem] rounded-b-md justify-evenly flex flex-row sm:text-sm text-[11px] -mt-[6px] sm:-mt-1 px-2 font-[Poppins] w-full bg-blur3"
        >
          <p class="flex dark:text-[#d0d0d0] text-[#3d3d3d] unselectable">
            holders: {holders.value ? formatNumber(holders.value) : "0.0K"}
          </p>
          <p class="flex dark:text-[#d0d0d0] text-[#3d3d3d] unselectable">
            transfers:{" "}
            {transfers.value ? formatNumber(transfers.value) : "0.0K"}
          </p>
          <a
            class="flex text-[#3b2d82] dark:text-[#ccb286]"
            target="_blank"
            href={contract}
          >
            contract
          </a>
          <a
            class="flex text-[#3b2d82] dark:text-[#ccb286]"
            target="_blank"
            href={trade}
          >
            trade
          </a>
        </div>
      )}
    </>
  );
}
