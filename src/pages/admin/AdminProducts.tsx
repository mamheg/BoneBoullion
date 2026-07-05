import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, Plus, Trash2, Upload, X } from 'lucide-react'
import { adminApi, type AdminProduct } from '@/services/adminApi'
import { formatPrice } from '@/brand/config'
import { Button } from '@/components/ui/Button'

const input = 'h-10 w-full rounded-lg border border-line bg-white px-3 text-sm focus:border-brand-300 focus:outline-none'
const label = 'mb-1 block text-xs font-medium text-ink-muted'
const BADGES = ['hit', 'new', 'sale']

type Draft = Partial<AdminProduct>

export function AdminProducts() {
  const qc = useQueryClient()
  const { data: products = [], isLoading } = useQuery({ queryKey: ['admin-products'], queryFn: () => adminApi.listProducts() })
  const { data: categories = [] } = useQuery({ queryKey: ['admin-categories'], queryFn: () => adminApi.listCategories() })
  const [editing, setEditing] = useState<Draft | null>(null)

  const refresh = () => qc.invalidateQueries({ queryKey: ['admin-products'] })
  const del = useMutation({ mutationFn: (id: number) => adminApi.deleteProduct(id), onSuccess: refresh })

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Товары</h1>
        <Button size="sm" onClick={() => setEditing({ badges: [], inStock: true, isActive: true, categoryId: categories[0]?.id })}>
          <Plus className="size-4" /> Добавить
        </Button>
      </div>

      <div className="mt-5 overflow-hidden rounded-card bg-card ring-1 ring-line/60">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-left text-xs text-ink-muted">
            <tr>
              <th className="px-4 py-2.5">Товар</th><th className="px-4 py-2.5">Категория</th>
              <th className="px-4 py-2.5">Цена</th><th className="px-4 py-2.5">Активен</th><th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {isLoading && <tr><td className="px-4 py-4 text-ink-muted" colSpan={5}>Загрузка…</td></tr>}
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-medium">{p.name}<span className="ml-2 text-xs text-ink-muted">{p.slug}</span></td>
                <td className="px-4 py-3 text-ink-muted">{p.categoryId}</td>
                <td className="px-4 py-3 tnum">{formatPrice(p.price)}</td>
                <td className="px-4 py-3">{p.isActive ? '✅' : '—'}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(p)} className="mr-2 rounded p-1 hover:text-brand-700"><Pencil className="size-4" /></button>
                  <button onClick={() => confirm(`Удалить «${p.name}»?`) && del.mutate(p.id)} className="rounded p-1 hover:text-danger"><Trash2 className="size-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <ProductModal draft={editing} categories={categories} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); refresh() }} />
      )}
    </div>
  )
}

