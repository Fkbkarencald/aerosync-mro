import type { ReactNode } from 'react'
import { CircleAlert, ImageUp } from 'lucide-react'

/**
 * Shared form primitives. Most design-preview forms use uncontrolled
 * defaults; the interactive V1 workflow opts into controlled checks
 * where transition confirmation must be enforced.
 */

export function FormCard({ children }: { children: ReactNode }) {
  return <section className="card">{children}</section>
}

export function FormSection({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: ReactNode
}) {
  return (
    <>
      <div className="form-section-head">
        <h2>{title}</h2>
        {hint && <p>{hint}</p>}
      </div>
      <div className="form-grid">{children}</div>
    </>
  )
}

interface FieldShellProps {
  label: string
  htmlFor: string
  required?: boolean
  hint?: string
  error?: string
  full?: boolean
  children: ReactNode
}

export function FieldShell({ label, htmlFor, required, hint, error, full, children }: FieldShellProps) {
  return (
    <div className={`field${full ? ' field--full' : ''}${error ? ' field--error' : ''}`}>
      <label htmlFor={htmlFor}>
        {label}
        {required && (
          <span className="req" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <span className="field-error">
          <CircleAlert size={13} aria-hidden="true" />
          {error}
        </span>
      ) : (
        hint && <span className="field-hint">{hint}</span>
      )}
    </div>
  )
}

interface TextFieldProps {
  id: string
  label: string
  defaultValue?: string
  placeholder?: string
  required?: boolean
  hint?: string
  error?: string
  full?: boolean
  type?: string
}

export function TextField({ id, label, defaultValue, placeholder, required, hint, error, full, type }: TextFieldProps) {
  return (
    <FieldShell label={label} htmlFor={id} required={required} hint={hint} error={error} full={full}>
      <input
        id={id}
        className="input"
        type={type ?? 'text'}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </FieldShell>
  )
}

interface SelectFieldProps {
  id: string
  label: string
  options: string[]
  defaultValue?: string
  required?: boolean
  hint?: string
  full?: boolean
  placeholder?: string
}

export function SelectField({ id, label, options, defaultValue, required, hint, full, placeholder }: SelectFieldProps) {
  return (
    <FieldShell label={label} htmlFor={id} required={required} hint={hint} full={full}>
      <select id={id} defaultValue={defaultValue ?? (placeholder ? '' : undefined)}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}

interface TextAreaFieldProps {
  id: string
  label: string
  defaultValue?: string
  placeholder?: string
  required?: boolean
  hint?: string
  full?: boolean
  rows?: number
}

export function TextAreaField({ id, label, defaultValue, placeholder, required, hint, full, rows }: TextAreaFieldProps) {
  return (
    <FieldShell label={label} htmlFor={id} required={required} hint={hint} full={full}>
      <textarea id={id} defaultValue={defaultValue} placeholder={placeholder} rows={rows ?? 4} />
    </FieldShell>
  )
}

export function CheckRow({
  id,
  label,
  defaultChecked,
  checked,
  onChange,
  disabled,
  type,
}: {
  id: string
  label: ReactNode
  defaultChecked?: boolean
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  type?: 'checkbox' | 'radio'
}) {
  return (
    <div className="check-row">
      <input
        id={id}
        type={type ?? 'checkbox'}
        defaultChecked={checked === undefined ? defaultChecked : undefined}
        checked={checked}
        disabled={disabled}
        onChange={onChange ? (event) => onChange(event.target.checked) : undefined}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  )
}

export function FormFooter({ note, children }: { note?: string; children: ReactNode }) {
  return (
    <div className="form-footer">
      {note && <span className="form-footer-note">{note}</span>}
      {children}
    </div>
  )
}

/** Visual photo/document dropzone (uploads are not implemented). */
export function AttachmentDropzone({ hint }: { hint?: string }) {
  return (
    <div className="dropzone">
      <ImageUp size={22} aria-hidden="true" />
      <span>
        Drag photos here or <strong>browse files</strong>
      </span>
      <span style={{ fontSize: 'var(--fs-sm)' }}>{hint ?? 'JPEG or PDF up to 10 MB — visual preview only, files are not uploaded'}</span>
    </div>
  )
}
