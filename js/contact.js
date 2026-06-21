/* =============================================================
   One Way Insurance — contact.js
   Client-side validation + submission scaffold for the contact form.

   >>> TO CONNECT THE BACKEND <<<
   Set FORM_ENDPOINT below to your handler URL (e.g. a Formspree/
   Netlify/own API endpoint). When empty, the form simulates a
   successful submission so you can preview the UX.
   ============================================================= */
(function () {
  "use strict";

  // 1) Paste your endpoint here when ready to go live:
  const FORM_ENDPOINT = ""; // e.g. "https://formspree.io/f/xxxxxx"

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
      setError(field, "Please confirm to continue.");
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
      if (input.closest(".field").classList.contains("has-error")) validateField(input);
    });
  });

  function showStatus(type, message) {
    if (!status) return;
    status.className = "form-status is-" + type;
    status.textContent = message;
    status.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validate all
    let valid = true;
    form.querySelectorAll("input, select, textarea").forEach(function (input) {
      if (!validateField(input)) valid = false;
    });
    if (!valid) {
      showStatus("error", "Please correct the highlighted fields and try again.");
      return;
    }

    const originalLabel = submitBtn ? submitBtn.textContent : "";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }

    const done = function (ok) {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
      if (ok) {
        showStatus(
          "success",
          "Thank you! Your message has been received. A One Way Insurance advisor will contact you shortly."
        );
        form.reset();
      } else {
        showStatus(
          "error",
          "Something went wrong while sending your message. Please call us at (888) 686-5309."
        );
      }
    };

    // No endpoint configured yet → simulate success for preview
    if (!FORM_ENDPOINT) {
      setTimeout(function () { done(true); }, 900);
      return;
    }

    // Real submission
    fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form),
    })
      .then(function (res) { done(res.ok); })
      .catch(function () { done(false); });
  });
})();
