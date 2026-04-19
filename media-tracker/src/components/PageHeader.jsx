import { Search, Plus, SlidersHorizontal } from 'lucide-react'

export default function PageHeader({ title, subtitle, onAdd, addLabel, children }) {
  return (
    <div className="sticky top-0 z-20 bg-[#0f0f1a]/90 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {children}
          {onAdd && (
            <button onClick={onAdd} className="btn-primary flex items-center gap-2 text-sm">
              <Plus size={16} />
              <span className="hidden sm:inline">{addLabel || 'Add'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
