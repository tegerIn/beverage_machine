import { log } from "../lib/logger";

export class Beverage{
    public name:string;
    public price:number;
    private count:number;
    constructor(name:string,price:number,count:number){
        this.name = name;
        this.price = price;
        this.count = count;
    }

    getCount(): number {
        return this.count;
    }

    addCount(count:number){
        this.count += count;
        log.info(`${this.name}이 ${count}개 추가되었습니다.`);
    }

    decreaseCount(): void {
        this.count--;
        log.info(`${this.name}이 ${this.count}개 남았습니다.`);
    }
}