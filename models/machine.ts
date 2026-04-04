import {Beverage} from "./beverage";
import {Coin, Currency} from "./coin";
import {orderedCoins} from "./coinListSeq";
import {log} from "../lib/logger";
import Soldouterror from "./soldouterror";
import Balanceerror from "./balanceerror";


export class Machine {
    private sellList: Beverage[];
    private buyList: Beverage[];
    private total: Coin[];

    constructor() {
        this.sellList = [];
        this.buyList = [];
        this.total = [];
    }

    makeBuyList(): Beverage[] {
        log.debug(JSON.stringify(this.buyList));
        return this.buyList;
    }


    makeItemList(): Beverage[] {
        log.debug(JSON.stringify(this.sellList));
        return this.sellList;
    }

    makeCoinList(): Coin[] {
        log.debug(JSON.stringify(this.total));
        return this.total;
    }

    async makeChange() {
        let sum = 0;
        for (const coin of this.total) {
            sum += coin.getAmount();
        }
        log.info(`총 ${sum}원 입니다.`);
        return sum;
    }

    addItem(item: Beverage) {
        this.sellList.push(item);
        log.info(`${item.name}을 추가했습니다.`);
        return this.sellList;
    }

    async buyItem(item: Beverage) {
        this.vaildateSoldout(item);
        let itemPrice = item.price;
        const coinList = orderedCoins(this.total);
        const sum = await this.makeChange();
        this.vaildateBalance(item, sum);

        for (const coin of coinList) {
            const existing = this.findCoinByCurrency(coin.currency);
            if (itemPrice >= coin.getAmount()) {
                itemPrice = await coin.returnChange(itemPrice,coin);
                coin.setAmount(0);
                if (existing) {
                    existing.setAmount(existing.getAmount() + coin.getAmount());
                }
            } else if (itemPrice < coin.getAmount()) {
                if (existing) {
                    existing.setAmount(await coin.returnChange(-itemPrice,coin));
                    itemPrice = 0;
                }
            }
        }

        item.decreaseCount();
        this.buyList.push(item);
        log.info(`${item.name}을 구매했습니다.`);
        log.info(`거스름 돈은 ${sum - item.price}원 입니다.`);
        return item;
    }

    async insertCoin(coin: Coin) {
        if (coin.currency !== "KRW") {
            await coin.exChangeCoin(coin);
        }
        const existing = this.findCoinByCurrency(coin.currency);
        if (existing) {
            existing.setAmount(existing.getAmount() + coin.getAmount());
            return;
        }
        this.total.push(coin);
    }

    private findCoinByCurrency(currency: Currency): Coin | undefined {
        return this.total.find((c) => c.currency === currency);
    }

    vaildateSoldout(item: Beverage): void {
        if (item.getCount() <= 0) {
            log.warn(`${item.name}은 품절입니다.`);
            throw new Soldouterror(`${item.name}은 품절입니다.`);
        }
    }

    vaildateBalance(item: Beverage, sum: number): void {
        if (sum < item.price) {
            log.warn("금액이 부족합니다.");
            throw new Balanceerror("금액이 부족합니다.");
        }
    }

}