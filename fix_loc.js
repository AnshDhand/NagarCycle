const fs = require('fs');
let c = fs.readFileSync('c:/Users/hp/OneDrive/Desktop/NSUTPROJ/HACKATHON/listing.html', 'utf8');

c = c.replace(
    'https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}',
    'https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en'
);

c = c.replace(
    'const addr = data.address;',
    'const city = data.city || data.locality || data.principalSubdivision;\n                                        const addr = {};'
);

c = c.replace(
    `const fullAddress = parts.length > 0 ? parts.join(', ') : "Unknown Location";`,
    'const fullAddress = city ? `${city}, ${data.countryCode || \'\'}` : "Unknown Location";'
);

fs.writeFileSync('c:/Users/hp/OneDrive/Desktop/NSUTPROJ/HACKATHON/listing.html', c);
console.log('Fixed location in listing.html');
