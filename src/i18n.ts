import type { FoodType, Screen } from "./types";

export type Locale = "en" | "zh-TW";

type Translation = {
  appName: string;
  nav: Record<Screen, string>;
  actions: {
    addTask: string;
    close: string;
    createTask: string;
    completeTask: string;
    deleteTask: string;
    openPet: string;
    petChinchilla: string;
  };
  home: {
    streakDay: (days: number) => string;
    heroTitle: string;
    stats: {
      streak: string;
      food: string;
      level: string;
      days: (days: number) => string;
      items: (items: number) => string;
    };
    dailyGoal: string;
    tasksComplete: (completed: number, goal: number) => string;
    today: string;
  };
  tasks: {
    focusList: string;
    due: (date: string) => string;
    flexible: string;
  };
  pet: {
    hunger: string;
    happiness: string;
    energy: string;
    left: (count: number) => string;
    status: {
      sad: string;
      excited: string;
      sleeping: string;
      happy: string;
    };
  };
  inventory: {
    pantry: string;
    savedTreats: (count: number) => string;
    unlocksAt: (level: number) => string;
    available: (count: number) => string;
  };
  stats: {
    progression: string;
    caretaker: (level: number) => string;
    untilNext: (count: number) => string;
  };
  settings: {
    language: string;
    gentleReminders: string;
    on: string;
    off: string;
    reminderHint: string;
    reminderOn: string;
    petReminder: string;
    taskReminder: (count: number) => string;
    sleepMode: string;
    sleepModeHint: string;
    chinchillaColor: string;
    chinchillaColors: {
      silver: string;
      cream: string;
      cocoa: string;
      blue: string;
    };
    seasonalTheme: string;
    seasonalThemes: {
      spring: string;
      summer: string;
      autumn: string;
      winter: string;
    };
  };
  modal: {
    title: string;
    taskTitle: string;
    taskPlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    deadline: string;
    reward: string;
  };
  foods: Record<FoodType, string>;
  tasksSeed: Record<string, { title: string; description?: string }>;
  quotes: string[];
  achievements: Record<string, { title: string; description: string }>;
};

export const languages: { id: Locale; label: string }[] = [
  { id: "en", label: "English" },
  { id: "zh-TW", label: "繁體中文" },
];

