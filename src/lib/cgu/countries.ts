// Lista oficial de países e códigos Fala.BR com suporte a rótulos PT/EN/ES.
// As funções expostas permitem mapear nomes (com ou sem acentos) para o código
// e obter as opções já traduzidas para o idioma selecionado.

export type SupportedLanguage = "pt-BR" | "en" | "es";

export interface Country {
  codigo: number;
  falaBrName: string;
  names: Record<SupportedLanguage, string>;
}

type RawCountryTuple = [number, string, string, string, string];

const RAW_COUNTRIES: RawCountryTuple[] = [
  [132, "Afeganistão", "Afeganistão", "Afghanistan", "Afganistán"],
  [7560, "África do Sul", "Africa do Sul", "South Africa", "Sudáfrica"],
  [175, "Albânia, República da", "Albânia", "Albania", "Albania"],
  [230, "Alemanha", "Alemanha", "Germany", "Alemania"],
  [370, "Andorra", "Andorra", "Andorra", "Andorra"],
  [400, "Angola", "Angola", "Angola", "Angola"],
  [
    434,
    "Antigua e Barbuda",
    "Antígua e Barbuda",
    "Antigua and Barbuda",
    "Antigua y Barbuda",
  ],
  [531, "Arábia Saudita", "Arábia Saudita", "Saudi Arabia", "Arabia Saudita"],
  [590, "Argélia", "Argélia", "Algeria", "Argelia"],
  [639, "Argentina", "Argentina", "Argentina", "Argentina"],
  [647, "Armênia, República da", "Armênia", "Armenia", "Armenia"],
  [698, "Austrália", "Austrália", "Australia", "Australia"],
  [728, "Áustria", "Austria", "Austria", "Austria"],
  [736, "Azerbaijão, República do", "Azerbaijão", "Azerbaijan", "Azerbaiyán"],
  [779, "Bahamas, Ilhas", "Bahamas", "Bahamas", "Bahamas"],
  [809, "Bahrein, Ilhas", "Bahrein", "Bahrain", "Bahrein"],
  [817, "Bangladesh", "Bangladesh", "Bangladesh", "Bangladés"],
  [833, "Barbados", "Barbados", "Barbados", "Barbados"],
  [850, "Belarus", "Belarus", "Belarus", "Belarús"],
  [876, "Bélgica", "Bélgica", "Belgium", "Bélgica"],
  [884, "Belize", "Belize", "Belize", "Belice"],
  [2291, "Benin", "Benim", "Benin", "Benín"],
  [973, "Bolívia", "Bolívia", "Bolivia", "Bolivia"],
  [
    981,
    "Bósnia-Herzegovina",
    "Bósnia e Herzegovina",
    "Bosnia and Herzegovina",
    "Bosnia y Herzegovina",
  ],
  [1015, "Botsuana", "Botsuana", "Botswana", "Botsuana"],
  [1058, "Brasil", "Brasil", "Brazil", "Brasil"],
  [1082, "Brunei", "Brunei", "Brunei Darussalam", "Brunéi"],
  [1112, "Bulgária, República da", "Bulgária", "Bulgaria", "Bulgaria"],
  [310, "Burkina Faso", "Burkina Faso", "Burkina Faso", "Burkina Faso"],
  [1155, "Burundi", "Burundi", "Burundi", "Burundi"],
  [1198, "Butão", "Butão", "Bhutan", "Bután"],
  [1279, "Cabo Verde, República de", "Cabo Verde", "Cabo Verde", "Cabo Verde"],
  [1414, "Camboja", "Camboja", "Cambodia", "Camboya"],
  [1457, "Camarões", "Cameroun", "Cameroon", "Camerún"],
  [1490, "Canadá", "Canada", "Canada", "Canadá"],
  [1546, "Catar", "Catar", "Qatar", "Catar"],
  [
    1538,
    "Cazaquistão, República do",
    "Cazaquistão",
    "Kazakhstan",
    "Kazajistán",
  ],
  [7889, "Chade", "Chade", "Chad", "Chad"],
  [1589, "Chile", "Chile", "Chile", "Chile"],
  [1600, "China, República Popular da", "China", "China", "China"],
  [1635, "Chipre", "Chipre", "Cyprus", "Chipre"],
  [1694, "Colômbia", "Colômbia", "Colombia", "Colombia"],
  [1732, "Comores, Ilhas", "Comores", "Comoros", "Comoras"],
  [
    1775,
    "Congo, República do",
    "Congo Brazzaville, República do Congo",
    "Congo, Republic of the",
    "Congo, República del",
  ],
  [
    8885,
    "Congo, República Democrática do",
    "Congo Kinshasa, República Democrática do Congo",
    "Congo, Democratic Republic of",
    "Congo, República Democrática del",
  ],
  [
    1872,
    "Coreia do Norte",
    "Coreia do Norte",
    "Korea, Democratic People's Republic of (North Korea)",
    "Corea (del Norte), República Popular Democrática de Corea",
  ],
  [
    1902,
    "Coreia do Sul",
    "Coreia do Sul",
    "Korea, Republic of (South Korea)",
    "Corea (del Sur), República de Corea",
  ],
  [
    1937,
    "Costa do Marfim",
    "Costa do Marfim",
    "Côte d'Ivoire",
    "Côte d'Ivoire",
  ],
  [1961, "Costa Rica", "Costa Rica", "Costa Rica", "Costa Rica"],
  [1953, "Croácia, República da", "Croácia", "Croatia", "Croacia"],
  [1996, "Cuba", "Cuba", "Cuba", "Cuba"],
  [2321, "Dinamarca", "Dinamarca", "Denmark", "Dinamarca"],
  [7838, "Djibuti", "Djibouti", "Djibouti", "Yibuti"],
  [2356, "Dominica, Ilha", "Dominica", "Dominica", "Dominica"],
  [2402, "Egito", "Egito", "Egypt", "Egipto"],
  [6874, "El Salvador", "El Salvador", "El Salvador", "El Salvador"],
  [
    2445,
    "Emirados Árabes Unidos",
    "Emirados Árabes",
    "United Arab Emirates",
    "Emiratos Árabes Unidos",
  ],
  [2399, "Equador", "Equador", "Ecuador", "Ecuador"],
  [2437, "Eritréia", "Eritréia", "Eritrea", "Eritrea"],
  [2470, "Eslovaca, República", "Eslováquia", "Slovakia", "Eslovaquia"],
  [2461, "Eslovênia, República da", "Eslovênia", "Slovenia", "Eslovenia"],
  [2453, "Espanha", "Espanha", "Spain", "España"],
  [7544, "Suazilândia", "Essuatíni", "Eswatini", "Esuatini"],
  [2496, "Estados Unidos", "Estados Unidos", "United States", "Estados Unidos"],
  [2518, "Estônia, República da", "Estônia", "Estonia", "Estonia"],
  [2534, "Etiópia", "Etiópia", "Ethiopia", "Etiopía"],
  [8702, "Fiji", "Fiji", "Fiji", "Fiyi"],
  [2674, "Filipinas", "Filipinas", "Philippines", "Filipinas"],
  [2712, "Finlândia", "Finlândia", "Finland", "Finlandia"],
  [2755, "França", "França", "France", "Francia"],
  [2810, "Gabão", "Gabão", "Gabon", "Gabón"],
  [2852, "Gâmbia", "Gâmbia", "The Gambia", "Gambia"],
  [2895, "Gana", "Gana", "Ghana", "Ghana"],
  [2917, "Geórgia, República da", "Geórgia", "Georgia", "Georgia"],
  [2976, "Granada", "Granada", "Grenada", "Granada"],
  [3018, "Grécia", "Grécia", "Greece", "Grecia"],
  [3174, "Guatemala", "Guatemala", "Guatemala", "Guatemala"],
  [3379, "Guiana", "Guiana", "Guyana", "Guayana"],
  [3298, "Guiné", "Guiné", "Guinea", "Guinea"],
  [3344, "Guiné-Bissau", "Guiné-Bissau", "Guinea-Bissau", "Guinea-Bissau"],
  [
    3310,
    "Guiné-Equatorial",
    "Guiné-Equatorial",
    "Equatorial Guinea",
    "Guinea Ecuatorial",
  ],
  [3417, "Haiti", "Haiti", "Haiti", "Haití"],
  [3450, "Honduras", "Honduras", "Honduras", "Honduras"],
  [3557, "Hungria, República da", "Hungria", "Hungary", "Hungría"],
  [3573, "Iêmen", "Iêmen", "Yemen", "Yemen"],
  [1830, "Cook, Ilhas", "Ilhas Cook", "Cook Islands", "Islas Cook"],
  [
    4766,
    "Marshall, Ilhas",
    "Ilhas Marshall",
    "Marshall Islands",
    "Islas Marshall",
  ],
  [6777, "Salomão, Ilhas", "Ilhas Salomão", "Solomon Islands", "Islas Salomón"],
  [3611, "Índia", "India", "India", "India"],
  [3654, "Indonésia", "Indonésia", "Indonesia", "Indonesia"],
  [3727, "Irã, República Islâmica do", "Irã", "Iran", "Irán"],
  [3697, "Iraque", "Iraque", "Iraq", "Irak"],
  [3751, "Irlanda", "Irlanda", "Ireland", "Irlanda"],
  [3794, "Islândia", "Islândia", "Iceland", "Islandia"],
  [3832, "Israel", "Israel", "Israel", "Israel"],
  [3867, "Itália", "Itália", "Italy", "Italia"],
  [3913, "Jamaica", "Jamaica", "Jamaica", "Jamaica"],
  [3999, "Japão", "Japão", "Japan", "Japón"],
  [4030, "Jordânia", "Jordânia", "Jordan", "Jordania"],
  [4111, "Kiribati", "Kiribati", "Kiribati", "Kiribati"],
  [9003, "Kuweit", "Kuwait", "Kuwait", "Kuwait"],
  [4200, "Laos, Rep. Pop. Democrática do", "Laos", "Laos", "Laos"],
  [4260, "Lesoto", "Lesoto", "Lesotho", "Lesoto"],
  [4278, "Letônia, República da", "Letônia", "Latvia", "Letonia"],
  [4316, "Líbano", "Líbano", "Lebanon", "Líbano"],
  [4340, "Libéria", "Libéria", "Liberia", "Liberia"],
  [4383, "Líbia", "Líbia", "Libya", "Libia"],
  [4405, "Liechtenstein", "Liechtenstein", "Liechtenstein", "Liechtenstein"],
  [4421, "Lituânia, República da", "Lituânia", "Lithuania", "Lituania"],
  [4456, "Luxemburgo", "Luxemburgo", "Luxembourg", "Luxemburgo"],
  [
    4499,
    "Macedônia",
    "Macedônia do Norte",
    "North Macedonia",
    "Macedonia del Norte",
  ],
  [4502, "Madagascar", "Madagascar", "Madagascar", "Madagascar"],
  [4553, "Malásia", "Malásia", "Malaysia", "Malasia"],
  [4588, "Malavi", "Malawi", "Malawi", "Malaui"],
  [4618, "Maldivas", "Maldivas", "Maldives", "Maldivas"],
  [4642, "Máli", "Mali", "Mali", "Mali"],
  [4677, "Malta", "Malta", "Malta", "Malta"],
  [4740, "Marrocos", "Marrocos", "Morocco", "Marruecos"],
  [4855, "Maurício", "Maurício", "Mauritius", "Mauricio"],
  [4880, "Mauritânia", "Mauritânia", "Mauritania", "Mauritania"],
  [4936, "México", "México", "Mexico", "México"],
  [4995, "Micronésia", "Micronésia", "Micronesia", "Micronesia"],
  [5053, "Moçambique", "Moçambique", "Mozambique", "Mozambique"],
  [4944, "Moldávia, República da", "Moldova", "Moldova", "Moldava"],
  [4952, "Mônaco", "Mônaco", "Monaco", "Mónaco"],
  [4979, "Mongólia", "Mongólia", "Mongolia", "Mongolia"],
  [930, "Mianmar (Birmânia)", "Myanmar", "Myanmar", "Myanmar"],
  [5070, "Namíbia", "Namíbia", "Namibia", "Namibia"],
  [5088, "Nauru", "Nauru", "Nauru", "Nauru"],
  [5177, "Nepal", "Nepal", "Nepal", "Nepal"],
  [5215, "Nicarágua", "Nicarágua", "Nicaragua", "Nicaragua"],
  [5258, "Niger", "Niger", "Niger", "Níger"],
  [5282, "Nigéria", "Nigéria", "Nigeria", "Nigeria"],
  [5312, "Niue, Ilha", "Niue", "Niue", "Niue"],
  [5380, "Noruega", "Noruega", "Norway", "Noruega"],
  [5487, "Nova Zelândia", "Nova Zelândia", "New Zealand", "Nueva Zelanda"],
  [5568, "Omã", "Omã", "Oman", "Omán"],
  [
    5738,
    "Holanda (Países Baixos)",
    "Países Baixos",
    "Netherlands",
    "Países Bajos",
  ],
  [5754, "Palau", "Palau", "Palau", "Palaos"],
  [5800, "Panamá", "Panamá", "Panama", "Panamá"],
  [
    5452,
    "Papua Nova Guiné",
    "Papua Nova Guiné",
    "Papua New Guinea",
    "Papúa Nueva Guinea",
  ],
  [5762, "Paquistão", "Paquistão", "Pakistan", "Pakistán"],
  [5860, "Paraguai", "Paraguai", "Paraguay", "Paraguay"],
  [5894, "Peru", "Peru", "Peru", "Perú"],
  [6033, "Polônia, República da", "Polônia", "Poland", "Polonia"],
  [6076, "Portugal", "Portugal", "Portugal", "Portugal"],
  [6238, "Quênia", "Quênia", "Kenya", "Kenia"],
  [6254, "Quirguiz, República", "Quirguistão", "Kyrgyzstan", "Kirguistán"],
  [
    9001,
    "Reino Unido",
    "Reino Unido da Grã-Bretanha e Irlanda do Norte",
    "United Kingdom of Great Britain and Northern Ireland",
    "Reino Unido de Gran Bretaña e Irlanda del Norte",
  ],
  [
    6408,
    "República Centro-Africana",
    "República Centro-Africana",
    "Central African Republic",
    "República Centroafricana",
  ],
  [
    6475,
    "República Dominicana",
    "República Dominicana",
    "Dominican Republic",
    "República Dominicana",
  ],
  [7919, "Tcheca, República", "República Tcheca", "Czechia", "Chequia"],
  [6700, "Romênia", "Romênia", "Romania", "Rumania"],
  [6750, "Ruanda", "Ruanda", "Rwanda", "Ruanda"],
  [6769, "Rússia", "Rússia", "Russia", "Rusia"],
  [6904, "Samoa", "Samoa", "Samoa", "Samoa"],
  [6971, "San Marino", "San Marino", "San Marino", "San Marino"],
  [7153, "Santa Lúcia", "Santa Lúcia", "Saint Lucia", "Santa Lucía"],
  [
    6955,
    "São Cristóvão e Neves",
    "São Cristóvão e Neves",
    "Saint Kitts and Nevis",
    "San Cristóbal y Nieves",
  ],
  [
    7200,
    "São Tomé e Príncipe, Ilhas",
    "São Tomé e Príncipe",
    "Sao Tome and Principe",
    "Santo Tomé y Príncipe",
  ],
  [
    7056,
    "São Vicente e Granadinas",
    "São Vicente e Granadinas",
    "Saint Vincent and the Grenadines",
    "San Vicente y las Granadinas",
  ],
  [7315, "Seychelles", "Seicheles", "Seychelles", "Seychelles"],
  [7285, "Senegal", "Senegal", "Senegal", "Senegal"],
  [7358, "Serra Leoa", "Serra Leoa", "Sierra Leone", "Sierra Leona"],
  [7412, "Cingapura", "Singapura", "Singapore", "Singapur"],
  [7447, "Síria, República Árabe da", "Síria", "Syria", "Siria"],
  [7480, "Somália", "Somália", "Somalia", "Somalia"],
  [7501, "Sri Lanka", "Sri Lanka", "Sri Lanka", "Sri Lanka"],
  [7595, "Sudão", "Sudão", "Sudan", "Sudán"],
  [7641, "Suécia", "Suécia", "Sweden", "Suecia"],
  [7676, "Suíça", "Suíça", "Switzerland", "Suiza"],
  [7706, "Suriname", "Suriname", "Suriname", "Surinam"],
  [7765, "Tailândia", "Tailândia", "Thailand", "Tailandia"],
  [7722, "Tadjiquistão", "Tajiquistão", "Tajikistan", "Tayikistán"],
  [7803, "Tanzânia, República Unida da", "Tanzânia", "Tanzania", "Tanzania"],
  [7951, "Timor Leste", "Timor-Leste", "Timor-Leste", "Timor-Leste"],
  [8001, "Togo", "Togo", "Togo", "Togo"],
  [8109, "Tonga", "Tonga", "Tonga", "Tonga"],
  [
    8150,
    "Trinidad e Tobago",
    "Trinidad e Tobago",
    "Trinidad and Tobago",
    "Trinidad y Tobago",
  ],
  [8206, "Tunísia", "Tunísia", "Tunisia", "Túnez"],
  [
    8249,
    "Turcomenistão, República do",
    "Turcomenistão",
    "Turkmenistan",
    "Turkmenistán",
  ],
  [8273, "Turquia", "Turquia", "Türkiye", "Turquía"],
  [8281, "Tuvalu", "Tuvalu", "Tuvalu", "Tuvalu"],
  [8311, "Ucrânia", "Ucrânia", "Ukraine", "Ucrania"],
  [8338, "Uganda", "Uganda", "Uganda", "Uganda"],
  [8451, "Uruguai", "Uruguai", "Uruguay", "Uruguay"],
  [
    8478,
    "Uzbequistão, República do",
    "Uzbequistão",
    "Uzbekistan",
    "Uzbekistán",
  ],
  [5517, "Vanuatu", "Vanuatu", "Vanuatu", "Vanuatu"],
  [8486, "Vaticano, Estado da Cidade do", "Vaticano", "Vatican", "Vaticano"],
  [8508, "Venezuela", "Venezuela", "Venezuela", "Venezuela"],
  [8583, "Vietnã", "Vietnã", "Viet Nam", "Vietnam"],
  [8907, "Zâmbia", "Zâmbia", "Zambia", "Zambia"],
  [6653, "Zimbábue", "Zimbábue", "Zimbabwe", "Zimbabue"],
];

