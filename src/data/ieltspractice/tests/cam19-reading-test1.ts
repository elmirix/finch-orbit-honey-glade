import type { PracticeTest } from "./types";

export const cam19ReadingTest1: PracticeTest = {
  id: "cam19-gt-reading-test1",
  module: "reading",
  title: "Cambridge IELTS 19 General Training — Reading Test 1",
  durationMinutes: 60,

  sections: [
    // =====================================================
    // PASSAGE 1
    // =====================================================
    {
      id: "cam19-r1-sec1",
      title: "Passage 1: Gobridge Tramlink & Adorable Knitwear",
      instruction: "Read the texts below and answer Questions 1–14.",
      passage: `==== Read the text below and answer Questions 1-7. ====

GOBRIDGE TRAMLINK – FREQUENTLY ASKED QUESTIONS (FAQs)

Here are some of the frequently asked questions about the tram service in Gobridge town.

When do the trams run?

Gobridge Tramlink operates a network of trams that run throughout the year and provide links to main services, stations and the airport. Timetables are reviewed in October and March, and may alter slightly so check before you travel. Our first tram from the city centre leaves from Marvin Square at 6.30 am, half an hour after the first city bus service.

Can I get a tram from the airport?

Trams from the airport to the city centre start running at 6.15 am and leave every fifteen minutes until 7.30 pm when the evening schedule takes over. Trams then run to the main railway station at 35-minute intervals and end at 11.35 pm. If your flight arrives later than this, the number 207 airport bus runs every hour through the night.

What do I do if I don't have a ticket?

Tickets are not sold by anyone on the tram. Ticket vending machines are located at all tram shelters. Check your route and make sure you buy the correct price ticket. If the vending machine does not work, you should push the red button on the machine and speak into the microphone. A member of staff will either fix the machine straight away or contact the tram inspector onboard your tram. He or she cannot sell you a ticket, but you will not be obliged to pay the £8 on-board fine for not having one.

Can I take my bike on the tram?

Each tram is licensed to carry a maximum of two bicycles, though drivers may refuse to allow cyclists to get on if the tram is crowded. Bicycles may only be taken on the trams during off-peak travel periods: up to 7.30 am, between 10 am and 2.30 pm and after 7 pm. Festivals and other large events may also mean that bicycles are prohibited as trams carry extra passengers at these times. Once on board, riders should remain with their bicycles throughout the journey and ensure they do not obstruct the entrance, exit or any other area of public access.

==== Read the text below and answer Questions 8-14. ====

ADORABLE KNITWEAR – ONLINE CUSTOMER REVIEWS

A — Mary-Anne

I spent a while thinking about buying this sweater because of the price, but I'm glad I finally did. It's a long sweater but that's good as I'm quite tall. I normally find that the sleeves are too short when I try on a top, but not with this one. I tend to take medium but went for large, which was a wise decision as there is plenty of room for a T-shirt underneath when I wear it with jeans.

B — Davina

These sweaters are an ideal weight for office wear. The purple one is pretty, though I expected a lighter shade from the picture. I wear a US size 12 / UK 16, and the medium is big enough to fit over a shirt with room to spare. It has long sleeves that I love to roll up at the wrist. I'm now trying to resist the temptation to buy it in grey too.

C — Naga

This knitted sweater looks great in the pictures. I ordered the olive green with stripes and, although I wasn't sure it was going to look right on me, I was pleasantly surprised when I put it on. It's very soft and I love the long past-the-wrist sleeves too. I opted for the medium, but it was too tight so I exchanged it.

D — Libby

This is the third of your sweaters that I've bought over the past two years. It's true to size and perfect for the winter months, though I should add that its loose knit means it's best to avoid playing with cats or young dogs when you're wearing it as they could pull threads in the body or sleeves.

E — Laura

I couldn't decide which colour to get so I bought the deep blue and the charcoal grey, with every intention of sending one of them back. That didn't happen, of course! I would say both colours match the online pictures. I bought size small, and the length is perfect for me, despite the unnecessarily long sleeves! These sweaters are lovely to wear with jeans but also stylish enough to wear to work.`,

      questions: [
        {
          id: "q1",
          number: 1,
          type: "choice",
          prompt: "The city buses start operating later than the trams.",
          options: ["TRUE", "FALSE", "NOT GIVEN"],
          answer: "FALSE",
          explanation: "Первый трамвай отправляется в 6:30, через полчаса после первого городского автобуса."
        },
        {
          id: "q2",
          number: 2,
          type: "choice",
          prompt: "You can get a tram from the airport to the city centre up to midnight.",
          options: ["TRUE", "FALSE", "NOT GIVEN"],
          answer: "FALSE",
          explanation: "Вечернее расписание заканчивается в 11:35 pm."
        },
        {
          id: "q3",
          number: 3,
          type: "choice",
          prompt: "The 207 bus service stops at the main railway station.",
          options: ["TRUE", "FALSE", "NOT GIVEN"],
          answer: "NOT GIVEN",
          explanation: "Остановки ночного автобуса №207 в тексте не перечислены."
        },
        {
          id: "q4",
          number: 4,
          type: "choice",
          prompt: "The cost of a tram ticket varies depending on your journey.",
          options: ["TRUE", "FALSE", "NOT GIVEN"],
          answer: "TRUE",
          explanation: "Нужно проверить маршрут и купить билет правильной стоимости (correct price ticket)."
        },
        {
          id: "q5",
          number: 5,
          type: "choice",
          prompt: "Bicycles are allowed on the trams between 7.30 am and 10 am.",
          options: ["TRUE", "FALSE", "NOT GIVEN"],
          answer: "FALSE",
          explanation: "Велосипеды разрешены до 7:30, с 10:00 до 14:30 и после 19:00."
        },
        {
          id: "q6",
          number: 6,
          type: "choice",
          prompt: "Additional trams run during the Gobridge festival period.",
          options: ["TRUE", "FALSE", "NOT GIVEN"],
          answer: "NOT GIVEN",
          explanation: "Дополнительные трамваи не упоминаются."
        },
        {
          id: "q7",
          number: 7,
          type: "choice",
          prompt: "Cyclists may be asked to leave the tram if they block the exit.",
          options: ["TRUE", "FALSE", "NOT GIVEN"],
          answer: "NOT GIVEN",
          explanation: "Указано лишь правило не блокировать проходы."
        },
        // Matrix questions 8-14 (таблица с радиокнопками A-E)
        { id: "q8", number: 8, type: "matrix", prompt: "The colour of the sweater did not match the website image.", options: ["A", "B", "C", "D", "E"], answer: "B", explanation: "Davina ожидала более светлый оттенок." },
        { id: "q9", number: 9, type: "matrix", prompt: "The customer took some time to decide on the purchase.", options: ["A", "B", "C", "D", "E"], answer: "A", explanation: "Mary-Anne долго думала перед покупкой." },
        { id: "q10", number: 10, type: "matrix", prompt: "The customer initially bought the wrong size.", options: ["A", "B", "C", "D", "E"], answer: "C", explanation: "Naga взяла medium, но обменяла на больший." },
        { id: "q11", number: 11, type: "matrix", prompt: "The customer changed her mind about returning a sweater.", options: ["A", "B", "C", "D", "E"], answer: "E", explanation: "Laura передумала отправлять один свитер назад." },
        { id: "q12", number: 12, type: "matrix", prompt: "The customer bought a bigger size than she usually does.", options: ["A", "B", "C", "D", "E"], answer: "A", explanation: "Mary-Anne взяла large вместо обычного medium." },
        { id: "q13", number: 13, type: "matrix", prompt: "The sweater can be worn for smart or casual occasions.", options: ["A", "B", "C", "D", "E"], answer: "E", explanation: "Подходит и к джинсам, и для офиса." },
        { id: "q14", number: 14, type: "matrix", prompt: "The customer was worried that the sweater wouldn't suit her.", options: ["A", "B", "C", "D", "E"], answer: "C", explanation: "Naga сомневалась, пойдет ли ей цвет." }
      ]
    },

    // =====================================================
    // PASSAGE 2
    // =====================================================
    {
      id: "cam19-r1-sec2",
      title: "Passage 2: How to Become a Great Leader & Resigning Professionally",
      instruction: "Read the texts below and answer Questions 15–27.",
      passage: `==== Read the text below and answer Questions 15-21. ====

How to Become a Great Leader

Stepping into a new management role can be unnerving. Here's how to inspire your team:

Set the tone of your leadership style from the outset. Be confident, self-assured, and respectful with everyone you meet. Speak as you want to be spoken to, and remember to listen. The first few weeks are when people develop their perceptions of you, so work hard to earn their trust. This will be key to effective change and progress.

Part of a leader's brief is to set bold goals. They could take years to achieve, but they need to be specific enough that everyone in the organization understands them, buys into them, and is willing to work together to achieve them.

Don't do everything yourself. Great leaders surround themselves with talented individuals and they should trust them to make things happen. If things need changing, tell people and involve them in making the changes by participating in the design of a new strategy. If the team is too cautious to embrace change, give them one more chance but be clearer about what you want.

Stamp out the 'them and us' culture. In many organizations, employees feel distant from senior management. The message must be plain: we all work together, but leaders need to work hard to ensure this filters through to everyone in the organization.

Allow time for innovation. It's important to give staff time to come up with new ideas and solutions that will fix new problems. However, be clear that a decision is expected; set a time limit and stick to it.

Honour early pioneers. It is likely that the formula that makes the business you are managing successful will have been created many years ago — but it's important to remember how the business started. Honour those early pioneers and instil a sense of pride across the organization.

Accept risk. Leaders need to accept that some risk may be required if the situation calls for it. Playing it safe is never a good business rule, and leaders must make sure their business stays ahead by being prepared to act quickly.

Show passion and enthusiasm. People spend a large part of their lives working for an organization, and having a leader who is genuinely thrilled about its future is hugely inspiring.

==== Read the text below and answer Questions 22-27. ====

Resigning from a Job in a Professional Manner

When you take the decision to resign and move on to another job, you might really want to dance your way out of the door, or get your own back by criticising your boss to the whole office. But you need to resist these temptations because in future you might find you're working with your ex-line manager or other colleagues in a different company.

Letting your manager know:

Show courtesy by telling your boss first. Request a meeting to say that you're leaving, following up soon after with an official letter. Before the meeting with your boss, write a list of ongoing tasks along with status updates and suggestions concerning completion. Use the meeting to clarify any other points, such as your notice period and leaving date, and how you will inform others. Ask about a reference too.

Preparation:

Work out how you can ensure a smooth transition and minimise disruption to your employer. Complete projects, work out priorities, and leave clear documentation for your successor.

Your letter of resignation:

Keep your letter short. Don't address failings of the company or your boss. Thank your employer and mention what you appreciated.

First paragraph: Basics (inform about resignation and final date).

Second paragraph: Thank your employer (projects, skill development, great team).

Third paragraph: Handover (willingness to finish tasks smoothly).`,

      questions: [
        { id: "q15", number: 15, type: "input", prompt: "Initially, a leader needs to focus on gaining the {{15}} of the staff.", answer: "trust", explanation: "earn their trust." },
        { id: "q16", number: 16, type: "input", prompt: "A leader should decide on {{16}} that their staff are happy to fulfil.", answer: "goals", explanation: "set bold goals." },
        { id: "q17", number: 17, type: "input", prompt: "Leaders should involve their staff in the process of producing a different {{17}}.", answer: "strategy", explanation: "design of a new strategy." },
        { id: "q18", number: 18, type: "input", prompt: "If tricky issues arise, leaders should give staff the space to find {{18}} to them.", answer: "solutions", explanation: "new ideas and solutions." },
        { id: "q19", number: 19, type: "input", prompt: "Leaders need to encourage their staff to feel {{19}} in the past achievements of the company.", answer: "pride", explanation: "sense of pride." },
        { id: "q20", number: 20, type: "input", prompt: "It is important for leaders to agree to a certain degree of {{20}} when necessary.", answer: "risk", explanation: "some risk may be required." },
        { id: "q21", number: 21, type: "input", prompt: "If leaders find the {{21}} of the company exciting, their staff will be more motivated to work hard.", answer: "future", explanation: "thrilled about its future." },
        { id: "q22", number: 22, type: "input", prompt: "Avoid all {{22}} to resign in an angry way.", answer: "temptations", explanation: "resist these temptations." },
        { id: "q23", number: 23, type: "input", prompt: "Arrange a meeting with the boss to mention any projects which are underway and give ideas for their {{23}}.", answer: "completion", explanation: "suggestions concerning completion." },
        { id: "q24", number: 24, type: "input", prompt: "Arrange a meeting with the boss to request information on the type of {{24}} you will receive.", answer: "reference", explanation: "Ask about a reference too." },
        { id: "q25", number: 25, type: "input", prompt: "Work to cause as little {{25}} as possible to the organisation.", answer: "disruption", explanation: "minimise disruption." },
        { id: "q26", number: 26, type: "input", prompt: "In the resignation letter, avoid mentioning any {{26}} in the organisation.", answer: "failings", explanation: "Don't address failings." },
        { id: "q27", number: 27, type: "input", prompt: "In the resignation letter, show appreciation for aspects of the job, e.g., the chance to improve your {{27}}.", answer: "skills", explanation: "skill development." }
      ]
    },

    // =====================================================
    // PASSAGE 3
    // =====================================================
    {
      id: "cam19-r1-sec3",
      title: "Passage 3: Emojis",
      instruction: "Read the text below and answer Questions 28–40.",
      headingsList: [
        "i. Why emojis may have a short life",
        "ii. Ways in which new emojis are designed and made available",
        "iii. How words and emojis both fulfil new needs in our society",
        "iv. How emojis are regarded in different ways by different cultures",
        "v. The use of emojis in different fields and what this means for us",
        "vi. The rapid spread of a new way of interacting",
        "vii. How and where emojis were first invented",
        "viii. The value of emojis for making feelings clear"
      ],
      passage: `==== Read the text and answer Questions 28-40. ====

Emojis

{{heading:28}}

A Language always changes, of course. This is one of the few constants about it. But it's arguably changing at a faster rate now than at any previous moment in its history. And emojis — the set of picture characters that people use to punctuate their online correspondence — are at the forefront of this frenzy for change.

As a form of global communication, emojis only began their growth in 2011. Four years later, it was estimated that they were being used by over 90 per cent of the online population. In excess of six billion were being sent every day. Their prevalence in the culture was such that Oxford Dictionaries recently chose one as their word of the year. 'Words of the Year' are those judged to be reflective of the 'ethos, mood, or preoccupations of that particular year'. They're very much of their time. And often, once that time has passed, they fade from people's consciousness almost as quickly as they arose.

There's a good chance, then, that the emoji chosen by Oxford Dictionaries — the 'face with tears of joy' — will also appear to be dated in a few years. But the reasons for this offer a fascinating insight into the way that society is evolving. The little yellow circle with dots for eyes acts as a surprisingly good lens through which to view the history of human communication, and to predict its future.

{{heading:29}}

B There are two main reasons why language changes. One is to do with the way that language mirrors the changes in how we relate to each other. As an expression of identity, language is adapted by different groups and different generations to reflect their own sense of self. It also needs to constantly assimilate fresh concepts as these evolve.

Words are being created for these reasons all the time. But what's interesting about emojis is that they've contributed to this ever-expanding storehouse in a different way. At this point in our history, the gaps in our vocabulary are being filled not simply by new words, but by an absolutely new system of expression.

{{heading:30}}

C The second major reason that language changes is down to technology — specifically, the ways in which the technologies we use have an effect on the process of communication itself. Both hardware and new technologies result in us subtly changing the way we interact with each other and also altering the shape of the language we use.

Emojis have evolved as a solution to the needs of mobile communication. In particular, they compensate for the way that computer-mediated messaging on smartphones can sometimes tend towards the emotionally empty. Whereas face-to-face, or even voice-to-voice, conversations can express emotional closeness through facial expression or tone of voice, this is easy to miss when messages are rendered in a few short words on a small screen. Emojis are a means of restoring this emotional framing to an interaction — punctuating your message with a smile.

{{heading:31}}

D But unlike almost any other type of language system, emojis have something akin to a built-in obsolescence. Just as smartphones and their operating systems have a frequent refresh rate, emojis also get routine enhancements. The emojis you have on your phone now will undergo subtle redesigns over the course of time, and extra characters will be added. Because of this, their usefulness is artificially limited.

In the context of communication systems, this is something that's never previously been the case. Twenty years ago, people might have bought a new landline phone when they were tired of the design of their old phone or if they wanted to get one with whatever latest innovation was going around — an inbuilt answering machine, say. But they didn't have to upgrade the language they were using as well.

Emojis, on the other hand, are a case study of how technology and the human capacity for communication are working together — of how the onward march of technology exists at the intersection of consumerism, innovation and design. Moreover, the fact that they're at the front line of a relentless wave of technologically driven change in communications practices encourages — if not necessitates — a great amount of creativity in the way they're used.

{{heading:32}}

E Finally, there's the way they've become implicated in almost all aspects of modern society, from politics and marketing to art and entertainment. Emojis are the subject of musicals and Hollywood films. They're the inspiration for fashion design, art and architecture. They're a staple in advertising and commerce. Understanding why they've become so popular, and how they work, can not only explain something about the nature of language; it can also help us to understand our relationship with technology, society and ourselves.`,

      summaryTemplate: {
        title: "The importance of the 'face with tears of joy'",
        instruction: "Complete the summary below. Choose ONE WORD ONLY from the text for each answer.",
        text: "It is probable that before long, an emoji such as the 'face with tears of joy' will seem {{33}}. This is of interest as it tells us about developments in {{34}}, providing an effective way to focus on both the {{35}} and the future of human communication. Changes in language reflect changes in people's relationships. They reflect the ways in which the {{36}} of groups and generations changes over time, and they allow new {{37}} to be included. However, emojis are interesting as they are a system that expresses these ideas in a completely new way."
      },

      questions: [
        { id: "q28", number: 28, type: "heading", prompt: "Section A", answer: "vi", explanation: "Быстрое распространение нового способа общения." },
        { id: "q29", number: 29, type: "heading", prompt: "Section B", answer: "iii", explanation: "Слова и эмодзи удовлетворяют новые потребности общества." },
        { id: "q30", number: 30, type: "heading", prompt: "Section C", answer: "viii", explanation: "Ценность эмодзи для передачи эмоций." },
        { id: "q31", number: 31, type: "heading", prompt: "Section D", answer: "i", explanation: "Почему у эмодзи может быть короткий срок жизни." },
        { id: "q32", number: 32, type: "heading", prompt: "Section E", answer: "v", explanation: "Использование эмодзи в разных сферах." },
        { id: "q33", number: 33, type: "input", prompt: "Question 33", answer: "dated", explanation: "will also appear to be dated." },
        { id: "q34", number: 34, type: "input", prompt: "Question 34", answer: "society", explanation: "way that society is evolving." },
        { id: "q35", number: 35, type: "input", prompt: "Question 35", answer: "history", explanation: "history of human communication." },
        { id: "q36", number: 36, type: "input", prompt: "Question 36", answer: "identity", explanation: "expression of identity." },
        { id: "q37", number: 37, type: "input", prompt: "Question 37", answer: "concepts", explanation: "assimilate fresh concepts." },
        {
          id: "q38",
          number: 38,
          type: "choice",
          prompt: "What does the writer say about 'Words of the Year'?",
          options: [
            "A They include increasing numbers of emojis.",
            "B They are soon forgotten by the public.",
            "C They are required to have social significance.",
            "D They are invented by the writers of dictionaries."
          ],
          answer: "B",
          explanation: "Они быстро исчезают из сознания людей."
        },
        {
          id: "q39",
          number: 39,
          type: "choice",
          prompt: "The writer says that the usefulness of emojis is limited because",
          options: [
            "A they are constantly being changed.",
            "B they may not be correctly interpreted.",
            "C they are difficult for some people to update.",
            "D they are linked to specific operating systems."
          ],
          answer: "A",
          explanation: "Они постоянно подвергаются редизайну и обновлениям."
        },
        {
          id: "q40",
          number: 40,
          type: "choice",
          prompt: "What would be the best subtitle for this text?",
          options: [
            "A Will emojis take over from words one day?",
            "B How can emojis be made more meaningful?",
            "C Are emojis used too much in our society today?",
            "D What do emojis tell us about the world we live in?"
          ],
          answer: "D",
          explanation: "Что эмодзи говорят о мире, в котором мы живем."
        }
      ]
    }
  ]
};