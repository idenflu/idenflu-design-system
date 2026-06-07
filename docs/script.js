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
    const use = button.querySelector("use");
    if (use) use.setAttribute("href", isDark ? "icons.svg#icon-sun" : "icons.svg#icon-moon");
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

document.querySelectorAll("[data-select-expanded]").forEach((root) => {
  const trigger = root.querySelector("[data-select-trigger]");
  const valueLabel = root.querySelector("[data-select-value]");
  const panel = root.querySelector("[data-select-panel]");
  const listbox = root.querySelector("[data-select-listbox]");
  const filterInput = root.querySelector("[data-select-filter]");
  const emptyState = root.querySelector("[data-select-empty]");
  const options = Array.from(root.querySelectorAll("[data-select-option]"));

  if (!trigger || !valueLabel || !panel || options.length === 0) {
    return;
  }

  const isMulti = root.hasAttribute("data-multi");
  const isSearchable = root.hasAttribute("data-searchable");
  const placeholder = valueLabel.getAttribute("data-placeholder") || "Select";

  const isDisabledOption = (option) =>
    option.hasAttribute("data-select-disabled") || option.getAttribute("aria-disabled") === "true";

  const optionLabel = (option) =>
    option.getAttribute("data-label") ||
    option.querySelector("[data-select-option-label]")?.textContent.trim() ||
    option.getAttribute("data-value") ||
    "";

  const getVisibleOptions = () => options.filter((option) => !option.hidden && !isDisabledOption(option));
  const getSelectedOptions = () => options.filter((option) => option.getAttribute("aria-selected") === "true");
  const getActiveOption = () => options.find((option) => option.classList.contains("active"));

  const setActiveDescendant = (id) => {
    [trigger, filterInput].forEach((element) => {
      if (!element) return;
      if (id) element.setAttribute("aria-activedescendant", id);
      else element.removeAttribute("aria-activedescendant");
    });
  };

  const clearActiveOption = () => {
    options.forEach((option) => option.classList.remove("active"));
    setActiveDescendant(null);
  };

  const setActiveOption = (option) => {
    if (!option || option.hidden || isDisabledOption(option)) {
      clearActiveOption();
      return;
    }
    options.forEach((item) => item.classList.toggle("active", item === option));
    setActiveDescendant(option.id);
    option.scrollIntoView({ block: "nearest" });
  };

  const updateEmptyState = () => {
    if (emptyState) emptyState.hidden = getVisibleOptions().length > 0;
  };

  const filterOptions = () => {
    const query = (filterInput?.value || "").trim().toLowerCase();
    options.forEach((option) => {
      const matches = !query || optionLabel(option).toLowerCase().includes(query);
      option.hidden = !matches;
    });
    updateEmptyState();
  };

  const renderTrigger = () => {
    const chosen = getSelectedOptions();
    valueLabel.replaceChildren();

    if (chosen.length === 0) {
      valueLabel.classList.add("is-placeholder");
      valueLabel.textContent = placeholder;
      return;
    }

    valueLabel.classList.remove("is-placeholder");

    if (isMulti) {
      const maxChips = 3;
      chosen.slice(0, maxChips).forEach((option) => {
        const label = optionLabel(option);
        const chip = document.createElement("span");
        chip.className = "tag-chip";
        chip.append(label);

        const remove = document.createElement("button");
        remove.type = "button";
        remove.setAttribute("aria-label", `Remove ${label}`);
        remove.textContent = "×";
        remove.addEventListener("click", (event) => {
          event.stopPropagation();
          option.setAttribute("aria-selected", "false");
          renderTrigger();
          trigger.focus();
        });

        chip.append(remove);
        valueLabel.append(chip);
      });

      const overflow = chosen.length - maxChips;
      if (overflow > 0) {
        const more = document.createElement("span");
        more.className = "expanded-select__more";
        more.textContent = `+${overflow}`;
        valueLabel.append(more);
      }
      return;
    }

    const only = chosen[0];
    const icon = only.querySelector("[data-select-option-icon]");
    if (icon) valueLabel.append(icon.cloneNode(true));
    valueLabel.append(optionLabel(only));
  };

  const setExpanded = (expanded) => {
    trigger.setAttribute("aria-expanded", String(expanded));
    panel.hidden = !expanded;
  };

  const openPanel = () => {
    setExpanded(true);
    const current = getSelectedOptions().find((option) => !option.hidden && !isDisabledOption(option));
    setActiveOption(current || getVisibleOptions()[0]);
    if (isSearchable && filterInput) filterInput.focus();
  };

  const closePanel = ({ focusTrigger = true } = {}) => {
    setExpanded(false);
    clearActiveOption();
    if (filterInput) {
      filterInput.value = "";
      filterOptions();
    }
    if (focusTrigger) trigger.focus();
  };

  const selectOption = (option) => {
    if (!option || isDisabledOption(option)) return;

    if (isMulti) {
      const next = option.getAttribute("aria-selected") === "true" ? "false" : "true";
      option.setAttribute("aria-selected", next);
      renderTrigger();
      setActiveOption(option);
      if (isSearchable && filterInput) filterInput.focus();
      else trigger.focus();
      return;
    }

    options.forEach((item) => item.setAttribute("aria-selected", String(item === option)));
    renderTrigger();
    closePanel();
  };

  const moveActiveOption = (direction) => {
    const visible = getVisibleOptions();
    if (visible.length === 0) return;

    const active = getActiveOption();
    const currentIndex = active ? visible.indexOf(active) : -1;
    let nextIndex;

    if (direction === "home") {
      nextIndex = 0;
    } else if (direction === "end") {
      nextIndex = visible.length - 1;
    } else {
      const delta = direction === "down" ? 1 : -1;
      const base = currentIndex === -1 ? (delta === 1 ? -1 : 0) : currentIndex;
      nextIndex = (base + delta + visible.length) % visible.length;
    }

    setActiveOption(visible[nextIndex]);
  };

  const onKeyDown = (event) => {
    const allowSpace = event.currentTarget !== filterInput;
    const isOpen = trigger.getAttribute("aria-expanded") === "true";

    if (!isOpen) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || (allowSpace && event.key === " ")) {
        event.preventDefault();
        openPanel();
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActiveOption("down");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActiveOption("up");
    } else if (event.key === "Home") {
      event.preventDefault();
      moveActiveOption("home");
    } else if (event.key === "End") {
      event.preventDefault();
      moveActiveOption("end");
    } else if (event.key === "Enter" || (allowSpace && event.key === " ")) {
      event.preventDefault();
      selectOption(getActiveOption() || getVisibleOptions()[0]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      closePanel();
    }
  };

  trigger.addEventListener("click", () => {
    if (trigger.getAttribute("aria-expanded") === "true") closePanel();
    else openPanel();
  });

  trigger.addEventListener("keydown", onKeyDown);
  filterInput?.addEventListener("keydown", onKeyDown);

  filterInput?.addEventListener("input", () => {
    setExpanded(true);
    filterOptions();
    setActiveOption(getVisibleOptions()[0]);
  });

  options.forEach((option) => {
    option.addEventListener("click", () => selectOption(option));
    option.addEventListener("mouseenter", () => {
      if (!option.hidden && !isDisabledOption(option)) setActiveOption(option);
    });
  });

  document.addEventListener("mousedown", (event) => {
    if (trigger.getAttribute("aria-expanded") !== "true") return;
    if (!root.contains(event.target)) closePanel({ focusTrigger: false });
  });

  setExpanded(false);
  filterOptions();
  renderTrigger();
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

const DATEPICKER_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Indexed by Date.getDay() (0 = Sunday).
const DATEPICKER_WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const dpPad2 = (value) => String(value).padStart(2, "0");

// Date -> "YYYY-MM-DD" (local).
const dpToISO = (date) => `${date.getFullYear()}-${dpPad2(date.getMonth() + 1)}-${dpPad2(date.getDate())}`;

// "YYYY-MM-DD" -> Date (local midnight) or null. Rejects overflow like "2026-02-30".
const dpParseISO = (iso) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, month, day);
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return null;
  return date;
};

