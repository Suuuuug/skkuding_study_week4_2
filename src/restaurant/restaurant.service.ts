// restaurant.service.ts
import { Injectable, OnModuleInit, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';
import { CreateRestaurantDto } from './restaurant.dto';
import * as path from 'path';

export interface JsonData {
    restaurants: CreateRestaurantDto[];
}

@Injectable()
export class RestaurantService implements OnModuleInit { //onmoduleinit 반드시 사용하겠다는 뜻
    private jsonData: JsonData = { restaurants: [] };
    private readonly filePath = path.join(process.cwd(), 'data', 'restaurant.json');

    async onModuleInit() {
        await this.initialize();
    }

    private async initialize() {
        try {
            const data = await readFile(this.filePath, 'utf8');
            this.jsonData = JSON.parse(data);
        } catch (error) {
            console.error('맛집 데이터 초기화 실패:', error);
            this.jsonData = { restaurants: [] };
        }
    }

    async getData() {
        if (!this.jsonData) {
            throw new InternalServerErrorException('서버가 아직 초기화되지 않았습니다.');
        }
        return this.jsonData;
    }

    async getRestaurantByName(name: string) {
        const data = await this.getData();
        const rest = data.restaurants.find(r => r.name === name);
        if (!rest) {
            throw new NotFoundException('해당 맛집 정보가 존재하지 않습니다.');
        }
        return rest;
    }

    async createRestaurant(newRest: CreateRestaurantDto) {
        const data = await this.getData();
        const exists = data.restaurants.find(r => r.name === newRest.name);

        if (exists) {
            throw new ConflictException('이미 해당 맛집 정보가 존재합니다.');
        }

        data.restaurants.push(newRest);
        await writeFile(this.filePath, JSON.stringify(data, null, 2));
        return newRest;
    }

    async deleteRestaurant(name: string) {
        const data = await this.getData();
        const restIndex = data.restaurants.findIndex(r => r.name === name);

        if (restIndex === -1) {
            throw new NotFoundException('해당 맛집 정보가 존재하지 않습니다.');
        }

        const deletedRest = data.restaurants[restIndex];
        data.restaurants = data.restaurants.filter(r => r.name !== name);
        await writeFile(this.filePath, JSON.stringify(data, null, 2));
        return deletedRest;
    }

    async updateRestaurant(patchRest: CreateRestaurantDto) {
        const data = await this.getData();
        const index = data.restaurants.findIndex(r => r.name === patchRest.name);

        if (index === -1) {
            throw new NotFoundException('해당 맛집 정보가 존재하지 않습니다.');
        }

        data.restaurants[index] = patchRest;
        await writeFile(this.filePath, JSON.stringify(data, null, 2));
        return patchRest;
    }
}