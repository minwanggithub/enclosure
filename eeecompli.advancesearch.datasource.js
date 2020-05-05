//=====================================================================
//Min Wang: 05/01/2020 -- Note ----
//Datasource definition template used by advance search everything can
//be overwritten at runtime for specific use
//=====================================================================

var advanceSearchDataSourceSettings = {
    actions: {
        GetDocumentType: "GetDocumentTypeLookUp",
        GetOpertorSearchColunm: "GetAdvanceSearchColumnDef?columnGroup=operator",
        GetSupplierSearchColunm: "GetAdvanceSearchColumnDef?columnGroup=SupplierSearch",
        GetSupplierType: "GetSupplierTypeLookUp",
        GetCountryType: "GetCountryTypeLookUp"
    },
    contenttype: {
        Json: "application/json; charset=utf-8"
    },
    controllers: {
        Company: "Company",
        Document: "Document",
        Home: "Home",
        Svc: "Svc"
    },
    area: {
        Operations: "Operations"
    },
    datasource: {

    }
};


var advanceSearchDataSource = {
    Operators: new kendo.data.DataSource({
        transport: {
            read: {
                url: GetEnvironmentLocation() + "/" + advanceSearchDataSourceSettings.controllers.Svc + "/" + advanceSearchDataSourceSettings.actions.GetOpertorSearchColunm,
                type: "POST",
                contentType: "application/json"
            }
        }
    }),
    SupplierType: new kendo.data.DataSource({
        transport: {
            read: {
                url: GetEnvironmentLocation() + "/" + advanceSearchDataSourceSettings.controllers.Svc + "/" + advanceSearchDataSourceSettings.actions.GetSupplierType,
                type: "POST",
                contentType: "application/json"
            }
        }
    }),
    SupplierSearchColumn: new kendo.data.DataSource({
        transport: {
            read: {
                url: GetEnvironmentLocation() + "/" + advanceSearchDataSourceSettings.controllers.Svc + "/" + advanceSearchDataSourceSettings.actions.GetSupplierSearchColunm,
                type: "POST",
                contentType: "application/json"
            }
        }
    }),

    CountryType: new kendo.data.DataSource({
        transport: {
            read: {
                url: GetEnvironmentLocation() + "/" + advanceSearchDataSourceSettings.controllers.Svc + "/" + advanceSearchDataSourceSettings.actions.GetCountryType,
                type: "POST",
                contentType: "application/json"
            }
        }
    })
};

