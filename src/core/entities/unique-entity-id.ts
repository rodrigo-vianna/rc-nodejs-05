import { randomUUID } from 'node:crypto'

export class UniqueEntityID {
  public _value: string

  constructor(value?: string) {
    this._value = value ?? randomUUID()
  }

  toString(): string {
    return this._value
  }

  get value(): string {
    return this._value
  }

  public equals(id: UniqueEntityID) {
    return id.value === this.value
  }
}
