import type { Subject } from "./types";
import { q } from "./q";

const formScript =
  "Receptionist: The photography club meets on Thursday, not Tuesday. Please write your family name as Khan. The room is B12, on the first floor. Bring a student card; a passport is not accepted.";

const mapScript =
  "Guide: You are at the gate. The cafe is on your left, next to the ticket office. The lake is straight ahead. To reach the bird hide, cross the bridge and turn right. Do not take the left path — that goes to the car park.";

const mcqScript =
  "Tutor: The field trip is on 14 May. We leave at 8:15, not at 8:50. Lunch is not included, but the museum ticket is. If it rains, we still go; only a storm warning would cancel the trip.";

export const ieltsListening: Subject = {
  id: "listening",
  title: "Аудирование",
  official: "Listening",
  description:
    "В демо вместо аудио дан короткий скрипт. Тренируются те же ловушки IELTS: исправление, отвлечение и точная форма ответа.",
  icon: "headphones",
  topics: [
    {
      id: "forms",
      title: "Заполнение бланка",
      blurb: "Имя, день и номер комнаты: слушайте поправку, а не первую цифру.",
      minutes: 12,
      theory: [
        {
          title: "Первое слово часто отменяют",
          paragraphs: [
            "В IELTS диктор называет день или номер и тут же поправляет себя: not Tuesday, Thursday. В бланк идёт последняя верная форма, написанная точно так, как просят: фамилия, не имя.",
          ],
          note: "Лимит слов в настоящем тесте решает всё. В этих заданиях выбирайте вариант, который не нарушил бы подсказку ONE WORD или номер комнаты.",
        },
        {
          title: "Отвлекающая бумага",
          paragraphs: ["Паспорт могут назвать, чтобы отвергнуть. В ответ попадает то, что принимают: student card."],
        },
      ],
      practice: [
        q("iel-form-p1", "В какой день встреча клуба?", ["Во вторник", "В среду", "В четверг", "В пятницу"], 2, "Сказано not Tuesday, встречается в Thursday.", formScript, "Скрипт"),
        q("iel-form-p2", "Как записать фамилию?", ["Photography", "Khan", "B12", "Card"], 1, "family name as Khan. Остальное — клуб, комната и документ."),
        q("iel-form-p3", "Какой документ просят принести?", ["Паспорт", "Студенческий билет", "Водительские права", "Ничего"], 1, "Bring a student card; паспорт прямо не принимают.", formScript, "Скрипт"),
      ],
      quiz: [
        q("iel-form-q1", "Номер комнаты…", ["B21", "B12", "12B", "1st"], 1, "The room is B12. First floor — этаж, не номер.", formScript, "Скрипт"),
        q("iel-form-q2", "Где находится комната?", ["В подвале", "На первом этаже", "На крыше", "У озера"], 1, "on the first floor.", formScript, "Скрипт"),
        q("iel-form-q3", "Какую ловушку использует диктор про день?", ["Называет верный день дважды", "Сначала даёт неверный день и отменяет его", "Не называет день", "Просит угадать"], 1, "Not Tuesday отменяет первую догадку."),
        q("iel-form-q4", "Что нельзя писать в графе фамилии по этому скрипту?", ["Khan", "Название клуба вместо фамилии", "Фамилию буквами", "Одно слово"], 1, "Клуб — это не family name. В графу идёт Khan."),
      ],
    },
    {
      id: "maps",
      title: "Карта и схема",
      blurb: "Лево, право и ориентир от ворот. Лишний поворот — отдельная ловушка.",
      minutes: 12,
      theory: [
        {
          title: "Встаньте в точку старта",
          paragraphs: [
            "Фраза You are at the gate задаёт, откуда считать left и straight ahead. Не переносите «налево» на следующую точку, пока диктор не скажет новый ориентир.",
          ],
        },
        {
          title: "Отрицательный маршрут",
          paragraphs: ["Do not take the left path значит: левая тропа существует, но это не ответ. Её называют, чтобы сбить."],
        },
      ],
      practice: [
        q("iel-map-p1", "Где кафе относительно ворот?", ["Справа у озера", "Слева, рядом с кассой", "За мостом", "На парковке"], 1, "on your left, next to the ticket office.", mapScript, "Скрипт"),
        q("iel-map-p2", "Куда идти к укрытию для наблюдения за птицами?", ["Через мост и направо", "Налево к парковке", "Назад к воротам", "Прямо в кафе"], 0, "Cross the bridge and turn right. Левая тропа ведёт на парковку.", mapScript, "Скрипт"),
        q("iel-map-p3", "Что находится прямо впереди?", ["Касса", "Озеро", "Парковка", "Птицы"], 1, "The lake is straight ahead.", mapScript, "Скрипт"),
      ],
      quiz: [
        q("iel-map-q1", "Куда ведёт левая тропа после моста?", ["К укрытию", "На парковку", "В кафе", "В кассу"], 1, "that goes to the car park — и её просят не брать.", mapScript, "Скрипт"),
        q("iel-map-q2", "Рядом с чем кафе?", ["С озером", "С кассой", "С мостом", "С укрытием"], 1, "next to the ticket office.", mapScript, "Скрипт"),
        q("iel-map-q3", "С чего начать разбор карты?", ["С конца маршрута", "С точки, где диктор ставит слушателя", "С самой дальней подписи", "С парковки, даже если вы не там"], 1, "Left и ahead считаются от gate."),
        q("iel-map-q4", "Почему в скрипте есть неверный поворот?", ["Чтобы заполнить паузу", "Это типичная ловушка: объект назван, но отменён", "Потому что парковка и есть ответ", "Диктор ошибся и поправиться не успел"], 1, "Do not take помечает отвлекающий ориентир."),
      ],
    },
    {
      id: "mcq",
      title: "Множественный выбор",
      blurb: "Время, что входит в цену и при каком условии поездку отменят.",
      minutes: 13,
      theory: [
        {
          title: "Два времени — одно верное",
          paragraphs: [
            "8:15 и 8:50 прозвучат оба. Верное то, которое не отменено частицей not. В бланке IELTS время пишут так, как в задании; здесь достаточно выбрать смысл.",
          ],
        },
        {
          title: "Included / not included",
          paragraphs: ["Билет музея оплачен, обед нет. Отмена только при storm warning, обычный дождь поездку не снимает."],
        },
      ],
      practice: [
        q("iel-mcq-p1", "Когда выезд?", ["В 8:15", "В 8:50", "В полдень", "14 мая вечером"], 0, "We leave at 8:15, not at 8:50. 14 мая — дата, не час.", mcqScript, "Скрипт"),
        q("iel-mcq-p2", "Что уже входит?", ["Обед", "Билет в музей", "Ужин", "Дождевики"], 1, "museum ticket is included, lunch is not.", mcqScript, "Скрипт"),
        q("iel-mcq-p3", "Когда поездку отменят?", ["Если будет обычный дождь", "Если объявят штормовое предупреждение", "Если студент опоздает", "Её не отменяют никогда"], 1, "If it rains, we still go; only a storm warning would cancel the trip.", mcqScript, "Скрипт"),
      ],
      quiz: [
        q("iel-mcq-q1", "Какая дата выезда?", ["4 мая", "14 мая", "15 мая", "8 мая"], 1, "The field trip is on 14 May.", mcqScript, "Скрипт"),
        q("iel-mcq-q2", "Что студент должен учесть про обед?", ["Его выдадут в автобусе", "Он не включён", "Он обязателен и уже оплачен", "Его заменяет билет"], 1, "Lunch is not included.", mcqScript, "Скрипт"),
        q("iel-mcq-q3", "Какое время является ловушкой?", ["8:15", "8:50", "14:00", "Полночь"], 1, "8:50 названо с not. Верный выезд — 8:15."),
        q("iel-mcq-q4", "Если идёт дождь без штормового предупреждения, группа…", ["остаётся в кампусе", "всё равно едет", "переносит поездку на год", "идёт только в кафе"], 1, "we still go.", mcqScript, "Скрипт"),
      ],
    },
  ],
};
