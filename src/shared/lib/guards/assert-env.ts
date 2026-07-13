export function assertEnv(value: string | undefined, name: string): asserts value is string {
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}
