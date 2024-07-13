import { Body, Controller, Post } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto, ProsConsDiscusserDto } from './dtos';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

@Post('orthography-check')
orthographycheck(
  @Body() orthographyDto: OrthographyDto
){
  // return orthographyDto;
  return this.gptService.orthographycheck(orthographyDto);
}


@Post('pros-cons-discusser')
prosConscheck(
  @Body() prosConsDiscusserDto: ProsConsDiscusserDto
){
  return this.gptService.prosConsDicusser(prosConsDiscusserDto);
 
}


}
