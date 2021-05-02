export class Player {
  private id:string;

  constructor(id:string) {
    this.id = id;
  };

  public hasID(id:string) :boolean {
    return this.id === id;
  }
}
