export const STATUS = status => {
  console.log('cc ', status)
  switch (status) {
    case 0:
      return 'Cancelled';
    case 1:
      return 'InProgress';
    case 2:
      return 'Reviewing';
    case 3:
      return 'Completed';
    default:
      return '';
  }
}