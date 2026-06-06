const THEME_STORAGE_KEY = "idenflu-theme";
const root = document.documentElement;
const themeButtons = document.querySelectorAll("[data-theme-toggle]");

const getSavedTheme = () => {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
};

const saveTheme = (theme) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* localStorage can be unavailable in strict browser contexts. */
  }
};

const applyTheme = (theme) => {
  const activeTheme = theme === "dark" ? "dark" : "light";

  root.dataset.theme = activeTheme;
  themeButtons.forEach((button) => {
    const isDark = activeTheme === "dark";
    button.textContent = isDark ? "Light" : "Dark";
    button.setAttribute("aria-pressed", String(isDark));
    button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  });
};

applyTheme(getSavedTheme() || "light");

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    saveTheme(nextTheme);
  });
});

document.querySelectorAll("[data-tabs]").forEach((tabs) => {
  const buttons = Array.from(tabs.querySelectorAll("[data-tab]"));
  const panels = Array.from(tabs.querySelectorAll("[data-panel]"));

  const activateTab = (button, shouldFocus = false) => {
    const target = button.getAttribute("data-tab");

    buttons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-selected", String(selected));
      item.setAttribute("tabindex", selected ? "0" : "-1");
    });

    panels.forEach((panel) => {
      const active = panel.getAttribute("data-panel") === target;
      panel.classList.toggle("active", active);
      panel.hidden = !active;
    });

    if (shouldFocus) {
      button.focus();
    }
  };

  const initialTab = buttons.find((button) => button.getAttribute("aria-selected") === "true") || buttons[0];

  if (initialTab) {
    activateTab(initialTab);
  }

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => activateTab(button));

    button.addEventListener("keydown", (event) => {
      const nextKeys = ["ArrowRight", "ArrowDown"];
      const previousKeys = ["ArrowLeft", "ArrowUp"];
      let nextIndex = index;

      if (nextKeys.includes(event.key)) {
        nextIndex = (index + 1) % buttons.length;
      } else if (previousKeys.includes(event.key)) {
        nextIndex = (index - 1 + buttons.length) % buttons.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = buttons.length - 1;
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activateTab(button);
        return;
      } else {
        return;
      }

      event.preventDefault();
      activateTab(buttons[nextIndex], true);
    });
  });
});

document.querySelectorAll("[data-menu]").forEach((menu) => {
  const items = Array.from(menu.querySelectorAll('[role="menuitem"]'));

  const focusItem = (index) => {
    items.forEach((item, itemIndex) => {
      item.setAttribute("tabindex", itemIndex === index ? "0" : "-1");
    });
    items[index]?.focus();
  };

  items.forEach((item, index) => {
    item.addEventListener("keydown", (event) => {
      let nextIndex = index;

      if (event.key === "ArrowDown") {
        nextIndex = (index + 1) % items.length;
      } else if (event.key === "ArrowUp") {
        nextIndex = (index - 1 + items.length) % items.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = items.length - 1;
      } else if (event.key === "Escape") {
        event.preventDefault();
        item.blur();
        return;
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        item.click();
        return;
      } else {
        return;
      }

      event.preventDefault();
      focusItem(nextIndex);
    });
  });
});

