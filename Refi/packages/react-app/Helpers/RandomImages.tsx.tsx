let randomImages: string[] = [
  'https://images.unsplash.com/photo-1506869580753-322ec19a37f5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MnxpaFNUdUQ5dU8xUXx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=700&q=60',
  'https://images.unsplash.com/photo-1611270418597-a6c77f4b7271?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2198&q=80',
  'https://images.unsplash.com/photo-1555063200-219c0652df49?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8NHxpaFNUdUQ5dU8xUXx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=700&q=60',
  'https://images.unsplash.com/photo-1559556064-4161b6be179b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8N3xpaFNUdUQ5dU8xUXx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=700&q=60',
  'https://images.unsplash.com/photo-1602041635604-5138cd3af167?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MTV8aWhTVHVEOXVPMVF8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=60'
];

function randomizeImage(): string {
  let randomNum: number = Math.floor(Math.random() * randomImages.length);
  console.log('the random num', randomNum);
  console.log('the image returned', randomImages[randomNum]);
  return randomImages[randomNum];
}

export default randomizeImage;
