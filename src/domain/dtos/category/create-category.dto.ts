

export class CreateCategoryDTO {
  private constructor(
    public readonly name: string,
    public readonly available: boolean,
  ) {

  }

  static create( object: { [key: string]: any } ): [string?, CreateCategoryDTO?] {
    const { name, available = false } = object;
    let availableBoolean = available;

    if(!name) return ['Mising name'];
    if(typeof available !== 'boolean') {
      availableBoolean = (available === 'true');
    }

    return [undefined, new CreateCategoryDTO(name, availableBoolean)]

  }

}