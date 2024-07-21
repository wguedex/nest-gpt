


import * as fs from 'fs';

import OpenAI from 'openai';
import { downloadImageAsPng } from '../helpers';

interface Options {
  prompt?: string;
  originalImage?: string;
  maskImage?: string;
}


export const imageGenerationUseCase = async( openai:OpenAI, options: Options ) => {
  
  const { prompt, originalImage, maskImage } = options;

    const response = await openai.images.generate({
      prompt: prompt,
      model: 'dall-e-3',
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url', 
    });
 
    //Todo: guardar la imagen en FS.
    const fileName = await downloadImageAsPng(response.data[0].url);
    const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

    return {
      url: url,
      openAIUrl: response.data[0].url,
      revised_prompt: response.data[0].revised_prompt,
    }; 


}