import { PREP_TIME } from "./js/menu.js";

const form = document.querySelector(".form");
const orderLog = document.querySelector(".order-log");

function makeOrder(delay, shouldResolve) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}

function addOrderRow(drink) {
  const li = document.createElement("li");
  li.classList.add("row-pending");
  li.innerHTML = `⏳ ${drink} · у роботі...`;
  orderLog.appendChild(li);
  return li;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const drink = formData.get("drink");
  const state = formData.get("state");

  if (!drink || !state) {
    return;
  }

  const delay = PREP_TIME[drink] || 0;
  const shouldResolve = state === "fulfilled";

  const row = addOrderRow(drink);

  makeOrder(delay, shouldResolve)
    .then((delayTime) => {
      row.classList.remove("row-pending");
      row.classList.add("row-ok");
      row.innerHTML = `✅ ${drink} · готове · ${delayTime} ms`;
    })
    .catch((delayTime) => {
      row.classList.remove("row-pending");
      row.classList.add("row-err");
      row.innerHTML = `❌ ${drink} · скасовано · ${delayTime} ms`;
    })
    .finally(() => {
      const timeString = new Date().toLocaleTimeString("uk-UA");
      row.innerHTML += ` · ${timeString}`;
    });
});

console.log('Шаблон готовий. Можна писати код 🚀');