const dpAddDays = (date, count) => {
  const next = new Date(date);
  next.setDate(next.getDate() + count);
  return next;
};

// First day of the month `count` months from `date`.
const dpAddMonths = (date, count) => new Date(date.getFullYear(), date.getMonth() + count, 1);

// 42 dates (6 weeks) covering the month, leading days from `weekStartsOn`.
const dpBuildMonthGrid = (year, month, weekStartsOn) => {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() - weekStartsOn + 7) % 7;
  const start = dpAddDays(first, -offset);
  return Array.from({ length: 42 }, (_, index) => dpAddDays(start, index));
};

// Weekday short labels rotated to `weekStartsOn`.
const dpWeekdayLabels = (weekStartsOn) =>
  Array.from({ length: 7 }, (_, index) => DATEPICKER_WEEKDAYS[(weekStartsOn + index) % 7]);

// ISO date strings compare lexically == chronologically.
const dpIsWithin = (iso, min, max) => (!min || iso >= min) && (!max || iso <= max);

const dpNavButton = (label, icon, onClick) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "datecal__nav";
  button.setAttribute("aria-label", label);
  button.innerHTML = `<svg class="button-icon" aria-hidden="true" focusable="false"><use href="icons.svg#${icon}"></use></svg>`;
  button.addEventListener("click", onClick);
  return button;
};

