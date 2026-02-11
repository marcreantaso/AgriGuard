export const diseases = {
    'Rice Blast': {
        crop: 'Rice',
        disease: 'Rice Blast',
        status: 'critical',
        description: "A fungal disease caused by Pyricularia oryzae. It causes diamond-shaped lesions on leaves and can lead to severe yield loss if the panicles are affected (neck blast). It spreads rapidly in high humidity.",
        treatment: [
            "Keep the soil flooded (water management) as the fungus thrives in dry soil.",
            "Avoid excessive nitrogen fertilizer application.",
            "Apply fungicides like Tricyclazole or Isoprothiolane immediately.",
            "Plant resistant varieties like NSIC Rc 222 or Rc 216."
        ],
        img: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?auto=format&fit=crop&q=80&w=800' // Generic rice field/leaf
    },
    'Leaf Blight': {
        crop: 'Rice',
        disease: 'Bacterial Leaf Blight',
        status: 'critical',
        description: "Caused by Xanthomonas oryzae. Leaves turn yellow to white, starting from the tip and moving downwards along the veins. It significantly reduces grain weight and quality.",
        treatment: [
            "Drain the field to reduce humidity.",
            "Use copper-based fungicides/bactericides.",
            "Practice balanced fertilization (optimize Potassium).",
            "Destroy infected stubble after harvest."
        ],
        img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800'
    },
    'Tungro Virus': {
        crop: 'Rice',
        disease: 'Tungro Virus',
        status: 'critical',
        description: "Transmitted by green leafhoppers. Plants become stunted and leaves turn yellow-orange with twisted tips. This is one of the most destructive rice diseases in Asia.",
        treatment: [
            "Control green leafhopper vectors using insecticides.",
            "Practice synchronous planting in the community.",
            "Plow under infected stubble immediately.",
            "Observe a fallow period of at least a month."
        ],
        img: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&q=80&w=800'
    },
    'Corn Smut': {
        crop: 'Corn',
        disease: 'Corn Smut',
        status: 'mild',
        description: "Fungal infection causing gall-like tumors on kernels, tassels, or stalks. While it reduces yield, the galls are edible (Huitlacoche) in some cultures but considered a pest here.",
        treatment: [
            "Remove and destroy galls before they release spores.",
            "Avoid mechanical injury to the plants.",
            "Practice crop rotation.",
            "Use resistant corn hybrids."
        ],
        img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=800' // Corn field
    },
    'Healthy': {
        crop: 'Rice',
        disease: 'Healthy',
        status: 'healthy',
        description: "The plant shows no signs of disease. The leaves are green, upright, and free from lesions or discoloration. Continue with standard care.",
        treatment: [
            "Continue regular monitoring.",
            "Maintain proper water levels.",
            "Apply maintenance fertilizer as scheduled."
        ],
        img: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&q=80&w=800'
    },
    // Banana Diseases
    'Panama Disease': {
        crop: 'Banana',
        disease: 'Panama Disease',
        status: 'critical',
        description: "Also known as Fusarium Wilt. A soil-borne fungal disease that causes yellowing of older leaves, splitting of the stem base, and eventual death of the plant.",
        treatment: [
            "Quarantine infected areas immediately.",
            "Disinfect tools and footwear with bleach solution.",
            "Use disease-free planting materials (tissue culture).",
            "There is no chemical cure; infected plants must be destroyed."
        ],
        img: 'https://images.unsplash.com/photo-1603052875302-d376b7c0638a?auto=format&fit=crop&q=80&w=800' // Banana leaf
    },
    'Sigatoka': {
        crop: 'Banana',
        disease: 'Black Sigatoka',
        status: 'critical',
        description: "Fungal leaf spot disease. Causes dark streaks on leaves that enlarge into spots with gray centers. heavily reduces photosynthetic area and yield.",
        treatment: [
            "De-leafing: Remove and burn infected leaves.",
            "Apply fungicides (Rotate modes of action to prevent resistance).",
            "Improve drainage and spacing to reduce humidity.",
            "Apply proper nutrition (Potassium and Silica)."
        ],
        img: 'https://images.unsplash.com/photo-1527063836104-a21237eb64b0?auto=format&fit=crop&q=80&w=800'
    },
    'Bunchy Top': {
        crop: 'Banana',
        disease: 'Banana Bunchy Top',
        status: 'critical',
        description: "Viral disease transmitted by aphids. Leaves become narrow, short, and upright ('bunchy'), with chlorotic margins. The plant stops growing and bears no fruit.",
        treatment: [
            "Control aphid vectors with insecticides.",
            "Inject herbicide (glyphosate) to kill the infected mat.",
            "Dig out and burn the infected mat.",
            "Replant with virus-free tissue-cultured plantlets."
        ]
    }
};

export const getDiseaseInfo = (diseaseName) => {
    return diseases[diseaseName] || {
        crop: 'Unknown',
        disease: diseaseName,
        status: 'mild',
        description: "No specific data available for this disease.",
        treatment: ["Consult a local agriculturist."],
        img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80'
    };
};
