export class ParamNotFound extends Error {
  constructor() {
    super('Parameter not found');
    this.name = 'ParamNotFound';
  }
}
