/* =============================================================
   One Way Insurance — contact.js
   Client-side visual validation for the contact form.

   The form submits natively to FormSubmit (see the <form action>
   in contact.html). This script ONLY validates: if a field is
   invalid it blocks the submit and highlights it; once everything
   is valid it lets the browser submit the form to FormSubmit,
   which then redirects to thank-you.html (via the _next field).
   No backend / PHP needed — fully GitHub Pages compatible.
   ============================================================= */
(function () {
  "use strict";

  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = form.querySelector(".form-status");
  const submitBtn = form.querySelector('[type="submit"]');

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRe = /^[\d\s()+.-]{7,}$/;

  function setError(field, message) {
    field.classList.add("has-error");
    const msg = field.querySelector(".error-msg");
    if (msg && message) msg.textContent = message;
  }
  function clearError(field) {
    field.classList.remove("has-error");
  }

  function validateField(input) {
    const field = input.closest(".field");
    if (!field) return true;
    const value = input.value.trim();

    if (input.hasAttribute("required") && !value && input.type !== "checkbox") {
      setError(field, "This field is required.");
      return false;
    }
    if (input.type === "checkbox" && input.hasAttribute("required") && !input.checked) {
      setError(field, "You must accept the terms to send the form.");
      return false;
    }
    if (input.type === "email" && value && !emailRe.test(value)) {
      setError(field, "Please enter a valid email address.");
      return false;
    }
    if (input.type === "tel" && value && !phoneRe.test(value)) {
      setError(field, "Please enter a valid phone number.");
      return false;
    }
    clearError(field);
    return true;
  }

  // Live validation on blur / change
  form.querySelectorAll("input, select, textarea").forEach(function (input) {
    input.addEventListener("blur", function () { validateField(input); });
    input.addEventListener("input", function () {
      const field = input.closest(".field");
      if (field && field.classList.contains("has-error")) validateField(input);
    });
  });

  function showStatus(type, message) {
    if (!status) return;
    status.className = "form-status is-" + type;
    status.textContent = message;
    status.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  form.addEventListener("submit", function (e) {
    // Validate every field first
    let valid = true;
    form.querySelectorAll("input, select, textarea").forEach(function (input) {
      if (!validateField(input)) valid = false;
    });

    if (!valid) {
      // Block the native submit ONLY when something is invalid
      e.preventDefault();
      showStatus("error", "Please correct the highlighted fields and try again.");
      return;
    }

    // Valid → let the form submit normally to FormSubmit (no preventDefault).
    showStatus("success", "Sending your message…");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }
  });
})();
