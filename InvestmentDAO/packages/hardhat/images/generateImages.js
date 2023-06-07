const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

// Set the canvas size
const canvasSize = 500;
const profileCount = 100;

async function generateProfilePictures() {
  // Create the canvas
  const canvas = createCanvas(canvasSize, canvasSize);
  const context = canvas.getContext('2d');

  // Generate profile pictures
  for (let i = 0; i < profileCount; i++) {
    await generateProfilePicture(context);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`profile_${i}.png`, buffer);
  }
}

async function generateProfilePicture(context) {
  // Set the background color
  context.fillStyle = getRandomColor();
  context.fillRect(0, 0, canvasSize, canvasSize);

  // Generate shapes and patterns
  for (let i = 0; i < 10; i++) {
    const shapeType = getRandomShapeType();
    const shapeSize = getRandomShapeSize();
    const shapeX = getRandomPosition();
    const shapeY = getRandomPosition();
    const shapeColor = getRandomColor();

    // Draw the shape
    context.fillStyle = shapeColor;
    if (shapeType === 'circle') {
      context.beginPath();
      context.arc(shapeX, shapeY, shapeSize, 0, Math.PI * 2, false);
      context.closePath();
      context.fill();
    } else if (shapeType === 'rectangle') {
      context.fillRect(shapeX, shapeY, shapeSize, shapeSize);
    }
  }
}

function getRandomShapeType() {
  const shapeTypes = ['circle', 'rectangle'];
  return shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
}

function getRandomShapeSize() {
  return Math.random() * (150 - 50) + 50;
}

function getRandomPosition() {
  return Math.random() * canvasSize;
}

function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

generateProfilePictures();