import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class EventsService {
    constructor(
        private readonly http: HttpService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    async fetchEvents (activeCategory: string, start: number, end: number) {


    // Create a unique cache key based on the parameterss
    const cacheKey = `events:${activeCategory}:${start}:${end}`;

    const cachedData = await this.cacheManager.get(cacheKey); // access cached data via get

    if(cachedData) { // checking if events exists in cache
        console.log("rendring events from redis")
        return cachedData;
    }

    console.log('fetching events from api call');
     const URL = process.env.PREDICTION_MARKET_API
     const res$ = this.http.get(`${URL}?category=${activeCategory}&start=${start}&end=${end}`)
     const res = await firstValueFrom(res$)

     await this.cacheManager.set(cacheKey, res.data, 120000) // insert new data inside cache for 2 mins

     return res.data
    } 
}