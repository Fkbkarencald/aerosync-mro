import type { ReactNode } from 'react'
import { ChevronDown, Search } from 'lucide-react'

/** Toolbar row for search + filter controls above tables/boards. */
export function FilterBar({ children }: { children: ReactNode }) {
  return <div className="filter-bar">{children}</div>
}

export function FilterSpacer() {
  return <span className="filter-spacer" aria-hidden="true" />
}

interface SearchInputProps {
  placeholder: string
  value?: string
  onChange?: (value: string) => void
  label?: string
  width?: number
}

export function SearchInput({ placeholder, value, onChange, label, width }: SearchInputProps) {
  return (
    <div className="search-input" style={width ? { width } : undefined}>
      <Search size={14} aria-hidden="true" />
      <input
        type="search"
        placeholder={placeholder}
        aria-label={label ?? placeholder}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        readOnly={!onChange}
      />
    </div>
  )
}

interface SelectFilterProps {
  label: string
  options: string[]
  value?: string
  onChange?: (value: string) => void
  /** First option, e.g. "All statuses". */
  allLabel?: string
}

export function SelectFilter({ label, options, value, onChange, allLabel }: SelectFilterProps) {
  return (
    <div className="select-control">
      <select
        aria-label={label}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      >
        {allLabel && <option value="">{allLabel}</option>}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown size={14} aria-hidden="true" />
    </div>
  )
}

interface SegmentedProps {
  options: { label: string; value: string; icon?: ReactNode }[]
  value: string
  onChange: (value: string) => void
  label: string
}

/** Segmented view toggle (e.g. table / board / calendar). */
export function Segmented({ options, value, onChange, label }: SegmentedProps) {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  )
}
