import OpenAI from "openai";

interface Options {
  prompt: string;
}

export const orthographyCheckUseCase = async (
  openai: OpenAI,
  options: Options
) => {
  const { prompt } = options;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          `
          Te serán provistos textos con posibles errores ortográficos y gramaticales. 
          Debes responder en formato JSON. Tu tarea es corregirlos y retornar información solucionada. 
          También debes dar un porcentaje de acierto para el usuario. 
          Si no hay errores, debes retornar un mensaje de felicitaciones.
          `
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "gpt-3.5-turbo-1106",
    temperature:0.3, 
    max_tokens: 150, 
    response_format: {
        type: 'json_object'
    }
  });

   const jsonResp = JSON.parse(completion.choices[0].message.content)
   return jsonResp;
};
