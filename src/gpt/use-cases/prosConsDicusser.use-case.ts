import OpenAI from "openai";

interface Options {
  prompt: string;
}

export const prosConsDicusserUseCase = async (
  openai: OpenAI, 
  { prompt }: Options
) => { 

    const completion = await openai.chat.completions.create({
        messages: [
            { 
                role: "system", 
                content: `
                    Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,
                    la respuesta debe de ser en formato markdown,
                    los pros y contras deben de estar en una lista,
                    Ejemplo de salida en formato JSON:
                    {
                      "pros": ["Pro 1", "Pro 2"],
                      "cons": ["Con 1", "Con 2"]
                    }                    
                        `
              },
              {
                role: 'user',
                content: prompt,
              }
        ],
        model: "gpt-4o",
        temperature:0.3, 
        max_tokens: 150, 
        response_format: {
            type: 'json_object'
        }
      });
 
      const jsonResp = JSON.parse(completion.choices[0].message.content)
      return jsonResp;

};
