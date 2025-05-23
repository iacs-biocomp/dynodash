import { Test, TestingModule } from '@nestjs/testing';
import { DatosController } from './datos.controller';

describe('DatosController', () => {
  let controller: DatosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DatosController],
    }).compile();

    controller = module.get<DatosController>(DatosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
