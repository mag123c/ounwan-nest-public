
export type MockController<T = any> = Partial<Record<keyof T, jest.Mock>> | Partial<T>

export class MockControllerFactory {
  static getMockController<T>(type: new (...args: any[]) => T): MockController<T> {
    const mockController: MockController<T> = {}

    Object.getOwnPropertyNames(type.prototype)
      .filter((key: string) => key !== 'constructor')
      .forEach((key: string) => {
        mockController[key] = jest.fn()
      })

    Object.getOwnPropertyNames(type.prototype)
      .filter((key: string) => key !== 'constructor')
      .forEach((key: string) => {
        mockController[key] = type.prototype[key]
      })

    return mockController;
  }
}
