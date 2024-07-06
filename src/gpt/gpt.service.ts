import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase } from './use-cases';
import { OrthographyDto } from './dtos';
import OpenAI from 'openai';


@Injectable()
export class GptService {

    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })
    
    async orthographycheck(orthographyDto: OrthographyDto){

        console.log(process.env.OPENAI_API_KEY)
 
        return await orthographyCheckUseCase(this.openai, {
            prompt: orthographyDto.prompt, 
        });

    }
    
}
