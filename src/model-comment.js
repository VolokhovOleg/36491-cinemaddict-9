export class ModelComment {
  constructor(data) {
    this.id = data[`id`];
    this.emoji = data[`emotion`];
    this.author = data[`author`];
    this.content = data[`comment`];
    this.date = new Date(data[`date`]);
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
      "date": `2019-05-11T16:12:32.554Z`,
      "emotion": `smile`,
    };
  }
}
