"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation } from "@tanstack/react-query";
import { Drawer } from "vaul";
import { useEffect } from "react";
import {
  Controller,
  type UseFormRegister,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";

import type { MealWithDetails } from "@/db/queries";
import { type MealFormValues, mealFormSchema } from "../meal-schema";
import { updateMealAction } from "../actions";

function SortableIngredientRow({
  id,
  nameValue,
  amountValue,
  onNameChange,
  onAmountChange,
  onRemove,
}: {
  id: string;
  index: number;
  nameValue: string;
  amountValue: string;
  onNameChange: (v: string) => void;
  onAmountChange: (v: string) => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      className="flex items-center gap-2.5 rounded-[14px] border border-[#F4ECFA] bg-white px-[14px] py-3 shadow-[0_1px_4px_rgba(201,168,232,0.10)]"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-[14px] font-extrabold tracking-[-0.06em] text-[#B7AAD0] outline-none"
        aria-label="გადაადგილება"
      >
        ⋮⋮
      </button>
      <input
        value={nameValue}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="ინგრედიენტი"
        className="min-w-0 flex-1 bg-transparent text-[13px] font-semibold text-[#3D2C5F] outline-none placeholder:text-[#B7AAD0]"
      />
      <input
        value={amountValue}
        onChange={(e) => onAmountChange(e.target.value)}
        placeholder="რაოდ."
        className="w-[72px] rounded-[10px] bg-[#F4ECFA] px-2 py-[5px] text-center text-[11px] font-bold text-[#3D2C5F] outline-none placeholder:text-[#B7AAD0]"
      />
      <button
        type="button"
        onClick={onRemove}
        className="text-[12px] font-bold text-[#B7AAD0] outline-none"
        aria-label="წაშლა"
      >
        ✕
      </button>
    </div>
  );
}

export function MealEditorSheet({
  meal,
  open,
  onOpenChange,
}: {
  meal: MealWithDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const defaultValues: MealFormValues = {
    time: meal.time,
    name: meal.name,
    summary: meal.summary,
    dayType: meal.dayType as "workout" | "rest",
    calories: meal.calories,
    pG: meal.pG,
    nG: meal.nG,
    fG: meal.fG,
    ingredients: meal.ingredients.map((i) => ({ id: i.id, name: i.name, amount: i.amount })),
    swaps: meal.swaps.map((s) => ({ id: s.id, name: s.name })),
  };

  const { register, handleSubmit, control, setValue, reset } = useForm<MealFormValues>({
    resolver: zodResolver(mealFormSchema),
    defaultValues,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    reset(defaultValues);
  }, [meal.id]);

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
    move: moveIngredient,
  } = useFieldArray({ control, name: "ingredients" });

  const {
    fields: swapFields,
    append: appendSwap,
    remove: removeSwap,
  } = useFieldArray({ control, name: "swaps" });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ingredientFields.findIndex((f) => f.id === active.id);
    const newIndex = ingredientFields.findIndex((f) => f.id === over.id);
    moveIngredient(oldIndex, newIndex);
  }

  const dayType = useWatch({ control, name: "dayType" });

  const mutation = useMutation({
    mutationFn: (values: MealFormValues) => updateMealAction(meal.id, values),
    onSuccess: () => onOpenChange(false),
  });

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
        <Drawer.Content className="fixed right-0 bottom-0 left-0 z-50 flex max-h-[92dvh] flex-col rounded-t-[28px] bg-white shadow-[0_-8px_32px_rgba(60,30,90,0.18)] outline-none">
          <div className="flex justify-center pt-2 pb-1">
            <div className="h-1 w-10 rounded-full bg-[#E8DFF7]" />
          </div>

          <div className="border-b border-[#F4ECFA] px-[22px] pt-3 pb-[14px]">
            <div className="flex items-center justify-between gap-3">
              <div className="text-[19px] leading-[1.15] font-extrabold tracking-[-0.01em] text-[#3D2C5F]">
                {meal.name} — რედაქტირება
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#F4ECFA] text-[14px] font-extrabold text-[#5A3A8B] outline-none focus-visible:ring-2 focus-visible:ring-[#C9A8E8]"
                aria-label="დახურვა"
              >
                ✕
              </button>
            </div>
            <div className="mt-1 text-[11.5px] font-medium text-[#7B6A9B]">
              ცვლილებები შენახვისას დადასტურდება
            </div>
          </div>

          <form
            id="meal-editor-form"
            onSubmit={handleSubmit((v) => mutation.mutate(v))}
            className="flex-1 overflow-y-auto pb-4"
          >
            <SectionLabel>🍽 ძირითადი</SectionLabel>
            <Card>
              <FieldRow label="დრო">
                <input
                  type="time"
                  {...register("time")}
                  className="rounded-[10px] bg-[#F4ECFA] px-3 py-[5px] text-[12px] font-bold text-[#3D2C5F] outline-none"
                />
              </FieldRow>
              <Divider />
              <div className="px-[18px] py-[14px]">
                <div className="mb-1.5 text-[13px] font-semibold text-[#3D2C5F]">კვების სახელი</div>
                <input
                  {...register("name")}
                  className="w-full rounded-[14px] bg-[#F4ECFA] px-[14px] py-3 text-[13px] font-semibold text-[#3D2C5F] outline-none placeholder:text-[#9785B5]"
                  placeholder="სახელი..."
                />
              </div>
              <Divider />
              <div className="px-[18px] py-[14px]">
                <div className="mb-1.5 text-[13px] font-semibold text-[#3D2C5F]">შინაარსი</div>
                <textarea
                  {...register("summary")}
                  rows={2}
                  className="w-full resize-none rounded-[14px] bg-[#F4ECFA] px-[14px] py-3 text-[13px] leading-[1.45] font-medium text-[#3D2C5F] outline-none placeholder:text-[#9785B5]"
                  placeholder="კვების შინაარსი..."
                />
              </div>
              <Divider />
              <FieldRow label="დღის ტიპი">
                <div className="flex gap-[2px] rounded-full bg-[#F8F2FB] p-[3px]">
                  {(["workout", "rest"] as const).map((dt) => {
                    const active = dayType === dt;
                    return (
                      <button
                        key={dt}
                        type="button"
                        onClick={() => setValue("dayType", dt)}
                        className="rounded-full px-[10px] py-[5px] text-[10.5px] font-bold whitespace-nowrap transition-colors"
                        style={{
                          background: active
                            ? "linear-gradient(135deg, #FFD66B 0%, #FF9EC5 100%)"
                            : "transparent",
                          color: active ? "#fff" : "#9785B5",
                          boxShadow: active ? "0 2px 6px rgba(255,158,197,0.4)" : "none",
                        }}
                      >
                        {dt === "workout" ? "💪 ვარჯიშის" : "😴 დასვენების"}
                      </button>
                    );
                  })}
                </div>
              </FieldRow>
            </Card>

            <SectionLabel
              right={
                <button
                  type="button"
                  onClick={() => appendIngredient({ id: String(Date.now()), name: "", amount: "" })}
                  className="bg-transparent text-[11.5px] font-bold text-[#7B4FA8]"
                >
                  + დამატება
                </button>
              }
            >
              🧾 ინგრედიენტები
            </SectionLabel>
            <div className="flex flex-col gap-2 px-[18px]">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={ingredientFields.map((f) => f.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {ingredientFields.map((field, index) => (
                    <Controller
                      key={field.id}
                      control={control}
                      name={`ingredients.${index}` as const}
                      render={({ field: f }) => (
                        <SortableIngredientRow
                          id={field.id}
                          index={index}
                          nameValue={f.value.name}
                          amountValue={f.value.amount}
                          onNameChange={(v) => f.onChange({ ...f.value, name: v })}
                          onAmountChange={(v) => f.onChange({ ...f.value, amount: v })}
                          onRemove={() => removeIngredient(index)}
                        />
                      )}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>

            <SectionLabel>📊 კალორია და მაკრო</SectionLabel>
            <Card>
              <MacroRow label="კალორია" unit="კკალ" fieldName="calories" register={register} />
              <Divider />
              <MacroRow
                label="ცილა"
                unit="გ"
                dotColor="#7DDFA8"
                fieldName="pG"
                register={register}
              />
              <Divider />
              <MacroRow
                label="ნახშირწყლები"
                unit="გ"
                dotColor="#FFD66B"
                fieldName="nG"
                register={register}
              />
              <Divider />
              <MacroRow
                label="ცხიმი"
                unit="გ"
                dotColor="#FF9EC5"
                fieldName="fG"
                register={register}
              />
            </Card>
            <p className="mx-[22px] mt-2 text-[11px] font-medium text-[#7B6A9B]">
              ჯამი ნაგულისხმევია — შენ შეგიძლია ხელით შეცვალო
            </p>

            <SectionLabel>🔄 შემცვლელები</SectionLabel>
            <div className="flex flex-wrap gap-[6px] px-[18px] pb-[22px]">
              {swapFields.map((field, index) => (
                <Controller
                  key={field.id}
                  control={control}
                  name={`swaps.${index}.name` as const}
                  render={({ field: f }) => (
                    <span className="flex items-center gap-[6px] rounded-full border border-[#F4ECFA] bg-white px-[11px] py-[6px] shadow-[0_1px_3px_rgba(201,168,232,0.10)]">
                      <input
                        value={f.value}
                        onChange={f.onChange}
                        className="min-w-0 bg-transparent text-[11.5px] font-bold text-[#3D2C5F] outline-none"
                        style={{ width: `${Math.max(4, f.value.length)}ch` }}
                      />
                      <button
                        type="button"
                        onClick={() => removeSwap(index)}
                        className="text-[11px] font-bold text-[#B7AAD0] outline-none"
                        aria-label="წაშლა"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                />
              ))}
              <button
                type="button"
                onClick={() => appendSwap({ id: String(Date.now()), name: "ახალი" })}
                className="rounded-full border-[1.5px] border-dashed border-[#C9A8E8] bg-transparent px-[11px] py-[5px] text-[11.5px] font-bold text-[#7B4FA8]"
              >
                + ახალი
              </button>
            </div>
          </form>

          <div className="flex items-center gap-3 border-t border-[#F4ECFA] bg-white px-[22px] pt-[14px] pb-[22px]">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-2 py-[10px] text-[13px] font-bold text-[#7B6A9B]"
            >
              გაუქმება
            </button>
            <div className="flex-1" />
            <button
              type="submit"
              form="meal-editor-form"
              disabled={mutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-full px-6 py-3 text-[14px] font-extrabold text-white shadow-[0_6px_18px_rgba(255,158,197,0.4)] disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #C9A8E8 0%, #FF9EC5 100%)" }}
            >
              {mutation.isPending ? "..." : "შენახვა ✓"}
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function SectionLabel({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="mx-[22px] mt-[18px] mb-2 flex items-baseline justify-between">
      <span className="text-[10.5px] font-bold tracking-[0.08em] text-[#7B4FA8] uppercase">
        {children}
      </span>
      {right}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-[18px] overflow-hidden rounded-[20px] border border-[#F4ECFA] bg-white shadow-[0_2px_8px_rgba(201,168,232,0.10)]">
      {children}
    </div>
  );
}

function Divider() {
  return <div className="mx-[18px] h-px bg-[#F4ECFA]" />;
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-[18px] py-[14px]">
      <span className="text-[13px] font-semibold text-[#3D2C5F]">{label}</span>
      {children}
    </div>
  );
}

type MacroFieldName = "calories" | "pG" | "nG" | "fG";

function MacroRow({
  label,
  unit,
  dotColor,
  fieldName,
  register,
}: {
  label: string;
  unit: string;
  dotColor?: string;
  fieldName: MacroFieldName;
  register: UseFormRegister<MealFormValues>;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-[18px] py-[14px]">
      <span className="text-[13px] font-semibold text-[#3D2C5F]">{label}</span>
      <span className="flex items-center gap-[7px]">
        {dotColor && (
          <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: dotColor }} />
        )}
        <span className="flex items-center gap-1">
          <input
            type="number"
            min={0}
            {...register(fieldName, { valueAsNumber: true })}
            className="w-[60px] rounded-[10px] bg-[#F4ECFA] px-3 py-[5px] text-right text-[13px] font-bold text-[#3D2C5F] outline-none"
          />
          <span className="text-[11px] font-bold text-[#7B6A9B]">{unit}</span>
        </span>
      </span>
    </div>
  );
}
