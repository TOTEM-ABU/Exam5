import { Injectable } from '@nestjs/common';
import { CreateGeneralInfoDto } from './dto/create-general-info.dto';
import { UpdateGeneralInfoDto } from './dto/update-general-info.dto';

@Injectable()
export class GeneralInfoService {
  create(createGeneralInfoDto: CreateGeneralInfoDto) {
    return 'This action adds a new generalInfo';
  }

  findAll() {
    return `This action returns all generalInfo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} generalInfo`;
  }

  update(id: number, updateGeneralInfoDto: UpdateGeneralInfoDto) {
    return `This action updates a #${id} generalInfo`;
  }

  remove(id: number) {
    return `This action removes a #${id} generalInfo`;
  }
}