var selectLanguageDataSource = [
    {
        Text: 'English',
        Value: '11',
    },
    {
        Text: 'French',
        Value: '18',
    },
    {
        Text: 'Chinese',
        Value: '63',
    },
    {
        Text: 'Japanese',
        Value: '29',
    },
    {
        Text: 'Spanish',
        Value: '12',
    },
    {
        Text: 'Afrikaans',
        Value: '1',
    },
    {
        Text: 'Albanian',
        Value: '51',
    },
    {
        Text: 'Arabic',
        Value: '2',
    },
    {
        Text: 'Armenian',
        Value: '25',
    },
    {
        Text: 'Azeri',
        Value: '3',
    },
    {
        Text: 'Basque',
        Value: '14',
    },
    {
        Text: 'Belarusian',
        Value: '4',
    },
    {
        Text: 'Bulgarian',
        Value: '5',
    },
    {
        Text: 'Catalan',
        Value: '6',
    },
    {
        Text: 'Croatian',
        Value: '23',
    },
    {
        Text: 'Czech',
        Value: '7',
    },
    {
        Text: 'Danish',
        Value: '8',
    },
    {
        Text: 'Dutch',
        Value: '41',
    },
    {
        Text: 'Estonian',
        Value: '13',
    },
    {
        Text: 'Faroese',
        Value: '17',
    },
    {
        Text: 'Farsi',
        Value: '15',
    },
    {
        Text: 'Filipino',
        Value: '64',
    },
    {
        Text: 'Finnish',
        Value: '16',
    },
    {
        Text: 'Galician',
        Value: '19',
    },
    {
        Text: 'Georgian',
        Value: '30',
    },
    {
        Text: 'German',
        Value: '9',
    },
    {
        Text: 'Greek',
        Value: '10',
    },
    {
        Text: 'Gujarati',
        Value: '20',
    },
    {
        Text: 'Hebrew',
        Value: '21',
    },
    {
        Text: 'Hindi',
        Value: '22',
    },
    {
        Text: 'Hungarian',
        Value: '24',
    },
    {
        Text: 'Icelandic',
        Value: '27',
    },
    {
        Text: 'Indonesian',
        Value: '26',
    },
    {
        Text: 'Italian',
        Value: '28',
    },
    {
        Text: 'Kannada',
        Value: '32',
    },
    {
        Text: 'Kazakh',
        Value: '31',
    },
    {
        Text: 'Korean',
        Value: '33',
    },
    {
        Text: 'Kyrgyz',
        Value: '34',
    },
    {
        Text: 'Latvian',
        Value: '36',
    },
    {
        Text: 'Khmer',
        Value: '68',
    },
    {
        Text: 'Lao',
        Value: '69',
    },
    {
        Text: 'Lithuanian',
        Value: '35',
    },
    {
        Text: 'Macedonian',
        Value: '37',
    },
    {
        Text: 'Malay',
        Value: '40',
    },
    {
        Text: 'Maltese',
        Value: '66',
    },
    {
        Text: 'Marathi',
        Value: '39',
    },
    {
        Text: 'Mongolian',
        Value: '38',
    },
    {
        Text: 'Norwegian',
        Value: '42',
    },
    {
        Text: 'Polish',
        Value: '44',
    },
    {
        Text: 'Portuguese',
        Value: '45',
    },
    {
        Text: 'Punjabi',
        Value: '43',
    },
    {
        Text: 'Romanian',
        Value: '46',
    },
    {
        Text: 'Sanskrit',
        Value: '48',
    },
    {
        Text: 'Serbian',
        Value: '65',
    },
    {
        Text: 'Slovak',
        Value: '49',
    },
    {
        Text: 'Slovenian',
        Value: '50',
    },
    {
        Text: 'Swahili',
        Value: '53',
    },
    {
        Text: 'Russian',
        Value: '47',
    },
    {
        Text: 'Swedish',
        Value: '52',
    },
    {
        Text: 'Tagalog',
        Value: '67',
    },
    {
        Text: 'Tamil',
        Value: '54',
    },
    {
        Text: 'Tatar',
        Value: '58',
    },
    {
        Text: 'Telugu',
        Value: '55',
    },
    {
        Text: 'Thai',
        Value: '56',
    },
    {
        Text: 'Turkish',
        Value: '57',
    },
    {
        Text: 'Ukrainian',
        Value: '59',
    },
    {
        Text: 'Urdu',
        Value: '60',
    },
    {
        Text: 'Uzbek',
        Value: '61',
    },
    {
        Text: 'Vietnamese',
        Value: '62',
    },
];

