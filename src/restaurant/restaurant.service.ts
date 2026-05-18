// restaurant.service.ts
import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { CreateRestaurantDto } from './restaurant.dto';
import { PrismaService } from 'src/prisma/prisma.service';

export interface JsonData {
    restaurants: CreateRestaurantDto[];
}

@Injectable()
export class RestaurantService{
    constructor(private prisma: PrismaService) {}

    async getData() {
        try{
            return await this.prisma.restaurant.findMany();
        }
        catch(error){
            console.error(error);
        }
    }

    async getRestaurantByName(name: string) {
        const rest = await this.prisma.restaurant.findUnique({
            where: {name: name}
        });
        if(!rest){
            throw new NotFoundException("해당 맛집 정보가 존재하지 않습니다.");
        }
        return rest;
    }

    async createRestaurant(newRest: CreateRestaurantDto) {
        const rest = await this.prisma.restaurant.findUnique({
            where: {name: newRest.name}
        });
        if(rest){
            throw new NotFoundException("이미 해당 맛집 정보가 존재합니다.");
        }
        const CreatedRest = await this.prisma.restaurant.create({
            data: {
                name: newRest.name,
                address: newRest.address,
                phone: newRest.phone,
            },
        });
        return CreatedRest;
    }

    async deleteRestaurant(name: string) {
        const rest = await this.prisma.restaurant.findUnique({
            where: {name: name}
        });
        if(!rest){
            throw new NotFoundException("해당 맛집 정보가 존재하지 않습니다.");
        }
        const deletedRest = await this.prisma.restaurant.delete({ //데이터 하나 삭제
            where: {
                name: name,
            },
        })
        return deletedRest;
    }

    async updateRestaurant(patchRest: CreateRestaurantDto) {
        const rest = await this.prisma.restaurant.findUnique({
            where: {name: patchRest.name}
        });
        if(!rest){
            throw new NotFoundException("해당 맛집 정보가 존재하지 않습니다.");
        }
        const updatedRest = await this.prisma.restaurant.update({
            where:{
                name: patchRest.name,
            },
            data: {
                address: patchRest.address,
                phone: patchRest.phone,
            }
        })
        return updatedRest;
    }
}