import {moment} from './utils.js';

export class ModelComment {
  constructor(data) {
    this.id = data[`id`];
    this.emoji = data[`emotion`];
    this.author = data[`author`];
    this.content = data[`comment`];
    this.date = data[`date`];
  }

  static parseComment(data) {
    return new ModelComment(data);
  }

  static parseComments(data) {
    return data.map(ModelComment.parseComment);
  }

  toRAW() {
    return {
      "comment": this.content,
      "date": moment(this.date).format(),
      "emotion": this.emoji,
    };
  }
}
