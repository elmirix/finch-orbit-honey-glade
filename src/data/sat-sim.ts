import type { Question } from "./types";
import { q } from "./q";

const note =
  "The clinic added Saturday hours, but only for blood tests. Doctor visits stay on weekdays. Patients who arrive on Saturday for a consultation are asked to book a weekday instead.";

export const satSimulation: Question[] = [
  q("sat-s1", "Какова главная мысль записки?", ["По субботам клиника делает только анализы крови", "Врач принимает по субботам", "Клиника закрылась", "Анализы отменили"], 0, "Saturday hours есть, но only for blood tests. Консультации остаются на буднях.", note, "Текст"),
  q("sat-s2", "Что просят сделать пациента, который пришёл в субботу к врачу?", ["Сдать анализ вместо консультации без записи", "Записаться на будний день", "Подождать в субботу до вечера", "Прийти в воскресенье"], 1, "asked to book a weekday instead.", note, "Текст"),
  q("sat-s3", "Выберите фразу без ошибки.", ["The set of results are ready.", "The set of results is ready.", "The set of results be ready.", "The set of results ready."], 1, "Подлежащее set — единственное число."),
  q("sat-s4", "Какая правка лаконичнее?", ["in order to see a nurse", "to see a nurse", "for the purpose of seeing to a nurse", "in order for to see a nurse"], 1, "To заменяет in order to без потери смысла."),
  q("sat-s5", "Какое предложение лишнее в абзаце про часы клиники?", ["Blood tests are available on Saturday.", "Consultations remain on weekdays.", "The museum sells posters in July.", "Saturday is not for doctor visits."], 2, "Музей не относится к часам клиники."),
  q("sat-s6", "Решите: 3x − 2 = 13.", ["x = 3", "x = 5", "x = 11", "x = 15"], 1, "3x = 15, x = 5."),
  q("sat-s7", "2/3 = x/12. Чему равен x?", ["6", "8", "9", "18"], 1, "2 · 12 = 3x, 24 = 3x, x = 8."),
  q("sat-s8", "x + y = 9 и x − y = 1. Чему равен x?", ["4", "5", "6", "8"], 1, "Сумма уравнений: 2x = 10, x = 5."),
  q("sat-s9", "Корни y = (x − 1)(x − 6) равны…", ["1 и 6", "−1 и −6", "5 и 6", "1 и −6"], 0, "Множители дают x = 1 и x = 6."),
  q("sat-s10", "Модель C = 25 + 10h. Что означает 25?", ["Цена часа", "Стартовая плата при h = 0", "Число часов", "Скидка 25%"], 1, "Свободный член — плата ещё до первого часа."),
];
