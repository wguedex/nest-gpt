import { Body, Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Req, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { GptService } from "./gpt.service";
import { ImageGenerationDto, OrthographyDto, ProsConsDiscusserDto, TextToAudioDto, TranslateDto } from "./dtos";
import { application, Response } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import {diskStorage} from 'multer';
import { ImageVariationDto } from "./dtos/image-variation.dto";


@Controller("gpt")
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post("orthography-check")
  orthographycheck(@Body() orthographyDto: OrthographyDto) {
    // return orthographyDto;
    return this.gptService.orthographycheck(orthographyDto);
  }

  @Post("pros-cons-discusser")
  prosConsDiscusser(@Body() prosConsDiscusserDto: ProsConsDiscusserDto) {
    return this.gptService.prosConsDicusser(prosConsDiscusserDto);
  }

  @Post('pros-cons-stream')
  async prosConsDicusserStream(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    @Res() res: Response,
  ) {
     const stream = await this.gptService.prosConsDicusserStream(prosConsDiscusserDto);

  
    res.setHeader('Content-Type', 'application/json');
    res.status( HttpStatus.OK );

    for await( const chunk of stream ) {
      const piece = chunk.choices[0].delta.content || '';
      // console.log(piece);
      res.write(piece);
    }

    res.end();

  }

  @Post("translate-text")
  translateText(@Body() translateDto: TranslateDto) {
    return this.gptService.translateText(translateDto);
  }
  
  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() res: Response,
  ) {
    const filePath = await this.gptService.textToAudio(textToAudioDto);

    res.setHeader('Content-Type','audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);

  }

  @Get('text-to-audio/:fileId')
  async textToAudioGetter(
    @Res() res: Response,
    @Param('fileId') fileId: string,
  ) {
    const filePath = await this.gptService.textToAudioGetter(fileId);

    res.setHeader('Content-Type','audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);

  }

  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, callback) => {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${ new Date().getTime() }.${ fileExtension }`;
          return callback(null, fileName);
        }
      })
    })
  )
  async audioToText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 1024 * 5, message: 'File is bigger than 5 mb ' }),
          new FileTypeValidator({ fileType: 'audio/*' })
        ]
      })
    ) file: Express.Multer.File,
  ) {
    
    return this.gptService.audioToText(file);
  }  
  
  @Post('image-generation')
  async imageGeneration(@Body() imageGenerationDto: ImageGenerationDto) {
    return await this.gptService.imageGeneration(imageGenerationDto);
  }
   
  @Get('image-generation/:filename')
  async getGenerated(@Res() res: Response, @Param('filename') fileName: string) {
    const filePath = this.gptService.getGeneratedImage(fileName);
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }  

  @Post('image-variation')
  async imageVariation(@Body() imageVariationDto: ImageVariationDto) {
    return await this.gptService.generateImageVariation(imageVariationDto);
  }

}
