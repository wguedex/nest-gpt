import { Injectable } from '@nestjs/common';
import { orthographyCheckUseCase } from './use-cases';

@Injectable()
export class GptService {



    async orthographycheck(){
        // return {
        //     message: 'Hola desde orthographycheck - service'
        //   };  

        return await orthographyCheckUseCase();

    }

}
