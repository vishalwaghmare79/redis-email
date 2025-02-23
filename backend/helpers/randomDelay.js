const getRandomDelay = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = { getRandomDelay, delay };