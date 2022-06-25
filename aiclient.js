const { Configuration, OpenAIApi } = require("openai");

class IdentityAIClient {
  constructor() {
    // empty
  }

  async getResponse(message) {
    return message;
  }
};

class OpenAIClient {
  constructor(botContext, apiKey) {
    this.name = botContext.name;
    this.apiKey = apiKey;
    const configuration = new Configuration({ apiKey: apiKey });
    this.openai = new OpenAIApi(configuration);
  }
  async getResponse(message) {
    const input = {
      model: "text-davinci-002",
      prompt: message,
      temperature: 1,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 2,
      presence_penalty: 2,
      stop: ["human:", `${this.name}:`],
    };

    console.log(message);
    
    let result = await this.openai.createCompletion(input); 
    console.log(result.data.choices);
    result = result.data.choices[0].text.trimStart();
    result = result.replace(/['?.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    result = result.toLowerCase();
    return result;
  }
}

module.exports.IdentityAIClient = IdentityAIClient;
module.exports.OpenAIClient = OpenAIClient;