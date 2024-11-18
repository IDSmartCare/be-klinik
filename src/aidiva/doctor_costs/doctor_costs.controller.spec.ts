import { Test, TestingModule } from '@nestjs/testing';
import { DoctorCostsController } from './doctor_costs.controller';

describe('DoctorCostsController', () => {
  let controller: DoctorCostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorCostsController],
    }).compile();

    controller = module.get<DoctorCostsController>(DoctorCostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
