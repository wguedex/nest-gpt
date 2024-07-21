import * as path from 'path';
import * as fs from 'fs';

import { Injectable, NotFoundException } from '@nestjs/common';
 
import {
  audioToTextUseCase,
  imageGenerationUseCase,
  imageVariationUseCase,
  orthographyCheckUseCase,
  prosConsDicusserStreamUseCase,
  prosConsDicusserUseCase,
} from "./use-cases";
import {
  ImageGenerationDto,
  OrthographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslateDto,
} from "./dtos";
import OpenAI from "openai";
import { translateUseCase } from "./use-cases/translate.use-case";
import { textToAudioUseCase } from "./use-cases/text-to-audio.use-case";
import { ImageVariationDto } from './dtos/image-variation.dto';

@Injectable()
export class GptService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async orthographycheck(orthographyDto: OrthographyDto) {
    return await orthographyCheckUseCase(this.openai, {
      prompt: orthographyDto.prompt,
    });
  }

  async prosConsDicusser(prosConsDiscusserDto: ProsConsDiscusserDto) {
    return await prosConsDicusserUseCase(this.openai, {
      prompt: prosConsDiscusserDto.prompt,
    });
  }

  async prosConsDicusserStream({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDicusserStreamUseCase(this.openai, { prompt });
  }

  async translateText({ prompt, lang }: TranslateDto) {
    return await translateUseCase(this.openai, { prompt, lang });
  }

  async textToAudio({ prompt, voice }: TextToAudioDto) {
    return await textToAudioUseCase(this.openai, { prompt, voice });
  }
 
  async textToAudioGetter(fileId: string) {
    const filePath = path.resolve(
      __dirname,
      '../../generated/audios/',
      `${fileId}.mp3`,
    );

    const wasFound = fs.existsSync(filePath);

    if (!wasFound) throw new NotFoundException(`File ${fileId} not found`);

    return filePath;
  }

  async audioToText( audioFile: Express.Multer.File, prompt?: string ) {
    return await audioToTextUseCase( this.openai, { audioFile, prompt } );
  }

  async imageGeneration(imageGenerationDto: ImageGenerationDto){
    return await imageGenerationUseCase( this.openai, { ...imageGenerationDto } );
  }

  getGeneratedImage( fileName: string ) {

    const filePath = path.resolve('./','./generated/images/', fileName);
    const exists = fs.existsSync( filePath );
    
    if ( !exists ) {
      throw new NotFoundException('File not found');
    }

    return filePath;

  }


  async generateImageVariation( { baseImage }: ImageVariationDto ) {
    return imageVariationUseCase( this.openai, { baseImage } );
  }


}
