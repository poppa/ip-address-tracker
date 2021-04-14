const ip4re = new RegExp(
  '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}' +
    '(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
)

const domainRe = /^(\w[-a-z0-9]+\.)+[a-z]+$/i

export function isIp4(ip: string): boolean {
  return ip4re.test(ip)
}

export function isDomain(domain: string): boolean {
  return domainRe.test(domain)
}

export function validate(inp: string): { valid: boolean; message: string } {
  return {
    valid: inp === '' || isIp4(inp) || isDomain(inp),
    message: 'Input is not a valid IPv4 Address or domain name'
  }
}

export function registerValidator(elem: HTMLInputElement | undefined): void {
  if (elem) {
    elem.addEventListener('input', (e: Event) => {
      const { valid, message } = validate((e.target as HTMLInputElement).value)
      if (!valid) {
        elem.setCustomValidity(message)
      } else {
        elem.setCustomValidity('')
      }
    })
  }
}
