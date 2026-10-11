"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BD_BANKS, BD_MFS, CARD_NETWORKS, type BDInstitution } from "@/lib/data/bd-institutions"
import { Check, Search, Building2, Smartphone, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"

interface InstitutionSelectorProps {
  value: string | null
  onChange: (id: string, institution: BDInstitution) => void
  type?: "bank" | "mfs" | "card_network" | "all"
  triggerLabel?: string
}

function InstitutionGrid({
  items,
  selected,
  onSelect,
}: {
  items: BDInstitution[]
  selected: string | null
  onSelect: (inst: BDInstitution) => void
}) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {items.map((inst) => (
        <button
          key={inst.id}
          type="button"
          onClick={() => onSelect(inst)}
          className={cn(
            "relative flex flex-col items-center justify-center gap-1.5 rounded-xl p-2.5 border-2 transition-all text-center",
            selected === inst.id
              ? "border-primary shadow-md scale-[1.02]"
              : "border-transparent hover:border-border hover:bg-muted/50",
          )}
        >
          {/* Colored badge */}
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center text-[10px] font-bold leading-tight shadow-sm"
            style={{
              background: `linear-gradient(135deg, ${inst.primaryColor}, ${inst.secondaryColor})`,
              color: inst.textColor,
            }}
          >
            {inst.shortName.length > 4 ? inst.shortName.slice(0, 4) : inst.shortName}
          </div>
          <span className="text-[10px] leading-tight text-foreground line-clamp-2">{inst.name}</span>
          {selected === inst.id && (
            <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
              <Check className="h-2.5 w-2.5 text-primary-foreground" />
            </div>
          )}
        </button>
      ))}
    </div>
  )
}

export function InstitutionSelector({ value, onChange, type = "all", triggerLabel }: InstitutionSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const allBanks = BD_BANKS
  const allMFS = BD_MFS
  const allCards = CARD_NETWORKS

  const filter = (items: BDInstitution[]) =>
    search
      ? items.filter(
          (i) =>
            i.name.toLowerCase().includes(search.toLowerCase()) ||
            i.shortName.toLowerCase().includes(search.toLowerCase()),
        )
      : items

  const handleSelect = (inst: BDInstitution) => {
    onChange(inst.id, inst)
    setOpen(false)
    setSearch("")
  }

  const selectedInst =
    value ? [...BD_BANKS, ...BD_MFS, ...CARD_NETWORKS].find((i) => i.id === value) : null

  const defaultTab = type === "mfs" ? "mfs" : type === "card_network" ? "cards" : "banks"

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="w-full justify-start h-auto py-2">
          {selectedInst ? (
            <div className="flex items-center gap-3">
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${selectedInst.primaryColor}, ${selectedInst.secondaryColor})`,
                  color: selectedInst.textColor,
                }}
              >
                {selectedInst.shortName.slice(0, 4)}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">{selectedInst.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{selectedInst.type.replace("_", " ")}</p>
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground">{triggerLabel || "Select institution..."}</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Institution</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search banks, MFS..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex-1 overflow-y-auto min-h-0">
          {type === "all" ? (
            <Tabs defaultValue={defaultTab}>
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="banks" className="gap-1.5">
                  <Building2 className="h-3.5 w-3.5" />
                  Banks
                </TabsTrigger>
                <TabsTrigger value="mfs" className="gap-1.5">
                  <Smartphone className="h-3.5 w-3.5" />
                  MFS
                </TabsTrigger>
                <TabsTrigger value="cards" className="gap-1.5">
                  <CreditCard className="h-3.5 w-3.5" />
                  Cards
                </TabsTrigger>
              </TabsList>
              <TabsContent value="banks" className="mt-3">
                {search ? (
                  <InstitutionGrid items={filter(allBanks)} selected={value} onSelect={handleSelect} />
                ) : (
                  <div className="space-y-4">
                    {["State Bank", "Private Bank", "Islamic Bank", "Foreign Bank"].map((cat) => {
                      const catItems = allBanks.filter((b) => b.category === cat)
                      if (!catItems.length) return null
                      return (
                        <div key={cat}>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            {cat}
                          </p>
                          <InstitutionGrid items={catItems} selected={value} onSelect={handleSelect} />
                        </div>
                      )
                    })}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="mfs" className="mt-3">
                <InstitutionGrid items={filter(allMFS)} selected={value} onSelect={handleSelect} />
              </TabsContent>
              <TabsContent value="cards" className="mt-3">
                <InstitutionGrid items={filter(allCards)} selected={value} onSelect={handleSelect} />
              </TabsContent>
            </Tabs>
          ) : type === "bank" ? (
            <div className="space-y-4 mt-2">
              {search ? (
                <InstitutionGrid items={filter(allBanks)} selected={value} onSelect={handleSelect} />
              ) : (
                ["State Bank", "Private Bank", "Islamic Bank", "Foreign Bank"].map((cat) => {
                  const catItems = allBanks.filter((b) => b.category === cat)
                  if (!catItems.length) return null
                  return (
                    <div key={cat}>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{cat}</p>
                      <InstitutionGrid items={catItems} selected={value} onSelect={handleSelect} />
                    </div>
                  )
                })
              )}
            </div>
          ) : type === "mfs" ? (
            <div className="mt-2">
              <InstitutionGrid items={filter(allMFS)} selected={value} onSelect={handleSelect} />
            </div>
          ) : (
            <div className="mt-2">
              <InstitutionGrid items={filter(allCards)} selected={value} onSelect={handleSelect} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
