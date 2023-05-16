export function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(38)}`;
}

export function truncateTxHash(txId: string) {
  return `${txId.slice(0, 6)}...${txId.slice(-4)}`;
}

export function formatTime(timestamp: number) {
  const milliseconds = timestamp * 1000;
  const dateObject = new Date(milliseconds);
  const humanDateFormat = dateObject.toLocaleString();
  return humanDateFormat;
}

export function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}