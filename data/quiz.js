export const questions = [
  {
    id: 1,
    text: "Ce apreciezi cel mai mult într-o relație?",
    options: ["Încrederea", "Comunicarea", "Respectul reciproc"],
    type: "single",
    next: {
      Încrederea: 2,
      Comunicarea: 3,
      "Respectul reciproc": 4,
    },
  },
  {
    id: 2,
    text: "Cât de des preferi să comunici cu partenerul tău?",
    options: ["Zilnic", "Săptămânal", "Ocazional"],
    type: "single",
    next: {
      Zilnic: 5,
      Săptămânal: 6,
      Ocazional: 4,
    },
  },
  {
    id: 3,
    text: "Care este cel mai important aspect într-o discuție?",
    options: ["Ascultarea", "Empatia", "Claritatea mesajului"],
    type: "single",
    next: {
      Ascultarea: 7,
      Empatia: 5,
      "Claritatea mesajului": 6,
    },
  },
  {
    id: 4,
    text: "Care este activitatea preferată pe care v-ar plăcea să o faceți împreună?",
    options: ["Călătorii", "Sporturi", "Gătit", "Relaxare acasă"],
    type: "single",
    next: {
      Călătorii: 8,
      Sporturi: 5,
      Gătit: 6,
      "Relaxare acasă": 7,
    },
  },
  {
    id: 5,
    text: "Ce valori considerați importante într-o relație?",
    options: ["Sinceritatea", "Loialitatea", "Sprijinul", "Libertatea"],
    type: "multiple",
    next: {
      default: 9,
    },
  },
  {
    id: 6,
    text: "Cât de mult contează timpul petrecut împreună?",
    options: ["Foarte mult", "Destul de mult", "Mai puțin important"],
    type: "single",
    next: {
      "Foarte mult": 9,
      "Destul de mult": 8,
      "Mai puțin important": 7,
    },
  },
  {
    id: 7,
    text: "Ce înseamnă pentru tine sprijinul într-o relație?",
    options: ["Susținere morală", "Ajutor financiar", "Ambiție comună"],
    type: "single",
    next: {
      "Susținere morală": 8,
      "Ajutor financiar": 9,
      "Ambiție comună": 10,
    },
  },
  {
    id: 8,
    text: "Cât de importantă este independența într-o relație?",
    options: ["Foarte importantă", "Importantă", "Mai puțin importantă"],
    type: "single",
    next: {
      "Foarte importantă": 10,
      Importantă: 9,
      "Mai puțin importantă": null,
    },
  },
  {
    id: 9,
    text: "Care dintre aceste caracteristici este esențială pentru tine?",
    options: ["Respect", "Încredere", "Onestitate", "Toleranță"],
    type: "multiple",
    next: {
      default: 10,
    },
  },
  {
    id: 10,
    text: "Cum preferi să fie abordate problemele într-o relație?",
    options: ["Discuții deschise", "Compromis", "Evitat pe moment"],
    type: "single",
    next: {
      "Discuții deschise": null,
      Compromis: null,
      "Evitat pe moment": null,
    },
  },
];
