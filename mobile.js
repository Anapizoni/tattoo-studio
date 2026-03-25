const mobileMenu = document.querySelector(".mobile-menu");
const menuNavegacao = document.querySelector(".menu-navegacao");
const menuItens = document.querySelectorAll(".menu-navegacao li");
const menuLinks = document.querySelectorAll('.menu-navegacao a[href^="#"]');
const cabecalho = document.querySelector(".cabecalho");
const activeClass = "active";

function handleMenuToggle(event) {
    event.preventDefault();
    event.stopPropagation();

    const isOpen = !menuNavegacao.classList.contains(activeClass);
    setMenuState(isOpen);
}

function animateLinks(isOpen) {
    menuItens.forEach((item, index) => {
        item.style.animation = isOpen
            ? `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`
            : "";
    });
}

function setMenuState(isOpen) {
    if (!mobileMenu || !menuNavegacao) {
        return;
    }

    mobileMenu.classList.toggle(activeClass, isOpen);
    menuNavegacao.classList.toggle(activeClass, isOpen);
    mobileMenu.setAttribute("aria-expanded", String(isOpen));
    animateLinks(isOpen);
}

function getHeaderOffset() {
    return cabecalho ? cabecalho.offsetHeight + 10 : 160;
}

if (mobileMenu && menuNavegacao) {
    mobileMenu.addEventListener("click", handleMenuToggle);

    menuLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");
            const target = href ? document.querySelector(href) : null;

            if (!target) {
                return;
            }

            event.preventDefault();
            setMenuState(false);

            const targetPosition = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();

            window.scrollTo({
                top: Math.max(targetPosition, 0),
                behavior: "smooth",
            });
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 1300) {
            setMenuState(false);
        }
    });
}