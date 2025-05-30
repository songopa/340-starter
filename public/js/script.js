const menuBtn = document.querySelector("#menu");
const navLinks = document.querySelectorAll("nav a");

menuBtn.addEventListener('click', function () {
    navLinks.forEach(link => {
        link.classList.toggle('show');
    });
    menuBtn.classList.toggle('show')
})