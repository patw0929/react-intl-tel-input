export const log = (...args) => {
  const logger = document.querySelector('#debug');

  if (typeof args === 'object') {
    logger.innerHTML += `${(JSON && JSON.stringify ? JSON.stringify(args) : args)}<br />`;
  } else {
    logger.innerHTML += `${args}<br />`;
  }

  logger.scrollTop = logger.scrollHeight;
};
