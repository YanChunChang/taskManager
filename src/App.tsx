"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Bell,
  Check,
  ChefHat,
  Flame,
  Home,
  Languages,
  ListTodo,
  Moon,
  Palette,
  Plus,
  Settings,
  Sparkles,
  Star,
  Trash2,
  Utensils,
} from "lucide-react";
import { AddTaskModal } from "./components/AddTaskModal";
import { Chinchilla } from "./components/Chinchilla";
import { Meter } from "./components/Meter";
import { RewardBurst } from "./components/RewardBurst";
import { baseAchievements, foods, initialTasks } from "./data";
import { languages, translations, type Locale } from "./i18n";
import type { FoodType, Screen, Task } from "./types";
import { completedCount, determineMood, getFood, levelFromTasks, progressToNextLevel, totalInventory } from "./utils";

const nav = [
  { id: "home", icon: Home },
  { id: "tasks", icon: ListTodo },
  { id: "pet", icon: Sparkles },
  { id: "inventory", icon: ChefHat },
  { id: "stats", icon: BarChart3 },
  { id: "settings", icon: Settings },
] satisfies { id: Screen; icon: typeof Home }[];

const pageVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const randomPercentBoost = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

type ChinchillaColor = "silver" | "cream" | "cocoa" | "blue";
type SeasonalTheme = "spring" | "summer" | "autumn" | "winter";

const chinchillaColors: ChinchillaColor[] = ["silver", "cream", "cocoa", "blue"];
const seasonalThemes: SeasonalTheme[] = ["spring", "summer", "autumn", "winter"];
const storageKey = "chilla-tasks-state-v1";
const initialInventory: Record<FoodType, number> = { berries: 3, seeds: 2, carrots: 0, snacks: 0 };
const initialPetStats = { hunger: 64, happiness: 72, energy: 68 };

type SavedAppState = {
  version: 1;
  locale: Locale;
  tasks: Task[];
  inventory: Record<FoodType, number>;
  petStats: typeof initialPetStats;
  gentleReminders: boolean;
  sleepMode: boolean;
  chinchillaColor: ChinchillaColor;
  seasonalTheme: SeasonalTheme;
};

const isLocale = (value: unknown): value is Locale => value === "en" || value === "zh-TW";
const isChinchillaColor = (value: unknown): value is ChinchillaColor => chinchillaColors.includes(value as ChinchillaColor);
const isSeasonalTheme = (value: unknown): value is SeasonalTheme => seasonalThemes.includes(value as SeasonalTheme);
const clampPercent = (value: unknown, fallback: number) => (typeof value === "number" && Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : fallback);

const restoreSavedState = (raw: string | null): Partial<SavedAppState> | null => {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<SavedAppState>;
    return {
      locale: isLocale(parsed.locale) ? parsed.locale : undefined,
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : undefined,
      inventory: parsed.inventory ? { ...initialInventory, ...parsed.inventory } : undefined,
      petStats: parsed.petStats
        ? {
            hunger: clampPercent(parsed.petStats.hunger, initialPetStats.hunger),
            happiness: clampPercent(parsed.petStats.happiness, initialPetStats.happiness),
            energy: clampPercent(parsed.petStats.energy, initialPetStats.energy),
          }
        : undefined,
      gentleReminders: typeof parsed.gentleReminders === "boolean" ? parsed.gentleReminders : undefined,
      sleepMode: typeof parsed.sleepMode === "boolean" ? parsed.sleepMode : undefined,
      chinchillaColor: isChinchillaColor(parsed.chinchillaColor) ? parsed.chinchillaColor : undefined,
      seasonalTheme: isSeasonalTheme(parsed.seasonalTheme) ? parsed.seasonalTheme : undefined,
    };
  } catch {
    return null;
  }
};

