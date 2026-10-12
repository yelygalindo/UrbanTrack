const config = window.URBANTRACK_CONFIG;
const signupForm = document.getElementById("signup-form");
const formSteps = [...document.querySelectorAll(".form-step")];
const indicators = [...document.querySelectorAll("[data-step-indicator]")];
const choiceOptions = [...document.querySelectorAll(".choice-option")];
const successState = document.querySelector(".success-state");
const submitButton = signupForm.querySelector(".submit-button");
const submitError = signupForm.querySelector(".submit-error");

const teamSizes = {
  "1-5": "1 a 5 personas",
  "6-20": "6 a 20 personas",
  "21-50": "21 a 50 personas",
  "50+": "Más de 50 personas",
};

let currentStep = 1;

function getTeamSize() {
  return teamSizes[signupForm.elements.equipo.value] || "No indicado";
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

    indicator.querySelector("span").textContent =
      indicatorStep < currentStep ? "✓" : indicatorStep;
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
    field.value = field.value.trim();
    const fieldIsValid = field.checkValidity();
    field.classList.toggle("invalid", !fieldIsValid);
    isValid = fieldIsValid && isValid;
  });

  if (!isValid) {
    formSteps[0].querySelector(".invalid")?.focus();
  }

  return isValid;
}

function updateChoiceSelection() {
  choiceOptions.forEach((option) => {
    option.classList.toggle("selected", option.querySelector("input").checked);
  });
}

function updateReview() {
  const formData = new FormData(signupForm);

  document.querySelector("[data-review='empresa']").textContent =
    formData.get("empresa") || "—";
  document.querySelector("[data-review='nombre']").textContent =
    `${formData.get("nombre") || ""} ${formData.get("apellido") || ""}`.trim() ||
    "—";
  document.querySelector("[data-review='correo']").textContent =
    formData.get("correo") || "—";
  document.querySelector("[data-review='equipo']").textContent = getTeamSize();
}

function setTrialEndDate() {
  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + config.trialDays);

  document.querySelector("[data-trial-end]").textContent =
    new Intl.DateTimeFormat("es-BO", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(trialEnd);
}

function getSignupData() {
  const formData = new FormData(signupForm);

  return {
    firstName: formData.get("nombre"),
    lastName: formData.get("apellido"),
    email: formData.get("correo"),
    company: formData.get("empresa"),
    phone: formData.get("telefono"),
    teamSize: formData.get("equipo"),
    message: formData.get("mensaje")?.trim() || "",
    trialDays: config.trialDays,
    acceptedTerms: true,
  };
}

// Crea la cuenta en la API. Devuelve la respuesta del backend, que puede
// incluir `onboardingUrl` para llevar al usuario directo a la aplicación.
async function createTrialAccount(data) {
  const response = await fetch(config.signupApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "No se pudo crear la cuenta");
  }

  return result;
}

// Mientras no exista la API, el registro llega al equipo por correo para que
// active la cuenta manualmente.
async function sendSignupToTeam(data) {
  await window.sendLead(`Nuevo registro de prueba · ${data.company}`, {
    Nombre: `${data.firstName} ${data.lastName}`,
    Correo: data.email,
    Empresa: data.company,
    Teléfono: data.phone,
    "Tamaño del equipo": getTeamSize(),
    Mensaje: data.message || "Sin mensaje adicional",
    "Prueba solicitada": `${data.trialDays} días`,
    _replyto: data.email,
  });
  return {};
}

function showSuccess(data, result) {
  document.querySelector("[data-success-title]").textContent =
    `¡Bienvenido, ${data.firstName}!`;

  if (config.signupApiUrl) {
    document.querySelector("[data-success-message]").textContent =
      `Tu prueba de ${data.trialDays} días ya comenzó. Te enviamos un correo a ${data.email} para verificar tu cuenta y crear tu contraseña.`;
    document.querySelector("[data-success-step-one]").textContent =
      "Verifica tu correo y crea tu contraseña.";
  } else {
    document.querySelector("[data-success-message]").textContent =
      `Recibimos el registro de ${data.company}. Activaremos tu espacio y te escribiremos a ${data.email} en menos de un día hábil.`;
  }

  if (result.onboardingUrl) {
    const action = document.querySelector("[data-success-action]");
    action.href = result.onboardingUrl;
    action.textContent = "Ir a UrbanTrack";
  }

  signupForm.hidden = true;
  document.querySelector(".stepper").hidden = true;
  successState.hidden = false;
  successState.focus();
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

choiceOptions.forEach((option) => {
  option
    .querySelector("input")
    .addEventListener("change", updateChoiceSelection);
});

signupForm.elements.terms.addEventListener("change", () => {
  document
    .querySelector(".terms-error")
    .classList.toggle("visible", !signupForm.elements.terms.checked);
});

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!signupForm.elements.terms.checked) {
    document.querySelector(".terms-error").classList.add("visible");
    signupForm.elements.terms.focus();
    return;
  }

  // Los bots suelen completar el campo oculto; las personas no lo ven.
  if (signupForm.elements._honey.value) {
    return;
  }

  const data = getSignupData();
  submitButton.disabled = true;
  submitButton.textContent = "Enviando…";
  submitError.hidden = true;

  try {
    const result = config.signupApiUrl
      ? await createTrialAccount(data)
      : await sendSignupToTeam(data);
    showSuccess(data, result);
  } catch {
    submitError.innerHTML = `No pudimos completar tu registro. Inténtalo de nuevo o escríbenos a <a href="mailto:${config.contactEmail}">${config.contactEmail}</a>.`;
    submitError.hidden = false;
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = `Comenzar mi prueba de ${config.trialDays} días`;
  }
});

setTrialEndDate();
updateChoiceSelection();
