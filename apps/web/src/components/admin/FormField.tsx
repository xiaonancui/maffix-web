import { ReactNode, useId } from 'react'

interface FormFieldProps {
  label: string
  name?: string
  type?: 'text' | 'email' | 'number' | 'password' | 'textarea' | 'select' | 'date' | 'datetime-local'
  value: string | number
  onChange: (value: any) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  help?: string
  helpText?: string
  options?: { label: string; value: string | number }[]
  rows?: number
  min?: number
  max?: number
  step?: number
  icon?: ReactNode
}

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  help,
  helpText,
  options,
  rows = 4,
  min,
  max,
  step,
  icon,
}: FormFieldProps) {
  const reactId = useId()
  const sanitizedLabel = label
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
  const fieldId = name || `${sanitizedLabel}-${reactId}`
  const helpMessage = help ?? helpText

  const baseInputClasses = `w-full rounded-lg bg-[#1a1a1a] border ${
    error ? 'border-red-500' : 'border-red-500/20'
  } px-4 py-2 text-white placeholder-gray-500 focus:border-red-500/40 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all`

  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <textarea
          id={fieldId}
          name={fieldId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          className={baseInputClasses}
        />
      )
    }

    if (type === 'select' && options) {
      const normalizedValue = value === undefined || value === null ? '' : String(value)

      return (
        <select
          id={fieldId}
          name={fieldId}
          value={normalizedValue}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
          className={baseInputClasses}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={String(option.value)}>
              {option.label}
            </option>
          ))}
        </select>
      )
    }

    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {icon}
          </div>
        )}
        <input
          id={fieldId}
          name={fieldId}
          type={type}
          value={value}
          onChange={(e) => {
            const rawValue = e.target.value
            if (type === 'number') {
              // Preserve empty input instead of forcing 0
              onChange(rawValue === '' ? '' : Number(rawValue))
            } else {
              onChange(rawValue)
            }
          }}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className={`${baseInputClasses} ${icon ? 'pl-10' : ''}`}
        />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <label htmlFor={fieldId} className="block text-sm font-semibold text-white">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {renderInput()}
      {helpMessage && !error && <p className="text-xs text-gray-400">{helpMessage}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
