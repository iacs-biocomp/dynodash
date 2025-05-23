import { Test, TestingModule } from '@nestjs/testing';
import { DatosService } from './datos.service';

describe('DatosService', () => {
  let service: DatosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatosService],
    }).compile();

    service = module.get<DatosService>(DatosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