var selectCountryDataSource = [
    {
        Text: 'AFGHANISTAN',
        Value: '1',
    },
    {
        Text: 'ALBANIA',
        Value: '2',
    },
    {
        Text: 'ALGERIA',
        Value: '3',
    },
    {
        Text: 'AMERICAN SAMOA',
        Value: '4',
    },
    {
        Text: 'ANDORRA',
        Value: '5',
    },
    {
        Text: 'ANGOLA',
        Value: '6',
    },
    {
        Text: 'ANGUILLA',
        Value: '7',
    },
    {
        Text: 'ANTARCTICA',
        Value: '8',
    },
    {
        Text: 'ANTIGUA AND BARBUDA',
        Value: '9',
    },
    {
        Text: 'ARGENTINA',
        Value: '10',
    },
    {
        Text: 'ARMENIA',
        Value: '11',
    },
    {
        Text: 'ARUBA',
        Value: '12',
    },
    {
        Text: 'AUSTRALIA',
        Value: '13',
    },
    {
        Text: 'AUSTRIA',
        Value: '14',
    },
    {
        Text: 'AZERBAIJAN',
        Value: '15',
    },
    {
        Text: 'BAHAMAS',
        Value: '16',
    },
    {
        Text: 'BAHRAIN',
        Value: '17',
    },
    {
        Text: 'BANGLADESH',
        Value: '18',
    },
    {
        Text: 'BARBADOS',
        Value: '19',
    },
    {
        Text: 'BELARUS',
        Value: '20',
    },
    {
        Text: 'BELGIUM',
        Value: '21',
    },
    {
        Text: 'BELIZE',
        Value: '22',
    },
    {
        Text: 'BENIN',
        Value: '23',
    },
    {
        Text: 'BERMUDA',
        Value: '24',
    },
    {
        Text: 'BHUTAN',
        Value: '25',
    },
    {
        Text: 'BOLIVIA',
        Value: '26',
    },
    {
        Text: 'BOSNIA AND HERZEGOWINA',
        Value: '27',
    },
    {
        Text: 'BOTSWANA',
        Value: '28',
    },
    {
        Text: 'BRAZIL',
        Value: '30',
    },
    {
        Text: 'BRUNEI DARUSSALAM',
        Value: '32',
    },
    {
        Text: 'BULGARIA',
        Value: '33',
    },
    {
        Text: 'BURKINA FASO',
        Value: '34',
    },
    {
        Text: 'BURUNDI',
        Value: '35',
    },
    {
        Text: 'CAMBODIA',
        Value: '36',
    },
    {
        Text: 'CAMEROON',
        Value: '37',
    },
    {
        Text: 'CANADA',
        Value: '38',
    },
    {
        Text: 'CAPE VERDE',
        Value: '39',
    },
    {
        Text: 'CAYMAN ISLANDS',
        Value: '40',
    },
    {
        Text: 'CENTRAL AFRICAN REPUBLIC',
        Value: '41',
    },
    {
        Text: 'CHAD',
        Value: '42',
    },
    {
        Text: 'CHILE',
        Value: '43',
    },
    {
        Text: 'CHINA',
        Value: '44',
    },
    {
        Text: 'CHRISTMAS ISLAND',
        Value: '45',
    },
    {
        Text: 'COCOS (KEELING) ISLANDS',
        Value: '46',
    },
    {
        Text: 'COLOMBIA',
        Value: '47',
    },
    {
        Text: 'COMOROS',
        Value: '48',
    },
    {
        Text: 'CONGO, Democratic Republic of the',
        Value: '49',
    },
    {
        Text: 'CONGO',
        Value: '50',
    },
    {
        Text: 'COOK ISLANDS',
        Value: '51',
    },
    {
        Text: 'COSTA RICA',
        Value: '52',
    },
    {
        Text: "COTE D''IVOIRE",
        Value: '53',
    },
    {
        Text: 'CROATIA',
        Value: '54',
    },
    {
        Text: 'CUBA',
        Value: '55',
    },
    {
        Text: 'CYPRUS',
        Value: '56',
    },
    {
        Text: 'CZECH REPUBLIC',
        Value: '57',
    },
    {
        Text: 'DENMARK',
        Value: '58',
    },
    {
        Text: 'DJIBOUTI',
        Value: '59',
    },
    {
        Text: 'DOMINICA',
        Value: '60',
    },
    {
        Text: 'DOMINICAN REPUBLIC',
        Value: '61',
    },
    {
        Text: 'EAST TIMOR',
        Value: '62',
    },
    {
        Text: 'ECUADOR',
        Value: '63',
    },
    {
        Text: 'EGYPT',
        Value: '64',
    },
    {
        Text: 'EL SALVADOR',
        Value: '65',
    },
    {
        Text: 'EQUATORIAL GUINEA',
        Value: '66',
    },
    {
        Text: 'ERITREA',
        Value: '67',
    },
    {
        Text: 'ESTONIA',
        Value: '68',
    },
    {
        Text: 'ETHIOPIA',
        Value: '69',
    },
    {
        Text: 'FALKLAND ISLANDS (MALVINAS)',
        Value: '70',
    },
    {
        Text: 'FAROE ISLANDS',
        Value: '71',
    },
    {
        Text: 'FIJI ISLANDS',
        Value: '72',
    },
    {
        Text: 'FINLAND',
        Value: '73',
    },
    {
        Text: 'FRANCE',
        Value: '74',
    },
    {
        Text: 'FRENCH GUIANA',
        Value: '75',
    },
    {
        Text: 'FRENCH POLYNESIA',
        Value: '76',
    },
    {
        Text: 'GABON',
        Value: '78',
    },
    {
        Text: 'GAMBIA',
        Value: '79',
    },
    {
        Text: 'GEORGIA',
        Value: '80',
    },
    {
        Text: 'GERMANY',
        Value: '81',
    },
    {
        Text: 'GHANA',
        Value: '82',
    },
    {
        Text: 'GIBRALTAR',
        Value: '83',
    },
    {
        Text: 'GREECE',
        Value: '84',
    },
    {
        Text: 'GREENLAND',
        Value: '85',
    },
    {
        Text: 'GRENADA',
        Value: '86',
    },
    {
        Text: 'GUADELOUPE',
        Value: '87',
    },
    {
        Text: 'GUAM',
        Value: '88',
    },
    {
        Text: 'GUATEMALA',
        Value: '89',
    },
    {
        Text: 'GUINEA',
        Value: '90',
    },
    {
        Text: 'GUINEA-BISSAU',
        Value: '91',
    },
    {
        Text: 'GUYANA',
        Value: '92',
    },
    {
        Text: 'HAITI',
        Value: '93',
    },
    {
        Text: 'HOLY SEE (VATICAN CITY STATE)',
        Value: '95',
    },
    {
        Text: 'HONDURAS',
        Value: '96',
    },
    {
        Text: 'HONG KONG',
        Value: '97',
    },
    {
        Text: 'HUNGARY',
        Value: '98',
    },
    {
        Text: 'ICELAND',
        Value: '99',
    },
    {
        Text: 'INDIA',
        Value: '100',
    },
    {
        Text: 'INDONESIA',
        Value: '101',
    },
    {
        Text: 'IRAN, ISLAMIC REPUBLIC OF',
        Value: '102',
    },
    {
        Text: 'IRAQ',
        Value: '103',
    },
    {
        Text: 'IRELAND',
        Value: '104',
    },
    {
        Text: 'ISRAEL',
        Value: '105',
    },
    {
        Text: 'ITALY',
        Value: '106',
    },
    {
        Text: 'JAMAICA',
        Value: '107',
    },
    {
        Text: 'JAPAN',
        Value: '108',
    },
    {
        Text: 'JORDAN',
        Value: '109',
    },
    {
        Text: 'KAZAKHSTAN',
        Value: '110',
    },
    {
        Text: 'KENYA',
        Value: '111',
    },
    {
        Text: 'KIRIBATI',
        Value: '112',
    },
    {
        Text: "KOREA, DEMOCRATIC PEOPLE''S REPUBLIC OF",
        Value: '113',
    },
    {
        Text: 'KOREA, REPUBLIC OF',
        Value: '114',
    },
    {
        Text: 'KUWAIT',
        Value: '115',
    },
    {
        Text: 'KYRGYZSTAN',
        Value: '116',
    },
    {
        Text: 'LAOS',
        Value: '117',
    },
    {
        Text: 'LATVIA',
        Value: '118',
    },
    {
        Text: 'LEBANON',
        Value: '119',
    },
    {
        Text: 'LESOTHO',
        Value: '120',
    },
    {
        Text: 'LIBERIA',
        Value: '121',
    },
    {
        Text: 'LIBYAN ARAB JAMAHIRIYA',
        Value: '122',
    },
    {
        Text: 'LIECHTENSTEIN',
        Value: '123',
    },
    {
        Text: 'LITHUANIA',
        Value: '124',
    },
    {
        Text: 'LUXEMBOURG',
        Value: '125',
    },
    {
        Text: 'MACAU',
        Value: '126',
    },
    {
        Text: 'MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF',
        Value: '127',
    },
    {
        Text: 'MADAGASCAR',
        Value: '128',
    },
    {
        Text: 'MALAWI',
        Value: '129',
    },
    {
        Text: 'MALAYSIA',
        Value: '130',
    },
    {
        Text: 'MALDIVES',
        Value: '131',
    },
    {
        Text: 'MALI',
        Value: '132',
    },
    {
        Text: 'MALTA',
        Value: '133',
    },
    {
        Text: 'MARSHALL ISLANDS',
        Value: '134',
    },
    {
        Text: 'MARTINIQUE',
        Value: '135',
    },
    {
        Text: 'MAURITANIA',
        Value: '136',
    },
    {
        Text: 'MAURITIUS',
        Value: '137',
    },
    {
        Text: 'MAYOTTE ISLAND',
        Value: '138',
    },
    {
        Text: 'MEXICO',
        Value: '139',
    },
    {
        Text: 'MICRONESIA',
        Value: '140',
    },
    {
        Text: 'MOLDOVA',
        Value: '141',
    },
    {
        Text: 'MONACO',
        Value: '142',
    },
    {
        Text: 'MONGOLIA',
        Value: '143',
    },
    {
        Text: 'MONTSERRAT',
        Value: '144',
    },
    {
        Text: 'MOROCCO',
        Value: '145',
    },
    {
        Text: 'MOZAMBIQUE',
        Value: '146',
    },
    {
        Text: 'MYANMAR',
        Value: '147',
    },
    {
        Text: 'NAMIBIA',
        Value: '148',
    },
    {
        Text: 'NAURU',
        Value: '149',
    },
    {
        Text: 'NEPAL',
        Value: '150',
    },
    {
        Text: 'NETHERLANDS',
        Value: '151',
    },
    {
        Text: 'NETHERLANDS ANTILLES',
        Value: '152',
    },
    {
        Text: 'NEW CALEDONIA',
        Value: '153',
    },
    {
        Text: 'NEW ZEALAND',
        Value: '154',
    },
    {
        Text: 'NICARAGUA',
        Value: '155',
    },
    {
        Text: 'NIGER',
        Value: '156',
    },
    {
        Text: 'NIGERIA',
        Value: '157',
    },
    {
        Text: 'NIUE',
        Value: '158',
    },
    {
        Text: 'NORFOLK ISLAND',
        Value: '159',
    },
    {
        Text: 'NORTHERN MARIANA ISLANDS',
        Value: '160',
    },
    {
        Text: 'NORWAY',
        Value: '161',
    },
    {
        Text: 'OMAN',
        Value: '162',
    },
    {
        Text: 'PAKISTAN',
        Value: '163',
    },
    {
        Text: 'PALAU',
        Value: '164',
    },
    {
        Text: 'PALESTINE TERRITORY, OCCUPIED',
        Value: '165',
    },
    {
        Text: 'PANAMA',
        Value: '166',
    },
    {
        Text: 'PAPUA NEW GUINEA',
        Value: '167',
    },
    {
        Text: 'PARAGUAY',
        Value: '168',
    },
    {
        Text: 'PERU',
        Value: '169',
    },
    {
        Text: 'PHILIPPINES',
        Value: '170',
    },
    {
        Text: 'POLAND',
        Value: '172',
    },
    {
        Text: 'PORTUGAL',
        Value: '173',
    },
    {
        Text: 'PUERTO RICO',
        Value: '174',
    },
    {
        Text: 'QATAR',
        Value: '175',
    },
    {
        Text: 'RÉUNION ISLAND',
        Value: '176',
    },
    {
        Text: 'ROMANIA',
        Value: '177',
    },
    {
        Text: 'RUSSIAN FEDERATION',
        Value: '178',
    },
    {
        Text: 'RWANDA',
        Value: '179',
    },
    {
        Text: 'SAINT KITTS AND NEVIS',
        Value: '180',
    },
    {
        Text: 'SAINT LUCIA',
        Value: '181',
    },
    {
        Text: 'SAINT VINCENT AND THE GRENADINES',
        Value: '182',
    },
    {
        Text: 'SAMOA',
        Value: '183',
    },
    {
        Text: 'SAN MARINO',
        Value: '184',
    },
    {
        Text: 'SÃO TOMÉ AND PRINCIPE',
        Value: '185',
    },
    {
        Text: 'SAUDI ARABIA',
        Value: '186',
    },
    {
        Text: 'SENEGAL',
        Value: '187',
    },
    {
        Text: 'SEYCHELLES ISLANDS',
        Value: '188',
    },
    {
        Text: 'SIERRA LEONE',
        Value: '189',
    },
    {
        Text: 'SINGAPORE',
        Value: '190',
    },
    {
        Text: 'SLOVAKIA',
        Value: '191',
    },
    {
        Text: 'SLOVENIA',
        Value: '192',
    },
    {
        Text: 'SOLOMON ISLANDS',
        Value: '193',
    },
    {
        Text: 'SOMALIA',
        Value: '194',
    },
    {
        Text: 'SOUTH AFRICA',
        Value: '195',
    },
    {
        Text: 'SPAIN',
        Value: '197',
    },
    {
        Text: 'SRI LANKA',
        Value: '198',
    },
    {
        Text: 'ST. HELENA',
        Value: '199',
    },
    {
        Text: 'ST. PIERRE AND MIQUELON',
        Value: '200',
    },
    {
        Text: 'SUDAN',
        Value: '201',
    },
    {
        Text: 'SURINAME',
        Value: '202',
    },
    {
        Text: 'SWAZILAND',
        Value: '204',
    },
    {
        Text: 'SWEDEN',
        Value: '205',
    },
    {
        Text: 'SWITZERLAND',
        Value: '206',
    },
    {
        Text: 'SYRIAN ARAB REPUBLIC',
        Value: '207',
    },
    {
        Text: 'TAIWAN, PROVINCE OF CHINA',
        Value: '208',
    },
    {
        Text: 'TAJIKISTAN',
        Value: '209',
    },
    {
        Text: 'TANZANIA, UNITED REPUBLIC OF',
        Value: '210',
    },
    {
        Text: 'THAILAND',
        Value: '211',
    },
    {
        Text: 'TOGO',
        Value: '212',
    },
    {
        Text: 'TOKELAU',
        Value: '213',
    },
    {
        Text: 'TONGA',
        Value: '214',
    },
    {
        Text: 'TRINIDAD AND TOBAGO',
        Value: '215',
    },
    {
        Text: 'TUNISIA',
        Value: '216',
    },
    {
        Text: 'TURKEY',
        Value: '217',
    },
    {
        Text: 'TURKMENISTAN',
        Value: '218',
    },
    {
        Text: 'TURKS AND CAICOS ISLANDS',
        Value: '219',
    },
    {
        Text: 'TUVALU',
        Value: '220',
    },
    {
        Text: 'UGANDA',
        Value: '221',
    },
    {
        Text: 'UKRAINE',
        Value: '222',
    },
    {
        Text: 'UNITED ARAB EMIRATES',
        Value: '223',
    },
    {
        Text: 'UNITED KINGDOM',
        Value: '224',
    },
    {
        Text: 'UNITED STATES OF AMERICA',
        Value: '225',
    },
    {
        Text: 'UNITED STATES MINOR OUTLYING ISLANDS',
        Value: '226',
    },
    {
        Text: 'URUGUAY',
        Value: '227',
    },
    {
        Text: 'UZBEKISTAN',
        Value: '228',
    },
    {
        Text: 'VANUATU',
        Value: '229',
    },
    {
        Text: 'VENEZUELA',
        Value: '230',
    },
    {
        Text: 'VIETNAM',
        Value: '231',
    },
    {
        Text: 'VIRGIN ISLANDS (BRITISH)',
        Value: '232',
    },
    {
        Text: 'VIRGIN ISLANDS (U.S.)',
        Value: '233',
    },
    {
        Text: 'WALLIS AND FUTUNA ISLANDS',
        Value: '234',
    },
    {
        Text: 'YEMEN',
        Value: '236',
    },
    {
        Text: 'YUGOSLAVIA',
        Value: '237',
    },
    {
        Text: 'ZAMBIA',
        Value: '238',
    },
    {
        Text: 'ZIMBABWE',
        Value: '239',
    },
    {
        Text: 'ALAND ISLANDS',
        Value: '240',
    },
    {
        Text: 'BOUVET ISLAND',
        Value: '241',
    },
    {
        Text: 'BRITISH INDIAN OCEAN TERRITORY',
        Value: '242',
    },
    {
        Text: 'FRENCH SOUTHERN TERRITORIES',
        Value: '243',
    },
    {
        Text: 'GUERNSEY',
        Value: '244',
    },
    {
        Text: 'HEARD ISLAND AND MCDONALD ISLANDS',
        Value: '245',
    },
    {
        Text: 'ISLE OF MAN',
        Value: '246',
    },
    {
        Text: 'JERSEY',
        Value: '247',
    },
    {
        Text: 'MONTENEGRO',
        Value: '248',
    },
    {
        Text: 'PITCAIRN',
        Value: '249',
    },
    {
        Text: 'SERBIA',
        Value: '250',
    },
    {
        Text: 'SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS',
        Value: '251',
    },
    {
        Text: 'SVALBARD AND JAN MAYEN',
        Value: '252',
    },
    {
        Text: 'TIMOR-LESTE',
        Value: '253',
    },
    {
        Text: 'WESTERN SAHARA',
        Value: '254',
    },
    {
        Text: 'SOUTH SUDAN',
        Value: '255',
    },
    {
        Text: 'BONAIRE, SINT EUSTATIUS AND SABA',
        Value: '256',
    },
    {
        Text: 'CURAÇAO',
        Value: '257',
    },
    {
        Text: 'SAINT BARTHÉLEMY',
        Value: '258',
    },
    {
        Text: 'SAINT MARTIN (FRENCH PART)',
        Value: '259',
    },
    {
        Text: 'SINT MAARTEN (DUTCH PART)',
        Value: '260',
    },
];