export const COUNTRIES: Country[] = RAW_COUNTRIES.map(
  ([codigo, falaBrName, pt, en, es]) => ({
    codigo,
    falaBrName,
    names: {
      "pt-BR": pt,
      en,
      es,
    },
  })
);

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

type AliasEntry = [string, number];

const MANUAL_ALIASES: AliasEntry[] = [
  ["brazil", 1058],
  ["brasil", 1058],
  ["united states", 2496],
  ["usa", 2496],
  ["eua", 2496],
  ["united states of america", 2496],
  ["germany", 230],
  ["deutschland", 230],
  ["alemanha", 230],
  ["spain", 2453],
  ["espana", 2453],
  ["espanha", 2453],
  ["italy", 3867],
  ["italia", 3867],
  ["france", 2755],
  ["franca", 2755],
  ["portugal", 6076],
  ["argentina", 639],
  ["chile", 1589],
  ["peru", 5894],
  ["paraguay", 5860],
  ["paraguai", 5860],
  ["uruguay", 8451],
  ["uruguai", 8451],
  ["bolivia", 973],
  ["venezuela", 8508],
  ["colombia", 1694],
  ["mexico", 4936],
  ["china", 1600],
  ["japan", 3999],
  ["japao", 3999],
  ["south korea", 1902],
  ["coreia do sul", 1902],
  ["north korea", 1872],
  ["coreia do norte", 1872],
  ["russia", 6769],
  ["turkiye", 8273],
  ["turkey", 8273],
  ["india", 3611],
  ["indonesia", 3654],
  ["south africa", 7560],
  ["africa do sul", 7560],
  ["netherlands", 5738],
  ["holanda", 5738],
  ["kingdom of the netherlands", 5738],
  ["uk", 9001],
  ["united kingdom", 9001],
  ["britain", 9001],
  ["great britain", 9001],
  ["dominican republic", 6475],
  ["czech republic", 7919],
  ["czechia", 7919],
  ["sri lanka", 7501],
  ["ivory coast", 1937],
  ["cote d ivoire", 1937],
];

