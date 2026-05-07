import { Test } from '@nestjs/testing';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';

describe('RestaurantController', () => {
  let restaurantController: RestaurantController;
  let restaurantService: RestaurantService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        controllers: [RestaurantController],
        providers: [RestaurantService],
      }).compile();

    restaurantService = moduleRef.get(RestaurantService);
    restaurantController = moduleRef.get(RestaurantController);
  });

  describe('getAllRestaurants', () => {
    it('should return all restaurants', async () => {
      const result = ['test'];
      jest.spyOn(restaurantService, 'getData').mockImplementation(() => result);

      expect(await restaurantController.getAllRestaurants()).toBe(result);
    });
  });
});