var selectDocumentTypeDataSource = [
    {
        Text: 'Attachment',
        Value: '1',
    },
    {
        Text: 'FDA Sheet',
        Value: '2',
    },
    {
        Text: 'SDS',
        Value: '3',
    },
    {
        Text: 'Tech Sheet',
        Value: '4',
    },
    {
        Text: 'Conflict Minerals',
        Value: '11',
    },
    {
        Text: 'Ge Si Template',
        Value: '12',
    },
    {
        Text: 'Smelter Certification',
        Value: '13',
    },
    {
        Text: 'Ingredient Disclosure',
        Value: '14',
    },
    {
        Text: 'Material Declaration',
        Value: '15',
    },
    {
        Text: 'Supplier Document',
        Value: '16',
    },
    {
        Text: 'REACH Disclosure',
        Value: '17',
    },
    {
        Text: 'ROHS Certification',
        Value: '18',
    },
    {
        Text: 'CA Proposition 65',
        Value: '19',
    },
    {
        Text: 'Bill of Materials',
        Value: '20',
    },
    {
        Text: 'Customer Survey',
        Value: '21',
    },
    {
        Text: 'Material Declaration IPC 1752',
        Value: '22',
    },
    {
        Text: 'Other is used to support unknown documents',
        Value: '30',
    },
    {
        Text: 'Fresenius EU Medical Device Sustainability',
        Value: '23',
    },
    {
        Text: "Burt''s Bees Topic Doc",
        Value: '31',
    },
    {
        Text: "Burt''s Bees RMQ",
        Value: '32',
    },
    {
        Text: 'SDS UK',
        Value: '33',
    },
    {
        Text: 'SDS US',
        Value: '34',
    },
    {
        Text: 'Raw Material Specification',
        Value: '35',
    },
    {
        Text: 'Certificate of Analysis (CoA)',
        Value: '36',
    },
    {
        Text: 'Manufacturing Flow Chart / Summary',
        Value: '37',
    },
    {
        Text: 'BSE-TSE',
        Value: '38',
    },
    {
        Text: 'GMO Status',
        Value: '39',
    },
    {
        Text: 'Particulate Substance Analysis',
        Value: '40',
    },
    {
        Text: 'NPA Personal Care Product Certification ',
        Value: '41',
    },
    {
        Text: 'ECOCERT Certification ',
        Value: '42',
    },
    {
        Text: 'NATRUE Certification ',
        Value: '43',
    },
    {
        Text: 'COSMOS Certification ',
        Value: '44',
    },
    {
        Text: 'EU Organic Certification ',
        Value: '45',
    },
    {
        Text: 'USDA NOP Certification ',
        Value: '46',
    },
    {
        Text: 'Pesticide Free Certification',
        Value: '47',
    },
    {
        Text: 'Fair Trade Certification ',
        Value: '48',
    },
    {
        Text: 'Halal Certification ',
        Value: '49',
    },
    {
        Text: 'Kosher Certification ',
        Value: '50',
    },
    {
        Text: 'Pesticide screening analysis',
        Value: '51',
    },
    {
        Text: 'Food Contact Questionnaire',
        Value: '52',
    },
    {
        Text: 'Allergen Declaration',
        Value: '53',
    },
    {
        Text: 'Regulated Materials Questionnaire',
        Value: '54',
    },
    {
        Text: 'Banned and Restricted Substances',
        Value: '55',
    },
    {
        Text: 'US Food Contact Certification',
        Value: '56',
    },
    {
        Text: 'GMP Audit Certificate',
        Value: '57',
    },
    {
        Text: 'EU Food Packaging Certification',
        Value: '58',
    },
    {
        Text: 'Allergen Operations Management Forms',
        Value: '59',
    },
    {
        Text: 'Animal Testing Compliance Questionnaire',
        Value: '60',
    },
    {
        Text: 'IFRA Compliance Questionnaire',
        Value: '61',
    },
    {
        Text: 'Responsible Sourcing',
        Value: '62',
    },
    {
        Text: 'Cosmetic Allergen Stock Form',
        Value: '63',
    },
    {
        Text: 'ROHS Certification Statement',
        Value: '75',
    },
    {
        Text: 'CA Proposition 65 Statement',
        Value: '76',
    },
    {
        Text: 'Allergen Declaration Statement',
        Value: '77',
    },
    {
        Text: 'Banned and Restricted Substances Statement',
        Value: '78',
    },
    {
        Text: 'CAA 611 Statement of Compliance',
        Value: '64',
    },
    {
        Text: 'Canadian CEPA Statement',
        Value: '65',
    },
    {
        Text: 'Canadian DSL Statement',
        Value: '66',
    },
    {
        Text: 'Conflict Minerals Statement',
        Value: '67',
    },
    {
        Text: 'CONEG Statement of Compliance',
        Value: '68',
    },
    {
        Text: 'Dioxins, chlorine',
        Value: '69',
    },
    {
        Text: 'Food Safety Program Statement',
        Value: '70',
    },
    {
        Text: 'ISO Certification',
        Value: '71',
    },
    {
        Text: 'Pallets Compliance',
        Value: '72',
    },
    {
        Text: 'Product Bulletin',
        Value: '73',
    },
    {
        Text: 'EU Article 33 REACH SVHC Declaration',
        Value: '74',
    },
    {
        Text: 'Exposure Scenario',
        Value: '5'
    },
    {
        Text: 'Food Contact Compliance',
        Value: '79'
    }
];

