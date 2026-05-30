import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, FileText, Plus, X } from "lucide-react";
import type { FoodType, Task } from "../types";

type AddTaskModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (task: Task) => void;
  onUpdate?: (task: Task) => void;
  editingTask?: Task | null;
  copy: {
    title: string;
    editTitle: string;
    taskTitle: string;
    taskPlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    deadline: string;
    reward: string;
    close: string;
    createTask: string;
    updateTask: string;
  };
  foodNames: Record<FoodType, string>;
  availableRewards: FoodType[];
};

export function AddTaskModal({ open, onClose, onCreate, onUpdate, editingTask, copy, foodNames, availableRewards }: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [rewardType, setRewardType] = useState<FoodType>("berries");
  const isEditing = Boolean(editingTask);

  useEffect(() => {
    if (!availableRewards.includes(rewardType)) {
      setRewardType(availableRewards[0] ?? "berries");
    }
  }, [availableRewards, rewardType]);

  useEffect(() => {
    if (!open) return;

    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description ?? "");
      setDeadline(editingTask.deadline ?? "");
      setRewardType(editingTask.reward.type);
      return;
    }

    setTitle("");
    setDescription("");
    setDeadline("");
    setRewardType(availableRewards[0] ?? "berries");
  }, [availableRewards, editingTask, open]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    if (editingTask && onUpdate) {
      onUpdate({
        ...editingTask,
        title: title.trim(),
        titleKey: undefined,
        description: description.trim() || undefined,
        descriptionKey: undefined,
        deadline: deadline || undefined,
        reward: { ...editingTask.reward, type: rewardType },
      });
      onClose();
      return;
    }

    onCreate({
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim() || undefined,
      deadline: deadline || undefined,
      completed: false,
      reward: { type: rewardType, amount: Math.floor(Math.random() * 3) + 1 },
    });
    setTitle("");
    setDescription("");
    setDeadline("");
    setRewardType("berries");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.form
            className="modal card"
            onSubmit={submit}
            initial={{ y: 40, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.96 }}
          >
            <div className="modal-head">
              <h2>{isEditing ? copy.editTitle : copy.title}</h2>
              <button className="icon-button" type="button" onClick={onClose} aria-label={copy.close}>
                <X size={18} />
              </button>
            </div>
            <label>
              <span>{copy.taskTitle}</span>
              <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder={copy.taskPlaceholder} />
            </label>
            <label>
              <span>{copy.description}</span>
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder={copy.descriptionPlaceholder} />
            </label>
            <div className="modal-grid">
              <label>
                <span><Calendar size={14} /> {copy.deadline}</span>
                <input type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} />
              </label>
              <label>
                <span><FileText size={14} /> {copy.reward}</span>
                <select value={rewardType} onChange={(event) => setRewardType(event.target.value as FoodType)}>
                  {availableRewards.map((reward) => (
                    <option key={reward} value={reward}>{foodNames[reward]}</option>
                  ))}
                </select>
              </label>
            </div>
            <button className="primary-button" type="submit">
              <Plus size={18} /> {isEditing ? copy.updateTask : copy.createTask}
            </button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
