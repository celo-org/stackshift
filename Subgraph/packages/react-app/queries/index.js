export function GET_ALL() {
  return `query {
    gravatars(first: 20) {
        id
        owner
        displayName
        imageUrl
      }
        }`;
}
