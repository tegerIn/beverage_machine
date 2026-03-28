import { log } from "../lib/logger";

export class Beverage{
    public name:string;
    public price:number;
    public count:number;
    constructor(name:string,price:number,count:number){
        this.name = name;
        this.price = price;
        this.count = count;
    }
    addCount(count:number){
        this.count += count;
        // console.log(`${this.name}이 ${count}개 추가되었습니다.`);
        log.info(`${this.name}이 ${count}개 추가되었습니다.`);
    }
}