import { log } from "../lib/logger";

export type Currency = "KRW" | "USD" | "JPY";

export class Coin{
public amount: number;
public  currency:Currency;
    constructor(amount:number,currency:Currency){
        this.amount = amount;
        this.currency = currency;
    }

    async returnChange(price:number,coin:Coin){
        return coin.amount - price;
    }
    async exChangeCoin(coin: Coin) {
        const url = `https://api.frankfurter.dev/v2/rate/${coin.currency}/KRW`;
        const res = await fetch(url);
        if (!res.ok) {
            // throw new Error(`환율 API 실패 (${res.status}): ${url}`);
            log.error(`환율 API 실패 (${res.status}): ${url}`);
        }
        const data = await res.json();
        const rate = data.rate;
        if (typeof rate !== "number" ) {
            // throw new Error(`응답 데이터 오류: ${JSON.stringify(data)}`);
            log.error(`응답 데이터 오류: ${JSON.stringify(data)}`);
        }
        coin.amount = Math.floor(coin.amount * rate);
        return coin;
    }
    
}