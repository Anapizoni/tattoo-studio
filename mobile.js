// MENU MOBILE

const mobileMenu = document.querySelector(".mobile-menu");
const menuNavegacao = document.querySelector(".menu-navegacao");
const menuItens = document.querySelectorAll(".menu-navegacao li");
const menuLinks = document.querySelectorAll('.menu-navegacao a[href^="#"]');
const cabecalho = document.querySelector(".cabecalho");
const menuBackdrop = document.querySelector(".menu-backdrop");
const activeClass = "active";

function handleMenuToggle() {
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
    if (menuBackdrop) {
        menuBackdrop.classList.toggle(activeClass, isOpen);
    }
    document.body.classList.toggle("menu-open", isOpen);
    mobileMenu.setAttribute("aria-expanded", String(isOpen));
    animateLinks(isOpen);
}

function getHeaderOffset() {
    return cabecalho ? cabecalho.offsetHeight + 10 : 160;
}

if (mobileMenu && menuNavegacao) {
    mobileMenu.addEventListener("click", handleMenuToggle);

    if (menuBackdrop) {
        menuBackdrop.addEventListener("click", () => setMenuState(false));
    }

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

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setMenuState(false);
        }
    });
}

// CARTAO SOBRE - TOQUE NO MOBILE
const cartaoSobre = document.querySelector(".cartao-container");
const imagemVersoSobre = document.querySelector(".cartao-container .verso img");

function isMobileTouch() {
    return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

if (cartaoSobre) {
    cartaoSobre.addEventListener("click", () => {
        if (!isMobileTouch()) {
            return;
        }

        if (!cartaoSobre.classList.contains("virado")) {
            cartaoSobre.classList.add("virado");
        }
    });
}

if (imagemVersoSobre && cartaoSobre) {
    imagemVersoSobre.addEventListener("click", (event) => {
        if (!isMobileTouch()) {
            return;
        }

        event.stopPropagation();
        cartaoSobre.classList.remove("virado");
    });
}

//FORMULÁRIO
    const contatoForm = document.querySelector(".formulario-contato form");
    const orcamentoButtons = document.querySelectorAll(".btn-orcamento");
    const customSelect = document.querySelector("[data-select]");

    if (customSelect) {
        const selectInput = customSelect.querySelector('input[name="assunto"]');
        const selectTrigger = customSelect.querySelector(".custom-select-trigger");
        const selectValue = customSelect.querySelector(".custom-select-value");
        const selectOptions = customSelect.querySelectorAll(".custom-select-option");

        if (selectValue) {
            selectValue.classList.add("placeholder");
        }

        selectTrigger?.addEventListener("click", () => {
            const isOpen = customSelect.classList.contains("open");
            customSelect.classList.toggle("open", !isOpen);
            selectTrigger.setAttribute("aria-expanded", String(!isOpen));
        });

        selectOptions.forEach((option) => {
            option.addEventListener("click", () => {
                const value = option.dataset.value || "";

                if (selectInput) {
                    selectInput.value = value;
                }

                if (selectValue) {
                    selectValue.textContent = value;
                    selectValue.classList.remove("placeholder");
                }

                selectOptions.forEach((item) => item.classList.remove("active"));
                option.classList.add("active");
                customSelect.classList.remove("open");
                selectTrigger?.setAttribute("aria-expanded", "false");
            });
        });

        document.addEventListener("click", (event) => {
            if (!customSelect.contains(event.target)) {
                customSelect.classList.remove("open");
                selectTrigger?.setAttribute("aria-expanded", "false");
            }
        });
    }

    function getWhatsAppNumber(rawValue) {
        return (rawValue || "").replace(/\D/g, "");
    }

    function buildWhatsAppMessage(formData) {
        return [
            "Oi! Vim pelo site e gostaria de solicitar um orçamento.",
            "",
            `Nome: ${formData.nome}`,
            `Email: ${formData.email}`,
            `Assunto: ${formData.assunto}`,
            "",
            "Ideia da tattoo:",
            formData.mensagem,
        ].join("\n");
    }

//CONFIGURAÇÃO DOS BOTÕES DE ORÇAMENTO

    function buildOrcamentoMessage(estilo, preco) {
        return [
            "Oi! Vim pelo site e tenho interesse em um orçamento.",
            "",
            `Estilo escolhido: ${estilo}`,
            `Valor de referencia no site: ${preco}`,
            "",
            "Gostaria de saber os proximos passos para agendar.",
        ].join("\n");
    }

    function openWhatsAppWithMessage(targetNumber, message) {
        const text = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${targetNumber}?text=${text}`;
        window.open(whatsappUrl, "_blank", "noopener");
    }

    if (orcamentoButtons.length > 0) {
        orcamentoButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const card = button.closest(".card-orcamento");
                const estilo = card?.querySelector(".subtitulo-orcamento h3")?.textContent?.trim() || "Nao informado";
                const preco = card?.querySelector(".preco")?.textContent?.trim() || "A combinar";
                const targetNumber = getWhatsAppNumber(contatoForm?.dataset?.whatsapp);

                if (!targetNumber) {
                    alert("Configure o numero do WhatsApp no atributo data-whatsapp do formulario.");
                    return;
                }

                openWhatsAppWithMessage(targetNumber, buildOrcamentoMessage(estilo, preco));
            });
        });
    }

    if (contatoForm) {
        contatoForm.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!contatoForm.assunto.value.trim()) {
                alert("Selecione um assunto.");
                return;
            }

            const formData = {
                nome: contatoForm.nome.value.trim(),
                email: contatoForm.email.value.trim(),
                assunto: contatoForm.assunto.value.trim(),
                mensagem: contatoForm.mensagem.value.trim(),
            };

            const targetNumber = getWhatsAppNumber(contatoForm.dataset.whatsapp);

            if (!targetNumber) {
                alert("Configure o número do WhatsApp no atributo data-whatsapp do formulário.");
                return;
            }

            openWhatsAppWithMessage(targetNumber, buildWhatsAppMessage(formData));
        });
    }