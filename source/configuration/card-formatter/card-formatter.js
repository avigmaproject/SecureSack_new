export const formatCardNumber = (text) => {
  let formattedText = text.split(' ').join('');
  if (formattedText.length > 0) {
    formattedText = formattedText.match(new RegExp('.{1,4}', 'g')).join(' ');
  }
  return formattedText;
};

const limitLength = (string = '', maxLength) => string.substr(0, maxLength);
const removeNonNumber = (string = '') => string.replace(/[^\d]/g, '');

export const formatExpiry = (expiry) => {
  const sanitized = limitLength(removeNonNumber(expiry), 4);
  if (sanitized.match(/^[2-9]$/)) {
    return `0${sanitized}`;
  }
  if (sanitized.length > 2) {
    return `${sanitized.substr(0, 2)}/${sanitized.substr(2, sanitized.length)}`;
  }
  return sanitized;
}

export const formatDate = (str) => {
     if (str == null) { 
        return '' }
  
    var re = new RegExp(/(\d{6})(\d{2})?/);
   
    if (re.test(str))
    {
        if (str.length == 8) {
            str = str.substring(0, 2) + '/' + str.substring(2, 4) + '/' + str.substring(4, 8)
        }
        
        if (str.length == 6) {
            if (str.substring(4, 6) < 20)
            {
                str = str.substring(0, 2) + '/' + str.substring(2, 4) + '/' + str.substring(4, 6);
            }
            else
            {
                str = str.substring(0, 2) + '/' + str.substring(2, 4) + '/' + str.substring(4, 6);
            }
        }
    }
    return str;
}