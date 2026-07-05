import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { adminApi } from '@/services/adminApi'
import { Button } from '@/components/ui/Button'

const input = 'h-10 rounded-lg border border-line bg-white px-3 text-sm focus:border-brand-300 focus:outline-none'

export function AdminCategories() {
  const qc = useQueryClient()
  const { data: cats = [] } = useQuery({ queryKey: ['admin-categories'], queryFn: () => adminApi.listCategories() })
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const refresh = () => qc.invalidateQueries({ queryKey: ['admin-categories'] })
  const create = useMutation({ mutationFn: () => adminApi.createCategory({ id, name, sortOrder: cats.length }), onSuccess: () => { setId(''); setName(''); refresh() } })
  const del = useMutation({ mutationFn: (cid: string) => adminApi.deleteCategory(cid), onSuccess: refresh })
  const submit = (e: FormEvent) => { e.preventDefault(); if (id && name) create.mutate() }

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-bold">Категории</h1>
      <div className="mt-5 divide-y divide-line rounded-card bg-card ring-1 ring-line/60">
        {cats.filter((c) => c.id !== 'all').map((c) => (
          <div key={c.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <span><b>{c.name}</b> <span className="text-ink-muted">/{c.id} · {c.count} тов.</span></span>
            <button onClick={() => confirm(`Удалить категорию «${c.name}»?`) && del.mutate(c.id)} className="text-ink-muted hover:text-danger"><Trash2 className="size-4" /></button>
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="mt-4 flex gap-2">
        <input className={`${input} w-28`} placeholder="id (bone)" value={id} onChange={(e) => setId(e.target.value)} />
        <input className={`${input} flex-1`} placeholder="Название" value={name} onChange={(e) => setName(e.target.value)} />
        <Button type="submit" disabled={create.isPending}>Добавить</Button>
      </form>
      {create.isError && <p className="mt-2 text-sm text-danger">{(create.error as Error).message}</p>}
    </div>
  )
}
