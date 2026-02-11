// Mock Database of Agri-Supply Shops
// Organized by Region > Province > Municipality for filtering

export const agriShops = [
    // NCR
    {
        id: 'ncr-01',
        name: "AgriTayo Quezon City",
        region: 'NCR',
        province: 'Metro Manila',
        municipality: 'Quezon City',
        address: "123 Elliptical Road, Diliman, Quezon City",
        contact: "0917-123-4567",
        rating: 4.8,
        products: ["Fungicides", "Fertilizers", "Seeds", "Tools"],
        verified: true,
        coordinates: { lat: 14.6514, lng: 121.0492 }, // Mock coords
        opensAt: "08:00 AM",
        closesAt: "05:00 PM"
    },

    // Region III - Central Luzon
    {
        id: 'r3-ne-01',
        name: "Nueva Ecija Farm Supply",
        region: 'Region III',
        province: 'Nueva Ecija',
        municipality: 'Cabanatuan City',
        address: "Maharlika Highway, Cabanatuan City",
        contact: "0918-987-6543",
        rating: 4.7,
        products: ["Rice Seeds", "Insecticides", "Fertilizers"],
        verified: true,
        coordinates: { lat: 15.4828, lng: 120.9745 },
        opensAt: "07:30 AM",
        closesAt: "06:00 PM"
    },
    {
        id: 'r3-ne-02',
        name: "Science City Agri-Tech",
        region: 'Region III',
        province: 'Nueva Ecija',
        municipality: 'Science City of Muñoz',
        address: "Near CLSU Gate, Muñoz",
        contact: "0922-333-4444",
        rating: 4.9,
        products: ["Organic Fertilizers", "Hybrid Seeds", "Pest Control"],
        verified: true,
        coordinates: { lat: 15.7126, lng: 120.9067 },
        opensAt: "08:00 AM",
        closesAt: "05:00 PM"
    },
    {
        id: 'r3-bul-01',
        name: "Bulacan Green Thumb",
        region: 'Region III',
        province: 'Bulacan',
        municipality: 'Malolos City',
        address: "MacArthur Highway, Malolos",
        contact: "0917-555-5555",
        rating: 4.6,
        products: ["General Farm Supplies", "Feed"],
        verified: true,
        coordinates: { lat: 14.8527, lng: 120.8160 },
        opensAt: "08:00 AM",
        closesAt: "05:00 PM"
    },

    // Region IV-A - CALABARZON
    {
        id: 'r4a-lag-01',
        name: "Laguna Crop Care",
        region: 'Region IV-A',
        province: 'Laguna',
        municipality: 'Los Baños',
        address: "Grove, Los Baños, Laguna",
        contact: "0917-777-8888",
        rating: 4.8,
        products: ["Research-Grade Fertilizers", "Pest Management"],
        verified: true,
        coordinates: { lat: 14.1678, lng: 121.2432 },
        opensAt: "08:00 AM",
        closesAt: "06:00 PM"
    },

    // Region XI - Davao
    {
        id: 'r11-dav-01',
        name: "Davao Planters depot",
        region: 'Region XI',
        province: 'Davao del Sur',
        municipality: 'Davao City',
        address: "Quirino Avenue, Davao City",
        contact: "0919-000-1111",
        rating: 4.7,
        products: ["Fruit Tree Seedlings", "Fungicides", "Fertilizers"],
        verified: true,
        coordinates: { lat: 7.0707, lng: 125.6087 },
        opensAt: "08:00 AM",
        closesAt: "06:00 PM"
    }
];

export const getShopsByProvince = (province) => agriShops.filter(shop => shop.province === province);
export const getShopsByMunicipality = (municipality) => agriShops.filter(shop => shop.municipality === municipality);
