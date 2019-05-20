import 'rxjs/add/operator/toPromise';
import { Md5 } from 'ts-md5/dist/md5'
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Comic } from '../models/comic.model';
import { MarvelResponse } from '../models/marvel.model';

@Injectable()
export class MarvelService {
    private _marvelComicUrl : string = "https://gateway.marvel.com:443/v1/public/comics";
    private _publicKey : string = "c4b5296bc35888971631d22848916410";
    private _privateKey : string = "fddd97e16368b2fee706a1f6de69f30f191467d3";
    constructor(private _httpService : Http) {}
    private getHash(timeStamp : string) : string {
        let hashGenerator : Md5 = new Md5();
        hashGenerator.appendStr(timeStamp);
        hashGenerator.appendStr(this._privateKey);
        hashGenerator.appendStr(this._publicKey);
        let hash : string = hashGenerator.end().toString();
        return hash;
    }
    private getTimeStamp() : string {
        return new Date().valueOf().toString();
    }    
    public async getComics(limit : number = 10, prefix : string = null, year : number = null) : Promise<MarvelResponse<Comic>> {
        let timeStamp = this.getTimeStamp();
        let hash = this.getHash(timeStamp);
        let requestUrl = this._marvelComicUrl + "?limit=" + limit + "&hasDigitalIssue=true&format=comic&ts=" + timeStamp + "&apikey=" + this._publicKey + "&hash=" + hash;
        if (prefix) {
            requestUrl += "&titleStartsWith=" + prefix;
        }
         if (year > 0) {
             requestUrl += "&startYear=" + year;
         }
        let response = await this._httpService.get(requestUrl).toPromise();
        return response.json();
    }
}
