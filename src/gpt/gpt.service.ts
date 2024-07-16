import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase, prosConsDicusserStreamUseCase, prosConsDicusserUseCase } from './use-cases';
import { OrthographyDto, ProsConsDiscusserDto, TranslateDto } from './dtos';
import OpenAI from 'openai';
import { translateUseCase } from './use-cases/translate.use-case';


@Injectable()
export class GptService {

    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })
    
    async orthographycheck(orthographyDto: OrthographyDto){
 
        return await orthographyCheckUseCase(this.openai, {
            prompt: orthographyDto.prompt, 
        });

    }

    async prosConsDicusser(prosConsDiscusserDto: ProsConsDiscusserDto){
        return await prosConsDicusserUseCase(this.openai, {
            prompt: prosConsDiscusserDto.prompt, 
        });
    }
   
    async prosConsDicusserStream({ prompt }: ProsConsDiscusserDto ) {
        return await prosConsDicusserStreamUseCase(this.openai, { prompt });
      }
   
      async translateText({ prompt, lang }: TranslateDto ) {
        return await translateUseCase(this.openai, { prompt, lang });
      }

}
