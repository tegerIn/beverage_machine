import { Machine } from "./models/machine";
import { Beverage } from "./models/beverage"
import {Coin} from "./models/coin"

async function main() {
  const cola = new Beverage("cola", 1500, 10);
  const cider = new Beverage("cider", 1500, 5);
  const coffee = new Beverage("coffee", 1800, 7);
  const water = new Beverage("water", 1000, 1);
  const greenTea = new Beverage("greenTea", 1200, 3);

  const machine = new Machine();
  machine.addItem(cola);
  machine.addItem(cider);
  machine.addItem(coffee);
  machine.addItem(water);
  machine.addItem(greenTea);

  machine.makeItemList();     
  await machine.insertCoin(new Coin(1000, "KRW"));
  await machine.insertCoin(new Coin(700, "KRW"));
  await machine.insertCoin(new Coin(1000, "JPY"));
  await machine.insertCoin(new Coin(1, "USD"));
  machine.makeCoinList();
  await machine.buyItem(water);
  machine.makeCoinList();
  await machine.insertCoin(new Coin(1000, "KRW"));
  machine.makeCoinList();
  await machine.buyItem(water);
  machine.makeCoinList();
  water.addCount(10);
  greenTea.addCount(8);
  machine.makeItemList();
  machine.makeBuyList();
}

main();