function ProductModal({ draft, categories, onClose, onSaved }: {
  draft: Draft
  categories: { id: string; name: string }[]
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState<Draft>(draft)
  const [error, setError] = useState('')
  const isEdit = typeof draft.id === 'number'
  const set = (k: keyof AdminProduct, v: unknown) => setForm((f) => ({ ...f, [k]: v }))

  const save = useMutation({
    mutationFn: async () => {
      const body = {
        slug: form.slug, name: form.name, description: form.description ?? '',
        price: Number(form.price), oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        volume: form.volume ?? '', accent: form.accent ?? null, categoryId: form.categoryId,
        badges: form.badges ?? [], inStock: form.inStock ?? true, isActive: form.isActive ?? true,
        composition: form.composition ?? null, nutrition: form.nutrition ?? null, sortOrder: form.sortOrder ?? 0,
      }
      if (isEdit) await adminApi.updateProduct(draft.id!, body)
      else await adminApi.createProduct(body)
    },
    onSuccess: onSaved,
    onError: (e) => setError((e as Error).message),
  })

  const upload = useMutation({
    mutationFn: (file: File) => adminApi.uploadImage(draft.id!, file),
    onSuccess: (img) => set('images', [...(form.images ?? []), img]),
  })

  const submit = (e: FormEvent) => { e.preventDefault(); setError(''); save.mutate() }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm">
      <form onSubmit={submit} className="my-8 w-full max-w-lg rounded-card-lg bg-card p-6 shadow-pop">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">{isEdit ? 'Редактировать' : 'Новый товар'}</h2>
          <button type="button" onClick={onClose}><X className="size-5 text-ink-muted" /></button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="col-span-2"><label className={label}>Название</label><input className={input} value={form.name ?? ''} onChange={(e) => set('name', e.target.value)} required /></div>
          <div><label className={label}>slug</label><input className={input} value={form.slug ?? ''} onChange={(e) => set('slug', e.target.value)} required /></div>
          <div><label className={label}>Категория</label>
            <select className={input} value={form.categoryId ?? ''} onChange={(e) => set('categoryId', e.target.value)}>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div><label className={label}>Цена</label><input type="number" className={input} value={form.price ?? ''} onChange={(e) => set('price', e.target.value)} required /></div>
          <div><label className={label}>Старая цена</label><input type="number" className={input} value={form.oldPrice ?? ''} onChange={(e) => set('oldPrice', e.target.value)} /></div>
          <div><label className={label}>Объём</label><input className={input} value={form.volume ?? ''} onChange={(e) => set('volume', e.target.value)} /></div>
          <div><label className={label}>Порядок</label><input type="number" className={input} value={form.sortOrder ?? 0} onChange={(e) => set('sortOrder', Number(e.target.value))} /></div>
          <div className="col-span-2"><label className={label}>Описание</label><textarea className={`${input} h-auto py-2`} rows={2} value={form.description ?? ''} onChange={(e) => set('description', e.target.value)} /></div>
          <div className="col-span-2"><label className={label}>Состав</label><textarea className={`${input} h-auto py-2`} rows={2} value={form.composition ?? ''} onChange={(e) => set('composition', e.target.value)} /></div>
          <div className="col-span-2 flex flex-wrap items-center gap-4">
            <div className="flex gap-2">
              {BADGES.map((b) => (
                <label key={b} className="flex items-center gap-1 text-sm">
                  <input type="checkbox" checked={form.badges?.includes(b) ?? false}
                    onChange={(e) => set('badges', e.target.checked ? [...(form.badges ?? []), b] : (form.badges ?? []).filter((x) => x !== b))} />
                  {b}
                </label>
              ))}
            </div>
            <label className="flex items-center gap-1 text-sm"><input type="checkbox" checked={form.inStock ?? true} onChange={(e) => set('inStock', e.target.checked)} /> в наличии</label>
            <label className="flex items-center gap-1 text-sm"><input type="checkbox" checked={form.isActive ?? true} onChange={(e) => set('isActive', e.target.checked)} /> активен</label>
          </div>
        </div>

        {isEdit && (
          <div className="mt-4">
            <label className={label}>Фото</label>
            <div className="flex flex-wrap items-center gap-2">
              {(form.images ?? []).map((img) => (
                <div key={img.id} className="relative">
                  <img src={img.url.startsWith('/media') ? (import.meta.env.VITE_API_URL ?? '') + img.url : img.url} className="size-16 rounded-lg object-cover ring-1 ring-line" />
                  <button type="button" onClick={() => { adminApi.deleteImage(draft.id!, img.id); set('images', (form.images ?? []).filter((x) => x.id !== img.id)) }}
                    className="absolute -right-1 -top-1 rounded-full bg-danger p-0.5 text-white"><X className="size-3" /></button>
                </div>
              ))}
              <label className="flex size-16 cursor-pointer items-center justify-center rounded-lg border border-dashed border-line text-ink-muted hover:border-brand-300">
                <Upload className="size-5" />
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload.mutate(e.target.files[0])} />
              </label>
            </div>
          </div>
        )}

        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>Отмена</Button>
          <Button type="submit" disabled={save.isPending}>{save.isPending ? 'Сохраняем…' : 'Сохранить'}</Button>
        </div>
        {!isEdit && <p className="mt-2 text-xs text-ink-muted">Фото можно добавить после создания — откройте товар на редактирование.</p>}
      </form>
    </div>
  )
}
