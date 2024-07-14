import { Body, Controller, HttpStatus, Post, Req, Res } from "@nestjs/common";
import { GptService } from "./gpt.service";
import { OrthographyDto, ProsConsDiscusserDto } from "./dtos";
import { application, Response } from "express";

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

  // @Post("pros-cons-stream")
  // async prosConsDiscusserStream(
  //   @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
  //   @Req() res: Response
  // ) {

  //   const stream = await this.gptService.prosConsDicusserStream(prosConsDiscusserDto);

  //   res.setHeader("content-type", "application/json");
  //   res.status(HttpStatus.OK);

  //   for await(const shunk of stream) {
  //     const piece = shunk.choices[0].delta.content || '';
  //     console.log(piece)
  //     res.write(piece)
  //   }

  //   res.end();

  // }

}
