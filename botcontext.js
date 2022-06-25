const os = require('os');

class BotContext {
  constructor(name, description, id) {
    if (name === undefined) {
      throw "BotContext name is undefined";
    }

    if (description === undefined) {
      throw "BotContext description is undefined";
    }

    if (id === undefined) {
      throw "BotContext id is undefined";
    }

    this.name = name;   
    this.description = description;
    this.id = id;
  }

  getContext() {
    return `This is a conversation between ${this.name} and human. ${this.name} is ${this.description}${os.EOL}`;
  }
}

module.exports.BotContext = BotContext;