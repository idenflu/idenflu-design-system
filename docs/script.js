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
  const listbox = combobox.querySelector("[role='listbox']");
  const options = Array.from(combobox.querySelectorAll("[data-combobox-option]"));
  const emptyState = combobox.querySelector("[data-combobox-empty]");
  const loadingState = combobox.querySelector("[data-combobox-loading]");
  const clearButton = combobox.querySelector("[data-combobox-clear]");

  if (!input || options.length === 0) {
    return;
  }

  const isDisabledOption = (option) =>
    option.hasAttribute("data-combobox-disabled") || option.getAttribute("aria-disabled") === "true";

  const optionValue = (option) => option.getAttribute("data-value") || option.textContent.trim();

  const setExpanded = (expanded) => {
    input.setAttribute("aria-expanded", String(expanded));
    if (listbox) listbox.hidden = !expanded;
  };

  const getVisibleComboboxOptions = () => options.filter((option) => !option.hidden && !isDisabledOption(option));

  const clearActiveOption = () => {
    options.forEach((option) => {
      option.classList.remove("active");
      option.setAttribute("aria-selected", "false");
    });
    input.removeAttribute("aria-activedescendant");
  };

  const setActiveOption = (activeOption, shouldCommit = false) => {
    if (!activeOption || activeOption.hidden || isDisabledOption(activeOption)) {
      clearActiveOption();
      return;
    }

    options.forEach((option) => {
      const active = option === activeOption;
      option.classList.toggle("active", active);
      option.setAttribute("aria-selected", String(active));
    });

    input.setAttribute("aria-activedescendant", activeOption.id);

    if (shouldCommit) {
      input.value = optionValue(activeOption);
      setExpanded(false);
    }
  };

  const updateEmptyState = () => {
    const hasVisibleOptions = getVisibleComboboxOptions().length > 0;
    if (emptyState) emptyState.hidden = hasVisibleOptions;
    if (listbox) listbox.classList.toggle("empty", !hasVisibleOptions);
  };

  const filterComboboxOptions = () => {
    const query = input.value.trim().toLowerCase();

    options.forEach((option) => {
      const matches = !query || optionValue(option).toLowerCase().includes(query);
      option.hidden = !matches;
    });

    const visibleOptions = getVisibleComboboxOptions();
    updateEmptyState();

    if (visibleOptions.length > 0) {
      setActiveOption(visibleOptions[0]);
    } else {
      clearActiveOption();
    }
  };

  const setLoading = (loading) => {
    if (loadingState) loadingState.hidden = !loading;
  };

  const selectedOption = options.find((option) => option.getAttribute("aria-selected") === "true" && !isDisabledOption(option));
  setLoading(false);

  if (combobox.hasAttribute("data-combobox-filter-on-init")) {
    filterComboboxOptions();
  } else {
    updateEmptyState();
    setActiveOption(selectedOption || getVisibleComboboxOptions()[0]);
  }

  setExpanded(input.getAttribute("aria-expanded") === "true");

  input.addEventListener("focus", () => {
    setExpanded(true);
  });

  input.addEventListener("input", () => {
    setExpanded(true);
    setLoading(true);
    filterComboboxOptions();
    setLoading(false);
  });

  input.addEventListener("keydown", (event) => {
    const visibleOptions = getVisibleComboboxOptions();
    const activeOption = visibleOptions.find((option) => option.getAttribute("aria-selected") === "true");
    const activeIndex = Math.max(0, visibleOptions.indexOf(activeOption));
    let nextIndex = activeIndex;

    if (event.key === "ArrowDown") {
      if (!visibleOptions.length) return;
      nextIndex = (activeIndex + 1) % visibleOptions.length;
    } else if (event.key === "ArrowUp") {
      if (!visibleOptions.length) return;
      nextIndex = (activeIndex - 1 + visibleOptions.length) % visibleOptions.length;
    } else if (event.key === "Home") {
      if (!visibleOptions.length) return;
      nextIndex = 0;
    } else if (event.key === "End") {
      if (!visibleOptions.length) return;
      nextIndex = visibleOptions.length - 1;
    } else if (event.key === "Enter") {
      event.preventDefault();
      setActiveOption(activeOption || visibleOptions[0], true);
      return;
    } else if (event.key === "Escape") {
      setExpanded(false);
      input.removeAttribute("aria-activedescendant");
      return;
    } else {
      return;
    }

    event.preventDefault();
    setExpanded(true);
    setActiveOption(visibleOptions[nextIndex]);
  });

  options.forEach((option) => {
    option.addEventListener("click", () => {
      if (isDisabledOption(option)) return;
      setActiveOption(option, true);
      input.focus();
    });
  });

  if (clearButton) {
    clearButton.addEventListener("click", () => {
      input.value = "";
      setExpanded(true);
      filterComboboxOptions();
      input.focus();
    });
  }
});

