import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

interface SelectFieldProps {
  label: string;
  icon: ReactNode;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

export function SelectField({ label, icon, value, options, onChange }: SelectFieldProps) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const selected = Math.max(0, options.findIndex((option) => option.value === value));
  const activeIndex = Math.min(active, options.length - 1);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  useEffect(() => {
    if (open) document.getElementById(`${id}-option-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex, id]);

  function choose(index: number) {
    const option = options[index];
    if (option) onChange(option.value);
    setOpen(false);
    trigger.current?.focus();
  }

  return (
    <div className={`select-field ${open ? "is-open" : ""}`} ref={root}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
      <button ref={trigger} type="button" className="select-trigger" role="combobox"
        aria-labelledby={`${id}-label ${id}-value`} aria-expanded={open}
        aria-controls={`${id}-list`} aria-haspopup="listbox"
        aria-activedescendant={open ? `${id}-option-${activeIndex}` : undefined}
        onClick={() => { setActive(selected); setOpen(!open); }}
        onKeyDown={(event) => {
          if (event.key === "Escape") { event.preventDefault(); setOpen(false); }
          else if (event.key === "Tab") setOpen(false);
          else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
            event.preventDefault();
            setOpen(true);
            setActive(event.key === "Home" ? 0 : event.key === "End" ? options.length - 1
              : !open ? selected : (activeIndex + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length);
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (open) choose(activeIndex);
            else { setActive(selected); setOpen(true); }
          } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
            const index = options.findIndex((option) => option.label.toLocaleLowerCase().startsWith(event.key.toLocaleLowerCase()));
            if (index >= 0) { setActive(index); setOpen(true); }
          }
        }}>
        <span className="select-field-icon" aria-hidden="true">{icon}</span>
        <span className="select-field-copy">
          <span className="field-caption" id={`${id}-label`}>{label}</span>
          <span className="select-field-value" id={`${id}-value`}>{options[selected]?.label}</span>
        </span>
        <ChevronDown size={18} className="select-chevron" aria-hidden="true" />
      </button>
      {open && (
        <ul className="select-menu" id={`${id}-list`} role="listbox" aria-labelledby={`${id}-label`}>
          {options.map((option, index) => (
            <li key={option.value} id={`${id}-option-${index}`} role="option"
              aria-selected={value === option.value}
              className={`select-option ${index === activeIndex ? "is-active" : ""}`}
              onPointerMove={() => setActive(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(index)}>
              <span>{option.label}</span>
              {value === option.value && <Check size={17} aria-hidden="true" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
