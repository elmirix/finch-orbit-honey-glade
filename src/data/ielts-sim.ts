import type { Question } from "./types";
import { q } from "./q";

const script =
  "Clerk: The workshop is on Wednesday at 6:30, not 4:30. It is in room C2. You need a pencil; pens are not provided. If the tutor is late, wait ten minutes.";

const read =
  "The college garden is open to all students on weekdays. Visitors from other colleges may enter only on Friday. The notice does not mention weekends. Tools can be borrowed, but gloves are not supplied.";

export const ieltsSimulation: Question[] = [
  q("iel-s1", "В какой день семинар?", ["Во вторник", "В среду", "В четверг", "В пятницу"], 1, "on Wednesday. Время — отдельная деталь.", script, "Скрипт"),
  q("iel-s2", "Во сколько начало?", ["В 4:30", "В 6:30", "В десять", "Утром"], 1, "at 6:30, not 4:30.", script, "Скрипт"),
  q("iel-s3", "Что нужно принести?", ["Ручку", "Карандаш", "Перчатки", "Карту"], 1, "You need a pencil; pens are not provided.", script, "Скрипт"),
  q("iel-s4", "Комната семинара…", ["B12", "C2", "2C", "ворота"], 1, "room C2.", script, "Скрипт"),
  q("iel-s5", "Сад открыт всем студентам колледжа по будням.", ["True", "False", "Not Given", "Только по пятницам"], 0, "open to all students on weekdays.", read, "Текст"),
  q("iel-s6", "Гости из других колледжей могут прийти в понедельник.", ["True", "False", "Not Given", "Только с инструментами"], 1, "Им можно only on Friday. Понедельник противоречит тексту.", read, "Текст"),
  q("iel-s7", "Сад работает в воскресенье.", ["True", "False", "Not Given", "Только утром"], 2, "Про выходные объявление молчит. Это Not Given, не False."),
  q("iel-s8", "Какой обзор сильнее для графика «автобусы выросли, машины снизились»?", ["There are numbers.", "Overall, bus use increased while car use declined.", "I prefer buses.", "20, 21, 22."], 1, "Overview называет оба ряда и направления."),
  q("iel-s9", "Do you walk to class? Ответ уровня Part 1:", ["Yes, when it is not raining, because the campus is close.", "Walking, history, economics, and my full biography.", "The bar chart peaked.", "No comment forever."], 0, "Короткий ответ и одна причина."),
  q("iel-s10", "На карточке Part 2 минуту подготовки лучше потратить на…", ["четыре опоры по пунктам карточки", "дословное чужое эссе", "пустой лист и импровизацию без плана", "график Task 1"], 0, "Опоры закрывают все пункты и оставляют живую речь."),
];
