const root = document.createElement('div');

const nameStr = document.createElement('div');
const emailStr = document.createElement('div');
const linebreak = document.createElement("br");

nameStr.textContent = 'Created By: Brendan Tobin';
emailStr.textContent = 'email: brendanpjtobin@gmail.com'

root.append(nameStr, emailStr);
document.body.append(root);