export const translations: Record<Locale, Translation> = {
  en: {
    appName: "Chilla Tasks",
    nav: {
      home: "Home",
      tasks: "Tasks",
      pet: "Pet",
      inventory: "Food",
      stats: "Stats",
      settings: "Settings",
    },
    actions: {
      addTask: "Add task",
      close: "Close",
      createTask: "Create task",
      completeTask: "Complete",
      deleteTask: "Delete",
      openPet: "Open pet screen",
      petChinchilla: "Pet Mochi",
    },
    home: {
      streakDay: (days) => `Day ${days} streak`,
      heroTitle: "Feed your focus, then feed Mochi.",
      stats: {
        streak: "Streak",
        food: "Food",
        level: "Level",
        days: (days) => `${days} days`,
        items: (items) => `${items} items`,
      },
      dailyGoal: "Daily goal",
      tasksComplete: (completed, goal) => `${completed}/${goal} tasks complete`,
      today: "Today",
    },
    tasks: {
      focusList: "Focus list",
      due: (date) => `Due ${date}`,
      flexible: "Flexible timing",
    },
    pet: {
      hunger: "Hunger",
      happiness: "Happiness",
      energy: "Energy",
      left: (count) => `${count} left`,
      status: {
        sad: "Mochi could use a tiny snack.",
        excited: "Mochi is twirling with joy.",
        sleeping: "Mochi is cozy and full.",
        happy: "Mochi feels loved.",
      },
    },
    inventory: {
      pantry: "Pantry",
      savedTreats: (count) => `${count} treats saved`,
      unlocksAt: (level) => `Unlocks at level ${level}`,
      available: (count) => `${count} available`,
    },
    stats: {
      progression: "Progression",
      caretaker: (level) => `Level ${level} caretaker`,
      untilNext: (count) => `${count} tasks until the next unlock.`,
    },
    settings: {
      language: "Language",
      gentleReminders: "Gentle reminders",
      on: "On",
      off: "Off",
      reminderHint: "Soft in-app nudges",
      reminderOn: "Gentle reminders are on.",
      petReminder: "Mochi could use a little care soon.",
      taskReminder: (count) => `${count} small task${count === 1 ? "" : "s"} still waiting for you.`,
      sleepMode: "Sleep mode",
      sleepModeHint: "Mochi rests and slows down",
      chinchillaColor: "Chinchilla color",
      chinchillaColors: {
        silver: "Silver",
        cream: "Cream",
        cocoa: "Cocoa",
        blue: "Blue gray",
      },
      seasonalTheme: "Seasonal theme",
      seasonalThemes: {
        spring: "Spring",
        summer: "Summer",
        autumn: "Autumn",
        winter: "Winter",
      },
    },
    modal: {
      title: "Add a small task",
      taskTitle: "Task title",
      taskPlaceholder: "Write one clear next step",
      description: "Description",
      descriptionPlaceholder: "Optional notes",
      deadline: "Deadline",
      reward: "Reward",
    },
    foods: {
      berries: "Moon Berries",
      seeds: "Cloud Seeds",
      carrots: "Tiny Carrots",
      snacks: "Star Snacks",
    },
    tasksSeed: {
      "task-1": {
        title: "Plan the top three priorities",
        description: "Choose the most meaningful tasks for today.",
      },
      "task-2": {
        title: "Deep work sprint",
        description: "A calm 30-minute focus block.",
      },
      "task-3": {
        title: "Reset desk and refill water",
      },
    },
    quotes: [
      "Small steps still feed big dreams.",
      "Your chinchilla believes in gentle momentum.",
      "Finish one thing. Make the room a little brighter.",
      "Progress can be soft and still be powerful.",
    ],
    achievements: {
      "first-treat": {
        title: "First Treat",
        description: "Complete one task and earn your first food reward.",
      },
      "cozy-streak": {
        title: "Cozy Streak",
        description: "Keep a daily rhythm for three days.",
      },
      "happy-habitat": {
        title: "Happy Habitat",
        description: "Reach level 3 to unlock the lavender den.",
      },
      "chinchilla-champion": {
        title: "Chinchilla Champion",
        description: "Complete 25 tasks across your journey.",
      },
    },
  },
  "zh-TW": {
    appName: "絨絨任務",
    nav: {
      home: "首頁",
      tasks: "任務",
      pet: "寵物",
      inventory: "食物",
      stats: "進度",
      settings: "設定",
    },
    actions: {
      addTask: "新增任務",
      close: "關閉",
      createTask: "建立任務",
      completeTask: "完成",
      deleteTask: "刪除",
      openPet: "打開寵物頁",
      petChinchilla: "摸摸麻糬",
    },
    home: {
      streakDay: (days) => `連續第 ${days} 天`,
      heroTitle: "餵飽專注力，也餵飽麻糬。",
      stats: {
        streak: "連續",
        food: "食物",
        level: "等級",
        days: (days) => `${days} 天`,
        items: (items) => `${items} 個`,
      },
      dailyGoal: "今日目標",
      tasksComplete: (completed, goal) => `已完成 ${completed}/${goal} 個任務`,
      today: "今日任務",
    },
    tasks: {
      focusList: "專注清單",
      due: (date) => `截止 ${date}`,
      flexible: "彈性時間",
    },
    pet: {
      hunger: "飽足感",
      happiness: "快樂感",
      energy: "活力",
      left: (count) => `剩下 ${count} 個`,
      status: {
        sad: "麻糬想吃一點小點心。",
        excited: "麻糬開心到轉圈圈。",
        sleeping: "麻糬吃飽飽，舒服休息中。",
        happy: "麻糬感覺被好好照顧。",
      },
    },
    inventory: {
      pantry: "小食櫃",
      savedTreats: (count) => `已存下 ${count} 份點心`,
      unlocksAt: (level) => `等級 ${level} 解鎖`,
      available: (count) => `可使用 ${count} 個`,
    },
    stats: {
      progression: "成長進度",
      caretaker: (level) => `等級 ${level} 照顧者`,
      untilNext: (count) => `再完成 ${count} 個任務即可解鎖下一項。`,
    },
    settings: {
      language: "語言",
      gentleReminders: "溫柔提醒",
      on: "開啟",
      off: "關閉",
      reminderHint: "用 app 內小提示提醒你",
      reminderOn: "溫柔提醒已開啟。",
      petReminder: "麻糬等等可能需要一點照顧。",
      taskReminder: (count) => `還有 ${count} 個小任務在等你。`,
      sleepMode: "睡眠模式",
      sleepModeHint: "麻糬會休息，移動變慢",
      chinchillaColor: "龍貓毛色",
      chinchillaColors: {
        silver: "銀灰",
        cream: "奶油",
        cocoa: "可可",
        blue: "藍灰",
      },
      seasonalTheme: "季節主題",
      seasonalThemes: {
        spring: "春日",
        summer: "夏日",
        autumn: "秋日",
        winter: "冬日",
      },
    },
    modal: {
      title: "新增一個小任務",
      taskTitle: "任務標題",
      taskPlaceholder: "寫下一個清楚的下一步",
      description: "描述",
      descriptionPlaceholder: "可選填備註",
      deadline: "截止日",
      reward: "獎勵",
    },
    foods: {
      berries: "月光莓果",
      seeds: "雲朵種子",
      carrots: "迷你胡蘿蔔",
      snacks: "星星點心",
    },
    tasksSeed: {
      "task-1": {
        title: "規劃今天三個重點",
        description: "選出今天最有意義的任務。",
      },
      "task-2": {
        title: "深度專注衝刺",
        description: "安靜專心 30 分鐘。",
      },
      "task-3": {
        title: "整理桌面並補水",
      },
    },
    quotes: [
      "小小一步，也能餵飽大大的夢。",
      "你的龍貓相信溫柔的前進。",
      "完成一件事，讓今天更亮一點。",
      "進步可以很柔軟，也可以很有力量。",
    ],
    achievements: {
      "first-treat": {
        title: "第一份點心",
        description: "完成一個任務並獲得第一份食物獎勵。",
      },
      "cozy-streak": {
        title: "舒服連續紀錄",
        description: "連續三天維持穩定節奏。",
      },
      "happy-habitat": {
        title: "快樂小窩",
        description: "達到等級 3，解鎖薰衣草小窩。",
      },
      "chinchilla-champion": {
        title: "龍貓任務高手",
        description: "在旅程中完成 25 個任務。",
      },
    },
  },
};
