

     async function loadHTML(id, file) {
                const element = document.getElementById(id);
                const response = await fetch(file);
                element.innerHTML = await response.text();
            }

            loadHTML("header", "header.html");
            loadHTML("footer", "footer.html");
    

const form = document.getElementById('contact-form');
const emaildata = document.getElementById('email');
const phonedata = document.getElementById('phone');
const emailErr = document.getElementById('email-error');
const phoneErr = document.getElementById('phone-error');