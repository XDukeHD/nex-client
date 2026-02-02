"use client";

import { useState, useCallback, useEffect, type ReactNode } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { saveWidgetLayouts, getWidgetLayouts, type WidgetLayout } from "@/lib/nex-store";

interface SortableWidgetProps {
  id: string;
  children: ReactNode;
  editMode: boolean;
  onRemove: (id: string) => void;
}

function SortableWidget({ id, children, editMode, onRemove }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group transition-all duration-200",
        isDragging && "z-50 opacity-90 scale-105",
        editMode && "ring-2 ring-primary/20 ring-offset-2 ring-offset-background rounded-xl"
      )}
    >
      {editMode && (
        <>
          {/* Drag handle */}
          <button
            className="absolute -top-2 -left-2 z-10 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
            {...attributes}
            {...listeners}
            aria-label="Drag to reorder"
          >
            <GripVertical className="w-3 h-3" />
          </button>
          {/* Remove button */}
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onRemove(id)}
            aria-label="Hide widget"
          >
            <X className="w-3 h-3" />
          </Button>
        </>
      )}
      {children}
    </div>
  );
}

interface WidgetGridProps {
  widgets: { id: string; component: ReactNode }[];
  hiddenWidgets: string[];
  editMode: boolean;
  onReorder: (newOrder: string[]) => void;
  onRemove: (id: string) => void;
}

export function WidgetGrid({
  widgets,
  hiddenWidgets,
  editMode,
  onReorder,
  onRemove,
}: WidgetGridProps) {
  const [order, setOrder] = useState<string[]>(() => {
    const savedLayouts = getWidgetLayouts();
    if (savedLayouts) {
      return savedLayouts.map((l) => l.id);
    }
    return widgets.map((w) => w.id);
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update order when widgets change
  useEffect(() => {
    const widgetIds = widgets.map((w) => w.id);
    setOrder((prev) => {
      const newOrder = prev.filter((id) => widgetIds.includes(id));
      const missingIds = widgetIds.filter((id) => !newOrder.includes(id));
      return [...newOrder, ...missingIds];
    });
  }, [widgets]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        setOrder((items) => {
          const oldIndex = items.indexOf(active.id as string);
          const newIndex = items.indexOf(over.id as string);
          const newOrder = arrayMove(items, oldIndex, newIndex);
          
          // Save to local storage
          const layouts: WidgetLayout[] = newOrder.map((id, index) => ({
            id,
            x: index % 4,
            y: Math.floor(index / 4),
            w: 1,
            h: 1,
            visible: !hiddenWidgets.includes(id),
          }));
          saveWidgetLayouts(layouts);
          onReorder(newOrder);
          
          return newOrder;
        });
      }
    },
    [hiddenWidgets, onReorder]
  );

  const visibleWidgets = widgets.filter(
    (w) => !hiddenWidgets.includes(w.id)
  );

  const orderedWidgets = order
    .filter((id) => visibleWidgets.some((w) => w.id === id))
    .map((id) => visibleWidgets.find((w) => w.id === id)!)
    .filter(Boolean);

  // Add any new widgets that aren't in the order yet
  const remainingWidgets = visibleWidgets.filter(
    (w) => !order.includes(w.id)
  );

  const allWidgets = [...orderedWidgets, ...remainingWidgets];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={allWidgets.map((w) => w.id)}
        strategy={rectSortingStrategy}
        disabled={!editMode}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 md:p-6">
          {allWidgets.map((widget) => (
            <SortableWidget
              key={widget.id}
              id={widget.id}
              editMode={editMode}
              onRemove={onRemove}
            >
              {widget.component}
            </SortableWidget>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
