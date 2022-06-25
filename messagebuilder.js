const os = require('os');

class MessageBuilder {
  constructor(botContext, channel) {
    this.botContext = botContext;
    this.channel = channel;
  }

  async buildMessage(messagesToRead, maxCharacters) {
    let messages = await this.channel.fetchMessages({ limit: messagesToRead });  
    messages = messages.array();   
    const header = this.botContext.getContext();   
    let length = 0;
    let payload = "";

    for (let i = Math.min(messages.length - 1, messagesToRead - 1); i >= 0; i--) {
      const msg = messages[i];
      if (length + msg.content.length <= maxCharacters) {      
        if (msg.author.id === this.botContext.id) {
          payload += os.EOL + this.botContext.name + ': ' + msg.content;
        }
        else {
          payload += os.EOL + 'human: ' + msg.content;
        }
      }
    }

    payload = header + payload + os.EOL + this.botContext.name + ': ';
    return payload;
  }
}

module.exports.MessageBuilder = MessageBuilder;