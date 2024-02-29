import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase, IDBPTransaction } from 'idb';
import { noop } from 'rxjs';

export const TAG = "tag";

export const ITEM_STORE = "item";
export const PRICE_STORE = "price";
export const PERSON_STORE = "person";
export const STORE_SETTINGS = "storeSettings";
export const GENERIC_DATA = "generic_data";
export const TS_STORE = "ts_store";

@Injectable({
  providedIn: 'root'
})
export class MyIdbService {
  static db: IDBPDatabase<unknown>;
  constructor() { 
    this.upgradeDB()
  }

  async upgradeDB(){
    if(MyIdbService.db===undefined){
      MyIdbService.db = await openDB("good-act", 1, {
        upgrade(
          db: IDBPDatabase, 
          oldVersion: number, 
          newVersion: number, 
          transaction: IDBPTransaction<unknown, string[], "versionchange">){
          if(newVersion===1){
            var objectStore = db.createObjectStore(TAG);
            objectStore.createIndex("workCatIndex", "key", { unique: false });
            var personStore = db.createObjectStore(PERSON_STORE);
            personStore.createIndex("nameIndex", "n", { unique: false });
            var shopStore = db.createObjectStore(STORE_SETTINGS);
            var genericStore = db.createObjectStore(GENERIC_DATA);
          }
        }
      });
    }
  }

  async setValue(storeName, data){
    var keys = Object.keys(data);
    if(storeName===undefined || storeName===null || keys===undefined || keys.length===0){
      return;
    }
    if(MyIdbService.db===undefined){
      await this.upgradeDB();
    }
    keys.forEach(key => {
      MyIdbService.db.put(storeName, data[key], key)
      .then(result=>{console.log(result)})
      .catch(err=>{console.log("error", err)});
    });
  }

  async getValue(storeName, key){
    if(storeName===undefined || storeName===null || key===undefined){
      return;
    }
    if(MyIdbService.db===undefined){
      await this.upgradeDB();
    }
    var promise = MyIdbService.db.get(storeName, key);
    return promise;
  }

  async getAllKeys(storeName){
    if(storeName===undefined || storeName===null){
      return;
    }
    if(MyIdbService.db===undefined){
      await this.upgradeDB();
    }
    var promise = MyIdbService.db.getAllKeys(storeName);
    return promise;
  }

  async getAll(storeName){
    if(storeName===undefined || storeName===null){
      return;
    }
    if(MyIdbService.db===undefined){
      await this.upgradeDB();
    }
    var promise = MyIdbService.db.getAll(storeName);
    return promise;
  }

  async getTagDetail(tagId){
    return this.getValue(TAG, tagId);
  }

  async getTagByIdAndLanguage(tagId, lang:string ="en"){
    var tag = await this.getValue(TAG, tagId);
    if(tag){
      return tag['tags'][lang];
    }else{
      return undefined;
    }
  }

  sanitizeByKey(key, list){
    var result = [];

    list.forEach(ele=>{
      if(ele.key===key){
        result.push(ele);
      }
      return result;
    });    
  }
}
