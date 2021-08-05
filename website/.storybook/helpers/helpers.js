// eslint-disable-next-line import/prefer-default-export
export const lookup = callback => {
  const request = new XMLHttpRequest()

  request.addEventListener('load', () => {
    callback(JSON.parse(request.responseText).country_code)
  })

  request.open('GET', 'https://api.ipdata.co/?api-key=test')
  request.send()
}
