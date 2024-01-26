function validateLen(pw) {
  if (pw.length < 8 || pw.length > 10) {
    return false
  } else {
    return true
  }
}

function validateNum(pw) {
  return /\d/.test(pw)
}

function validateSC(pw) {
  const sc = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "+", "=", ",", "{", "}", "[", "]"]
  return sc.some(c => pw.includes(c))
}

function validateAlp(pw) {
  return /[a-zA-Z]/.test(pw)
}

export function validatePassword(pw) {
  const result = [validateAlp(pw), validateLen(pw), validateNum(pw), validateSC(pw)]
  return result.every(Boolean)
}
