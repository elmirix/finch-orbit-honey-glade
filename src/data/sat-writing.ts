import type { Subject } from "./types";
import { q } from "./q";

export const satWriting: Subject = {
  id: "writing",
  title: "Письмо и язык",
  official: "Writing & Language",
  description:
    "Грамматика предложения, логика абзаца и лаконичный стиль. Вы выбираете лучшую правку — как в секции Writing & Language.",
  icon: "pen",
  topics: [
    {
      id: "grammar",
      title: "Грамматика предложения",
      blurb: "Согласование, местоимения и границы предложения.",
      minutes: 14,
      theory: [
        {
          title: "Подлежащее командует глаголом",
          paragraphs: [
            "Глагол согласуется с подлежащим, а не с ближайшим существительным. Each, everyone и every требуют единственного числа: everyone is, each of the students has.",
          ],
          bullets: [
            "The list of dates is long. Подлежащее — list",
            "She doesn't, не she don't",
            "Между двумя полными предложениями нужна точка, точка с запятой или союз",
          ],
        },
        {
          title: "Местоимение",
          paragraphs: [
            "It, they, this должны иметь ясный предшественник. Если this висит одно, лучше this delay / this rule — с существительным.",
          ],
        },
      ],
      practice: [
        q("sat-gr-p1", "В каком варианте нет ошибки?", ["She don't like the plan.", "She doesn't like the plan.", "She not like the plan.", "She doesn't likes the plan."], 1, "Третье лицо единственного числа: doesn't + начальная форма."),
        q("sat-gr-p2", "Выберите верное согласование.", ["The list of dates are long.", "The list of dates is long.", "The list of dates be long.", "The list of dates were long."], 1, "Подлежащее list — единственное число. Dates только дополнение."),
        q("sat-gr-p3", "Какая склейка двух мыслей верна?", ["The bus was late, we walked.", "The bus was late, so we walked.", "The bus was late we walked.", "The bus was late, so, we walked home and."], 1, "Нужен союз so между двумя основами. Запятая без союза — comma splice."),
      ],
      quiz: [
        q("sat-gr-q1", "Everyone in the group ___ ready.", ["are", "were", "is", "be"], 2, "Everyone согласуется с глаголом в единственном числе: is."),
        q("sat-gr-q2", "Какое местоимение яснее?", ["The rule changed. This annoyed students.", "The rule changed. This change annoyed students.", "The rule changed. They annoyed it.", "The rule changed, which students."], 1, "This change называет, что именно раздражает. Голое this легко потерять."),
        q("sat-gr-q3", "Each of the answers ___ correct.", ["are", "were", "have", "is"], 3, "Each of + множественное всё равно даёт единственное число: is."),
        q("sat-gr-q4", "Что такое comma splice?", ["Две полные мысли, соединённые только запятой", "Запятая перед and в списке из трёх пунктов", "Точка в конце абзаца", "Лишний артикль"], 0, "Две независимые клаузы нельзя склеивать одной запятой без союза."),
      ],
    },
    {
      id: "structure",
      title: "Структура абзаца",
      blurb: "Куда поставить предложение, чтобы оно держало тему, а не ломало переход.",
      minutes: 13,
      theory: [
        {
          title: "Абзац обещает одно",
          paragraphs: [
            "Первое предложение абзаца задаёт тему. Новая мысль про другой предмет, даже интересная, уходит в другой абзац. Предложение-мост стоит там, где читатель ещё помнит обе стороны.",
          ],
        },
        {
          title: "Порядок",
          paragraphs: [
            "Обычно так: тезис, пояснение, конкретный пример, вывод. Пример не ставят раньше, чем сказано, что он иллюстрирует.",
          ],
          note: "Если вопрос Where should the sentence be placed, проверьте, на какое существительное ссылается местоимение в этом предложении. Предшественник должен быть уже назван.",
        },
      ],
      practice: [
        q("sat-st-p1", "Абзац о пользе сна. Какое предложение лишнее?", ["Teenagers need about nine hours.", "A short nap can restore focus.", "The school cafeteria sells soup on Friday.", "Screens before bed delay sleep."], 2, "Суп в столовой не про сон. Остальные держат тему."),
        q("sat-st-p2", "Куда логичнее поставить пример?", ["До того, как названа идея", "Сразу после идеи, которую он поясняет", "В заголовок другого текста", "Вместо тезиса"], 1, "Пример работает, только если читатель уже знает, что именно поясняют."),
        q("sat-st-p3", "Предложение начинается с This policy. Где ему место?", ["До упоминания любой политики", "После предложения, где политика уже названа", "В списке источников", "Внутри цитаты без связи"], 1, "This policy требует уже названного предшественника."),
      ],
      quiz: [
        q("sat-st-q1", "Какой порядок абзаца удачнее?", ["Пример, потом неизвестно о чём он", "Тезис, пояснение, пример", "Три несвязанных факта", "Вывод, который противоречит примеру без оговорки"], 1, "Читатель сначала получает обещание абзаца, затем опору."),
        q("sat-st-q2", "Зачем нужен переходное слово however?", ["Чтобы повторить ту же мысль", "Чтобы показать контраст с предыдущей фразой", "Чтобы начать список покупок", "Чтобы заменить точку"], 1, "However предупреждает: сейчас будет ограничение или спор."),
        q("sat-st-q3", "Какое предложение лучше завершает абзац о ночных автобусах для смен больницы?", ["Поэтому редкий рейс оставляет работников без дороги домой.", "В меню кафе появился суп.", "Автор любит синий цвет.", "Автобусы изобрели давно, и это всё."], 0, "Финал должен собирать уже заданную тему, а не открывать новую."),
        q("sat-st-q4", "Признак лишнего предложения:", ["Оно называет число", "Оно уводит в другую тему, чем обещанная первой фразой", "Оно короче соседних", "В нём есть запятая"], 1, "Длина не важна. Важно, держит ли предложение тему абзаца."),
      ],
    },
    {
      id: "style",
      title: "Стиль и лаконичность",
      blurb: "Убрать повтор, выбрать точный глагол и не повышать тон без нужды.",
      minutes: 12,
      theory: [
        {
          title: "Короче, если смысл тот же",
          paragraphs: [
            "SAT часто просит самый лаконичный вариант. Due to the fact that значит because. A large number of значит many. Повтор слова рядом почти всегда лишний.",
          ],
          bullets: [
            "in order to → to",
            "the reason is because → the reason is that / because",
            "completely finish → finish",
          ],
        },
        {
          title: "Тон",
          paragraphs: [
            "Справочный абзац не переходит на восклицания и разговорные оценки вроде awesome. Тон соседей должен совпасть: если вокруг спокойное описание, не вставляйте приказ читателю.",
          ],
        },
      ],
      practice: [
        q("sat-sty-p1", "Какая правка лаконичнее и точнее?", ["due to the fact that", "because", "based off of the fact that", "in light of the fact that"], 1, "Because говорит то же самое без тяжёлой рамки."),
        q("sat-sty-p2", "Где нет лишнего повтора?", ["She finished and completed the form.", "She finished the form.", "She completely finished up the form entirely.", "She did a finishing of the form."], 1, "Finished уже содержит завершение. Остальные варианты дублируют смысл."),
        q("sat-sty-p3", "Какой тон уместен в справке о библиотеке?", ["You won't believe this awesome room!", "The reading room stays open until 10 p.m.", "Wow, books are literally everything.", "Don't even think of leaving early!!!"], 1, "Справка держит ровный информационный тон."),
      ],
      quiz: [
        q("sat-sty-q1", "Чем заменить in order to?", ["for the purpose of", "to", "so as in order to", "in order for to"], 1, "To достаточно. Остальное либо длиннее, либо сломано."),
        q("sat-sty-q2", "Какая фраза грамматически и стилистически лучше?", ["The reason is because the bus was late.", "The reason is that the bus was late.", "The reason is because of the bus was late.", "The reason why is because the bus."], 1, "Reason is that, а не reason is because: because уже содержит причину."),
        q("sat-sty-q3", "Что удалить в completely essential?", ["completely", "essential", "оба слова", "ничего: так точнее"], 0, "Essential уже значит «совершенно необходимый». Completely не добавляет смысла."),
        q("sat-sty-q4", "Когда разговорное слово неуместно?", ["В реплике персонажа, если так говорит герой", "В нейтральном информационном абзаце среди спокойных фраз", "В цитате подростка", "В заголовке блога, который сам так написан"], 1, "Стиль правки должен совпасть с уже заданным тоном абзаца."),
      ],
    },
  ],
};
