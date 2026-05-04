import { 
    Controller, Get, Post, Delete, Patch, Param, Body, HttpStatus, UseFilters, HttpCode 
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './restaurant.dto';
import { HttpExceptionFilter } from './http-exception.filter';

@Controller('restaurant')
@UseFilters(HttpExceptionFilter) // 필터 적용
export class RestaurantController {
    constructor(private readonly restaurantService: RestaurantService) {}

    @Get()
    async getAllRestaurants() {
        return await this.restaurantService.getData();
    }

    @Get(':name')
    async getRestaurantByName(@Param('name') name: string) {
        return await this.restaurantService.getRestaurantByName(name);
    }

    @Post()
    async createRestaurant(@Body() newRest: CreateRestaurantDto) {
        return await this.restaurantService.addRestaurant(newRest);
    }

    @Delete(':name')
    async deleteRestaurant(@Param('name') name: string) {
        return await this.restaurantService.deleteRestaurant(name);
    }

    @Patch()
    async updateRestaurant(@Body() patchRest: CreateRestaurantDto) {
        return await this.restaurantService.updateRestaurant(patchRest);
    }
}