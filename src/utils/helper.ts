/**
 * return if email is correct, is Valid email
 * */
export function isEmail(emailAddress: string) {
  let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return emailAddress?.match(regex)
}