const INDEX_BY_NAME = new Map<string, number>();

for (const country of COUNTRIES) {
  const variants = new Set<string>([
    country.falaBrName,
    country.names["pt-BR"],
    country.names.en,
    country.names.es,
  ]);
  for (const variant of variants) {
    if (!variant) continue;
    INDEX_BY_NAME.set(normalize(variant), country.codigo);
  }
}

for (const [alias, code] of MANUAL_ALIASES) {
  INDEX_BY_NAME.set(normalize(alias), code);
}

export function findCountryCodeByName(name: string): number | undefined {
  if (!name) return undefined;
  const key = normalize(name);
  if (INDEX_BY_NAME.has(key)) {
    return INDEX_BY_NAME.get(key);
  }
  for (const country of COUNTRIES) {
    const variants = [
      country.falaBrName,
      country.names["pt-BR"],
      country.names.en,
      country.names.es,
    ];
    for (const variant of variants) {
      const normalized = normalize(variant);
      if (normalized.includes(key) || key.includes(normalized)) {
        return country.codigo;
      }
    }
  }
  return undefined;
}

export function getCountryLabel(
  code: number,
  language: SupportedLanguage = "pt-BR"
): string | undefined {
  const country = COUNTRIES.find((c) => c.codigo === code);
  if (!country) return undefined;
  return (
    country.names[language] ?? country.names["pt-BR"] ?? country.falaBrName
  );
}

export function getCountryOptions(
  language: SupportedLanguage = "pt-BR"
): { label: string; value: number; codigo: number }[] {
  // Gera as opções e ordena alfabeticamente de forma sensível ao idioma selecionado.
  // Usa Intl.Collator para comparar ignorando acentos (sensitivity: 'base').
  const collator = new Intl.Collator(language, { sensitivity: "base" });
  return COUNTRIES.map((country) => {
    const label =
      getCountryLabel(country.codigo, language) ?? country.falaBrName;
    return { label, value: country.codigo, codigo: country.codigo };
  }).sort((a, b) => collator.compare(a.label, b.label));
}
