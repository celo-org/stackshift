export const truncate = (address: string) => address.substring(0, 20)

export const hexToNumber = (hexString : string) => parseInt(hexString, 16);