const signupForm = document.getElementById("signup-form");
const formSteps = [...document.querySelectorAll(".form-step")];
const indicators = [...document.querySelectorAll("[data-step-indicator]")];
const planOptions = [...document.querySelectorAll(".plan-option")];
const passwordInput = signupForm.elements.password;
const passwordToggle = document.querySelector(".password-toggle");
const successState = document.querySelector(".success-state");

const plans = {
  starter: {
    name: "Inicial",
    price: 10,
  },
  professional: {
    name: "Profesional",
    price: 30,
  },
  business: {
    name: "Empresa",
    price: 100,
  },
};

let currentStep = 1;

function getSelectedPlan() {
  const selected = signupForm.elements.plan.value;
  return plans[selected] || plans.professional;
}

function setStep(nextStep) {
  currentStep = nextStep;

  formSteps.forEach((step) => {
    step.classList.toggle("active", Number(step.dataset.step) === currentStep);
  });

  indicators.forEach((indicator) => {
    const indicatorStep = Number(indicator.dataset.stepIndicator);
    indicator.classList.toggle("active", indicatorStep === currentStep);
    indicator.classList.toggle("completed", indicatorStep < currentStep);

    if (indicatorStep === currentStep) {
      indicator.setAttribute("aria-current", "step");
    } else {
      indicator.removeAttribute("aria-current");
    }

    if (indicatorStep < currentStep) {
      indicator.querySelector("span").textContent = "✓";
    } else {
      indicator.querySelector("span").textContent = indicatorStep;
    }
  });

  if (currentStep === 3) {
    updateReview();
  }

  document
    .querySelector(".form-card")
    .scrollIntoView({ behavior: "smooth", block: "start" });
}

function validateFirstStep() {
  const fields = formSteps[0].querySelectorAll("input[required]");
  let isValid = true;

  fields.forEach((field) => {
    const fieldIsValid = field.checkValidity();
    field.classList.toggle("invalid", !fieldIsValid);
    isValid = fieldIsValid && isValid;
  });

  if (!isValid) {
    const firstInvalid = formSteps[0].querySelector(".invalid");
    firstInvalid?.focus();
  }

  return isValid;
}

function updatePlanSelection() {
  planOptions.forEach((option) => {
    option.classList.toggle("selected", option.querySelector("input").checked);
  });

  const plan = getSelectedPlan();
  document.querySelector("[data-summary-plan]").textContent = plan.name;
  document.querySelector("[data-summary-price]").innerHTML =
    `$${plan.price}<small>/mes</small>`;
}

function updateReview() {
  const formData = new FormData(signupForm);
  const plan = getSelectedPlan();

  document.querySelector("[data-review='empresa']").textContent =
    formData.get("empresa") || "—";
  document.querySelector("[data-review='nombre']").textContent =
    `${formData.get("nombre") || ""} ${formData.get("apellido") || ""}`.trim() ||
    "—";
  document.querySelector("[data-review='correo']").textContent =
    formData.get("correo") || "—";
  document.querySelector("[data-review='plan']").textContent =
    `${plan.name} · $${plan.price}/mes`;
}

function setTrialEndDate() {
  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + 10);

  document.querySelector("[data-trial-end]").textContent =
    new Intl.DateTimeFormat("es-BO", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(trialEnd);
}

document.querySelectorAll(".next-button").forEach((button) => {
  button.addEventListener("click", () => {
    if (currentStep === 1 && !validateFirstStep()) {
      return;
    }

    setStep(Math.min(currentStep + 1, 3));
  });
});

document.querySelectorAll(".back-button").forEach((button) => {
  button.addEventListener("click", () => {
    setStep(Math.max(currentStep - 1, 1));
  });
});

signupForm
  .querySelectorAll("input:not([type='radio']):not([type='checkbox'])")
  .forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("invalid");
    });
  });

planOptions.forEach((option) => {
  option.querySelector("input").addEventListener("change", updatePlanSelection);
});

passwordToggle.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  passwordToggle.textContent = isPassword ? "Ocultar" : "Ver";
  passwordToggle.setAttribute(
    "aria-label",
    isPassword ? "Ocultar contraseña" : "Mostrar contraseña",
  );
});

signupForm.elements.terms.addEventListener("change", () => {
  document
    .querySelector(".terms-error")
    .classList.toggle("visible", !signupForm.elements.terms.checked);
});

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!signupForm.elements.terms.checked) {
    document.querySelector(".terms-error").classList.add("visible");
    signupForm.elements.terms.focus();
    return;
  }

  const plan = getSelectedPlan();
  const company = signupForm.elements.empresa.value.trim();

  document.querySelector("[data-success-company]").textContent = company;
  document.querySelector("[data-success-plan]").textContent =
    `${plan.name} · $${plan.price}/mes después de la prueba`;

  signupForm.hidden = true;
  document.querySelector(".stepper").hidden = true;
  successState.hidden = false;
  successState.focus();
});

setTrialEndDate();
updatePlanSelection();
