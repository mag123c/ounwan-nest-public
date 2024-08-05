import { performance } from "perf_hooks";

export const performanceCheck = (fn: Function, ...args: any[]) => async () => {
  const start = performance.now();
  const result = await fn(...args);
  const end = performance.now();

  console.log(`Execution time for ${fn.name}: ${Math.floor(end - start)} ms`);
  return result;
};

export const repoPerformCheck = (context: any, fn: (...args: any[]) => Promise<any>, ...args: any[]) => async () => {
  const start = performance.now();
  const result = await fn.apply(context, args);
  const end = performance.now();

  console.log(`Execution time for ${fn.name}: ${Math.floor(end - start)} ms`);
  return result;
};