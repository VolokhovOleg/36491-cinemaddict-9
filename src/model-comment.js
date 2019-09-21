class ModelComment {
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
    return data.map(ModelComment.parseFilm);
  }
}
