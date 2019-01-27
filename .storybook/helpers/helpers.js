export const log = (...args) => {
  const logger = document.querySelector('#debug');

  if (typeof args === 'object') {
    logger.innerHTML += `${(JSON && JSON.stringify ? JSON.stringify(args) : args)}<br />`;
  } else {
    logger.innerHTML += `${args}<br />`;
  }

  logger.scrollTop = logger.scrollHeight;
};

export const lookup = callback => {
  const request = new XMLHttpRequest();

  request.addEventListener('load', () => {
    callback(JSON.parse(request.responseText).country_code);
  });

  request.open('GET', 'https://api.ipdata.co/?api-key=test');
  request.send();
};
