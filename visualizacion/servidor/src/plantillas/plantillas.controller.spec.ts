import { Test, TestingModule } from '@nestjs/testing';
import { PlantillasController } from './plantillas.controller';

describe('PlantillasController', () => {
  let controller: PlantillasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlantillasController],
    }).compile();

    controller = module.get<PlantillasController>(PlantillasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
