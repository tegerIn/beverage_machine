import { exChangeCoin } from "./exchangeCoin";

export type Currency = "KRW" | "USD" | "JPY";

export class Coin{
private amount: number;
public currency:Currency;
    constructor(amount:number,currency:Currency){
        this.amount = amount;
        this.currency = currency;
    }

    getAmount(): number {
        return this.amount;
    }

    setAmount(amount:number): void {
        this.amount = amount;
    }

    async returnChange(price:number,coin:Coin){
        return coin.amount - price;
    }
    async exChangeCoin(coin:Coin){   
        const rate = await exChangeCoin(coin.currency);
        this.amount = Math.floor(this.amount * rate);
        return this.amount;
    }
    
}