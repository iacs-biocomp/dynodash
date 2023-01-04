import { Test, TestingModule } from '@nestjs/testing';
import { PlantillasService } from './plantillas.service';

describe('PlantillasService', () => {
  let service: PlantillasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlantillasService],
    }).compile();

    service = module.get<PlantillasService>(PlantillasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
