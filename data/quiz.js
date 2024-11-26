export const firstQuestions = [
  {
    id: 1,
    text: "En quoi pouvons-nous vous aider?",
    options: [
      "Je cherche un(e) partenaire de vie pour une relation sérieuse et stable.",
      "Je cherche des rencontres coquines en toute discrétion.",
      "Je cherche à élargir mon cercle d’amis.",
    ],
    type: "single",
    next: 2, // Trece la întrebarea următoare din acest set
    matchRequired: true, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 2,
    text: "Quelle est pour vous la meilleure manière de vous contacter?",
    options: [
      "Par mail",
      "Appel téléphonique sur mon GSM",
      "Appel téléphonique sur mon fixe",
      "Whatsapp",
      "SMS",
    ],
    type: "single",
    next: 3, // Trece la întrebarea următoare din acest set
  },
  {
    id: 3,
    text: "Dans quelle tranche d’heures préférez-vous être contacté?",
    options: ["Matin", "Midi", "Après midi", "Début soirée", "Soirée"],
    type: "multiple",
    next: null, // După această întrebare, să treacă la un set nou, în funcție de răspunsul la întrebarea 1
  },
];

export const questionsSet1 = [
  {
    id: 1,
    section: "Amour",
    text: "Etes-vous :",
    options: ["Homme", "Femme", "Non-binaire"],
    type: "single", // Se poate selecta o singură opțiune
    next: 2, // Urmează întrebarea despre consimțământ
    consentAfter: true, // Afișează consimțământul după răspuns
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 2,
    text: "Acceptez-vous que cette information soit partagée avec les profils compatibles ?",
    options: ["Oui", "Non"],
    type: "single", // Consimțământ simplu
    consentFor: [1], // Se referă la întrebarea 1
    next: 3, // Urmează următoarea întrebare din secțiune
  },
  {
    id: 3,
    text: "Langues parlées :",
    options: [
      "Français",
      "Anglais",
      "Espagnol",
      "Allemand",
      "Italien",
      "Chinois",
      "Japonais",
      "Autre : ajouter une langue",
    ], // Listă predefinită de limbi
    type: "multiple", // Permite selecția multiplă
    allowsCustom: true, // Permite adăugarea unei limbi personalizate
    next: 4, // Urmează întrebarea despre consimțământ
    consentAfter: true, // Afișează consimțământul după răspuns
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 4,
    text: "Acceptez-vous que cette information soit partagée avec les profils compatibles ?",
    options: ["Oui", "Non"],
    type: "single", // Consimțământ simplu
    consentFor: [3], // Se referă la întrebarea 3
    next: 5, // Urmează următoarea întrebare din secțiune
  },
  {
    id: 5,
    text: "Cherchez-vous :",
    options: ["Homme", "Femme", "Bisexuel/le"],
    type: "single", // Se poate selecta o singură opțiune
    next: 6, // Urmează întrebarea despre consimțământ
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
    consentAfter: true, // Afișează consimțământul după răspuns
  },
  {
    id: 6,
    text: "Acceptez-vous que cette information soit partagée avec les profils compatibles ?",
    options: ["Oui", "Non"],
    type: "single", // Consimțământ simplu
    consentFor: [5], // Se referă la întrebarea 5
    next: 7, // Urmează următoarea întrebare din secțiune
  },
  {
    id: 7,
    text: "Votre orientation sexuelle est :",
    options: [
      "Hétérosexuel/le",
      "Bisexuel/le",
      "Homosexuel",
      "Transgenre",
      "En questionnement",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 8, // Urmează întrebarea despre consimțământ
    consentAfter: true, // Afișează consimțământul după răspuns
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 8,
    text: "Acceptez-vous que cette information soit partagée avec les profils compatibles ?",
    options: ["Oui", "Non"],
    type: "single", // Consimțământ simplu
    consentFor: [7], // Se referă la întrebarea 7
    next: 9, // Urmează următoarea întrebare din secțiune
  },
  {
    id: 9,
    text: "Où habitez-vous ?",
    type: "input", // Input pentru cod poștal
    placeholder: "Code postal (Belgique)",
    api: {
      url: "http://api.zippopotam.us/",
      params: { country: "be" }, // Specificație pentru Belgia
    },
    responseMapping: {
      postalCode: "post code", // Maparea codului poștal
      city: "places[0]['place name']", // Maparea orașului din API
    },
    next: 10, // Urmează întrebarea despre consimțământ
    consentAfter: true, // Afișează consimțământul după răspuns
  },
  {
    id: 10,
    text: "Acceptez-vous que cette information soit partagée avec les profils compatibles ?",
    options: ["Oui", "Non"],
    type: "single", // Consimțământ simplu
    consentFor: [9], // Se referă la întrebarea 9
    next: 11, // Urmează următoarea întrebare din secțiune
  },
  {
    id: 11,
    text: "Quelle est votre date de naissance ?",
    type: "input", // Input pentru introducerea datei
    placeholder: "JJ/MM/AAAA",
    validation: {
      type: "date",
      format: "dd/MM/yyyy",
    },
    next: 12, // Urmează întrebarea despre vârsta partenerului ideal
    consentAfter: false,
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
    compatibilityBirthDateUser: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 12,
    text: "Quel est la tranche d’âge idéale de votre futur partenaire ?",
    type: "range", // Selectarea unui interval de vârstă
    placeholder: { min: "De", max: "À" },
    validation: {
      type: "range",
      min: 18, // Limită minimă de vârstă
      max: 100, // Limită maximă de vârstă
    },
    next: 13, // Urmează următoarea întrebare
    matchWith: [11], // Se face matching între vârsta persoanei și intervalul dorit
    consentAfter: false,
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
    compatibilityBirthDateRange: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 13,
    text: "De quelle origine êtes-vous ?",
    options: [
      "Européenne",
      "Asiatique",
      "Arabe",
      "Indienne",
      "Africaine",
      "Latino-américaine",
      "Autre : espace",
    ],
    type: "single", // Se poate selecta o singură opțiune
    allowsCustom: true, // Permite adăugarea unei origini personalizate
    next: 14,
    consentAfter: false,
    matchRequired: true, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
    compatibilityUserOrigin: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 14,
    text: "De quelle origine souhaiteriez-vous votre partenaire ?",
    options: [
      "Sans importance",
      "Européenne",
      "Asiatique",
      "Arabe",
      "Indienne",
      "Africaine",
      "Latino-américaine",
      "Autre : ajouter une origine",
    ],
    type: "multiple", // Permite selecția multiplă
    allowsCustom: true, // Permite adăugarea unei origini personalizate
    next: 15, // Urmează următoarea întrebare
    matchWith: [13], // Se face matching între originea persoanei și dorințele exprimate
    consentAfter: false,
    matchRequired: true, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
    compatibilityOriginWanted: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 15,
    text: "Quelle est votre religion ?",
    options: [
      "Bouddhiste",
      "Catholique",
      "Croyant, non pratiquant",
      "Juive",
      "Musulmane",
      "Non croyant et non pratiquant",
      "Orthodoxe",
      "Protestante",
      "Autre : ajouter une religion",
    ],
    type: "single", // Se poate selecta o singură opțiune
    allowsCustom: true, // Permite adăugarea unei religii personalizate
    next: 16,
    consentAfter: false,
    matchRequired: true, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
    compatibilityUserReligion: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 16,
    text: "Avez-vous une préférence quant à la religion de votre partenaire ?",
    options: [
      "Sans importance",
      "Bouddhiste",
      "Catholique",
      "Croyant, non pratiquant",
      "Juive",
      "Musulmane",
      "Non croyant et non pratiquant",
      "Orthodoxe",
      "Protestante",
      "Autre : ajouter une religion",
    ],
    type: "multiple", // Permite selecția multiplă
    allowsCustom: true, // Permite adăugarea unei religii personalizate
    next: 17, // Urmează întrebarea despre consimțământ
    matchWith: [15], // Se face matching între religia persoanei și dorințele exprimate
    consentAfter: true,
    matchRequired: true, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
    compatibilityWantedReligion: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 17,
    text: "Acceptez-vous que cette information soit partagée avec les profils compatibles ?",
    options: ["Oui", "Non"],
    type: "single", // Consimțământ simplu
    consentFor: [11, 12, 13, 14, 15, 16], // Se aplică pentru întrebările din acest calup
    next: 18,
  },
  {
    id: 18,
    text: "Quel est votre métier ?",
    options: ["Médecin", "Sans emploi", "Autre : ajouter un métier"],
    type: "single", // Se poate selecta o singură opțiune
    allowsCustom: true, // Permite adăugarea unui alt răspuns
    api: {
      url: "https://www.je-change-de-metier.com/les-metiers-de-a-a-z", // Pentru sugestii de meserii
      params: {},
    },
    next: 19, // Urmează întrebarea despre satisfacția în muncă
    consentAfter: false,
  },
  {
    id: 19,
    text: "Etes-vous satisfait de votre métier ?",
    options: [
      "Oui, mon métier me passionne.",
      "Non.",
      "J’envisage une reconversion professionnelle.",
      "Il me fait vivre, mais ce n’est pas ma priorité.",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 20,
    consentAfter: false,
  },
  {
    id: 20,
    text: "Votre carrière est :",
    options: [
      "Continue dans le même emploi.",
      "Avec des pauses.",
      "Continue mais avec des changements d’emploi.",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 21,
    consentAfter: false,
  },
  {
    id: 21,
    text: "Travaillez-vous :",
    options: [
      "De jour, horaire de bureau.",
      "En pause, y compris la nuit.",
      "Uniquement la nuit.",
      "Horaires variable, je peux travailler même le week-end.",
      "Horaires variable, mais jamais le week-end.",
    ],
    type: "multiple", // Permite selecția multiplă
    next: 22,
    consentAfter: false,
  },
  {
    id: 22,
    text: "Travaillez-vous loin de votre domicile ?",
    options: [
      "A moins de 15 minutes.",
      "A moins de 30 minutes.",
      "A moins de 1 heure.",
      "A moins de 2 heures.",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 23,
    consentAfter: false,
  },
  {
    id: 23,
    text: "Quel est votre niveau d’études ?",
    options: [
      "Etudes secondaires.",
      "Breveté.",
      "Bachelier.",
      "Master.",
      "Doctorat.",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 24, // Urmează întrebarea despre consimțământ
    consentAfter: true,
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 24,
    text: "Acceptez-vous que cette information soit partagée avec les profils compatibles ?",
    options: ["Oui", "Non"],
    type: "single", // Consimțământ simplu
    consentFor: [18, 19, 20, 21, 22, 23], // Se referă la întrebările din acest calup
    next: 25,
  },
  {
    id: 25,
    text: "Habitez-vous :",
    options: [
      "Seul.",
      "Avec mes parents.",
      "Avec mes enfants tout le temps.",
      "Avec mes enfants une partie du temps.",
      "Colocation.",
      "C’est délicat.",
      "Sans domicile fixe.",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 26,
    consentAfter: false,
  },
  {
    id: 26,
    text: "Combien d’enfants avez-vous ?",
    options: ["Je n’ai pas d’enfants.", "1", "2", "3", "4", "5", "6+"],
    type: "single", // Se poate selecta o singură opțiune
    conditionalNext: {
      "Je n’ai pas d’enfants.": 30, // Sare direct la întrebarea 30 dacă utilizatorul nu are copii
    },
    next: 27, // Dacă există copii, continuă cu detalii despre aceștia
    consentAfter: false,
  },
  {
    id: 27,
    text: "Quel âge a le plus jeune de vos enfants ?",
    type: "input", // Input numeric
    placeholder: "Années",
    validation: {
      type: "number",
      min: 0,
      max: 100,
    },
    next: 28,
    consentAfter: false,
  },
  {
    id: 28,
    text: "Quel âge a le plus âgé de vos enfants ?",
    type: "input", // Input numeric
    placeholder:
      "Années (si enfant unique mettre le même âge que la question précédente)",
    validation: {
      type: "number",
      min: 0,
      max: 100,
    },
    next: 29,
    consentAfter: false,
  },
  {
    id: 29,
    text: "Avez-vous une bonne relation avec l’autre parent ?",
    options: [
      "Oui, il y a une bonne communication entre nous.",
      "Non, c’est encore conflictuel.",
      "Par moment c’est conflictuel.",
    ],
    type: "single",
    next: 30,
    consentAfter: false,
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 30,
    text: "Vous vivez avec vos enfants :",
    options: [
      "100% du temps",
      "50% du temps (garde alternée)",
      "20% du temps (2 week-ends par mois)",
      "Moins que le 20% du temps (vacances scolaires ou moins)",
    ],
    type: "single",
    next: 31,
    consentAfter: false,
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 31,
    text: "Accepteriez-vous que votre partenaire ait des enfants à charge ?",
    options: ["Oui", "Non"],
    type: "single",
    conditionalNext: {
      Oui: 32,
      Non: 35,
    },
    next: 35,
    consentAfter: false,
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 32,
    text: "Combien d’enfants au maximum accepteriez-vous du coté de votre partenaire ?",
    type: "input", // Input numeric
    placeholder: "Nombre d'enfants",
    validation: {
      type: "number",
      min: 0,
      max: 10,
    },
    next: 33,
    consentAfter: false,
  },
  {
    id: 33,
    text: "Avez-vous une préférence concernant l’âge minimum des enfants du coté de votre partenaire ?",
    options: ["Non", "Oui"],
    type: "single",
    conditionalNext: {
      Oui: 34,
      Non: 35,
    },
    next: 35,
    consentAfter: false,
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 34,
    text: "Si Oui, indiquez l’âge minimum :",
    type: "input", // Input numeric
    placeholder: "Années",
    validation: {
      type: "number",
      min: 0,
      max: 100,
    },
    next: 35,
    consentAfter: false,
  },
  {
    id: 35,
    text: "Voulez-vous avoir des enfants avec votre futur partenaire ?",
    options: ["Oui", "Non"],
    type: "single",
    next: 36,
    consentAfter: false,
  },
  {
    id: 36,
    text: "Avez-vous des animaux de compagnie ?",
    options: ["Oui", "Non"],
    type: "single",
    conditionalNext: {
      Oui: 37,
      Non: 39,
    },
    next: 39,
    consentAfter: false,
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 37,
    text: "Si Oui, lesquels ?",
    options: [
      "Chien",
      "Chat",
      "Poisson",
      "Reptiles",
      "Hamster",
      "Lapin",
      "Autre : ajouter un animal",
      "J’ai une ferme !!!",
    ],
    type: "multiple",
    next: 39,
    consentAfter: false,
  },
  {
    id: 39,
    text: "Accepteriez-vous que votre partenaire ait des animaux de compagnie ?",
    options: ["Oui", "Non"],
    type: "single",
    next: 40,
    consentAfter: false,
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 40,
    text: "Acceptez-vous que cette information soit partagée avec les profils compatibles ?",
    options: ["Oui", "Non"],
    type: "single", // Consimțământ simplu
    consentFor: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 39], // Se aplică pentru întrebările din acest calup
    next: 41,
  },
  {
    id: 41,
    text: "Vous habitez :",
    options: [
      "Dans un appartement",
      "Dans une maison",
      "En colocation",
      "Autre : ajouter un type de logement",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 42,
    consentAfter: false,
  },
  {
    id: 42,
    text: "Etes-vous :",
    options: ["Propriétaire", "Locataire"],
    type: "single", // Se poate selecta o singură opțiune
    next: 43,
    consentAfter: false,
  },
  {
    id: 43,
    text: "Au cas où vous rencontriez la personne de votre cœur, comment voyez-vous les projets futurs dans votre couple ?",
    options: [
      "Cohabitation.",
      "Chacun chez soit, on pourra se voir dans notre temps libre.",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 44,
    consentAfter: false,
    matchRequired: false, // Această întrebare este folosită pentru matching
    compatibility: true, // Această întrebare este folosită pentru matching
  },
  {
    id: 44,
    text: "Au cas où vous rencontriez la personne de votre cœur, seriez-vous d’accord à déménager chez l’autre ?",
    options: ["Oui", "Non", "Un foyer nouveau pour les deux c’est mieux."],
    type: "single", // Se poate selecta o singură opțiune
    next: 45,
    consentAfter: false,
  },
  {
    id: 45,
    text: "Quel est votre moyen de transport principal :",
    options: [
      "A pieds.",
      "En Vélo",
      "En Moto",
      "En Voiture",
      "En Transport en commun.",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 46,
    consentAfter: false,
  },
  {
    id: 46,
    text: "Combien des Km êtes-vous prêt à faire pour aller voir (souvent) votre partenaire ?",
    options: ["Moins de 10 km.", "Moins de 50 km.", "Moins de 100 km."],
    type: "single", // Se poate selecta o singură opțiune
    next: 47, // Urmează întrebarea despre consimțământ
    consentAfter: true,
  },
  {
    id: 47,
    text: "Acceptez-vous que ces informations soient partagées avec les profils compatibles ?",
    options: ["Oui", "Non"],
    type: "single", // Consimțământ simplu
    consentFor: [41, 42, 43, 44, 45, 46], // Se aplică pentru întrebările din acest calup
    next: 48,
  },
  {
    id: 48,
    text: "Quelle est votre situation familiale personnelle ?",
    options: [
      "Je n’ai jamais été marié(e).",
      "Je suis divorcé(e).",
      "Je suis séparé(e).",
      "Je suis veuf(ve).",
      "C’est compliqué.",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 49,
    consentAfter: false,
  },
  {
    id: 49,
    text: "Quelle est la place du mariage dans votre vie ?",
    options: [
      "C’est primordial.",
      "C’est possible, mais non nécessaire.",
      "J’ai déjà donné, plus jamais !",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 50,
    consentAfter: false,
  },
  {
    id: 50,
    text: "Quelle est la relation avec votre famille d’origine ?",
    options: [
      "Fusionnelle, nous nous voyons tous les jours.",
      "On se voit de façon récurrente, chacun chez soi pour le reste",
      "Je n’ai plus de famille ou j’ai coupé les contacts",
      "Je suis en contact avec ma famille, à distance",
    ],
    type: "single", // Se poate selecta o singură opțiune
    next: 51,
    consentAfter: false,
  },
  {
    id: 51,
    text: "Votre famille d’origine a-t-elle émis des avis négatifs sur un ou plusieurs de vos partenaires pendant ou après vos relations ?",
    options: ["Oui, toujours", "Oui, parfois", "Non"],
    type: "single", // Se poate selecta o singură opțiune
    next: 52,
    consentAfter: false,
  },
  {
    id: 52,
    text: "Vos enfants ont-ils émis des avis négatifs sur un ou plusieurs de vos partenaires pendant ou après vos relations ?",
    options: ["Je n’ai pas d’enfants", "Oui, toujours", "Oui, parfois", "Non"],
    type: "single", // Se poate selecta o singură opțiune
    next: 53, // Urmează întrebarea despre consimțământ
    consentAfter: true,
  },
  {
    id: 53,
    text: "Acceptez-vous que ces informations soient partagées avec les profils compatibles ?",
    options: ["Oui", "Non"],
    type: "single", // Consimțământ simplu
    consentFor: [48, 49, 50, 51, 52], // Se aplică pentru întrebările din acest calup
    next: 54,
  },
];

export const questionsSet2 = [
  {
    id: 1,
    text: "Etes-vous",
    options: ["Homme", "Femme", "Non-binaire"],
    type: "single",
    next: 2, // Finalul chestionarului
  },
];

export const questionsSet3 = [
  {
    id: 1,
    text: "Quel est votre objectif principal pour élargir votre cercle d’amis ?",
    options: [
      "Activités en groupe",
      "Discussions en ligne",
      "Sorties régulières",
    ],
    type: "single",
    next: 2, // Finalul chestionarului
  },
];
