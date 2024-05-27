export async function getTotals(dexdata : any) {
    const data = dexdata ? await dexdata : {};
    let totalvolume = 0;
    let totalprice = 0;
    let totalliquidity = 0;
    for (let i = 0; i < data[0].pairs.length; i++) {
      const fixedliq = Number(data[0].pairs[i].liquidity.usd).toFixed(2);
      const fixedvalue = Number(data[0].pairs[i].priceUsd).toFixed(5);
      switch (data[0].pairs[i].url) {
        case "https://dexscreener.com/ethereum/0xb7a71c2e31920019962cb62aeea1dbf502905b81":
          totalvolume += data[0].pairs[i].volume.h24;
          totalprice += Number(fixedvalue);
          totalliquidity += Number(fixedliq);
          break;
        case "https://dexscreener.com/arbitrum/0x05c5bdbc7b3c64109ddcce058ce99f4515fe1c83":
          totalvolume += data[0].pairs[i].volume.h24;
          totalprice += Number(fixedvalue);
          totalliquidity += Number(fixedliq);
          break;
        case "https://dexscreener.com/bsc/0x642089a5da2512db761d325a868882ece6e387f5":
          totalvolume += data[0].pairs[i].volume.h24;
          totalprice += Number(fixedvalue);
          totalliquidity += Number(fixedliq);
          break;
        case "https://dexscreener.com/base/0xb64dff20dd5c47e6dbb56ead80d23568006dec1e":
          totalvolume += data[0].pairs[i].volume.h24;
          totalprice += Number(fixedvalue);
          totalliquidity += Number(fixedliq);
          break;
        case "https://dexscreener.com/avalanche/0x523a04633b6c0c4967824471dda0abbce7c5e643":
          totalvolume += data[0].pairs[i].volume.h24;
          totalprice += Number(fixedvalue);
          totalliquidity += Number(fixedliq);
          break;
        default:
          break;
      }
    }
    // calc marketcap
    const avrg = totalprice / 5;
    const fixedavrg = avrg.toFixed(5);
    const supply = 946778380;
    const timestamp = Date.now();
    const marketcap = Number(fixedavrg) * supply
    const liq = totalliquidity
    const volume = totalvolume
    const averageprice =  Number(fixedavrg)
    const response = [{timestamp, averageprice, marketcap, liq, volume}];
    return response
}