document.querySelectorAll("[data-overlay-open]").forEach((trigger) => {
  const overlayId = trigger.getAttribute("data-overlay-open");
  const overlay = overlayId ? document.getElementById(overlayId) : null;

  if (!overlay) {
    return;
  }

  const closeButtons = Array.from(overlay.querySelectorAll("[data-overlay-close]"));
  const backdrop = document.querySelector(`[data-overlay-backdrop="${overlayId}"]`);
  let restoreTarget = trigger;

  const getFocusableElements = () =>
    Array.from(
      overlay.querySelectorAll(
        "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
      ),
    ).filter((element) => !element.hidden && element.getClientRects().length > 0);

  const getFocusTarget = () => getFocusableElements()[0];

  const trapOverlayFocus = (event) => {
    if (event.key !== "Tab" || overlay.getAttribute("aria-modal") !== "true") {
      return;
    }

    const focusableElements = getFocusableElements();
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!firstElement || !lastElement) {
      event.preventDefault();
      return;
    }

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  const closeOverlay = () => {
    overlay.hidden = true;
    if (backdrop) {
      backdrop.hidden = true;
    }
    trigger.setAttribute("aria-expanded", "false");
    restoreTarget?.focus();
  };

  trigger.addEventListener("click", () => {
    restoreTarget = trigger;
    overlay.hidden = false;
    if (backdrop) {
      backdrop.hidden = false;
    }
    trigger.setAttribute("aria-expanded", "true");
    getFocusTarget()?.focus();
  });

  overlay.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeOverlay();
      return;
    }

    trapOverlayFocus(event);
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeOverlay);
  });

  backdrop?.addEventListener("click", closeOverlay);
});

document.querySelectorAll("[data-keyboard-table]").forEach((table) => {
  const rows = Array.from(table.querySelectorAll("[data-row-focus]"));

  if (rows.length === 0) {
    return;
  }

  const moveTableFocus = (currentIndex, nextIndex) => {
    const targetIndex = Math.max(0, Math.min(nextIndex, rows.length - 1));

    rows.forEach((row, rowIndex) => {
      row.setAttribute("tabindex", rowIndex === targetIndex ? "0" : "-1");
    });

    rows[targetIndex]?.focus();
  };

  rows.forEach((row, index) => {
    row.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveTableFocus(index, index + 1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        moveTableFocus(index, index - 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        moveTableFocus(index, 0);
      } else if (event.key === "End") {
        event.preventDefault();
        moveTableFocus(index, rows.length - 1);
      }
    });
  });
});

document.querySelectorAll("[data-combobox]").forEach((combobox) => {
  const input = combobox.querySelector("[data-combobox-input]");
  const options = Array.from(combobox.querySelectorAll("[data-combobox-option]"));

  if (!input || options.length === 0) {
    return;
  }

  const setActiveOption = (index, shouldCommit = false) => {
    const activeOption = options[index];

    options.forEach((option, optionIndex) => {
      const active = optionIndex === index;
      option.classList.toggle("active", active);
      option.setAttribute("aria-selected", String(active));
    });

    if (!activeOption) {
      input.removeAttribute("aria-activedescendant");
      return;
    }

    input.setAttribute("aria-activedescendant", activeOption.id);

    if (shouldCommit) {
      input.value = activeOption.getAttribute("data-value") || activeOption.textContent.trim();
      input.setAttribute("aria-expanded", "false");
    }
  };

  setActiveOption(0);

  input.addEventListener("focus", () => {
    input.setAttribute("aria-expanded", "true");
  });

  input.addEventListener("input", () => {
    input.setAttribute("aria-expanded", "true");
  });

  input.addEventListener("keydown", (event) => {
    const activeIndex = Math.max(
      0,
      options.findIndex((option) => option.getAttribute("aria-selected") === "true"),
    );
    let nextIndex = activeIndex;

    if (event.key === "ArrowDown") {
      nextIndex = (activeIndex + 1) % options.length;
    } else if (event.key === "ArrowUp") {
      nextIndex = (activeIndex - 1 + options.length) % options.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = options.length - 1;
    } else if (event.key === "Enter") {
      event.preventDefault();
      setActiveOption(activeIndex, true);
      return;
    } else if (event.key === "Escape") {
      input.setAttribute("aria-expanded", "false");
      input.removeAttribute("aria-activedescendant");
      return;
    } else {
      return;
    }

    event.preventDefault();
    input.setAttribute("aria-expanded", "true");
    setActiveOption(nextIndex);
  });

  options.forEach((option, index) => {
    option.addEventListener("click", () => {
      setActiveOption(index, true);
      input.focus();
    });
  });
});
