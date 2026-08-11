// 365 daily affirmations. Days 1-40 are the original Aurelia collection.
import { AURELIA_FORTY } from "./aurelia-forty";

export type Category =
  | "Wealth Creation"
  | "Positive Energy"
  | "Positive Change"
  | "Inner Healing";

export interface Affirmation {
  day: number;
  category: Category;
  affirmation: string;
  reflection: string;
  action: string;
}

export const CATEGORIES: Category[] = [
  "Wealth Creation",
  "Positive Energy",
  "Positive Change",
  "Inner Healing",
];

const libraryBase: Affirmation[] = [
  {
    "day": 1,
    "category": "Wealth Creation",
    "affirmation": "I create wealth when I take one focused step toward a valuable goal.",
    "reflection": "What valuable step can I take today?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 2,
    "category": "Positive Energy",
    "affirmation": "I raise my energy when I breathe deeply and soften unnecessary tension.",
    "reflection": "What am I grateful to notice right now?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 3,
    "category": "Positive Change",
    "affirmation": "I change my life when I keep promises to myself with patience and compassion.",
    "reflection": "What would my future self choose today?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 4,
    "category": "Inner Healing",
    "affirmation": "I heal from within when I release blame while keeping the wisdom of the lesson.",
    "reflection": "What burden am I ready to set down?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 5,
    "category": "Wealth Creation",
    "affirmation": "My prosperity grows as I save, earn, and grow from a place of self-respect.",
    "reflection": "What resource can I manage more intentionally?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 6,
    "category": "Positive Energy",
    "affirmation": "My presence becomes brighter as I celebrate small victories with genuine gratitude.",
    "reflection": "What would lift my energy by one percent?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 7,
    "category": "Positive Change",
    "affirmation": "My future shifts each time I accept that growth can be quiet and still be real.",
    "reflection": "Which old pattern am I ready to interrupt?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 8,
    "category": "Inner Healing",
    "affirmation": "My heart feels safer as I let my body know that this moment is safe.",
    "reflection": "Where can I create more emotional safety?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 9,
    "category": "Wealth Creation",
    "affirmation": "I welcome abundance when I manage what I have with wisdom and gratitude.",
    "reflection": "What would wise financial confidence look like today?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 10,
    "category": "Positive Energy",
    "affirmation": "I welcome good energy by choosing to release what drains me and welcome what restores me.",
    "reflection": "How can I protect my energy with love?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 11,
    "category": "Positive Change",
    "affirmation": "I become stronger as I replace all-or-nothing thinking with steady progress.",
    "reflection": "What is the smallest meaningful change I can make?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 12,
    "category": "Inner Healing",
    "affirmation": "I give myself permission to tell the truth about my needs with kindness.",
    "reflection": "What feeling can I acknowledge without judgment?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 13,
    "category": "Wealth Creation",
    "affirmation": "Money supports my purpose as I believe there is enough success for me and everyone.",
    "reflection": "How can my talents create more value?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 14,
    "category": "Positive Energy",
    "affirmation": "Peace moves through me whenever I let hope be stronger than yesterday's heaviness.",
    "reflection": "What thought would better support my peace?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 15,
    "category": "Positive Change",
    "affirmation": "I am free to reinvent myself when I show up consistently, even in a small way.",
    "reflection": "Which habit supports the identity I want?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 16,
    "category": "Inner Healing",
    "affirmation": "I restore my inner peace when I honor how far I have come through difficult seasons.",
    "reflection": "What part of me needs kindness today?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 17,
    "category": "Wealth Creation",
    "affirmation": "I build lasting wealth each time I ask confidently for the value my work provides.",
    "reflection": "What belief about money am I ready to upgrade?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 18,
    "category": "Positive Energy",
    "affirmation": "I protect my light when I choose thoughts that support the life I want.",
    "reflection": "What is draining me that I can gently release?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 19,
    "category": "Positive Change",
    "affirmation": "Growth becomes natural when I learn from setbacks instead of turning them into verdicts.",
    "reflection": "What can I begin again without shame?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 20,
    "category": "Inner Healing",
    "affirmation": "My healing deepens as I allow grief and hope to exist together.",
    "reflection": "How can I care for the younger part of me?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 21,
    "category": "Wealth Creation",
    "affirmation": "I am becoming financially stronger because I treat every dollar as a tool for freedom and good.",
    "reflection": "Where is an opportunity I may be overlooking?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 22,
    "category": "Positive Energy",
    "affirmation": "My day changes for the better as I remember that my energy is mine to guide.",
    "reflection": "Where can I bring more light today?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 23,
    "category": "Positive Change",
    "affirmation": "I move beyond old patterns as I turn intention into a clear and manageable plan.",
    "reflection": "Where have I already grown more than I realize?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 24,
    "category": "Inner Healing",
    "affirmation": "I return to wholeness whenever I listen to my feelings without letting them define me.",
    "reflection": "What would compassion say to me right now?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 25,
    "category": "Wealth Creation",
    "affirmation": "My income expands when I invest my time in skills that expand my future.",
    "reflection": "What valuable step can I take today?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 26,
    "category": "Positive Energy",
    "affirmation": "I am a source of calm strength because I move my body and reconnect with the present.",
    "reflection": "What am I grateful to notice right now?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 27,
    "category": "Positive Change",
    "affirmation": "I prove my resilience whenever I make choices my future self will appreciate.",
    "reflection": "What would my future self choose today?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 28,
    "category": "Inner Healing",
    "affirmation": "I am gentle with my story when I receive support instead of carrying everything alone.",
    "reflection": "What burden am I ready to set down?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 29,
    "category": "Wealth Creation",
    "affirmation": "I honor the energy of money when I notice the resources, relationships, and skills already around me.",
    "reflection": "What resource can I manage more intentionally?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 30,
    "category": "Positive Energy",
    "affirmation": "Joy finds me more easily when I focus on what is present, possible, and good.",
    "reflection": "What would lift my energy by one percent?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 31,
    "category": "Positive Change",
    "affirmation": "I create a new chapter when I choose a better response than the one I used before.",
    "reflection": "Which old pattern am I ready to interrupt?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 32,
    "category": "Inner Healing",
    "affirmation": "My wounded places soften as I rest without believing I must earn it.",
    "reflection": "Where can I create more emotional safety?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 33,
    "category": "Wealth Creation",
    "affirmation": "I attract valuable opportunities as I make thoughtful decisions instead of fearful ones.",
    "reflection": "What would wise financial confidence look like today?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 34,
    "category": "Positive Energy",
    "affirmation": "I create a positive atmosphere as I trust that one difficult moment does not define my day.",
    "reflection": "How can I protect my energy with love?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 35,
    "category": "Positive Change",
    "affirmation": "My potential unfolds as I release routines that no longer support who I am.",
    "reflection": "What is the smallest meaningful change I can make?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 36,
    "category": "Inner Healing",
    "affirmation": "I rebuild trust in myself when I remember that healing is not required to be linear.",
    "reflection": "What feeling can I acknowledge without judgment?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 37,
    "category": "Wealth Creation",
    "affirmation": "I am worthy of prosperity, and I solve real problems with courage and care.",
    "reflection": "How can my talents create more value?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 38,
    "category": "Positive Energy",
    "affirmation": "My energy is magnetic when I speak to myself with encouragement and respect.",
    "reflection": "What thought would better support my peace?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 39,
    "category": "Positive Change",
    "affirmation": "I trust the process of change when I let discomfort teach me without controlling me.",
    "reflection": "Which habit supports the identity I want?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 40,
    "category": "Inner Healing",
    "affirmation": "I release shame each time I set loving boundaries that protect my well-being.",
    "reflection": "What part of me needs kindness today?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 41,
    "category": "Wealth Creation",
    "affirmation": "My financial future brightens as I follow through on ideas that can serve others.",
    "reflection": "What belief about money am I ready to upgrade?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 42,
    "category": "Positive Energy",
    "affirmation": "I return to gratitude when I pause before reacting and respond from my values.",
    "reflection": "What is draining me that I can gently release?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 43,
    "category": "Positive Change",
    "affirmation": "I honor the person I am becoming as I speak honestly about what needs to change.",
    "reflection": "What can I begin again without shame?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 44,
    "category": "Inner Healing",
    "affirmation": "I honor my emotions when I accept love without searching for reasons to distrust it.",
    "reflection": "How can I care for the younger part of me?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 45,
    "category": "Wealth Creation",
    "affirmation": "I turn possibility into prosperity when I recognize opportunities that match my values.",
    "reflection": "Where is an opportunity I may be overlooking?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 46,
    "category": "Positive Energy",
    "affirmation": "I radiate confidence and kindness as I notice beauty in ordinary moments.",
    "reflection": "Where can I bring more light today?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 47,
    "category": "Positive Change",
    "affirmation": "I build momentum every time I practice the habits that match my desired identity.",
    "reflection": "Where have I already grown more than I realize?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 48,
    "category": "Inner Healing",
    "affirmation": "I become my own safe place as I recognize survival responses without judging myself.",
    "reflection": "What would compassion say to me right now?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 49,
    "category": "Wealth Creation",
    "affirmation": "I allow wealth to reach me as I stay open to income arriving through expected and unexpected paths.",
    "reflection": "What valuable step can I take today?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 50,
    "category": "Positive Energy",
    "affirmation": "My spirit feels lighter each time I give my attention to people and places that nourish me.",
    "reflection": "What am I grateful to notice right now?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 51,
    "category": "Positive Change",
    "affirmation": "I choose my direction when I choose courage more often than comfort.",
    "reflection": "What would my future self choose today?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 52,
    "category": "Inner Healing",
    "affirmation": "I make peace with my past when I choose peace even when I cannot change the past.",
    "reflection": "What burden am I ready to set down?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 53,
    "category": "Wealth Creation",
    "affirmation": "I multiply my resources by choosing to practice patience, discipline, and clear action.",
    "reflection": "What resource can I manage more intentionally?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 54,
    "category": "Positive Energy",
    "affirmation": "I invite uplifting experiences when I bring warmth and intention into my interactions.",
    "reflection": "What would lift my energy by one percent?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 55,
    "category": "Positive Change",
    "affirmation": "My courage expands as I allow myself to begin again without shame.",
    "reflection": "Which old pattern am I ready to interrupt?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 56,
    "category": "Inner Healing",
    "affirmation": "I nurture my inner child as I forgive myself for what I did while trying to survive.",
    "reflection": "Where can I create more emotional safety?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 57,
    "category": "Wealth Creation",
    "affirmation": "My talents become valuable income when I choose progress over perfection in my financial journey.",
    "reflection": "What would wise financial confidence look like today?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 58,
    "category": "Positive Energy",
    "affirmation": "I choose the frequency of peace as I choose curiosity instead of immediate judgment.",
    "reflection": "How can I protect my energy with love?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 59,
    "category": "Positive Change",
    "affirmation": "I release the past by choosing to take the next small action before I feel completely ready.",
    "reflection": "What is the smallest meaningful change I can make?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 60,
    "category": "Inner Healing",
    "affirmation": "I reclaim my worth whenever I offer myself the patience I once needed from others.",
    "reflection": "What feeling can I acknowledge without judgment?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 61,
    "category": "Wealth Creation",
    "affirmation": "I lead my money with confidence as I release scarcity thinking and choose possibility.",
    "reflection": "How can my talents create more value?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 62,
    "category": "Positive Energy",
    "affirmation": "I become more alive whenever I set boundaries without guilt or anger.",
    "reflection": "What thought would better support my peace?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 63,
    "category": "Positive Change",
    "affirmation": "I become consistent when I focus on the next right step, not the entire staircase.",
    "reflection": "Which habit supports the identity I want?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 64,
    "category": "Inner Healing",
    "affirmation": "I allow tenderness to guide me when I replace harsh self-talk with a compassionate voice.",
    "reflection": "What part of me needs kindness today?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 65,
    "category": "Wealth Creation",
    "affirmation": "I make room for overflow when I take one focused step toward a valuable goal.",
    "reflection": "What belief about money am I ready to upgrade?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 66,
    "category": "Positive Energy",
    "affirmation": "Good things grow around me when I breathe deeply and soften unnecessary tension.",
    "reflection": "What is draining me that I can gently release?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 67,
    "category": "Positive Change",
    "affirmation": "I welcome transformation as I keep promises to myself with patience and compassion.",
    "reflection": "What can I begin again without shame?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 68,
    "category": "Inner Healing",
    "affirmation": "My nervous system settles as I release blame while keeping the wisdom of the lesson.",
    "reflection": "How can I care for the younger part of me?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 69,
    "category": "Wealth Creation",
    "affirmation": "I am aligned with ethical abundance as I save, earn, and grow from a place of self-respect.",
    "reflection": "Where is an opportunity I may be overlooking?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 70,
    "category": "Positive Energy",
    "affirmation": "I honor my energy by choosing to celebrate small victories with genuine gratitude.",
    "reflection": "Where can I bring more light today?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 71,
    "category": "Positive Change",
    "affirmation": "I am capable of lasting change because I accept that growth can be quiet and still be real.",
    "reflection": "Where have I already grown more than I realize?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 72,
    "category": "Inner Healing",
    "affirmation": "I choose compassion for myself when I let my body know that this moment is safe.",
    "reflection": "What would compassion say to me right now?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 73,
    "category": "Wealth Creation",
    "affirmation": "My relationship with money heals as I manage what I have with wisdom and gratitude.",
    "reflection": "What valuable step can I take today?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 74,
    "category": "Positive Energy",
    "affirmation": "I carry hope into this moment as I release what drains me and welcome what restores me.",
    "reflection": "What am I grateful to notice right now?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 75,
    "category": "Positive Change",
    "affirmation": "I shape tomorrow whenever I replace all-or-nothing thinking with steady progress.",
    "reflection": "What would my future self choose today?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 76,
    "category": "Inner Healing",
    "affirmation": "I welcome healing without rushing it as I tell the truth about my needs with kindness.",
    "reflection": "What burden am I ready to set down?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 77,
    "category": "Wealth Creation",
    "affirmation": "I claim the power to prosper whenever I believe there is enough success for me and everyone.",
    "reflection": "What resource can I manage more intentionally?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 78,
    "category": "Positive Energy",
    "affirmation": "My inner light strengthens when I let hope be stronger than yesterday's heaviness.",
    "reflection": "What would lift my energy by one percent?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 79,
    "category": "Positive Change",
    "affirmation": "I turn lessons into strength as I show up consistently, even in a small way.",
    "reflection": "Which old pattern am I ready to interrupt?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 80,
    "category": "Inner Healing",
    "affirmation": "I free myself from old pain when I honor how far I have come through difficult seasons.",
    "reflection": "Where can I create more emotional safety?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 81,
    "category": "Wealth Creation",
    "affirmation": "I build freedom and security as I ask confidently for the value my work provides.",
    "reflection": "What would wise financial confidence look like today?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 82,
    "category": "Positive Energy",
    "affirmation": "I am grounded, open, and energized as I choose thoughts that support the life I want.",
    "reflection": "How can I protect my energy with love?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 83,
    "category": "Positive Change",
    "affirmation": "I step into my power when I learn from setbacks instead of turning them into verdicts.",
    "reflection": "What is the smallest meaningful change I can make?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 84,
    "category": "Inner Healing",
    "affirmation": "I remember my inherent worth as I allow grief and hope to exist together.",
    "reflection": "What feeling can I acknowledge without judgment?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 85,
    "category": "Wealth Creation",
    "affirmation": "I receive more with gratitude when I treat every dollar as a tool for freedom and good.",
    "reflection": "How can my talents create more value?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 86,
    "category": "Positive Energy",
    "affirmation": "I make space for joy whenever I remember that my energy is mine to guide.",
    "reflection": "What thought would better support my peace?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 87,
    "category": "Positive Change",
    "affirmation": "I grow at my own honest pace as I turn intention into a clear and manageable plan.",
    "reflection": "Which habit supports the identity I want?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 88,
    "category": "Inner Healing",
    "affirmation": "I create emotional safety when I listen to my feelings without letting them define me.",
    "reflection": "What part of me needs kindness today?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 89,
    "category": "Wealth Creation",
    "affirmation": "I create a rich life by choosing to invest my time in skills that expand my future.",
    "reflection": "What belief about money am I ready to upgrade?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 90,
    "category": "Positive Energy",
    "affirmation": "I transform the mood around me when I move my body and reconnect with the present.",
    "reflection": "What is draining me that I can gently release?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 91,
    "category": "Positive Change",
    "affirmation": "I create evidence of change whenever I make choices my future self will appreciate.",
    "reflection": "What can I begin again without shame?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 92,
    "category": "Inner Healing",
    "affirmation": "I let love reach the parts of me that hurt as I receive support instead of carrying everything alone.",
    "reflection": "How can I care for the younger part of me?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 93,
    "category": "Wealth Creation",
    "affirmation": "I create wealth when I notice the resources, relationships, and skills already around me.",
    "reflection": "Where is an opportunity I may be overlooking?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 94,
    "category": "Positive Energy",
    "affirmation": "I raise my energy when I focus on what is present, possible, and good.",
    "reflection": "Where can I bring more light today?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 95,
    "category": "Positive Change",
    "affirmation": "I change my life when I choose a better response than the one I used before.",
    "reflection": "Where have I already grown more than I realize?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 96,
    "category": "Inner Healing",
    "affirmation": "I heal from within when I rest without believing I must earn it.",
    "reflection": "What would compassion say to me right now?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 97,
    "category": "Wealth Creation",
    "affirmation": "My prosperity grows as I make thoughtful decisions instead of fearful ones.",
    "reflection": "What valuable step can I take today?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 98,
    "category": "Positive Energy",
    "affirmation": "My presence becomes brighter as I trust that one difficult moment does not define my day.",
    "reflection": "What am I grateful to notice right now?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 99,
    "category": "Positive Change",
    "affirmation": "My future shifts each time I release routines that no longer support who I am.",
    "reflection": "What would my future self choose today?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 100,
    "category": "Inner Healing",
    "affirmation": "My heart feels safer as I remember that healing is not required to be linear.",
    "reflection": "What burden am I ready to set down?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 101,
    "category": "Wealth Creation",
    "affirmation": "I welcome abundance when I solve real problems with courage and care.",
    "reflection": "What resource can I manage more intentionally?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 102,
    "category": "Positive Energy",
    "affirmation": "I welcome good energy by choosing to speak to myself with encouragement and respect.",
    "reflection": "What would lift my energy by one percent?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 103,
    "category": "Positive Change",
    "affirmation": "I become stronger as I let discomfort teach me without controlling me.",
    "reflection": "Which old pattern am I ready to interrupt?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 104,
    "category": "Inner Healing",
    "affirmation": "I give myself permission to set loving boundaries that protect my well-being.",
    "reflection": "Where can I create more emotional safety?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 105,
    "category": "Wealth Creation",
    "affirmation": "Money supports my purpose as I follow through on ideas that can serve others.",
    "reflection": "What would wise financial confidence look like today?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 106,
    "category": "Positive Energy",
    "affirmation": "Peace moves through me whenever I pause before reacting and respond from my values.",
    "reflection": "How can I protect my energy with love?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 107,
    "category": "Positive Change",
    "affirmation": "I am free to reinvent myself when I speak honestly about what needs to change.",
    "reflection": "What is the smallest meaningful change I can make?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 108,
    "category": "Inner Healing",
    "affirmation": "I restore my inner peace when I accept love without searching for reasons to distrust it.",
    "reflection": "What feeling can I acknowledge without judgment?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 109,
    "category": "Wealth Creation",
    "affirmation": "I build lasting wealth each time I recognize opportunities that match my values.",
    "reflection": "How can my talents create more value?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 110,
    "category": "Positive Energy",
    "affirmation": "I protect my light when I notice beauty in ordinary moments.",
    "reflection": "What thought would better support my peace?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 111,
    "category": "Positive Change",
    "affirmation": "Growth becomes natural when I practice the habits that match my desired identity.",
    "reflection": "Which habit supports the identity I want?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 112,
    "category": "Inner Healing",
    "affirmation": "My healing deepens as I recognize survival responses without judging myself.",
    "reflection": "What part of me needs kindness today?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 113,
    "category": "Wealth Creation",
    "affirmation": "I am becoming financially stronger because I stay open to income arriving through expected and unexpected paths.",
    "reflection": "What belief about money am I ready to upgrade?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 114,
    "category": "Positive Energy",
    "affirmation": "My day changes for the better as I give my attention to people and places that nourish me.",
    "reflection": "What is draining me that I can gently release?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 115,
    "category": "Positive Change",
    "affirmation": "I move beyond old patterns as I choose courage more often than comfort.",
    "reflection": "What can I begin again without shame?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 116,
    "category": "Inner Healing",
    "affirmation": "I return to wholeness whenever I choose peace even when I cannot change the past.",
    "reflection": "How can I care for the younger part of me?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 117,
    "category": "Wealth Creation",
    "affirmation": "My income expands when I practice patience, discipline, and clear action.",
    "reflection": "Where is an opportunity I may be overlooking?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 118,
    "category": "Positive Energy",
    "affirmation": "I am a source of calm strength because I bring warmth and intention into my interactions.",
    "reflection": "Where can I bring more light today?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 119,
    "category": "Positive Change",
    "affirmation": "I prove my resilience whenever I allow myself to begin again without shame.",
    "reflection": "Where have I already grown more than I realize?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 120,
    "category": "Inner Healing",
    "affirmation": "I am gentle with my story when I forgive myself for what I did while trying to survive.",
    "reflection": "What would compassion say to me right now?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 121,
    "category": "Wealth Creation",
    "affirmation": "I honor the energy of money when I choose progress over perfection in my financial journey.",
    "reflection": "What valuable step can I take today?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 122,
    "category": "Positive Energy",
    "affirmation": "Joy finds me more easily when I choose curiosity instead of immediate judgment.",
    "reflection": "What am I grateful to notice right now?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 123,
    "category": "Positive Change",
    "affirmation": "I create a new chapter when I take the next small action before I feel completely ready.",
    "reflection": "What would my future self choose today?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 124,
    "category": "Inner Healing",
    "affirmation": "My wounded places soften as I offer myself the patience I once needed from others.",
    "reflection": "What burden am I ready to set down?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 125,
    "category": "Wealth Creation",
    "affirmation": "I attract valuable opportunities as I release scarcity thinking and choose possibility.",
    "reflection": "What resource can I manage more intentionally?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 126,
    "category": "Positive Energy",
    "affirmation": "I create a positive atmosphere as I set boundaries without guilt or anger.",
    "reflection": "What would lift my energy by one percent?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 127,
    "category": "Positive Change",
    "affirmation": "My potential unfolds as I focus on the next right step, not the entire staircase.",
    "reflection": "Which old pattern am I ready to interrupt?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 128,
    "category": "Inner Healing",
    "affirmation": "I rebuild trust in myself when I replace harsh self-talk with a compassionate voice.",
    "reflection": "Where can I create more emotional safety?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 129,
    "category": "Wealth Creation",
    "affirmation": "I am worthy of prosperity, and I take one focused step toward a valuable goal.",
    "reflection": "What would wise financial confidence look like today?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 130,
    "category": "Positive Energy",
    "affirmation": "My energy is magnetic when I breathe deeply and soften unnecessary tension.",
    "reflection": "How can I protect my energy with love?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 131,
    "category": "Positive Change",
    "affirmation": "I trust the process of change when I keep promises to myself with patience and compassion.",
    "reflection": "What is the smallest meaningful change I can make?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 132,
    "category": "Inner Healing",
    "affirmation": "I release shame each time I release blame while keeping the wisdom of the lesson.",
    "reflection": "What feeling can I acknowledge without judgment?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 133,
    "category": "Wealth Creation",
    "affirmation": "My financial future brightens as I save, earn, and grow from a place of self-respect.",
    "reflection": "How can my talents create more value?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 134,
    "category": "Positive Energy",
    "affirmation": "I return to gratitude when I celebrate small victories with genuine gratitude.",
    "reflection": "What thought would better support my peace?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 135,
    "category": "Positive Change",
    "affirmation": "I honor the person I am becoming as I accept that growth can be quiet and still be real.",
    "reflection": "Which habit supports the identity I want?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 136,
    "category": "Inner Healing",
    "affirmation": "I honor my emotions when I let my body know that this moment is safe.",
    "reflection": "What part of me needs kindness today?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 137,
    "category": "Wealth Creation",
    "affirmation": "I turn possibility into prosperity when I manage what I have with wisdom and gratitude.",
    "reflection": "What belief about money am I ready to upgrade?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 138,
    "category": "Positive Energy",
    "affirmation": "I radiate confidence and kindness as I release what drains me and welcome what restores me.",
    "reflection": "What is draining me that I can gently release?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 139,
    "category": "Positive Change",
    "affirmation": "I build momentum every time I replace all-or-nothing thinking with steady progress.",
    "reflection": "What can I begin again without shame?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 140,
    "category": "Inner Healing",
    "affirmation": "I become my own safe place as I tell the truth about my needs with kindness.",
    "reflection": "How can I care for the younger part of me?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 141,
    "category": "Wealth Creation",
    "affirmation": "I allow wealth to reach me as I believe there is enough success for me and everyone.",
    "reflection": "Where is an opportunity I may be overlooking?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 142,
    "category": "Positive Energy",
    "affirmation": "My spirit feels lighter each time I let hope be stronger than yesterday's heaviness.",
    "reflection": "Where can I bring more light today?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 143,
    "category": "Positive Change",
    "affirmation": "I choose my direction when I show up consistently, even in a small way.",
    "reflection": "Where have I already grown more than I realize?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 144,
    "category": "Inner Healing",
    "affirmation": "I make peace with my past when I honor how far I have come through difficult seasons.",
    "reflection": "What would compassion say to me right now?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 145,
    "category": "Wealth Creation",
    "affirmation": "I multiply my resources by choosing to ask confidently for the value my work provides.",
    "reflection": "What valuable step can I take today?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 146,
    "category": "Positive Energy",
    "affirmation": "I invite uplifting experiences when I choose thoughts that support the life I want.",
    "reflection": "What am I grateful to notice right now?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 147,
    "category": "Positive Change",
    "affirmation": "My courage expands as I learn from setbacks instead of turning them into verdicts.",
    "reflection": "What would my future self choose today?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 148,
    "category": "Inner Healing",
    "affirmation": "I nurture my inner child as I allow grief and hope to exist together.",
    "reflection": "What burden am I ready to set down?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 149,
    "category": "Wealth Creation",
    "affirmation": "My talents become valuable income when I treat every dollar as a tool for freedom and good.",
    "reflection": "What resource can I manage more intentionally?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 150,
    "category": "Positive Energy",
    "affirmation": "I choose the frequency of peace as I remember that my energy is mine to guide.",
    "reflection": "What would lift my energy by one percent?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 151,
    "category": "Positive Change",
    "affirmation": "I release the past by choosing to turn intention into a clear and manageable plan.",
    "reflection": "Which old pattern am I ready to interrupt?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 152,
    "category": "Inner Healing",
    "affirmation": "I reclaim my worth whenever I listen to my feelings without letting them define me.",
    "reflection": "Where can I create more emotional safety?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 153,
    "category": "Wealth Creation",
    "affirmation": "I lead my money with confidence as I invest my time in skills that expand my future.",
    "reflection": "What would wise financial confidence look like today?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 154,
    "category": "Positive Energy",
    "affirmation": "I become more alive whenever I move my body and reconnect with the present.",
    "reflection": "How can I protect my energy with love?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 155,
    "category": "Positive Change",
    "affirmation": "I become consistent when I make choices my future self will appreciate.",
    "reflection": "What is the smallest meaningful change I can make?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 156,
    "category": "Inner Healing",
    "affirmation": "I allow tenderness to guide me when I receive support instead of carrying everything alone.",
    "reflection": "What feeling can I acknowledge without judgment?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 157,
    "category": "Wealth Creation",
    "affirmation": "I make room for overflow when I notice the resources, relationships, and skills already around me.",
    "reflection": "How can my talents create more value?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 158,
    "category": "Positive Energy",
    "affirmation": "Good things grow around me when I focus on what is present, possible, and good.",
    "reflection": "What thought would better support my peace?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 159,
    "category": "Positive Change",
    "affirmation": "I welcome transformation as I choose a better response than the one I used before.",
    "reflection": "Which habit supports the identity I want?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 160,
    "category": "Inner Healing",
    "affirmation": "My nervous system settles as I rest without believing I must earn it.",
    "reflection": "What part of me needs kindness today?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 161,
    "category": "Wealth Creation",
    "affirmation": "I am aligned with ethical abundance as I make thoughtful decisions instead of fearful ones.",
    "reflection": "What belief about money am I ready to upgrade?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 162,
    "category": "Positive Energy",
    "affirmation": "I honor my energy by choosing to trust that one difficult moment does not define my day.",
    "reflection": "What is draining me that I can gently release?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 163,
    "category": "Positive Change",
    "affirmation": "I am capable of lasting change because I release routines that no longer support who I am.",
    "reflection": "What can I begin again without shame?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 164,
    "category": "Inner Healing",
    "affirmation": "I choose compassion for myself when I remember that healing is not required to be linear.",
    "reflection": "How can I care for the younger part of me?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 165,
    "category": "Wealth Creation",
    "affirmation": "My relationship with money heals as I solve real problems with courage and care.",
    "reflection": "Where is an opportunity I may be overlooking?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 166,
    "category": "Positive Energy",
    "affirmation": "I carry hope into this moment as I speak to myself with encouragement and respect.",
    "reflection": "Where can I bring more light today?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 167,
    "category": "Positive Change",
    "affirmation": "I shape tomorrow whenever I let discomfort teach me without controlling me.",
    "reflection": "Where have I already grown more than I realize?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 168,
    "category": "Inner Healing",
    "affirmation": "I welcome healing without rushing it as I set loving boundaries that protect my well-being.",
    "reflection": "What would compassion say to me right now?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 169,
    "category": "Wealth Creation",
    "affirmation": "I claim the power to prosper whenever I follow through on ideas that can serve others.",
    "reflection": "What valuable step can I take today?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 170,
    "category": "Positive Energy",
    "affirmation": "My inner light strengthens when I pause before reacting and respond from my values.",
    "reflection": "What am I grateful to notice right now?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 171,
    "category": "Positive Change",
    "affirmation": "I turn lessons into strength as I speak honestly about what needs to change.",
    "reflection": "What would my future self choose today?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 172,
    "category": "Inner Healing",
    "affirmation": "I free myself from old pain when I accept love without searching for reasons to distrust it.",
    "reflection": "What burden am I ready to set down?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 173,
    "category": "Wealth Creation",
    "affirmation": "I build freedom and security as I recognize opportunities that match my values.",
    "reflection": "What resource can I manage more intentionally?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 174,
    "category": "Positive Energy",
    "affirmation": "I am grounded, open, and energized as I notice beauty in ordinary moments.",
    "reflection": "What would lift my energy by one percent?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 175,
    "category": "Positive Change",
    "affirmation": "I step into my power when I practice the habits that match my desired identity.",
    "reflection": "Which old pattern am I ready to interrupt?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 176,
    "category": "Inner Healing",
    "affirmation": "I remember my inherent worth as I recognize survival responses without judging myself.",
    "reflection": "Where can I create more emotional safety?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 177,
    "category": "Wealth Creation",
    "affirmation": "I receive more with gratitude when I stay open to income arriving through expected and unexpected paths.",
    "reflection": "What would wise financial confidence look like today?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 178,
    "category": "Positive Energy",
    "affirmation": "I make space for joy whenever I give my attention to people and places that nourish me.",
    "reflection": "How can I protect my energy with love?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 179,
    "category": "Positive Change",
    "affirmation": "I grow at my own honest pace as I choose courage more often than comfort.",
    "reflection": "What is the smallest meaningful change I can make?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 180,
    "category": "Inner Healing",
    "affirmation": "I create emotional safety when I choose peace even when I cannot change the past.",
    "reflection": "What feeling can I acknowledge without judgment?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 181,
    "category": "Wealth Creation",
    "affirmation": "I create a rich life by choosing to practice patience, discipline, and clear action.",
    "reflection": "How can my talents create more value?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 182,
    "category": "Positive Energy",
    "affirmation": "I transform the mood around me when I bring warmth and intention into my interactions.",
    "reflection": "What thought would better support my peace?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 183,
    "category": "Positive Change",
    "affirmation": "I create evidence of change whenever I allow myself to begin again without shame.",
    "reflection": "Which habit supports the identity I want?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 184,
    "category": "Inner Healing",
    "affirmation": "I let love reach the parts of me that hurt as I forgive myself for what I did while trying to survive.",
    "reflection": "What part of me needs kindness today?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 185,
    "category": "Wealth Creation",
    "affirmation": "I create wealth when I choose progress over perfection in my financial journey.",
    "reflection": "What belief about money am I ready to upgrade?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 186,
    "category": "Positive Energy",
    "affirmation": "I raise my energy when I choose curiosity instead of immediate judgment.",
    "reflection": "What is draining me that I can gently release?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 187,
    "category": "Positive Change",
    "affirmation": "I change my life when I take the next small action before I feel completely ready.",
    "reflection": "What can I begin again without shame?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 188,
    "category": "Inner Healing",
    "affirmation": "I heal from within when I offer myself the patience I once needed from others.",
    "reflection": "How can I care for the younger part of me?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 189,
    "category": "Wealth Creation",
    "affirmation": "My prosperity grows as I release scarcity thinking and choose possibility.",
    "reflection": "Where is an opportunity I may be overlooking?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 190,
    "category": "Positive Energy",
    "affirmation": "My presence becomes brighter as I set boundaries without guilt or anger.",
    "reflection": "Where can I bring more light today?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 191,
    "category": "Positive Change",
    "affirmation": "My future shifts each time I focus on the next right step, not the entire staircase.",
    "reflection": "Where have I already grown more than I realize?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 192,
    "category": "Inner Healing",
    "affirmation": "My heart feels safer as I replace harsh self-talk with a compassionate voice.",
    "reflection": "What would compassion say to me right now?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 193,
    "category": "Wealth Creation",
    "affirmation": "I welcome abundance when I take one focused step toward a valuable goal.",
    "reflection": "What valuable step can I take today?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 194,
    "category": "Positive Energy",
    "affirmation": "I welcome good energy by choosing to breathe deeply and soften unnecessary tension.",
    "reflection": "What am I grateful to notice right now?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 195,
    "category": "Positive Change",
    "affirmation": "I become stronger as I keep promises to myself with patience and compassion.",
    "reflection": "What would my future self choose today?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 196,
    "category": "Inner Healing",
    "affirmation": "I give myself permission to release blame while keeping the wisdom of the lesson.",
    "reflection": "What burden am I ready to set down?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 197,
    "category": "Wealth Creation",
    "affirmation": "Money supports my purpose as I save, earn, and grow from a place of self-respect.",
    "reflection": "What resource can I manage more intentionally?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 198,
    "category": "Positive Energy",
    "affirmation": "Peace moves through me whenever I celebrate small victories with genuine gratitude.",
    "reflection": "What would lift my energy by one percent?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 199,
    "category": "Positive Change",
    "affirmation": "I am free to reinvent myself when I accept that growth can be quiet and still be real.",
    "reflection": "Which old pattern am I ready to interrupt?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 200,
    "category": "Inner Healing",
    "affirmation": "I restore my inner peace when I let my body know that this moment is safe.",
    "reflection": "Where can I create more emotional safety?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 201,
    "category": "Wealth Creation",
    "affirmation": "I build lasting wealth each time I manage what I have with wisdom and gratitude.",
    "reflection": "What would wise financial confidence look like today?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 202,
    "category": "Positive Energy",
    "affirmation": "I protect my light when I release what drains me and welcome what restores me.",
    "reflection": "How can I protect my energy with love?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 203,
    "category": "Positive Change",
    "affirmation": "Growth becomes natural when I replace all-or-nothing thinking with steady progress.",
    "reflection": "What is the smallest meaningful change I can make?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 204,
    "category": "Inner Healing",
    "affirmation": "My healing deepens as I tell the truth about my needs with kindness.",
    "reflection": "What feeling can I acknowledge without judgment?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 205,
    "category": "Wealth Creation",
    "affirmation": "I am becoming financially stronger because I believe there is enough success for me and everyone.",
    "reflection": "How can my talents create more value?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 206,
    "category": "Positive Energy",
    "affirmation": "My day changes for the better as I let hope be stronger than yesterday's heaviness.",
    "reflection": "What thought would better support my peace?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 207,
    "category": "Positive Change",
    "affirmation": "I move beyond old patterns as I show up consistently, even in a small way.",
    "reflection": "Which habit supports the identity I want?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 208,
    "category": "Inner Healing",
    "affirmation": "I return to wholeness whenever I honor how far I have come through difficult seasons.",
    "reflection": "What part of me needs kindness today?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 209,
    "category": "Wealth Creation",
    "affirmation": "My income expands when I ask confidently for the value my work provides.",
    "reflection": "What belief about money am I ready to upgrade?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 210,
    "category": "Positive Energy",
    "affirmation": "I am a source of calm strength because I choose thoughts that support the life I want.",
    "reflection": "What is draining me that I can gently release?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 211,
    "category": "Positive Change",
    "affirmation": "I prove my resilience whenever I learn from setbacks instead of turning them into verdicts.",
    "reflection": "What can I begin again without shame?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 212,
    "category": "Inner Healing",
    "affirmation": "I am gentle with my story when I allow grief and hope to exist together.",
    "reflection": "How can I care for the younger part of me?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 213,
    "category": "Wealth Creation",
    "affirmation": "I honor the energy of money when I treat every dollar as a tool for freedom and good.",
    "reflection": "Where is an opportunity I may be overlooking?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 214,
    "category": "Positive Energy",
    "affirmation": "Joy finds me more easily when I remember that my energy is mine to guide.",
    "reflection": "Where can I bring more light today?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 215,
    "category": "Positive Change",
    "affirmation": "I create a new chapter when I turn intention into a clear and manageable plan.",
    "reflection": "Where have I already grown more than I realize?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 216,
    "category": "Inner Healing",
    "affirmation": "My wounded places soften as I listen to my feelings without letting them define me.",
    "reflection": "What would compassion say to me right now?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 217,
    "category": "Wealth Creation",
    "affirmation": "I attract valuable opportunities as I invest my time in skills that expand my future.",
    "reflection": "What valuable step can I take today?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 218,
    "category": "Positive Energy",
    "affirmation": "I create a positive atmosphere as I move my body and reconnect with the present.",
    "reflection": "What am I grateful to notice right now?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 219,
    "category": "Positive Change",
    "affirmation": "My potential unfolds as I make choices my future self will appreciate.",
    "reflection": "What would my future self choose today?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 220,
    "category": "Inner Healing",
    "affirmation": "I rebuild trust in myself when I receive support instead of carrying everything alone.",
    "reflection": "What burden am I ready to set down?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 221,
    "category": "Wealth Creation",
    "affirmation": "I am worthy of prosperity, and I notice the resources, relationships, and skills already around me.",
    "reflection": "What resource can I manage more intentionally?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 222,
    "category": "Positive Energy",
    "affirmation": "My energy is magnetic when I focus on what is present, possible, and good.",
    "reflection": "What would lift my energy by one percent?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 223,
    "category": "Positive Change",
    "affirmation": "I trust the process of change when I choose a better response than the one I used before.",
    "reflection": "Which old pattern am I ready to interrupt?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 224,
    "category": "Inner Healing",
    "affirmation": "I release shame each time I rest without believing I must earn it.",
    "reflection": "Where can I create more emotional safety?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 225,
    "category": "Wealth Creation",
    "affirmation": "My financial future brightens as I make thoughtful decisions instead of fearful ones.",
    "reflection": "What would wise financial confidence look like today?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 226,
    "category": "Positive Energy",
    "affirmation": "I return to gratitude when I trust that one difficult moment does not define my day.",
    "reflection": "How can I protect my energy with love?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 227,
    "category": "Positive Change",
    "affirmation": "I honor the person I am becoming as I release routines that no longer support who I am.",
    "reflection": "What is the smallest meaningful change I can make?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 228,
    "category": "Inner Healing",
    "affirmation": "I honor my emotions when I remember that healing is not required to be linear.",
    "reflection": "What feeling can I acknowledge without judgment?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 229,
    "category": "Wealth Creation",
    "affirmation": "I turn possibility into prosperity when I solve real problems with courage and care.",
    "reflection": "How can my talents create more value?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 230,
    "category": "Positive Energy",
    "affirmation": "I radiate confidence and kindness as I speak to myself with encouragement and respect.",
    "reflection": "What thought would better support my peace?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 231,
    "category": "Positive Change",
    "affirmation": "I build momentum every time I let discomfort teach me without controlling me.",
    "reflection": "Which habit supports the identity I want?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 232,
    "category": "Inner Healing",
    "affirmation": "I become my own safe place as I set loving boundaries that protect my well-being.",
    "reflection": "What part of me needs kindness today?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 233,
    "category": "Wealth Creation",
    "affirmation": "I allow wealth to reach me as I follow through on ideas that can serve others.",
    "reflection": "What belief about money am I ready to upgrade?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 234,
    "category": "Positive Energy",
    "affirmation": "My spirit feels lighter each time I pause before reacting and respond from my values.",
    "reflection": "What is draining me that I can gently release?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 235,
    "category": "Positive Change",
    "affirmation": "I choose my direction when I speak honestly about what needs to change.",
    "reflection": "What can I begin again without shame?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 236,
    "category": "Inner Healing",
    "affirmation": "I make peace with my past when I accept love without searching for reasons to distrust it.",
    "reflection": "How can I care for the younger part of me?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 237,
    "category": "Wealth Creation",
    "affirmation": "I multiply my resources by choosing to recognize opportunities that match my values.",
    "reflection": "Where is an opportunity I may be overlooking?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 238,
    "category": "Positive Energy",
    "affirmation": "I invite uplifting experiences when I notice beauty in ordinary moments.",
    "reflection": "Where can I bring more light today?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 239,
    "category": "Positive Change",
    "affirmation": "My courage expands as I practice the habits that match my desired identity.",
    "reflection": "Where have I already grown more than I realize?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 240,
    "category": "Inner Healing",
    "affirmation": "I nurture my inner child as I recognize survival responses without judging myself.",
    "reflection": "What would compassion say to me right now?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 241,
    "category": "Wealth Creation",
    "affirmation": "My talents become valuable income when I stay open to income arriving through expected and unexpected paths.",
    "reflection": "What valuable step can I take today?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 242,
    "category": "Positive Energy",
    "affirmation": "I choose the frequency of peace as I give my attention to people and places that nourish me.",
    "reflection": "What am I grateful to notice right now?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 243,
    "category": "Positive Change",
    "affirmation": "I release the past by choosing to choose courage more often than comfort.",
    "reflection": "What would my future self choose today?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 244,
    "category": "Inner Healing",
    "affirmation": "I reclaim my worth whenever I choose peace even when I cannot change the past.",
    "reflection": "What burden am I ready to set down?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 245,
    "category": "Wealth Creation",
    "affirmation": "I lead my money with confidence as I practice patience, discipline, and clear action.",
    "reflection": "What resource can I manage more intentionally?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 246,
    "category": "Positive Energy",
    "affirmation": "I become more alive whenever I bring warmth and intention into my interactions.",
    "reflection": "What would lift my energy by one percent?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 247,
    "category": "Positive Change",
    "affirmation": "I become consistent when I allow myself to begin again without shame.",
    "reflection": "Which old pattern am I ready to interrupt?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 248,
    "category": "Inner Healing",
    "affirmation": "I allow tenderness to guide me when I forgive myself for what I did while trying to survive.",
    "reflection": "Where can I create more emotional safety?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 249,
    "category": "Wealth Creation",
    "affirmation": "I make room for overflow when I choose progress over perfection in my financial journey.",
    "reflection": "What would wise financial confidence look like today?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 250,
    "category": "Positive Energy",
    "affirmation": "Good things grow around me when I choose curiosity instead of immediate judgment.",
    "reflection": "How can I protect my energy with love?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 251,
    "category": "Positive Change",
    "affirmation": "I welcome transformation as I take the next small action before I feel completely ready.",
    "reflection": "What is the smallest meaningful change I can make?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 252,
    "category": "Inner Healing",
    "affirmation": "My nervous system settles as I offer myself the patience I once needed from others.",
    "reflection": "What feeling can I acknowledge without judgment?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 253,
    "category": "Wealth Creation",
    "affirmation": "I am aligned with ethical abundance as I release scarcity thinking and choose possibility.",
    "reflection": "How can my talents create more value?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 254,
    "category": "Positive Energy",
    "affirmation": "I honor my energy by choosing to set boundaries without guilt or anger.",
    "reflection": "What thought would better support my peace?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 255,
    "category": "Positive Change",
    "affirmation": "I am capable of lasting change because I focus on the next right step, not the entire staircase.",
    "reflection": "Which habit supports the identity I want?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 256,
    "category": "Inner Healing",
    "affirmation": "I choose compassion for myself when I replace harsh self-talk with a compassionate voice.",
    "reflection": "What part of me needs kindness today?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 257,
    "category": "Wealth Creation",
    "affirmation": "My relationship with money heals as I take one focused step toward a valuable goal.",
    "reflection": "What belief about money am I ready to upgrade?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 258,
    "category": "Positive Energy",
    "affirmation": "I carry hope into this moment as I breathe deeply and soften unnecessary tension.",
    "reflection": "What is draining me that I can gently release?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 259,
    "category": "Positive Change",
    "affirmation": "I shape tomorrow whenever I keep promises to myself with patience and compassion.",
    "reflection": "What can I begin again without shame?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 260,
    "category": "Inner Healing",
    "affirmation": "I welcome healing without rushing it as I release blame while keeping the wisdom of the lesson.",
    "reflection": "How can I care for the younger part of me?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 261,
    "category": "Wealth Creation",
    "affirmation": "I claim the power to prosper whenever I save, earn, and grow from a place of self-respect.",
    "reflection": "Where is an opportunity I may be overlooking?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 262,
    "category": "Positive Energy",
    "affirmation": "My inner light strengthens when I celebrate small victories with genuine gratitude.",
    "reflection": "Where can I bring more light today?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 263,
    "category": "Positive Change",
    "affirmation": "I turn lessons into strength as I accept that growth can be quiet and still be real.",
    "reflection": "Where have I already grown more than I realize?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 264,
    "category": "Inner Healing",
    "affirmation": "I free myself from old pain when I let my body know that this moment is safe.",
    "reflection": "What would compassion say to me right now?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 265,
    "category": "Wealth Creation",
    "affirmation": "I build freedom and security as I manage what I have with wisdom and gratitude.",
    "reflection": "What valuable step can I take today?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 266,
    "category": "Positive Energy",
    "affirmation": "I am grounded, open, and energized as I release what drains me and welcome what restores me.",
    "reflection": "What am I grateful to notice right now?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 267,
    "category": "Positive Change",
    "affirmation": "I step into my power when I replace all-or-nothing thinking with steady progress.",
    "reflection": "What would my future self choose today?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 268,
    "category": "Inner Healing",
    "affirmation": "I remember my inherent worth as I tell the truth about my needs with kindness.",
    "reflection": "What burden am I ready to set down?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 269,
    "category": "Wealth Creation",
    "affirmation": "I receive more with gratitude when I believe there is enough success for me and everyone.",
    "reflection": "What resource can I manage more intentionally?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 270,
    "category": "Positive Energy",
    "affirmation": "I make space for joy whenever I let hope be stronger than yesterday's heaviness.",
    "reflection": "What would lift my energy by one percent?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 271,
    "category": "Positive Change",
    "affirmation": "I grow at my own honest pace as I show up consistently, even in a small way.",
    "reflection": "Which old pattern am I ready to interrupt?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 272,
    "category": "Inner Healing",
    "affirmation": "I create emotional safety when I honor how far I have come through difficult seasons.",
    "reflection": "Where can I create more emotional safety?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 273,
    "category": "Wealth Creation",
    "affirmation": "I create a rich life by choosing to ask confidently for the value my work provides.",
    "reflection": "What would wise financial confidence look like today?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 274,
    "category": "Positive Energy",
    "affirmation": "I transform the mood around me when I choose thoughts that support the life I want.",
    "reflection": "How can I protect my energy with love?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 275,
    "category": "Positive Change",
    "affirmation": "I create evidence of change whenever I learn from setbacks instead of turning them into verdicts.",
    "reflection": "What is the smallest meaningful change I can make?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 276,
    "category": "Inner Healing",
    "affirmation": "I let love reach the parts of me that hurt as I allow grief and hope to exist together.",
    "reflection": "What feeling can I acknowledge without judgment?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 277,
    "category": "Wealth Creation",
    "affirmation": "I create wealth when I treat every dollar as a tool for freedom and good.",
    "reflection": "How can my talents create more value?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 278,
    "category": "Positive Energy",
    "affirmation": "I raise my energy when I remember that my energy is mine to guide.",
    "reflection": "What thought would better support my peace?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 279,
    "category": "Positive Change",
    "affirmation": "I change my life when I turn intention into a clear and manageable plan.",
    "reflection": "Which habit supports the identity I want?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 280,
    "category": "Inner Healing",
    "affirmation": "I heal from within when I listen to my feelings without letting them define me.",
    "reflection": "What part of me needs kindness today?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 281,
    "category": "Wealth Creation",
    "affirmation": "My prosperity grows as I invest my time in skills that expand my future.",
    "reflection": "What belief about money am I ready to upgrade?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 282,
    "category": "Positive Energy",
    "affirmation": "My presence becomes brighter as I move my body and reconnect with the present.",
    "reflection": "What is draining me that I can gently release?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 283,
    "category": "Positive Change",
    "affirmation": "My future shifts each time I make choices my future self will appreciate.",
    "reflection": "What can I begin again without shame?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 284,
    "category": "Inner Healing",
    "affirmation": "My heart feels safer as I receive support instead of carrying everything alone.",
    "reflection": "How can I care for the younger part of me?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 285,
    "category": "Wealth Creation",
    "affirmation": "I welcome abundance when I notice the resources, relationships, and skills already around me.",
    "reflection": "Where is an opportunity I may be overlooking?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 286,
    "category": "Positive Energy",
    "affirmation": "I welcome good energy by choosing to focus on what is present, possible, and good.",
    "reflection": "Where can I bring more light today?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 287,
    "category": "Positive Change",
    "affirmation": "I become stronger as I choose a better response than the one I used before.",
    "reflection": "Where have I already grown more than I realize?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 288,
    "category": "Inner Healing",
    "affirmation": "I give myself permission to rest without believing I must earn it.",
    "reflection": "What would compassion say to me right now?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 289,
    "category": "Wealth Creation",
    "affirmation": "Money supports my purpose as I make thoughtful decisions instead of fearful ones.",
    "reflection": "What valuable step can I take today?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 290,
    "category": "Positive Energy",
    "affirmation": "Peace moves through me whenever I trust that one difficult moment does not define my day.",
    "reflection": "What am I grateful to notice right now?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 291,
    "category": "Positive Change",
    "affirmation": "I am free to reinvent myself when I release routines that no longer support who I am.",
    "reflection": "What would my future self choose today?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 292,
    "category": "Inner Healing",
    "affirmation": "I restore my inner peace when I remember that healing is not required to be linear.",
    "reflection": "What burden am I ready to set down?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 293,
    "category": "Wealth Creation",
    "affirmation": "I build lasting wealth each time I solve real problems with courage and care.",
    "reflection": "What resource can I manage more intentionally?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 294,
    "category": "Positive Energy",
    "affirmation": "I protect my light when I speak to myself with encouragement and respect.",
    "reflection": "What would lift my energy by one percent?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 295,
    "category": "Positive Change",
    "affirmation": "Growth becomes natural when I let discomfort teach me without controlling me.",
    "reflection": "Which old pattern am I ready to interrupt?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 296,
    "category": "Inner Healing",
    "affirmation": "My healing deepens as I set loving boundaries that protect my well-being.",
    "reflection": "Where can I create more emotional safety?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 297,
    "category": "Wealth Creation",
    "affirmation": "I am becoming financially stronger because I follow through on ideas that can serve others.",
    "reflection": "What would wise financial confidence look like today?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 298,
    "category": "Positive Energy",
    "affirmation": "My day changes for the better as I pause before reacting and respond from my values.",
    "reflection": "How can I protect my energy with love?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 299,
    "category": "Positive Change",
    "affirmation": "I move beyond old patterns as I speak honestly about what needs to change.",
    "reflection": "What is the smallest meaningful change I can make?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 300,
    "category": "Inner Healing",
    "affirmation": "I return to wholeness whenever I accept love without searching for reasons to distrust it.",
    "reflection": "What feeling can I acknowledge without judgment?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 301,
    "category": "Wealth Creation",
    "affirmation": "My income expands when I recognize opportunities that match my values.",
    "reflection": "How can my talents create more value?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 302,
    "category": "Positive Energy",
    "affirmation": "I am a source of calm strength because I notice beauty in ordinary moments.",
    "reflection": "What thought would better support my peace?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 303,
    "category": "Positive Change",
    "affirmation": "I prove my resilience whenever I practice the habits that match my desired identity.",
    "reflection": "Which habit supports the identity I want?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 304,
    "category": "Inner Healing",
    "affirmation": "I am gentle with my story when I recognize survival responses without judging myself.",
    "reflection": "What part of me needs kindness today?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 305,
    "category": "Wealth Creation",
    "affirmation": "I honor the energy of money when I stay open to income arriving through expected and unexpected paths.",
    "reflection": "What belief about money am I ready to upgrade?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 306,
    "category": "Positive Energy",
    "affirmation": "Joy finds me more easily when I give my attention to people and places that nourish me.",
    "reflection": "What is draining me that I can gently release?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 307,
    "category": "Positive Change",
    "affirmation": "I create a new chapter when I choose courage more often than comfort.",
    "reflection": "What can I begin again without shame?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 308,
    "category": "Inner Healing",
    "affirmation": "My wounded places soften as I choose peace even when I cannot change the past.",
    "reflection": "How can I care for the younger part of me?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 309,
    "category": "Wealth Creation",
    "affirmation": "I attract valuable opportunities as I practice patience, discipline, and clear action.",
    "reflection": "Where is an opportunity I may be overlooking?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 310,
    "category": "Positive Energy",
    "affirmation": "I create a positive atmosphere as I bring warmth and intention into my interactions.",
    "reflection": "Where can I bring more light today?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 311,
    "category": "Positive Change",
    "affirmation": "My potential unfolds as I allow myself to begin again without shame.",
    "reflection": "Where have I already grown more than I realize?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 312,
    "category": "Inner Healing",
    "affirmation": "I rebuild trust in myself when I forgive myself for what I did while trying to survive.",
    "reflection": "What would compassion say to me right now?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 313,
    "category": "Wealth Creation",
    "affirmation": "I am worthy of prosperity, and I choose progress over perfection in my financial journey.",
    "reflection": "What valuable step can I take today?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 314,
    "category": "Positive Energy",
    "affirmation": "My energy is magnetic when I choose curiosity instead of immediate judgment.",
    "reflection": "What am I grateful to notice right now?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 315,
    "category": "Positive Change",
    "affirmation": "I trust the process of change when I take the next small action before I feel completely ready.",
    "reflection": "What would my future self choose today?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 316,
    "category": "Inner Healing",
    "affirmation": "I release shame each time I offer myself the patience I once needed from others.",
    "reflection": "What burden am I ready to set down?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 317,
    "category": "Wealth Creation",
    "affirmation": "My financial future brightens as I release scarcity thinking and choose possibility.",
    "reflection": "What resource can I manage more intentionally?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 318,
    "category": "Positive Energy",
    "affirmation": "I return to gratitude when I set boundaries without guilt or anger.",
    "reflection": "What would lift my energy by one percent?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 319,
    "category": "Positive Change",
    "affirmation": "I honor the person I am becoming as I focus on the next right step, not the entire staircase.",
    "reflection": "Which old pattern am I ready to interrupt?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 320,
    "category": "Inner Healing",
    "affirmation": "I honor my emotions when I replace harsh self-talk with a compassionate voice.",
    "reflection": "Where can I create more emotional safety?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 321,
    "category": "Wealth Creation",
    "affirmation": "I turn possibility into prosperity when I take one focused step toward a valuable goal.",
    "reflection": "What would wise financial confidence look like today?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 322,
    "category": "Positive Energy",
    "affirmation": "I radiate confidence and kindness as I breathe deeply and soften unnecessary tension.",
    "reflection": "How can I protect my energy with love?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 323,
    "category": "Positive Change",
    "affirmation": "I build momentum every time I keep promises to myself with patience and compassion.",
    "reflection": "What is the smallest meaningful change I can make?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 324,
    "category": "Inner Healing",
    "affirmation": "I become my own safe place as I release blame while keeping the wisdom of the lesson.",
    "reflection": "What feeling can I acknowledge without judgment?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 325,
    "category": "Wealth Creation",
    "affirmation": "I allow wealth to reach me as I save, earn, and grow from a place of self-respect.",
    "reflection": "How can my talents create more value?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 326,
    "category": "Positive Energy",
    "affirmation": "My spirit feels lighter each time I celebrate small victories with genuine gratitude.",
    "reflection": "What thought would better support my peace?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 327,
    "category": "Positive Change",
    "affirmation": "I choose my direction when I accept that growth can be quiet and still be real.",
    "reflection": "Which habit supports the identity I want?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 328,
    "category": "Inner Healing",
    "affirmation": "I make peace with my past when I let my body know that this moment is safe.",
    "reflection": "What part of me needs kindness today?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 329,
    "category": "Wealth Creation",
    "affirmation": "I multiply my resources by choosing to manage what I have with wisdom and gratitude.",
    "reflection": "What belief about money am I ready to upgrade?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 330,
    "category": "Positive Energy",
    "affirmation": "I invite uplifting experiences when I release what drains me and welcome what restores me.",
    "reflection": "What is draining me that I can gently release?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 331,
    "category": "Positive Change",
    "affirmation": "My courage expands as I replace all-or-nothing thinking with steady progress.",
    "reflection": "What can I begin again without shame?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 332,
    "category": "Inner Healing",
    "affirmation": "I nurture my inner child as I tell the truth about my needs with kindness.",
    "reflection": "How can I care for the younger part of me?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 333,
    "category": "Wealth Creation",
    "affirmation": "My talents become valuable income when I believe there is enough success for me and everyone.",
    "reflection": "Where is an opportunity I may be overlooking?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 334,
    "category": "Positive Energy",
    "affirmation": "I choose the frequency of peace as I let hope be stronger than yesterday's heaviness.",
    "reflection": "Where can I bring more light today?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 335,
    "category": "Positive Change",
    "affirmation": "I release the past by choosing to show up consistently, even in a small way.",
    "reflection": "Where have I already grown more than I realize?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 336,
    "category": "Inner Healing",
    "affirmation": "I reclaim my worth whenever I honor how far I have come through difficult seasons.",
    "reflection": "What would compassion say to me right now?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 337,
    "category": "Wealth Creation",
    "affirmation": "I lead my money with confidence as I ask confidently for the value my work provides.",
    "reflection": "What valuable step can I take today?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 338,
    "category": "Positive Energy",
    "affirmation": "I become more alive whenever I choose thoughts that support the life I want.",
    "reflection": "What am I grateful to notice right now?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 339,
    "category": "Positive Change",
    "affirmation": "I become consistent when I learn from setbacks instead of turning them into verdicts.",
    "reflection": "What would my future self choose today?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 340,
    "category": "Inner Healing",
    "affirmation": "I allow tenderness to guide me when I allow grief and hope to exist together.",
    "reflection": "What burden am I ready to set down?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 341,
    "category": "Wealth Creation",
    "affirmation": "I make room for overflow when I treat every dollar as a tool for freedom and good.",
    "reflection": "What resource can I manage more intentionally?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 342,
    "category": "Positive Energy",
    "affirmation": "Good things grow around me when I remember that my energy is mine to guide.",
    "reflection": "What would lift my energy by one percent?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 343,
    "category": "Positive Change",
    "affirmation": "I welcome transformation as I turn intention into a clear and manageable plan.",
    "reflection": "Which old pattern am I ready to interrupt?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 344,
    "category": "Inner Healing",
    "affirmation": "My nervous system settles as I listen to my feelings without letting them define me.",
    "reflection": "Where can I create more emotional safety?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 345,
    "category": "Wealth Creation",
    "affirmation": "I am aligned with ethical abundance as I invest my time in skills that expand my future.",
    "reflection": "What would wise financial confidence look like today?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 346,
    "category": "Positive Energy",
    "affirmation": "I honor my energy by choosing to move my body and reconnect with the present.",
    "reflection": "How can I protect my energy with love?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 347,
    "category": "Positive Change",
    "affirmation": "I am capable of lasting change because I make choices my future self will appreciate.",
    "reflection": "What is the smallest meaningful change I can make?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 348,
    "category": "Inner Healing",
    "affirmation": "I choose compassion for myself when I receive support instead of carrying everything alone.",
    "reflection": "What feeling can I acknowledge without judgment?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 349,
    "category": "Wealth Creation",
    "affirmation": "My relationship with money heals as I notice the resources, relationships, and skills already around me.",
    "reflection": "How can my talents create more value?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 350,
    "category": "Positive Energy",
    "affirmation": "I carry hope into this moment as I focus on what is present, possible, and good.",
    "reflection": "What thought would better support my peace?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 351,
    "category": "Positive Change",
    "affirmation": "I shape tomorrow whenever I choose a better response than the one I used before.",
    "reflection": "Which habit supports the identity I want?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 352,
    "category": "Inner Healing",
    "affirmation": "I welcome healing without rushing it as I rest without believing I must earn it.",
    "reflection": "What part of me needs kindness today?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 353,
    "category": "Wealth Creation",
    "affirmation": "I claim the power to prosper whenever I make thoughtful decisions instead of fearful ones.",
    "reflection": "What belief about money am I ready to upgrade?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 354,
    "category": "Positive Energy",
    "affirmation": "My inner light strengthens when I trust that one difficult moment does not define my day.",
    "reflection": "What is draining me that I can gently release?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 355,
    "category": "Positive Change",
    "affirmation": "I turn lessons into strength as I release routines that no longer support who I am.",
    "reflection": "What can I begin again without shame?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 356,
    "category": "Inner Healing",
    "affirmation": "I free myself from old pain when I remember that healing is not required to be linear.",
    "reflection": "How can I care for the younger part of me?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 357,
    "category": "Wealth Creation",
    "affirmation": "I build freedom and security as I solve real problems with courage and care.",
    "reflection": "Where is an opportunity I may be overlooking?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 358,
    "category": "Positive Energy",
    "affirmation": "I am grounded, open, and energized as I speak to myself with encouragement and respect.",
    "reflection": "Where can I bring more light today?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 359,
    "category": "Positive Change",
    "affirmation": "I step into my power when I let discomfort teach me without controlling me.",
    "reflection": "Where have I already grown more than I realize?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 360,
    "category": "Inner Healing",
    "affirmation": "I remember my inherent worth as I set loving boundaries that protect my well-being.",
    "reflection": "What would compassion say to me right now?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 361,
    "category": "Wealth Creation",
    "affirmation": "I receive more with gratitude when I follow through on ideas that can serve others.",
    "reflection": "What valuable step can I take today?",
    "action": "Write down one income-building idea."
  },
  {
    "day": 362,
    "category": "Positive Energy",
    "affirmation": "I make space for joy whenever I pause before reacting and respond from my values.",
    "reflection": "What am I grateful to notice right now?",
    "action": "Name three small things that feel good today."
  },
  {
    "day": 363,
    "category": "Positive Change",
    "affirmation": "I grow at my own honest pace as I speak honestly about what needs to change.",
    "reflection": "What would my future self choose today?",
    "action": "Write the next step in five words or fewer."
  },
  {
    "day": 364,
    "category": "Inner Healing",
    "affirmation": "I create emotional safety when I accept love without searching for reasons to distrust it.",
    "reflection": "What burden am I ready to set down?",
    "action": "Allow ten quiet minutes without needing to perform."
  },
  {
    "day": 365,
    "category": "Wealth Creation",
    "affirmation": "I create a rich life by choosing to recognize opportunities that match my values.",
    "reflection": "What resource can I manage more intentionally?",
    "action": "Write down one income-building idea."
  }
];

/**
 * The full 365-day journey: the forty original Aurelia affirmations open the
 * year, followed by the rest of the library from day 41 onward.
 */
export const affirmations: Affirmation[] = [
  ...AURELIA_FORTY,
  ...libraryBase.slice(AURELIA_FORTY.length),
];

export function getAffirmation(day: number): Affirmation {
  const total = affirmations.length;
  const index = (((day - 1) % total) + total) % total;
  return affirmations[index]!;
}

