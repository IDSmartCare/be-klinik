import { Test, TestingModule } from '@nestjs/testing';
import { DoctorCostsService } from './doctor_costs.service';

describe('DoctorCostsService', () => {
  let service: DoctorCostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoctorCostsService],
    }).compile();

    service = module.get<DoctorCostsService>(DoctorCostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