document.querySelectorAll("[data-select-demo]").forEach((demo) => {
  const select = demo.querySelector("[data-select-input], select");
  const output = demo.querySelector("[data-select-output]");
  const resetButton = demo.querySelector("[data-select-reset]");

  if (!select || !output) {
    return;
  }

  const initialValue = select.value;
  const emptyText = output.getAttribute("data-empty") || output.textContent.trim();

  const updateSelectOutput = () => {
    const selectedOption = select.selectedOptions[0];
    const summary = selectedOption?.getAttribute("data-summary") || selectedOption?.textContent.trim() || emptyText;
    const isEmpty = !select.value;

    output.textContent = isEmpty ? emptyText : summary;
    const invalid = select.required && isEmpty;
    demo.classList.toggle("invalid", invalid);
    select.setAttribute("aria-invalid", String(invalid));
  };

  select.addEventListener("change", updateSelectOutput);

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      select.value = initialValue;
      updateSelectOutput();
      select.focus();
    });
  }

  updateSelectOutput();
});

document.querySelectorAll("[data-disclosure]").forEach((disclosure) => {
  const trigger = disclosure.querySelector("[data-disclosure-trigger]");
  const panel = disclosure.querySelector("[data-disclosure-panel]");

  if (!trigger || !panel) {
    return;
  }

  const setDisclosureState = (expanded) => {
    trigger.setAttribute("aria-expanded", String(expanded));
    panel.hidden = !expanded;
    const actionLabel = trigger.querySelector("strong");
    if (actionLabel) actionLabel.textContent = expanded ? "Hide details" : "Show details";
  };

  setDisclosureState(trigger.getAttribute("aria-expanded") === "true");

  trigger.addEventListener("click", () => {
    setDisclosureState(trigger.getAttribute("aria-expanded") !== "true");
  });
});

document.querySelectorAll("[data-chip-remove]").forEach((button) => {
  button.addEventListener("click", () => {
    const chip = button.closest(".tag-chip");
    if (!chip) return;
    chip.setAttribute("data-removing", "true");
    chip.hidden = true;
  });
});

document.querySelectorAll("[data-pagination-demo]").forEach((demo) => {
  const pageButtons = Array.from(demo.querySelectorAll(".pagination-control button")).filter(
    (button) => /^\d+$/.test(button.textContent.trim()),
  );
  const prevButton = demo.querySelector("[data-pagination-prev]");
  const nextButton = demo.querySelector("[data-pagination-next]");

  if (!pageButtons.length) {
    return;
  }

  const setCurrentPage = (nextIndex) => {
    const boundedIndex = Math.max(0, Math.min(nextIndex, pageButtons.length - 1));

    pageButtons.forEach((button, index) => {
      if (index === boundedIndex) {
        button.setAttribute("aria-current", "page");
      } else {
        button.removeAttribute("aria-current");
      }
    });

    if (prevButton) prevButton.disabled = boundedIndex === 0;
    if (nextButton) nextButton.disabled = boundedIndex === pageButtons.length - 1;
  };

  const currentIndex = Math.max(0, pageButtons.findIndex((button) => button.getAttribute("aria-current") === "page"));
  setCurrentPage(currentIndex);

  pageButtons.forEach((button, index) => {
    button.addEventListener("click", () => setCurrentPage(index));
  });

  prevButton?.addEventListener("click", () => {
    const activeIndex = pageButtons.findIndex((button) => button.getAttribute("aria-current") === "page");
    setCurrentPage(activeIndex - 1);
  });

  nextButton?.addEventListener("click", () => {
    const activeIndex = pageButtons.findIndex((button) => button.getAttribute("aria-current") === "page");
    setCurrentPage(activeIndex + 1);
  });
});

document.querySelectorAll("[data-progress-demo]").forEach((demo) => {
  const progressbar = demo.querySelector("[role='progressbar']");
  if (!progressbar) return;

  const value = Number(progressbar.getAttribute("aria-valuenow") || 0);
  const fill = progressbar.querySelector("span");
  if (fill) fill.style.width = `${Math.max(0, Math.min(value, 100))}%`;
});

document.querySelectorAll("[data-toast-demo]").forEach((demo) => {
  const stack = demo.querySelector(".toast-stack");
  const trigger = demo.querySelector("[data-toast-trigger]");

  const bindDismiss = (toast) => {
    toast.querySelector("[data-toast-dismiss]")?.addEventListener("click", () => {
      toast.hidden = true;
    });
  };

  demo.querySelectorAll(".toast-item").forEach(bindDismiss);

  if (!stack || !trigger) {
    return;
  }

  trigger.addEventListener("click", () => {
    const toast = document.createElement("article");
    toast.className = "toast-item success";
    toast.innerHTML = `
      <strong>Update complete</strong>
      <p>${trigger.getAttribute("data-toast-message") || "Changes saved."}</p>
      <button class="button ghost small" type="button">Undo</button>
      <button class="icon-button small ghost" type="button" aria-label="Dismiss toast" data-toast-dismiss>×</button>
    `;
    stack.prepend(toast);
    bindDismiss(toast);
  });
});
