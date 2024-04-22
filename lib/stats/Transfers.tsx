export async function GetTransfers(url: string) {
    const options = {method: 'GET', headers: {accept: 'application/json', 'x-api-key': typeof Deno !== 'undefined' ? Deno.env.get("chainbase_api") : "demo"}};
    try {
      const response = await fetch(url, options)
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  }
  