export default function App() {
  const [locale, setLocale] = useState<Locale>("en");
  const [activeScreen, setActiveScreen] = useState<Screen>("home");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [inventory, setInventory] = useState<Record<FoodType, number>>(initialInventory);
  const [petStats, setPetStats] = useState(initialPetStats);
  const [streak] = useState(6);
  const [dailyGoal] = useState(4);
  const [modalOpen, setModalOpen] = useState(false);
  const [reward, setReward] = useState<Task["reward"] | null>(null);
  const [feedCombo, setFeedCombo] = useState(0);
  const [feeding, setFeeding] = useState(false);
  const [petting, setPetting] = useState(false);
  const [petInteractionKey, setPetInteractionKey] = useState(0);
  const [gentleReminders, setGentleReminders] = useState(true);
  const [reminderMessage, setReminderMessage] = useState<string | null>(null);
  const [sleepMode, setSleepMode] = useState(false);
  const [chinchillaColor, setChinchillaColor] = useState<ChinchillaColor>("silver");
  const [seasonalTheme, setSeasonalTheme] = useState<SeasonalTheme>("spring");
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [storageReady, setStorageReady] = useState(false);

  const { hunger, happiness, energy } = petStats;
  const completed = completedCount(tasks);
  const t = translations[locale];
  const level = levelFromTasks(completed);
  const mood = determineMood(hunger, happiness, feedCombo);
  const effectiveMood = sleepMode ? "sleeping" : mood;
  const todaysTasks = tasks.filter((task) => !task.completed).slice(0, 3);
  const quote = useMemo(() => t.quotes[new Date().getDay() % t.quotes.length], [t.quotes]);
  const unlockedFoods = foods.filter((food) => food.unlockLevel <= level);
  const availableRewards = unlockedFoods.map((food) => food.id);
  const dailyProgress = Math.min(100, (completed / dailyGoal) * 100);
  const foodNames = t.foods;
  const taskText = (task: Task) => {
    const translated = task.titleKey ? t.tasksSeed[task.titleKey] : undefined;
    return {
      title: translated?.title ?? task.title,
      description: task.descriptionKey ? translated?.description : task.description,
    };
  };

  useEffect(() => {
    let saved: Partial<SavedAppState> | null = null;

    try {
      saved = restoreSavedState(window.localStorage.getItem(storageKey));
    } catch {
      saved = null;
    }

    if (saved) {
      if (saved.locale) setLocale(saved.locale);
      if (saved.tasks) setTasks(saved.tasks);
      if (saved.inventory) setInventory(saved.inventory);
      if (saved.petStats) setPetStats(saved.petStats);
      if (typeof saved.gentleReminders === "boolean") setGentleReminders(saved.gentleReminders);
      if (typeof saved.sleepMode === "boolean") setSleepMode(saved.sleepMode);
      if (saved.chinchillaColor) setChinchillaColor(saved.chinchillaColor);
      if (saved.seasonalTheme) setSeasonalTheme(saved.seasonalTheme);
    }

    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;

    const stateToSave: SavedAppState = {
      version: 1,
      locale,
      tasks,
      inventory,
      petStats,
      gentleReminders,
      sleepMode,
      chinchillaColor,
      seasonalTheme,
    };

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch {
      // Some private browsing modes can block localStorage writes.
    }
  }, [chinchillaColor, gentleReminders, inventory, locale, petStats, seasonalTheme, sleepMode, storageReady, tasks]);

  useEffect(() => {
    const decayTimer = window.setInterval(() => {
      setPetStats((current) => ({
        hunger: Math.max(0, current.hunger - 1),
        happiness: Math.max(0, current.happiness - 1),
        energy: sleepMode ? Math.min(100, current.energy + 1) : Math.max(0, current.energy - 1),
      }));
    }, 180000);

    return () => window.clearInterval(decayTimer);
  }, [sleepMode]);

  useEffect(() => {
    if (!reminderMessage) return;
    const toastTimer = window.setTimeout(() => setReminderMessage(null), 3200);
    return () => window.clearTimeout(toastTimer);
  }, [reminderMessage]);

  useEffect(() => {
    if (!gentleReminders) {
      setReminderMessage(null);
      return;
    }

    const reminderTimer = window.setInterval(() => {
      if (hunger < 40 || happiness < 38) {
        setReminderMessage(t.settings.petReminder);
        return;
      }

      if (activeScreen !== "tasks" && todaysTasks.length > 0) {
        setReminderMessage(t.settings.taskReminder(todaysTasks.length));
      }
    }, 240000);

    return () => window.clearInterval(reminderTimer);
  }, [activeScreen, gentleReminders, happiness, hunger, t.settings, todaysTasks.length]);

  const completeTask = (task: Task) => {
    if (task.completed) return;
    setOpenTaskId(null);
    setTasks((current) => current.map((item) => (item.id === task.id ? { ...item, completed: true } : item)));
    setInventory((current) => ({ ...current, [task.reward.type]: current[task.reward.type] + task.reward.amount }));
    setPetStats((current) => ({
      hunger: current.hunger,
      happiness: Math.min(100, current.happiness + 4),
      energy: Math.min(100, current.energy + 2),
    }));
    setReward(task.reward);
    window.setTimeout(() => setReward(null), 1400);
  };

  const createTask = (task: Task) => setTasks((current) => [task, ...current]);

  const deleteTask = (taskId: string) => {
    setOpenTaskId(null);
    setTasks((current) => current.filter((task) => task.id !== taskId));
  };

  const feedPet = (foodType: FoodType) => {
    if (inventory[foodType] <= 0) return;
    const food = getFood(foodType);
    setInventory((current) => ({ ...current, [foodType]: current[foodType] - 1 }));
    setPetStats((current) => ({
      hunger: Math.min(100, current.hunger + food.hunger),
      happiness: Math.min(100, current.happiness + food.happiness),
      energy: Math.min(100, current.energy + food.energy),
    }));
    setFeedCombo((value) => value + 1);
    setFeeding(true);
    window.setTimeout(() => setFeeding(false), 900);
    window.setTimeout(() => setFeedCombo(0), 2600);
  };

  const petChinchilla = () => {
    const happinessBoost = randomPercentBoost(1, 3);
    const energyBoost = randomPercentBoost(1, 3);
    setPetStats((current) => ({
      hunger: current.hunger,
      happiness: Math.min(100, current.happiness + happinessBoost),
      energy: Math.min(100, current.energy + energyBoost),
    }));
    setPetInteractionKey((value) => value + 1);
    setPetting(true);
    window.setTimeout(() => setPetting(false), 850);
  };

  const toggleGentleReminders = () => {
    setGentleReminders((current) => {
      const next = !current;
      setReminderMessage(next ? t.settings.reminderOn : null);
      return next;
    });
  };

  const screen = {
    home: <HomeScreen />,
    tasks: <TasksScreen />,
    pet: <PetScreen />,
    inventory: <InventoryScreen />,
    stats: <StatsScreen />,
    settings: <SettingsScreen />,
  }[activeScreen];

  return (
    <main className={`app-shell theme-${seasonalTheme}`}>
      <RewardBurst reward={reward} foodNames={foodNames} />
      <ReminderToast message={reminderMessage} />
      <section className="phone-frame">
        <header className="topbar">
          <div>
            <p className="eyebrow">{t.appName}</p>
            <h1>{t.nav[activeScreen]}</h1>
          </div>
          <button className="icon-button" aria-label={t.actions.addTask} onClick={() => setModalOpen(true)}>
            <Plus size={20} />
          </button>
        </header>

        <AnimatePresence mode="wait">
          <motion.div key={activeScreen} variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.22 }} className="screen">
            {screen}
          </motion.div>
        </AnimatePresence>

        <nav className="bottom-nav" aria-label="Main navigation">
          {nav.map((item) => {
            const Icon = item.icon;
            const label = t.nav[item.id];
            return (
              <button key={item.id} className={activeScreen === item.id ? "active" : ""} onClick={() => setActiveScreen(item.id)} aria-label={label}>
                <Icon size={19} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
      </section>
      <AddTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={createTask}
        foodNames={foodNames}
        availableRewards={availableRewards}
        copy={{
          ...t.modal,
          close: t.actions.close,
          createTask: t.actions.createTask,
        }}
      />
    </main>
  );

  function HomeScreen() {
    return (
      <>
        <section className="hero-card">
          <div className="hero-copy">
            <p className="eyebrow">{t.home.streakDay(streak)}</p>
            <h2>{t.home.heroTitle}</h2>
            <p>{quote}</p>
          </div>
          <button className="pet-preview" onClick={() => setActiveScreen("pet")} aria-label={t.actions.openPet}>
            <Chinchilla mood={effectiveMood} level={level} compact feeding={feeding} color={chinchillaColor} />
          </button>
        </section>

        <section className="quick-stats">
          <Stat icon={Flame} label={t.home.stats.streak} value={t.home.stats.days(streak)} />
          <Stat icon={Utensils} label={t.home.stats.food} value={t.home.stats.items(totalInventory(inventory))} />
          <Stat icon={Star} label={t.home.stats.level} value={`${level}`} />
        </section>

        <section className="card">
          <div className="section-head">
            <div>
              <p className="eyebrow">{t.home.dailyGoal}</p>
              <h2>{t.home.tasksComplete(completed, dailyGoal)}</h2>
            </div>
            <Sparkles size={20} />
          </div>
          <div className="progress-track">
            <motion.div className="progress-fill" animate={{ width: `${dailyProgress}%` }} />
          </div>
        </section>

        <TaskStack title={t.home.today} tasks={todaysTasks} />
      </>
    );
  }

  function TasksScreen() {
    return (
      <>
        <button className="primary-button wide" onClick={() => setModalOpen(true)}>
          <Plus size={18} /> {t.actions.addTask}
        </button>
        <TaskStack title={t.tasks.focusList} tasks={tasks} showCompleted />
      </>
    );
  }

  function PetScreen() {
    return (
      <>
        <section className="pet-stage">
          <div
            className={`habitat interactive level-${Math.min(level, 4)}`}
            role="button"
            tabIndex={0}
            aria-label={t.actions.petChinchilla}
            onClick={petChinchilla}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                petChinchilla();
              }
            }}
          >
            <Chinchilla
              mood={effectiveMood}
              level={level}
              feeding={feeding}
              petting={petting}
              interactionKey={petInteractionKey}
              color={chinchillaColor}
            />
          </div>
          <p className="pet-status">{t.pet.status[effectiveMood]}</p>
        </section>
        <section className="card meters-card">
          <Meter label={t.pet.hunger} value={hunger} tone="violet" />
          <Meter label={t.pet.happiness} value={happiness} tone="pink" />
          <Meter label={t.pet.energy} value={energy} tone="gold" />
        </section>
        <section className="food-grid">
          {unlockedFoods.map((food) => (
            <button key={food.id} className="food-card" onClick={() => feedPet(food.id)} disabled={inventory[food.id] <= 0}>
              <span className="food-emoji">{food.emoji}</span>
              <strong>{foodNames[food.id]}</strong>
              <small>{t.pet.left(inventory[food.id])}</small>
            </button>
          ))}
        </section>
      </>
    );
  }

  function InventoryScreen() {
    return (
      <>
        <section className="card">
          <div className="section-head">
            <div>
              <p className="eyebrow">{t.inventory.pantry}</p>
              <h2>{t.inventory.savedTreats(totalInventory(inventory))}</h2>
            </div>
            <ChefHat size={22} />
          </div>
        </section>
        <section className="food-grid">
          {foods.map((food) => (
            <div key={food.id} className={`food-card ${food.unlockLevel > level ? "locked" : ""}`}>
              <span className="food-emoji">{food.unlockLevel > level ? "🔒" : food.emoji}</span>
              <strong>{foodNames[food.id]}</strong>
              <small>{food.unlockLevel > level ? t.inventory.unlocksAt(food.unlockLevel) : t.inventory.available(inventory[food.id])}</small>
            </div>
          ))}
        </section>
      </>
    );
  }

  function StatsScreen() {
    const achievements = baseAchievements.map((item) =>
      item.id === "happy-habitat" ? { ...item, unlocked: level >= 3 } : item.id === "chinchilla-champion" ? { ...item, unlocked: completed >= 25 } : item,
    );
    return (
      <>
        <section className="card">
          <p className="eyebrow">{t.stats.progression}</p>
          <h2>{t.stats.caretaker(level)}</h2>
          <div className="progress-track">
            <motion.div className="progress-fill" animate={{ width: `${progressToNextLevel(completed)}%` }} />
          </div>
          <p className="muted">{t.stats.untilNext(3 - (completed % 3))}</p>
        </section>
        <section className="achievement-list">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            const translated = t.achievements[achievement.id];
            return (
              <article key={achievement.id} className={`achievement ${achievement.unlocked ? "unlocked" : ""}`}>
                <Icon size={20} />
                <div>
                  <strong>{translated.title}</strong>
                  <p>{translated.description}</p>
                </div>
              </article>
            );
          })}
        </section>
      </>
    );
  }

  function SettingsScreen() {
    return (
      <section className="settings-list">
        <article className="setting-row language-row">
          <div className="setting-icon">
            <Languages size={20} />
          </div>
          <div className="setting-content">
            <strong className="setting-label">{t.settings.language}</strong>
            <div className="language-toggle" role="group" aria-label={t.settings.language}>
              {languages.map((language) => (
                <button key={language.id} className={locale === language.id ? "active" : ""} onClick={() => setLocale(language.id)}>
                  {language.label}
                </button>
              ))}
            </div>
          </div>
        </article>
        <article className="setting-row action-setting">
          <div className="setting-icon">
            <Bell size={20} />
          </div>
          <div className="setting-content">
            <strong>{t.settings.gentleReminders}</strong>
            <span>{gentleReminders ? t.settings.reminderHint : t.settings.off}</span>
          </div>
          <button
            className={`switch ${gentleReminders ? "active" : ""}`}
            type="button"
            role="switch"
            aria-checked={gentleReminders}
            aria-label={t.settings.gentleReminders}
            onClick={toggleGentleReminders}
          >
            <span />
          </button>
        </article>
        <article className="setting-row action-setting">
          <div className="setting-icon">
            <Moon size={20} />
          </div>
          <div className="setting-content">
            <strong>{t.settings.sleepMode}</strong>
            <span>{sleepMode ? t.settings.on : t.settings.sleepModeHint}</span>
          </div>
          <button
            className={`switch ${sleepMode ? "active" : ""}`}
            type="button"
            role="switch"
            aria-checked={sleepMode}
            aria-label={t.settings.sleepMode}
            onClick={() => setSleepMode((value) => !value)}
          >
            <span />
          </button>
        </article>
        <article className="setting-row choice-setting">
          <div className="setting-icon">
            <Palette size={20} />
          </div>
          <div className="setting-content">
            <strong>{t.settings.chinchillaColor}</strong>
            <div className="choice-grid" role="group" aria-label={t.settings.chinchillaColor}>
              {chinchillaColors.map((color) => (
                <button
                  key={color}
                  className={`choice-chip color-chip ${chinchillaColor === color ? "active" : ""}`}
                  onClick={() => setChinchillaColor(color)}
                  type="button"
                >
                  <span className={`swatch fur-${color}`} />
                  {t.settings.chinchillaColors[color]}
                </button>
              ))}
            </div>
          </div>
        </article>
        <article className="setting-row choice-setting">
          <div className="setting-icon">
            <Sparkles size={20} />
          </div>
          <div className="setting-content">
            <strong>{t.settings.seasonalTheme}</strong>
            <div className="choice-grid" role="group" aria-label={t.settings.seasonalTheme}>
              {seasonalThemes.map((theme) => (
                <button
                  key={theme}
                  className={`choice-chip theme-chip ${seasonalTheme === theme ? "active" : ""}`}
                  onClick={() => setSeasonalTheme(theme)}
                  type="button"
                >
                  <span className={`swatch season-${theme}`} />
                  {t.settings.seasonalThemes[theme]}
                </button>
              ))}
            </div>
          </div>
        </article>
      </section>
    );
  }

  function TaskStack({ title, tasks: list, showCompleted = false }: { title: string; tasks: Task[]; showCompleted?: boolean }) {
    return (
      <section className="task-section">
        <div className="section-head">
          <h2>{title}</h2>
          <span>{list.length}</span>
        </div>
        <div className="task-list">
          <AnimatePresence initial={false}>
            {list.map((task) => {
              const food = getFood(task.reward.type);
              const text = taskText(task);
              if (task.completed && !showCompleted) return null;
              return (
                <motion.div
                  key={task.id}
                  className={`task-swipe ${task.completed ? "can-delete" : ""}`}
                  layout="position"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -120, scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 380, damping: 34, opacity: { duration: 0.16 } }}
                >
                {task.completed && (
                  <button className="delete-task-button" onClick={() => deleteTask(task.id)} aria-label={`${t.actions.deleteTask} ${text.title}`}>
                    <Trash2 size={20} />
                  </button>
                )}
                <motion.article
                  className={`task-card ${task.completed ? "done" : ""}`}
                  drag={task.completed ? "x" : false}
                  dragConstraints={task.completed ? { left: -82, right: 0 } : undefined}
                  dragElastic={0.08}
                  animate={{ x: task.completed && openTaskId === task.id ? -82 : 0 }}
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  onDragStart={() => {
                    if (task.completed) setOpenTaskId(null);
                  }}
                  onDragEnd={(_, info) => {
                    if (!task.completed) return;
                    setOpenTaskId(info.offset.x < -36 || info.velocity.x < -420 ? task.id : null);
                  }}
                  whileDrag={task.completed ? { scale: 0.99 } : undefined}
                  whileTap={{ scale: 0.98 }}
                >
                <button className="check-button" onClick={() => completeTask(task)} aria-label={`${t.actions.completeTask} ${text.title}`}>
                  {task.completed && <Check size={16} />}
                </button>
                <div className="task-copy">
                  <strong>{text.title}</strong>
                  {text.description && <p>{text.description}</p>}
                  <small>{task.deadline ? t.tasks.due(task.deadline) : t.tasks.flexible}</small>
                </div>
                <span className="reward-pill">+{task.reward.amount} {food.emoji}</span>
                </motion.article>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>
    );
  }

  function Stat({ icon: Icon, label, value }: { icon: typeof Flame; label: string; value: string }) {
    return (
      <div className="stat-card">
        <Icon size={18} />
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    );
  }

  function Setting({ icon: Icon, label, value }: { icon: typeof Bell; label: string; value: string }) {
    return (
      <article className="setting-row">
        <div className="setting-icon">
          <Icon size={20} />
        </div>
        <div>
          <strong>{label}</strong>
          <span>{value}</span>
        </div>
      </article>
    );
  }

  function ReminderToast({ message }: { message: string | null }) {
    return (
      <AnimatePresence>
        {message && (
          <motion.div
            className="reminder-toast"
            role="status"
            initial={{ opacity: 0, y: -18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
          >
            <Bell size={16} />
            <span>{message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
}
