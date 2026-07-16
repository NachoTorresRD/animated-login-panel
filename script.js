"use strict";

(() => {
  const auth = document.querySelector("#auth");
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const panels = [...document.querySelectorAll('[role="tabpanel"]')];
  const forms = [...document.querySelectorAll("form")];
  const toggles = [...document.querySelectorAll("[data-password]")];
  const status = document.querySelector("#form-status");
  const sceneCaption = document.querySelector("#scene-caption");
  const visualKicker = document.querySelector("#visual-kicker");
  const visualTitle = document.querySelector("#visual-title");
  const visualText = document.querySelector("#visual-text");
  const sceneClasses = ["scene-idle", "scene-email", "scene-password", "scene-success", "scene-error"];

  if (!auth || !tabs.length || !panels.length || !status || !sceneCaption || !visualKicker || !visualTitle || !visualText) return;

  const sceneCopy = {
    idle: ["EQUIPO EN ESPERA", "Todo listo para empezar.", "Entra al primer campo y mira quién aparece.", "Esperando correo"],
    email: ["MENSAJERO EN RUTA", "El correo va en camino.", "Cada tecla acerca el mensaje a su destino.", "Entregando correo"],
    password: ["CLAVE PROTEGIDA", "Nadie está mirando.", "El guardián se tapa los ojos mientras escribes.", "Protegiendo clave"],
    success: ["MISIÓN COMPLETA", "¡La cuadrilla lo logró!", "Correo entregado, clave protegida y escena completada.", "Acceso completado"],
    error: ["FALTA UN DETALLE", "La misión sigue abierta.", "Revisa el campo señalado y vuelve a intentarlo.", "Revisa los campos"]
  };

  const setScene = (name, passwordVisible = false) => {
    sceneClasses.forEach(className => auth.classList.remove(className));
    auth.classList.add(`scene-${name}`);
    auth.classList.toggle("password-visible", name === "password" && passwordVisible);
    const copy = sceneCopy[name] || sceneCopy.idle;
    visualKicker.textContent = copy[0];
    visualTitle.textContent = copy[1];
    visualText.textContent = copy[2];
    sceneCaption.textContent = copy[3];
  };

  const replayTypingBeat = () => {
    auth.classList.remove("typing-burst");
    void auth.offsetWidth;
    auth.classList.add("typing-burst");
  };

  const activate = tab => {
    const register = tab.id === "register-tab";
    tabs.forEach(item => {
      const active = item === tab;
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
    });
    panels.forEach(panel => {
      panel.hidden = panel.id !== tab.getAttribute("aria-controls");
    });
    auth.classList.toggle("register-mode", register);
    status.textContent = "";
    setScene("idle");
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activate(tab));
    tab.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === "ArrowRight"
        ? (index + 1) % tabs.length
        : (index - 1 + tabs.length) % tabs.length;
      activate(tabs[next]);
      tabs[next].focus();
    });
  });

  document.querySelectorAll('input[type="email"]').forEach(input => {
    input.addEventListener("focus", () => setScene("email"));
    input.addEventListener("input", () => {
      setScene("email");
      replayTypingBeat();
      input.removeAttribute("aria-invalid");
      const error = document.getElementById(`${input.id}-error`);
      if (error) error.textContent = "";
      status.textContent = "";
    });
  });

  document.querySelectorAll('input[name="password"]').forEach(input => {
    const syncPasswordScene = () => setScene("password", input.type === "text");
    input.addEventListener("focus", syncPasswordScene);
    input.addEventListener("input", () => {
      syncPasswordScene();
      replayTypingBeat();
      input.removeAttribute("aria-invalid");
      const error = document.getElementById(`${input.id}-error`);
      if (error) error.textContent = "";
      status.textContent = "";
    });
  });

  toggles.forEach(toggle => {
    toggle.addEventListener("click", () => {
      const input = document.getElementById(toggle.dataset.password);
      if (!input) return;
      const visible = input.type === "text";
      input.type = visible ? "password" : "text";
      toggle.textContent = visible ? "Mostrar" : "Ocultar";
      toggle.setAttribute("aria-label", visible ? "Mostrar clave" : "Ocultar clave");
      setScene("password", !visible);
      input.focus();
    });
  });

  const message = input => {
    if (input.validity.valueMissing) return "Completa este campo para continuar la escena.";
    if (input.validity.typeMismatch) return "Prueba con un correo válido.";
    if (input.validity.tooShort) return `Usa ${input.minLength} caracteres o más.`;
    return "";
  };

  forms.forEach(form => {
    form.addEventListener("submit", event => {
      event.preventDefault();
      let firstInvalid = null;

      [...form.elements]
        .filter(element => element instanceof HTMLInputElement)
        .forEach(input => {
          const error = document.getElementById(`${input.id}-error`);
          const text = message(input);
          input.setAttribute("aria-invalid", String(Boolean(text)));
          if (error) error.textContent = text;
          if (text && !firstInvalid) firstInvalid = input;
        });

      if (firstInvalid) {
        firstInvalid.focus();
        setScene("error");
        status.textContent = "La cuadrilla necesita que completes los campos señalados.";
        return;
      }

      setScene("success");
      status.textContent = "✓ Escena completada. La cuadrilla celebra contigo.";
      form.querySelector(".submit")?.animate(
        [{ transform: "scale(1)" }, { transform: "scale(.97)" }, { transform: "scale(1)" }],
        { duration: 360, easing: "cubic-bezier(.16,1,.3,1)" }
      );
    });
  });
})();
