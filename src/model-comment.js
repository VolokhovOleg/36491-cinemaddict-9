import {moment, DOMPurify} from './utils.js';

export class ModelComment {
  constructor(data) {
    this.id = DOMPurify.sanitize(data[`id`]);
    this.emoji = DOMPurify.sanitize(data[`emotion`]);
    this.author = DOMPurify.sanitize(data[`author`]);
    this.content = DOMPurify.sanitize(data[`comment`]);
    this.date = DOMPurify.sanitize(moment(data[`date`]).toISOString());
  }

  static parseComment(data) {
    return new ModelComment(data);
  }

  static parseComments(data) {
    return data.map(ModelComment.parseComment);
  }

  toRAW() {
    return {
      'comment': this.content,
      'date': moment(this.date).format(),
      'emotion': this.emoji,
    };
  }
}
