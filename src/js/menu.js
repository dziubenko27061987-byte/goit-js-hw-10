export const PREP_TIME = {
  "Еспресо": 1000,
  "Капучино": 2000,
  "Лате": 3000,
  "Флет-вайт": 4000,
  "Раф": 5000,
};

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

import { PREP_TIME } from "./menu.js";

const form = document.querySelector(".form");
const orderLog = document.querySelector(".order-log");

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