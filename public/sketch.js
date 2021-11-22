const root = document.createElement('div');

const Welcome = document.createElement('div');
const linebreak = document.createElement("br");
let welcomeString = "Pittsburgh Stormwater Scout is an online log of locations and photos in which there appears to be an issue with the Pittsburgh stormwater system. Anywhere you find a clogged stormwater inlet, pollution flowing into an inlet, or excessive flooding you can store the location and an image of the issue by navigating to the 'Callout an Issue!' section of this site. \n\n\nIf you do report an issue, thank you for participating in keeping an eye on our Pittsburgh water. This website has no official affiliation with the city of Pittsburgh and its municipal authorities. It is simply a fun project to keep an eye on the city's water system.";

Welcome.textContent = welcomeString;
root.append(Welcome);
document.body.append(root);
