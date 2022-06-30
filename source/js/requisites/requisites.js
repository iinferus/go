const requisites = document.querySelectorAll(".requisites");

function copyText(el) {
  /* Get the text field */
  var copyText = document.getElementById("myInput");

  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */

  /* Copy the text inside the text field */
  navigator.clipboard.writeText(copyText.value);

  /* Alert the copied text */
  alert("Copied the text: " + copyText.value);
}

if (requisites.length > 0) {
  requisites.forEach((requisite) => {
    const check = requisite.querySelector(".requisites__check");
    const tooltip = requisite.querySelector(".requisites__tooltip");

    requisite.addEventListener("click", () => {
      navigator.clipboard.writeText(check.textContent);

      if (tooltip) {
        tooltip.classList.add("tooltip--visible");

        setTimeout(() => {
          tooltip.classList.remove("tooltip--visible");
        }, 3500);
      }
    });
  });
}
