'use client'
import { useFormContext } from "react-hook-form";
import { Trash2, Plus } from "lucide-react";
import { useRef } from "react";
import { Booth } from "@/app/(main)/(host)/create-event/actions";
import { useCurrency } from "@/components/CurrencyProvider";

export const BoothSection = () => {
  const { watch, setValue } = useFormContext();
  const { currencyCode } = useCurrency();
  const nextBoothId = useRef(0);
  const booths: Booth[] = watch("booths") || [];

  const handleUpdateBooth = (index: number, field: keyof Booth, value: string | number) => {
    const updatedBooths = [...booths];
    updatedBooths[index] = { ...updatedBooths[index], [field]: value } as Booth;
    setValue("booths", updatedBooths, { shouldValidate: true });
  };

  const handleDeleteBooth = (id: string) => {
    const updatedBooths = booths.filter((b) => b.id !== id);
    setValue("booths", updatedBooths, { shouldValidate: true });
  };

  const handleAddBooth = () => {
    nextBoothId.current += 1;
    const newBooth: Booth = { 
      id: `booth-${nextBoothId.current}`, 
      name: `Booth ${booths.length + 1}`, 
      type: "AVAILABLE", 
      price: 0,
      width: 80, 
      height: 80,
      x: 0,
      y: 0,
      rotation: 0,
      description: ""
    };
    setValue("booths", [...booths, newBooth], { shouldValidate: true });
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold uppercase tracking-tight text-foreground">Manage Booths</h3>
        <button 
          type="button"
          className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
          onClick={handleAddBooth}
        >
          <Plus size={16} />
          Add Booth
        </button>
      </div>

      {booths.length > 0 ? (
        <div className="border rounded-xl bg-background overflow-hidden shadow-sm">
          <div className="max-h-[400px] overflow-y-auto">
            {booths.map((booth, index) => (
              <div key={booth.id} className="flex flex-col gap-3 border-b p-4 transition-colors last:border-b-0 hover:bg-accent/30">
                
                <div className="flex justify-between items-center gap-4">
                  <input
                    className="flex-1 border-none bg-transparent p-0 text-lg font-bold text-foreground placeholder:text-muted-foreground focus:ring-0"
                    placeholder="Booth Name (e.g. A1)"
                    value={booth.name}
                    onChange={(e) => handleUpdateBooth(index, "name", e.target.value)}
                  />
                  <button 
                    type="button" 
                    onClick={() => handleDeleteBooth(booth.id)} 
                    className="p-1 text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                  <select
                    value={booth.type}
                    onChange={(e) => handleUpdateBooth(index, "type", e.target.value as Booth["type"])}
                    className="rounded-md border border-border bg-background px-2 py-1 text-xs font-bold uppercase text-foreground focus:ring-1 focus:ring-ring"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="RESERVED">Reserved</option>
                    <option value="SOLD">Sold</option>
                    <option value="LOCKED">Locked</option>
                  </select>

                  <div className="flex items-center rounded-md border border-border bg-background px-2 py-1">
                    <span className="mr-1 text-xs font-bold text-muted-foreground">{currencyCode}</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="bg-transparent border-none p-0 w-20 text-xs font-bold focus:ring-0"
                      value={booth.price}
                      onChange={(e) => handleUpdateBooth(index, "price", Number(e.target.value))}
                    />
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-[10px] text-muted-foreground">width(cm)</span>
                    <input
                      type="number"
                      min="1"
                      className="w-12 rounded border border-border bg-background p-1 text-center text-[10px] text-foreground"
                      value={booth.width}
                      onChange={(e) => handleUpdateBooth(index, "width", Number(e.target.value))}
                    />
                    <span className="text-[10px] text-muted-foreground">height(cm)</span>
                    <input
                      type="number"
                      min="1"
                      className="w-12 rounded border border-border bg-background p-1 text-center text-[10px] text-foreground"
                      value={booth.height}
                      onChange={(e) => handleUpdateBooth(index, "height", Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground px-1">Description</span>
                  <textarea
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-ring min-h-[100px]"
                    placeholder="Describe booth features or location..."
                    value={booth.description || ""}
                    onChange={(e) => handleUpdateBooth(index, "description", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card p-12 text-center">
          <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-3">
            <Plus className="text-primary-foreground" />
          </div>
          <p className="font-medium text-foreground">No booths added yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Click &quot;Add Booth&quot; to start building your layout</p>
        </div>
      )}
    </div>
  );
};