var selectSupplierTypeDataSource = [
    {
        Text: 'Manufacturer',
        Value: '1',
        Type: 'text'
    },
    {
        Text: 'Supplier',
        Value: '2',
        Type: 'text'
    },
    {
        Text: 'Distributor',
        Value: '3',
        Type: 'text'
    },
    {
        Text: 'PrivateLabel',
        Value: '4',
        Type: 'text'
    },
    {
        Text: 'Smelter',
        Value: '5',
        Type: 'text'
    }
];

var asSupplierSearchColumnDataSource = [
    {
        Text: 'AccountId',
        Value: '1',
        Type: 'integer'
    },
    {
        Text: 'Supplier Type',
        Value: '2',
        Type: 'lookup',
        //DataLookup: advanceSearchDataSource.SupplierType
        DataLookup: 'GetSupplierTypeLookUp'
    },
    {
        Text: 'DocumentType',
        Value: '3',
        Type: 'lookup',
        DataLookup: selectDocumentTypeDataSource
    },
    {
        Text: 'Language',
        Value: '4',
        Type: 'lookup',
        DataLookup: selectLanguageDataSource
    },
    {
        Text: 'Country',
        Value: '5',
        Type: 'lookup',
        //DataLookup: selectCountryDataSource
        DataLookup: selectCountryDataSource
    },
    {
        Text: 'SupplierId',
        Value: '6',
        Type: 'integer'
    },
    {
        Text: 'SupplierName',
        Value: '7',
        Type: 'text'
    },
    {
        Text: 'RequestId',
        Value: '8',
        Type: 'integer'
    },
    {
        Text: 'ProductId',
        Value: '9',
        Type: 'integer'
    },
    {
        Text: 'ProductName',
        Value: '10',
        Type: 'text'
    },
    {
        Text: 'ProductPartNumber',
        Value: '11',
        Type: 'text'
    },
    {
        Text: 'UPC',
        Value: '12',
        Type: 'text'
    },
    {
        Text: 'Assign To',
        Value: '13',
        Type: 'text'
    },
    {
        Text: 'CreatedDate',
        Value: '14',
        Type: 'DateRange'
    },
];

var defaultOperatorDataSource = [
    {
        Text: 'Contains',
        Value: '1',
        Type: 'integer'
    },
    {
        Text: 'Exact Match',
        Value: '2',
        Type: 'integer'
    },
    {
        Text: 'Starts With',
        Value: '3',
        Type: 'integer',
    },
    {
        Text: 'Ends With',
        Value: '4',
        Type: 'integer'
    }
    
];

var defaultSupplierTypeDataSource = [];


//Load only second datasource first 
advanceSearchDataSource.SupplierType.read();

advanceSearchDataSource.SupplierType.read().then(function () {
    defaultSupplierTypeDataSource = advanceSearchDataSource.SupplierType.view();
});

advanceSearchDataSource.CountryType.read();
//$.each(advanceSearchDataSource, function (index, datasource) {
//    datasource.fetch();
//});
