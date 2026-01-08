import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EventsService {
    constructor(private readonly http: HttpService) {}

    async fetchEvents (activeCategory: string, start: number, end: number) {
     const URL = process.env.PREDICTION_MARKET_API
     const res$ = this.http.get(`${URL}?category=${activeCategory}&start=${start}&end=${end}`)
     const res = await firstValueFrom(res$)
    
     console.log(res.data)
     return res.data
    } 
}
