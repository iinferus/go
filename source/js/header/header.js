const page = document.querySelector(".page");
const header = document.querySelector(".header");

function isElementInViewport(el) {
  let rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

if (header) {
  const burger = header.querySelector(".header__burger");
  const list = header.querySelector(".header__list");
  const links = header.querySelectorAll(".header__link");

  let prevScrollpos = window.pageYOffset;
  window.onscroll = function () {
    const currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
      header.classList.remove("header--hidden");
    } else {
      header.classList.add("header--hidden");
    }
    prevScrollpos = currentScrollPos;
  };

  if (list && burger) {
    burger.addEventListener("click", () => {
      burger.classList.toggle("header__burger--active");
      list.classList.toggle("header__list--active");
      page.classList.toggle("page--hidden");
    });
  }

  links.forEach((link) => {
    link.addEventListener("click", (evt) => {
      evt.preventDefault();
      burger.classList.remove("header__burger--active");
      list.classList.remove("header__list--active");
      page.classList.remove("page--hidden");

      const blockID = link.getAttribute("href").substr(1);

      document.getElementById(blockID).scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
    });
  });
}
