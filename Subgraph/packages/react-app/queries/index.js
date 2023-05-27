export function GET_ALL() {
  return `query {
    tasks(first: 5) {
      id
      owner
      taskName
      duration
      }
        }`;
}
