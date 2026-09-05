// Philippine LGU Agricultural Office Contacts Database
// These are sample contacts for demonstration - replace with actual LGU emails

export const lguContacts = [
    // NCR
    { region: 'NCR', province: 'Metro Manila', municipality: 'Quezon City', email: 'agriculture@quezoncity.gov.ph', contactPerson: 'City Agriculturist Office' },

    // Region I - Ilocos
    { region: 'Region I', province: 'Pangasinan', municipality: 'Dagupan City', email: 'agri.dagupan@gov.ph', contactPerson: 'Municipal Agriculture Office' },
    { region: 'Region I', province: 'La Union', municipality: 'San Fernando', email: 'agriculture@sanfernandolaunion.gov.ph', contactPerson: 'City Agriculture Office' },

    // Region II - Cagayan Valley
    { region: 'Region II', province: 'Isabela', municipality: 'Ilagan City', email: 'agriculture@ilagan.gov.ph', contactPerson: 'Provincial Agriculture Office' },
    { region: 'Region II', province: 'Nueva Vizcaya', municipality: 'Bayombong', email: 'mao.bayombong@gov.ph', contactPerson: 'Municipal Agriculture Office' },

    // Region III - Central Luzon (Major Rice Belt)
    { region: 'Region III', province: 'Nueva Ecija', municipality: 'Cabanatuan City', email: 'agriculture@cabanatuan.gov.ph', contactPerson: 'City Agriculture Office' },
    { region: 'Region III', province: 'Nueva Ecija', municipality: 'Science City of Muñoz', email: 'agri.munoz@gov.ph', contactPerson: 'PhilRice Research Center' },
    { region: 'Region III', province: 'Bulacan', municipality: 'Malolos City', email: 'agriculture@malolos.gov.ph', contactPerson: 'City Agriculture Office' },
    { region: 'Region III', province: 'Tarlac', municipality: 'Tarlac City', email: 'agriculture@tarlaccity.gov.ph', contactPerson: 'City Agriculture Office' },
    { region: 'Region III', province: 'Pampanga', municipality: 'San Fernando', email: 'agri.sanfernando.pampanga@gov.ph', contactPerson: 'City Agriculture Office' },

    // Region IV-A - CALABARZON
    { region: 'Region IV-A', province: 'Laguna', municipality: 'Los Baños', email: 'agriculture@losbanos.gov.ph', contactPerson: 'Municipal Agriculture Office' },
    { region: 'Region IV-A', province: 'Quezon', municipality: 'Lucena City', email: 'agriculture@lucenacity.gov.ph', contactPerson: 'City Agriculture Office' },

    // Region V - Bicol
    { region: 'Region V', province: 'Camarines Sur', municipality: 'Naga City', email: 'agriculture@naga.gov.ph', contactPerson: 'City Agriculture Office' },
    { region: 'Region V', province: 'Albay', municipality: 'Legazpi City', email: 'agri.legazpi@gov.ph', contactPerson: 'City Agriculture Office' },

    // Region VI - Western Visayas
    { region: 'Region VI', province: 'Iloilo', municipality: 'Iloilo City', email: 'agriculture@iloilocity.gov.ph', contactPerson: 'City Agriculture Office' },
    { region: 'Region VI', province: 'Negros Occidental', municipality: 'Bacolod City', email: 'agriculture@bacolodcity.gov.ph', contactPerson: 'City Agriculture Office' },

    // Region VII - Central Visayas
    { region: 'Region VII', province: 'Cebu', municipality: 'Cebu City', email: 'agriculture@cebucity.gov.ph', contactPerson: 'City Agriculture Office' },
    { region: 'Region VII', province: 'Bohol', municipality: 'Tagbilaran City', email: 'agri.tagbilaran@gov.ph', contactPerson: 'City Agriculture Office' },

    // Region VIII - Eastern Visayas
    { region: 'Region VIII', province: 'Leyte', municipality: 'Tacloban City', email: 'agriculture@tacloban.gov.ph', contactPerson: 'City Agriculture Office' },

    // Region X - Northern Mindanao
    { region: 'Region X', province: 'Bukidnon', municipality: 'Malaybalay City', email: 'agriculture@malaybalaycity.gov.ph', contactPerson: 'City Agriculture Office' },

    // Region XI - Davao
    { region: 'Region XI', province: 'Davao del Sur', municipality: 'Davao City', email: 'agriculture@davaocity.gov.ph', contactPerson: 'City Agriculture Office' },

    // Region XII - SOCCSKSARGEN
    { region: 'Region XII', province: 'South Cotabato', municipality: 'General Santos City', email: 'agriculture@gensantos.gov.ph', contactPerson: 'City Agriculture Office' },
];

// Get unique regions for dropdown
export const getRegions = () => [...new Set(lguContacts.map(c => c.region))];

// Get provinces by region
export const getProvincesByRegion = (region) => [...new Set(lguContacts.filter(c => c.region === region).map(c => c.province))];

// Get municipalities by province
export const getMunicipalitiesByProvince = (province) => lguContacts.filter(c => c.province === province);

// Get contact by municipality
export const getContactByMunicipality = (municipality) => lguContacts.find(c => c.municipality === municipality);
