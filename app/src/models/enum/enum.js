const ROLE = {
    client: 'client',
    admin: 'admin',
    veterinary: 'veterinary'
}

const SPECIALITY = {
    medecineComportementAnimauxDomestique: "Médecine du comportement des animaux domestiques",
    medecineInterneAnimaauxCompagnie: "Médecine interne des animaux de compagnie",
    medecineInterneAnimaauxCompagnieCardiologie: "Médecine interne des animaux de compagnie, option cardiologie",
    anatomiePathologiqueVeterinaire: "Anatomie pathologique vétérinaire",
    chirurgieAnimauxDomestique: "Chirurgie des animaux de compagnie",
    chirgurieEquine: "Chirurgie équine",
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
    pathologieCliniqueVeterinaire: "Pathologie clinique vétérinaire",
    santeProductionAnimalRegionChaude: "Santé et productions animales en régions chaudes",
    santePubliqueVeterinaireScienceAliments: "Santé publique vétérinaire - sciences des aliments",
    santePubliqueVeterinaireMedecinePopulations: "Santé publique vétérinaire - médecine des populations",
    scienceMedecineAnimauxLaboratoire: "Sciences et médecine des animaux de laboratoire",
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
    INSCRIPTION: "inscription",
    VALIDATION: "validation",
    DEACTIVATION: "deactivation",
    APPOINTMENTFORVET: "appointmentforvet",
    APPOINTMENTFORCLIENT: "appointmentforclient",
    APPOINTMENTUPDATE: "appointmentupdate",
    APPOINTMENTDELETE: "appointmentdelete",
    APPOINTMENT: "appointment",
    HRMODIFICATION: "hrmodification",
}

const NEWSLETTER_FREQUENCY = {
    DAILY: "daily",
    WEEKLY: "weekly",
    MONTHLY: "monthly",
}

module.exports = {
    ROLE: ROLE,
    SPECIALITY: SPECIALITY,
    PAYMENTMETHOD: PAYMENTMETHOD,
    ANIMALTYPE: ANIMALTYPE,
    SEX: SEX,
    MAILACTION: MAILACTION,
    NEWSLETTER_FREQUENCY: NEWSLETTER_FREQUENCY
}
