const ROLE = {
    client: 'client',
    admin: 'admin',
    veterinary: 'veterinary'
}

const SPECIALITY = {
    medecineComportementAnimauxDomestique: "Médecine du comportement des animaux domestiques",
    medecineInterneAnimaauxCompagnie: "Médecine interne des animaux de compagnie",
    anatomiePathologiqueVeterinaire: "Anatomie pathologique vétérinaire",
    chirurgieAnimauxDomestique: "Chirurgie des animaux de compagnie",
    chirgurieAnimauxElevage: "Chirurgie des animaux d'élevage",
    demartologieVeterinaire: "Dermatologie vétérinaire",
    elevagePathologieEquide: "Elevage et pathologie des équidés",
    gestionSanteBovins: "Gestion de la santé des bovins",
    gestionsSanteQualiteProductionAvicole: "Gestion de la santé et de la qualité en productions avicoles",
    gestionsSanteQualiteProductionLaitiere: "Gestion de la santé et de la qualité en production laitière",
    gestionsSanteQualiteProductionPorcine: "Gestion de la santé et de la qualité en production porcine",
    imagerieMedicaleVeterinaire: "Imagerie médicale vétérinaire",
    medecineInterneEquide: "Médecine interne des équidés",
    neurologieVeterinaire: "Neurologie vétérinaire",
    nutritionCliniqueVeterinaire: "Nutrition clinique vétérinaire",
    ophtalmologieVeterinaire: "Ophtalmologie vétérinaire",
    santeProductionAnimalRegionChaude: "Santé et productions animales en régions chaudes",
    stomatologieDentisterieVeterinaire: "Stomatologie et dentisterie vétérinaires"
};

const PAYMENTMETHOD = {
    CB: 'carte bancaire',
    espece: 'espece',
    cheque: 'cheque'
}

const SEX = {
    MALE: 'male',
    FEMALE: 'female',
    OTHER: 'other'
}

const ANIMALTYPE = {
    AUTRE: "Autre",
    AMPHIBIENS: "Amphibiens : la grenouille rieuse, l’axolotl, le dendrobate, etc.",
    ARTHROPODES: "Arthropodes : l’araignée, le scorpion, le myriapode, etc.",
    CHAT: "Chat",
    CHIEN: "Chien",
    CRUSTACES: "Crustacés : la crevette, le bernard-l’hermite, etc.",
    FURET: "Furet",
    GALINACES: "Gallinacés : la poule, le paon, le canard, l’oie, le dindon, etc.",
    INSECTES: "Insectes",
    LEZARDS: "Lézards",
    MOLLUSQUE: "Mollusques : les escargots de Bourgogne, etc.",
    OISEAUX: "Oiseaux",
    POISSONS: "Poissons",
    PRIMATES: "Primates",
    PUTOIS: "Putois",
    RONGEURS: "Rongeurs",
    SERPENTS: "Serpents",
    TORTUES: "Tortues",
    VISON: "Vison"
}

const MAILACTION = {
    REGISTER: "register",
    REGISTERVET: "registervet",
    REGISTERADMIN: "registeradmin",
    VALIDATION: "validation",
    DEACTIVATION: "deactivation",
    REFUSE: "refuse",
    DELETE: "delete",
    UPDATE: "update",
    APPOINTMENTUPDATE: "appointmentupdate",
    APPOINTMENTDELETE: "appointmentdelete",
    APPOINTMENT: "appointment",
    HRCREATION: "hrcreation",
    HRMODIFICATION: "hrmodification",
    HRDELETION: "hrdeletion"
}

const ORDERSTATUS = {
    PREPARATION: "preparation",
    SHIPPED: "shipped",
    DELIVERED: "delivered",
}

module.exports = {
    ROLE: ROLE,
    SPECIALITY: SPECIALITY,
    PAYMENTMETHOD: PAYMENTMETHOD,
    ANIMALTYPE: ANIMALTYPE,
    SEX: SEX,
    MAILACTION: MAILACTION,
    ORDERSTATUS: ORDERSTATUS
}
