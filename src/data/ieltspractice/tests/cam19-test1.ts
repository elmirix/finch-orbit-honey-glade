import type { PracticeTest } from "../types";

export const cambridge19ListeningTest1: PracticeTest = {
  id: "cam-19-test-1",
  module: "listening",
  title: "Cambridge IELTS 19 General Training - Test 1",
  durationMinutes: 30,
  sections: [
    {
      title: "Part 1: Questions 1–10",
      instruction: "Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.",
      audioUrl: "/audio/listening/test-1/part1.mp3",
      passage: `### Hinchingbrooke Country Park

**The park**
Area: {{1}} hectares
Habitats: wetland, grassland and woodland
Wetland: lakes, ponds and a {{2}}
Wildlife includes birds, insects and animals

**Subjects studied in educational visits include**
Science: Children look at {{3}} about plants, etc.
Geography: includes learning to use a {{4}} and compass
History: changes in land use
Leisure and tourism: mostly concentrates on the park’s {{5}}
Music: Children make {{6}} with natural materials, and experiment with rhythm and speed.

**Benefits of outdoor educational visits**
They give children a feeling of {{7}} that they may not have elsewhere.
Children learn new {{8}} and gain self-confidence.

**Practical issues**
Cost per child: £ {{9}}
Adults, such as {{10}} , free`,
      questions: [
        { id: "q1", number: 1, type: "input", prompt: "Area", answer: "69", explanation: "«Altogether the park covers 170 acres, that's 69 hectares.» — Спикер называет две цифры, ответом является площадь в гектарах." },
        { id: "q2", number: 2, type: "input", prompt: "Wetland", answer: "stream", explanation: "«...forming the two large lakes. There are also several smaller ones, ponds and a stream that flows through the park.» — Ручей (stream) дополняет список объектов водной среды." },
        { id: "q3", number: 3, type: "input", prompt: "Science", answer: "data", explanation: "«They also collect and analyse data about the things they see.» — По научному направлению дети собирают и анализируют данные (data)." },
        { id: "q4", number: 4, type: "input", prompt: "Geography", answer: "map", explanation: "«...learn and practice reading a map and using a compass...» — На географии изучают работу с компасом и картой (map)." },
        { id: "q5", number: 5, type: "input", prompt: "Leisure and tourism", answer: "visitors", explanation: "«That focuses on your visitors, I would imagine? — Yes, mostly.» — Туризм и отдых концентрируются на посетителях (visitors)." },
        { id: "q6", number: 6, type: "input", prompt: "Music", answer: "sounds", explanation: "«...here the children experiment with natural materials to create sounds and explore rhythm and tempo.» — На музыке дети создают звуки (sounds)." },
        { id: "q7", number: 7, type: "input", prompt: "Feeling", answer: "freedom", explanation: "«I would imagine they get a sense of freedom that might not be a normal part of their lives.» — Ученики получают ощущение свободы (freedom)." },
        { id: "q8", number: 8, type: "input", prompt: "Learn new", answer: "skills", explanation: "«...and they develop new skills. This gives them greater self-confidence.» — Развитие новых навыков (skills) повышает уверенность." },
        { id: "q9", number: 9, type: "input", prompt: "Cost per child", answer: "4.95", explanation: "«...it costs £4.95 for each child who attends on the day.» — Стоимость визита для одного ребенка." },
        { id: "q10", number: 10, type: "input", prompt: "Adults", answer: "leaders", explanation: "«There's no charge for leaders and other adults...» — Руководители (leaders) проходят бесплатно." },
      ],
    },
    {
      title: "Part 2: Questions 11–20",
      instruction: "Questions 11–15: Choose the correct letter, A, B or C.\nQuestions 16–20: Label the map below. Write the correct letter, A–H.",
      audioUrl: "/audio/listening/test-1/part2.mp3",
      imageUrl: "/images/listening/test-1/farley-house.png",
      sharedOptions: ["A", "B", "C", "D", "E", "F", "G", "H"],
      questions: [
        {
          id: "q11", number: 11, type: "choice",
          prompt: "During the visit to Malatte, in France, members especially enjoyed",
          options: ["going to a theme park.", "experiencing a river trip.", "visiting a cheese factory."],
          answer: "B",
          explanation: "«The theme park trip had to be cancelled... but we all had a great time on the final boat trip down the river—that was the real highlight.»"
        },
        {
          id: "q12", number: 12, type: "choice",
          prompt: "What will happen in Stanthorpe to mark the 25th anniversary of the Twinning Association?",
          options: ["A tree will be planted.", "A garden seat will be bought.", "A footbridge will be built."],
          answer: "A",
          explanation: "«...we've decided to plant a poplar tree in the museum gardens.»"
        },
        {
          id: "q13", number: 13, type: "choice",
          prompt: "Which event raised most funds this year?",
          options: ["the film show", "the pancake evening", "the cookery demonstration"],
          answer: "B",
          explanation: "«Our pancake evening was well attended and made record profits.»"
        },
        {
          id: "q14", number: 14, type: "choice",
          prompt: "For the first evening with the French visitors host families are advised to",
          options: ["take them for a walk round the town.", "go to a local restaurant.", "have a meal at home."],
          answer: "C",
          explanation: "«...have dinner in the house or garden rather than eating out.»"
        },
        {
          id: "q15", number: 15, type: "choice",
          prompt: "On Saturday evening there will be the chance to",
          options: ["listen to a concert.", "watch a match.", "take part in a competition."],
          answer: "A",
          explanation: "«...we'll have Toby Sharp and his band performing English and Scottish country songs.»"
        },
        { id: "q16", number: 16, type: "matrix", prompt: "Farm shop", answer: "G", explanation: "«...it's in the old stables, which is the first building you come to... shop's in the far corner on the left.»" },
        { id: "q17", number: 17, type: "matrix", prompt: "Disabled entry", answer: "C", explanation: "«...you might want to use the disabled entry. This is on the far side of the house...»" },
        { id: "q18", number: 18, type: "matrix", prompt: "Adventure playground", answer: "B", explanation: "«That's at the northern end of the larger lake, in a bend on the path...»" },
        { id: "q19", number: 19, type: "matrix", prompt: "Kitchen gardens", answer: "D", explanation: "«The kitchen gardens are rectangular... to the north-east of the house...»" },
        { id: "q20", number: 20, type: "matrix", prompt: "The Temple of the Four Winds", answer: "A", explanation: "«...take the right-hand path. Go up there... and the temple is right at the end.»" },
      ],
    },
    {
      title: "Part 3: Questions 21–30",
      instruction: "Questions 21–24: Choose TWO letters, A–E.\nQuestions 25–30: What is the students’ opinion about each of the following food trends? Choose SIX answers from the box and select the correct letter, A–H.",
      audioUrl: "/audio/listening/test-1/part3.mp3",
      sharedOptionsTitle: "Opinions",
      sharedOptions: [
        "A. This is only relevant to young people.",
        "B. This may have disappointing results.",
        "C. This already seems to be widespread.",
        "D. Retailers should do more to encourage this.",
        "E. More financial support is needed for this.",
        "F. Most people know little about this.",
        "G. There should be stricter regulations about this.",
        "H. This could be dangerous.",
      ],
      questions: [
        {
          id: "q21", number: 21, type: "choice",
          prompt: "Which TWO things did Colin find most satisfying about his bread reuse project? (1-й выбор)",
          options: [
            "receiving support from local restaurants",
            "finding a good way to prevent waste",
            "overcoming problems in a basic process",
            "experimenting with designs and colours",
            "learning how to apply 3-D printing",
          ],
          answer: "B",
          explanation: "«...finding a good way to prevent waste...»"
        },
        {
          id: "q22", number: 22, type: "choice",
          prompt: "Which TWO things did Colin find most satisfying about his bread reuse project? (2-й выбор)",
          options: [
            "receiving support from local restaurants",
            "finding a good way to prevent waste",
            "overcoming problems in a basic process",
            "experimenting with designs and colours",
            "learning how to apply 3-D printing",
          ],
          answer: "D",
          explanation: "«...experimenting with different patterns for the biscuits and finding how I could add fruit and vegetables to make them a more appetising colour...»"
        },
        {
          id: "q23", number: 23, type: "choice",
          prompt: "Which TWO ways do the students agree that touch-sensitive sensors for food labels could be developed in future? (1-й выбор)",
          options: [
            "for use on medical products",
            "to show that food is no longer fit to eat",
            "for use with drinks as well as foods",
            "to provide applications for blind people",
            "to indicate the weight of certain foods",
          ],
          answer: "A",
          explanation: "«...it might be really good for drug storage in hospitals and pharmacies...»"
        },
        {
          id: "q24", number: 24, type: "choice",
          prompt: "Which TWO ways do the students agree that touch-sensitive sensors for food labels could be developed in future? (2-й выбор)",
          options: [
            "for use on medical products",
            "to show that food is no longer fit to eat",
            "for use with drinks as well as foods",
            "to provide applications for blind people",
            "to indicate the weight of certain foods",
          ],
          answer: "E",
          explanation: "«...Like how many kilograms a joint of meat is...»"
        },
        { id: "q25", number: 25, type: "matching", prompt: "Use of local products", answer: "D", explanation: "«Oh things like more focus on local products? That seems so obvious, but the shops are still full of imported foods... They need to be more proactive to address that.»" },
        { id: "q26", number: 26, type: "matching", prompt: "Reduction in unnecessary packaging", answer: "G", explanation: "«...the need for a reduction in unnecessary packaging—but just about everything you buy in supermarkets is still covered in plastic. The government needs to do something about it.»" },
        { id: "q27", number: 27, type: "matching", prompt: "Gluten-free and lactose-free food", answer: "C", explanation: "«Lots of people I know have been buying that type of food for years now.»" },
        { id: "q28", number: 28, type: "matching", prompt: "Use of branded products related to celebrity chefs", answer: "B", explanation: "«...I bought a ready-made spice mix for chicken... and it didn't actually taste of anything.»" },
        { id: "q29", number: 29, type: "matching", prompt: "Development of 'ghost kitchens’ for takeaway food", answer: "F", explanation: "«...a cooking facility just for delivery meals - the public don't ever go there. But people aren't aware of that - it's all kept very quiet.»" },
        { id: "q30", number: 30, type: "matching", prompt: "Use of mushrooms for common health concerns", answer: "H", explanation: "«They might be taking a big risk there...»" },
      ],
    },
    {
      title: "Part 4: Questions 31–40",
      instruction: "Complete the notes below.\nWrite ONE WORD ONLY for each answer.",
      audioUrl: "/audio/listening/test-1/part4.mp3",
      passage: `### Céide Fields
an important Neolithic archaeological site in the northwest of Ireland

**Discovery**
In the 1930s, a local teacher realised that stones beneath the bog surface were once {{31}} .
His {{32}} became an archaeologist and undertook an investigation of the site:
- a traditional method used by local people to dig for {{33}} was used to identify where stones were located
- carbon dating later proved the site was Neolithic.
Items are well preserved in the bog because of a lack of {{34}} .

**Neolithic farmers**
Houses were {{35}} in shape and had a hole in the roof.
Neolithic innovations include:
- cooking indoors
- pots used for storage and to make {{36}} .
Each field at Céide was large enough to support a big {{37}} .
The fields were probably used to restrict the grazing of animals – no evidence of structures to house them during {{38}} .

**Reasons for the decline in farming**
a decline in {{39}} quality
an increase in {{40}}`,
      questions: [
        { id: "q31", number: 31, type: "input", prompt: "stones beneath the bog surface were once", answer: "walls", explanation: "«...constantly hitting against what seemed to be rows of stones. He realised that these must be walls...»" },
        { id: "q32", number: 32, type: "input", prompt: "His ... became an archaeologist", answer: "son", explanation: "«...Patrick Caulfield's son Seamus, who had become an archaeologist...»" },
        { id: "q33", number: 33, type: "input", prompt: "dig for", answer: "fuel", explanation: "«...traditional method which local people had always used for finding fuel buried in the bog...»" },
        { id: "q34", number: 34, type: "input", prompt: "lack of", answer: "oxygen", explanation: "«...because of the acidity of the peat and the deficiency of oxygen.»" },
        { id: "q35", number: 35, type: "input", prompt: "Houses were ... in shape", answer: "rectangular", explanation: "«These weren't round as people often assume, but rectangular with a small hole...»" },
        { id: "q36", number: 36, type: "input", prompt: "to make", answer: "lamps", explanation: "«...pots were filled with a small amount of fat and when this was set alight, they served as lamps.»" },
        { id: "q37", number: 37, type: "input", prompt: "support a big", answer: "family", explanation: "«...each plot of land was of a suitable size to sustain an extended family.»" },
        { id: "q38", number: 38, type: "input", prompt: "during", answer: "winter", explanation: "«...no structures have been found which would have been used to shelter animals in the winter.»" },
        { id: "q39", number: 39, type: "input", prompt: "decline in ... quality", answer: "soil", explanation: "«The soil would have become less productive and led to the abandonment of farming.»" },
        { id: "q40", number: 40, type: "input", prompt: "increase in", answer: "rain", explanation: "«...the conditions became wetter as there was a lot more rain.»" },
      ],
    },
  ],
};