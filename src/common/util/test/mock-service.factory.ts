
export type MockService<T = any> = Partial<Record<keyof T, jest.Mock>> | Partial<T>

export class MockServiceFactory {
  static getMockService<T>(type: new (...args: any[]) => T): MockService<T> {
    const mockService: MockService<T> = {}

    Object.getOwnPropertyNames(type.prototype)
      .filter((key: string) => key !== 'constructor')
      .forEach((key: string) => {
        mockService[key] = jest.fn()
      })

    Object.getOwnPropertyNames(type.prototype)
      .filter((key: string) => key !== 'constructor')
      .forEach((key: string) => {
        mockService[key] = type.prototype[key]
      })

    return mockService;
  }
}
