const FastPriorityQueue = require('fastpriorityqueue');

// Prioritize replying to channels which we have sent the least messages in
class MinHeapReplyManager {
  constructor() {
    this.minHeap = new FastPriorityQueue((a, b) => a.numResponses < b.numResponses);
    this.channelQueued = {};
  }

  onMessage(channel) {
    if (!(channel in this.channelQueued) || !this.channelQueued[channel]) {
      channel.numResponses = channel.numResponses || 0;
      this.minHeap.add(channel);
      this.channelQueued[channel] = true;
    }
  }

  getChannel() {
    const channel = this.minHeap.poll();

    if (channel) {
      this.channelQueued[channel] = false;
    }

    return channel;
  }
}

module.exports.MinHeapReplyManager = MinHeapReplyManager;