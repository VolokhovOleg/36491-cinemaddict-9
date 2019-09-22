export class ModelComment {
  constructor(data) {
    this.id = data[`id`];
    this.emoji = `images/emoji/${data[`emotion`]}.png`;
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
}
