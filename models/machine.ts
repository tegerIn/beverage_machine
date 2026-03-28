import { Beverage } from "./beverage";
import { Coin } from "./coin";
import { log } from "../lib/logger";
export class Machine{
   private sellList:Beverage[];
   private buyList:Beverage[];
   private total:Coin[];
   constructor(){
    this.sellList = [];
    this.buyList = [];
    this.total = [];
   }
    makeBuyList():Beverage[]{
    //    console.log(this.buyList);
       log.debug(JSON.stringify(this.buyList));
       return this.buyList;
    }
    makeItemList():Beverage[]{
        // console.log(this.sellList);
        log.debug(JSON.stringify(this.sellList));
        return this.sellList;
    }
    makeCoinList():Coin[]{
        // console.log(this.total);
        log.debug(JSON.stringify(this.total));
        return this.total;
    }
    async makeChange(){
        let sum = 0;
        for (const coin of this.total) {
            sum += coin.amount;
        }
        log.info(`총 ${sum}원 입니다.`);
        return sum;
    }
    addItem(item:Beverage){
        this.sellList.push(item);
        // console.log(`${item.name}을 추가했습니다.`);
        log.info(`${item.name}을 추가했습니다.`);
        return this.sellList;
    }
    async buyItem(item:Beverage){
        if(item.count<=0){
            // console.log(`${item.name}은 품절입니다.`);
            log.info(`${item.name}은 품절입니다.`);
            return false;
        }else{
            let itemPrice = item.price;
            const coinList = this.total.filter(item=>item.currency === "KRW")
                .concat(this.total.filter(item=>item.currency === "USD")
                .concat(this.total.filter(item=>item.currency === "JPY")));

            const sum = await this.makeChange();

            if(sum < itemPrice){
                // console.log("금액이 부족합니다.");
                log.info("금액이 부족합니다.");
                return false;
            }else {
                for(const coin of coinList){
                    if(itemPrice>=coin.amount){
                        itemPrice = await coin.returnChange(itemPrice,coin);
                        coin.amount = 0;
                        const existing = this.total.find((c) => c.currency === coin.currency);
                        if (existing) {
                            existing.amount += coin.amount;
                        }
                    }else if(itemPrice<coin.amount){
                        console.log("itemPrice : ",itemPrice);
                        const existing = this.total.find((c) => c.currency === coin.currency);
                        if (existing) {
                            existing.amount = await coin.returnChange(-itemPrice,coin);
                            itemPrice = 0;
                        }
                    }
                }

                item.count--;
                this.buyList.push(item);
                // console.log(`${item.name}을 구매했습니다.`);
                log.info(`${item.name}을 구매했습니다.`);
                // console.log(`거스름 돈은 ${sum - item.price}원 입니다.`);
                log.info(`거스름 돈은 ${sum - item.price}원 입니다.`);
                return item;
            }
        }
    }
    async insertCoin(coin: Coin) {
        const existing = this.total.find((c) => c.currency === coin.currency);
        if (existing) {
            if (coin.currency === "KRW") {
                existing.amount += coin.amount;
            } else {
                const converted = await coin.exChangeCoin(coin);
                existing.amount += converted.amount;
            }
            return;
        }
        if (coin.currency === "KRW") {
            this.total.push(coin);
            return;
        }
        this.total.push(await coin.exChangeCoin(coin));
    }
    async retrunChange(item:Beverage,coin:Coin){
        const change = await coin.returnChange(item.price,coin);
        if(change < 0){
            return false;
        }else {
            return true;
        }
        
    }

}