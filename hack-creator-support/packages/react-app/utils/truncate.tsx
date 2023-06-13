export const truncate = (string) => `${string.substring(0, 5)}...`

export const removeSpace = (string) => string.replace(/\s/g, '')

export const convertHexToNumber = (hexString: string) => {
  const numberValue = parseInt(hexString, 16);
  return numberValue
}