document.querySelectorAll("[data-datepicker]").forEach((root) => {
  const trigger = root.querySelector("[data-datepicker-trigger]");
  const valueLabel = root.querySelector("[data-datepicker-value]");
  const popover = root.querySelector("[data-datepicker-popover]");

  if (!trigger || !valueLabel || !popover) {
    return;
  }

  const isRange = root.hasAttribute("data-range");
  const weekStartsOn = root.getAttribute("data-week-start") === "1" ? 1 : 0;
  const min = root.getAttribute("data-min") || "";
  const max = root.getAttribute("data-max") || "";
  const placeholder = valueLabel.getAttribute("data-placeholder") || (isRange ? "Select range" : "Select date");
  const todayISO = dpToISO(new Date());

  const viewMatch = /^(\d{4})-(\d{2})$/.exec(root.getAttribute("data-view") || "");
  const initialView = viewMatch
    ? { year: Number(viewMatch[1]), month: Number(viewMatch[2]) - 1 }
    : { year: 2026, month: 5 };

  let view = { ...initialView };
  let single = isRange ? "" : root.getAttribute("data-value") || "";
  let rangeVal = { from: root.getAttribute("data-from") || "", to: root.getAttribute("data-to") || "" };
  let pendingStart = "";
  let hoverISO = "";
  let focusISO = "";
  let dayButtons = {};
  let dayCells = [];

  const isEndpoint = (iso) =>
    isRange ? iso === rangeVal.from || iso === rangeVal.to || iso === pendingStart : iso === single;

  const inRange = (iso) => {
    if (!isRange) return false;
    let lower = "";
    let upper = "";
    if (pendingStart && hoverISO) {
      lower = pendingStart <= hoverISO ? pendingStart : hoverISO;
      upper = pendingStart <= hoverISO ? hoverISO : pendingStart;
    } else if (rangeVal.from && rangeVal.to) {
      lower = rangeVal.from;
      upper = rangeVal.to;
    }
    return Boolean(lower && upper && iso > lower && iso < upper);
  };

  const displayText = () => {
    if (isRange) {
      if (pendingStart) return pendingStart;
      if (rangeVal.from && rangeVal.to) return `${rangeVal.from} ~ ${rangeVal.to}`;
      return null;
    }
    return single || null;
  };

  const renderTrigger = () => {
    const text = displayText();
    if (text) {
      valueLabel.classList.remove("is-placeholder");
      valueLabel.textContent = text;
    } else {
      valueLabel.classList.add("is-placeholder");
      valueLabel.textContent = placeholder;
    }
  };

  const applyDayClasses = () => {
    dayCells.forEach(({ iso, date, button }) => {
      const disabled = !dpIsWithin(iso, min, max);
      const endpoint = isEndpoint(iso);
      button.classList.toggle("is-outside", date.getMonth() !== view.month);
      button.classList.toggle("is-today", iso === todayISO);
      button.classList.toggle("is-in-range", inRange(iso));
      button.classList.toggle("is-selected", endpoint);
      button.classList.toggle("is-disabled", disabled);
      button.setAttribute("aria-selected", String(endpoint));
      if (disabled) button.setAttribute("aria-disabled", "true");
      else button.removeAttribute("aria-disabled");
      button.tabIndex = iso === focusISO ? 0 : -1;
    });
  };

  const goMonth = (delta) => {
    const next = dpAddMonths(new Date(view.year, view.month, 1), delta);
    view = { year: next.getFullYear(), month: next.getMonth() };
    focusISO = dpToISO(new Date(view.year, view.month, 1));
    renderCalendar();
  };

  const focusDay = (iso) => {
    focusISO = iso;
    const date = dpParseISO(iso);
    if (date && (date.getFullYear() !== view.year || date.getMonth() !== view.month)) {
      view = { year: date.getFullYear(), month: date.getMonth() };
      renderCalendar();
    } else {
      applyDayClasses();
    }
    dayButtons[iso]?.focus();
  };

  const selectDay = (iso) => {
    if (!dpIsWithin(iso, min, max)) return;
    if (!isRange) {
      single = iso;
      renderTrigger();
      closePopover();
      return;
    }
    if (!pendingStart) {
      pendingStart = iso;
      hoverISO = "";
      renderTrigger();
      applyDayClasses();
      return;
    }
    if (iso >= pendingStart) {
      rangeVal = { from: pendingStart, to: iso };
      pendingStart = "";
      renderTrigger();
      closePopover();
    } else {
      pendingStart = iso;
      renderTrigger();
      applyDayClasses();
    }
  };

  const onGridKeyDown = (event) => {
    const current = dpParseISO(focusISO) || new Date(view.year, view.month, 1);
    const weekday = (current.getDay() - weekStartsOn + 7) % 7;
    let next = null;

    if (event.key === "ArrowLeft") {
      next = dpAddDays(current, -1);
    } else if (event.key === "ArrowRight") {
      next = dpAddDays(current, 1);
    } else if (event.key === "ArrowUp") {
      next = dpAddDays(current, -7);
    } else if (event.key === "ArrowDown") {
      next = dpAddDays(current, 7);
    } else if (event.key === "Home") {
      next = dpAddDays(current, -weekday);
    } else if (event.key === "End") {
      next = dpAddDays(current, 6 - weekday);
    } else if (event.key === "PageUp") {
      const lastDay = new Date(current.getFullYear(), current.getMonth(), 0).getDate();
      next = new Date(current.getFullYear(), current.getMonth() - 1, Math.min(current.getDate(), lastDay));
    } else if (event.key === "PageDown") {
      const lastDay = new Date(current.getFullYear(), current.getMonth() + 2, 0).getDate();
      next = new Date(current.getFullYear(), current.getMonth() + 1, Math.min(current.getDate(), lastDay));
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectDay(focusISO);
      return;
    } else if (event.key === "Escape") {
      event.preventDefault();
      closePopover();
      return;
    } else {
      return;
    }

    event.preventDefault();
    focusDay(dpToISO(next));
  };

  function renderCalendar() {
    popover.replaceChildren();
    dayButtons = {};
    dayCells = [];

    const header = document.createElement("div");
    header.className = "datecal__header";
    const monthLabel = document.createElement("span");
    monthLabel.className = "datecal__month";
    monthLabel.textContent = `${DATEPICKER_MONTHS[view.month]} ${view.year}`;
    header.append(
      dpNavButton("Previous month", "icon-chevron-left", () => goMonth(-1)),
      monthLabel,
      dpNavButton("Next month", "icon-chevron-right", () => goMonth(1)),
    );

    const weekdays = document.createElement("div");
    weekdays.className = "datecal__weekdays";
    weekdays.setAttribute("aria-hidden", "true");
    dpWeekdayLabels(weekStartsOn).forEach((label) => {
      const cell = document.createElement("span");
      cell.className = "datecal__weekday";
      cell.textContent = label;
      weekdays.append(cell);
    });

    const grid = document.createElement("div");
    grid.className = "datecal__grid";
    grid.setAttribute("role", "grid");
    grid.addEventListener("keydown", onGridKeyDown);

    const days = dpBuildMonthGrid(view.year, view.month, weekStartsOn);
    for (let week = 0; week < 6; week += 1) {
      const row = document.createElement("div");
      row.className = "datecal__row";
      row.setAttribute("role", "row");
      days.slice(week * 7, week * 7 + 7).forEach((date) => {
        const iso = dpToISO(date);
        const button = document.createElement("button");
        button.type = "button";
        button.className = "datecal__day";
        button.setAttribute("role", "gridcell");
        button.setAttribute("aria-label", `${DATEPICKER_MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`);
        button.textContent = String(date.getDate());
        button.addEventListener("click", () => selectDay(iso));
        button.addEventListener("mouseenter", () => {
          if (isRange && pendingStart && dpIsWithin(iso, min, max)) {
            hoverISO = iso;
            applyDayClasses();
          }
        });
        dayButtons[iso] = button;
        dayCells.push({ iso, date, button });
        row.append(button);
      });
      grid.append(row);
    }

    popover.append(header, weekdays, grid);
    applyDayClasses();
  }

  const openPopover = () => {
    trigger.setAttribute("aria-expanded", "true");
    popover.hidden = false;
    const anchorISO = isRange ? rangeVal.from : single;
    const anchor = dpParseISO(anchorISO || "");
    view = anchor ? { year: anchor.getFullYear(), month: anchor.getMonth() } : { ...initialView };
    focusISO = anchor ? anchorISO : dpToISO(new Date(view.year, view.month, 1));
    renderCalendar();
    dayButtons[focusISO]?.focus();
  };

  function closePopover({ focusTrigger = true } = {}) {
    trigger.setAttribute("aria-expanded", "false");
    popover.hidden = true;
    pendingStart = "";
    hoverISO = "";
    renderTrigger();
    if (focusTrigger) trigger.focus();
  }

  trigger.addEventListener("click", () => {
    if (trigger.getAttribute("aria-expanded") === "true") closePopover();
    else openPopover();
  });

  trigger.addEventListener("keydown", (event) => {
    if (trigger.getAttribute("aria-expanded") === "true") return;
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPopover();
    }
  });

  document.addEventListener("mousedown", (event) => {
    if (trigger.getAttribute("aria-expanded") !== "true") return;
    if (!root.contains(event.target)) closePopover({ focusTrigger: false });
  });

  trigger.setAttribute("aria-expanded", "false");
  popover.hidden = true;
  renderTrigger();
});
