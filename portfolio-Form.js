
const resetButton = document.getElementById("reset-button");
const submitButton = document.getElementById("submit-button");
const message = document.getElementById("message");
const email = document.getElementById("inputEmail4");
const textmessage = document.getElementById("floatingTextarea2");

submitButton.addEventListener("click", function(event) {
    event.preventDefault();
    if (email.reportValidity() && textmessage.reportValidity()) {
      message.innerHTML = "Message received, Thank you";
      message.classList.remove("d-none");
    }
});
  
resetButton.addEventListener("click", function() {
    message.classList.add("d-none");
  });
  
  window.addEventListener("beforeunload", function () {
      message.classList.add("d-none");
  });